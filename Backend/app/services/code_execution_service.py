"""
Code Execution Service — services/code_execution_service.py

Safely executes candidate Python code against hidden test cases stored in
MongoDB and returns a structured pass/fail evaluation.

Security model
--------------
Code is exec()'d in a restricted namespace that exposes only a safe whitelist
of builtins. No filesystem, network, subprocess, or import access is allowed.
Infinite loops are killed via asyncio.wait_for with a configurable timeout.

⚠️  For a public-facing deployment, replace the exec() runner with a fully
    isolated sandbox (e.g., Docker + seccomp, judge0, or AWS Lambda).

Test-case privacy
-----------------
By default (hide_inputs=True), raw input values in per-test results are
replaced with "<hidden>". The full expected output is also withheld from
individual results. Only pass/fail per test and the top-level summary are
returned to the caller.

Public API
----------
  run_tests(db, question_id, code, hide_inputs=True)
  fetch_test_cases(db, question_id)            # internal but importable
"""

from __future__ import annotations

import ast
import asyncio
import logging
import traceback
from typing import Any, Dict, List, Optional

from fastapi import HTTPException

logger = logging.getLogger(__name__)

# ──────────────────────────────────────────────────────────────────────────────
# Configuration
# ──────────────────────────────────────────────────────────────────────────────

EXECUTION_TIMEOUT_SECONDS: float = 5.0          # per test-case timeout
MAX_TEST_CASES: int = 50                         # safety cap on DB documents
QUESTIONS_COLLECTION: str = "questions"


# ──────────────────────────────────────────────────────────────────────────────
# Safe builtins whitelist
# ──────────────────────────────────────────────────────────────────────────────

_SAFE_BUILTINS: Dict[str, Any] = {
    # types
    "int": int, "float": float, "str": str, "bool": bool,
    "list": list, "dict": dict, "set": set, "tuple": tuple,
    "bytes": bytes, "bytearray": bytearray,
    # introspection
    "type": type, "isinstance": isinstance, "issubclass": issubclass,
    "hasattr": hasattr, "getattr": getattr, "setattr": setattr,
    "callable": callable, "id": id,
    # iterables / functional
    "len": len, "range": range, "enumerate": enumerate,
    "zip": zip, "map": map, "filter": filter,
    "sorted": sorted, "reversed": reversed,
    "sum": sum, "min": min, "max": max,
    "any": any, "all": all, "next": next, "iter": iter,
    # math helpers
    "abs": abs, "round": round, "divmod": divmod, "pow": pow,
    "hex": hex, "oct": oct, "bin": bin, "ord": ord, "chr": chr,
    # output (captured by exec namespace — won't reach real stdout)
    "print": print,
    # exceptions candidates commonly raise
    "ValueError": ValueError, "TypeError": TypeError,
    "IndexError": IndexError, "KeyError": KeyError,
    "StopIteration": StopIteration, "Exception": Exception,
    "NotImplementedError": NotImplementedError,
    # None / True / False are always present; no need to whitelist
    "__build_class__": __build_class__,    # required for class definitions
    "__name__": "__main__",
}


# ──────────────────────────────────────────────────────────────────────────────
# MongoDB helper
# ──────────────────────────────────────────────────────────────────────────────

async def fetch_test_cases(db, question_id: str) -> List[dict]:
    """
    Retrieve test cases for a question from MongoDB.

    The projection intentionally fetches ONLY the test_cases field.
    All other question content (description, starter_code, etc.) is not loaded.

    Returns
    -------
    List of test-case dicts, each with "input" and "output" keys.

    Raises
    ------
    HTTPException 404 — question not found
    HTTPException 400 — question has no test_cases field
    HTTPException 500 — database error
    """
    if not question_id or not question_id.strip():
        raise HTTPException(status_code=400, detail="question_id cannot be empty.")

    try:
        collection = db[QUESTIONS_COLLECTION]
        doc = await collection.find_one(
            {"_id": question_id.strip()},
            {"test_cases": 1, "_id": 0},          # only fetch test_cases
        )
    except Exception as exc:
        logger.error("fetch_test_cases: DB error for '%s': %s", question_id, exc)
        raise HTTPException(status_code=500, detail="Failed to fetch test cases.")

    if doc is None:
        raise HTTPException(
            status_code=404,
            detail=f"Question not found: '{question_id}'",
        )

    test_cases: List[dict] = doc.get("test_cases") or []
    if not test_cases:
        raise HTTPException(
            status_code=400,
            detail=f"Question '{question_id}' has no test cases defined.",
        )

    return test_cases[:MAX_TEST_CASES]


# ──────────────────────────────────────────────────────────────────────────────
# AST helpers
# ──────────────────────────────────────────────────────────────────────────────

# Modules that are never allowed even if somehow reachable
_FORBIDDEN_MODULES = frozenset({
    "os", "sys", "subprocess", "shutil", "pathlib", "socket",
    "http", "urllib", "requests", "ftplib", "smtplib",
    "importlib", "ctypes", "mmap", "signal", "threading",
    "multiprocessing", "concurrent", "asyncio",
    "pickle", "shelve", "sqlite3", "json",  # json is safe but disallowed for hygiene
    "inspect", "ast", "dis", "gc", "weakref",
    "builtins", "__future__",
})


def _check_forbidden_imports(code: str) -> Optional[str]:
    """
    Walk the AST and return an error string if any import statement
    references a forbidden module.

    Returns None if code is clean.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return None   # syntax check will catch this separately

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                top = alias.name.split(".")[0]
                if top in _FORBIDDEN_MODULES:
                    return (
                        f"ImportError: module '{alias.name}' is not allowed "
                        "in the interview sandbox."
                    )
        elif isinstance(node, ast.ImportFrom):
            module = (node.module or "").split(".")[0]
            if module in _FORBIDDEN_MODULES:
                return (
                    f"ImportError: module '{node.module}' is not allowed "
                    "in the interview sandbox."
                )
    return None


def _detect_function_name(code: str) -> Optional[str]:
    """Parse code and return the first top-level FunctionDef name."""
    try:
        tree = ast.parse(code)
    except SyntaxError:
        return None

    for node in ast.iter_child_nodes(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            return node.name
    return None


def _validate_syntax(code: str) -> Optional[str]:
    """
    Try to compile the code. Return a human-readable error string on failure,
    or None if the code parses cleanly.
    """
    try:
        compile(code, "<candidate>", "exec")
        return None
    except SyntaxError as exc:
        return f"SyntaxError on line {exc.lineno}: {exc.msg}"


# ──────────────────────────────────────────────────────────────────────────────
# Core executor
# ──────────────────────────────────────────────────────────────────────────────

async def _run_candidate_function(
    func_name: str,
    compiled_code,
    args: Any,
    timeout: float = EXECUTION_TIMEOUT_SECONDS,
) -> tuple[Any, Optional[str]]:
    """
    Execute the candidate function inside an asyncio timeout.

    Parameters
    ----------
    func_name     : name of the function to call after exec()
    compiled_code : pre-compiled code object (from compile())
    args          : the test input — unpacked as *args if it is a list/tuple
    timeout       : seconds before TimeoutError

    Returns
    -------
    (result, error_string)
        error_string is None on success; a human-readable string on failure.
    """

    def _sync_run() -> Any:
        """Runs synchronously inside an executor thread to isolate blocking."""
        namespace: Dict[str, Any] = {"__builtins__": _SAFE_BUILTINS}
        exec(compiled_code, namespace)  # noqa: S102 (intentional)

        func = namespace.get(func_name)
        if func is None:
            raise NameError(f"Function '{func_name}' not defined after exec.")

        if isinstance(args, (list, tuple)):
            return func(*args)
        return func(args)

    loop = asyncio.get_event_loop()
    try:
        result = await asyncio.wait_for(
            loop.run_in_executor(None, _sync_run),
            timeout=timeout,
        )
        return result, None

    except asyncio.TimeoutError:
        return None, (
            f"Time Limit Exceeded: execution did not complete within "
            f"{timeout:.0f} second(s)."
        )
    except NameError as exc:
        return None, f"NameError: {exc}"
    except RecursionError:
        return None, "RecursionError: maximum recursion depth exceeded."
    except MemoryError:
        return None, "MemoryError: code consumed too much memory."
    except Exception as exc:
        return None, f"{type(exc).__name__}: {exc}"


# ──────────────────────────────────────────────────────────────────────────────
# Output comparison
# ──────────────────────────────────────────────────────────────────────────────

def _outputs_match(actual: Any, expected: Any) -> bool:
    """
    Compare actual vs expected output.

    Primary: strict equality (==).
    Fallback: if both are lists of primitive values, compare sorted copies to
              handle order-insensitive answers (e.g. index pairs like [1, 0]).
    """
    if actual == expected:
        return True

    # Sorted fallback for lists of primitives only
    _primitive = (int, float, str, bool)
    if (
        isinstance(actual, list)
        and isinstance(expected, list)
        and all(isinstance(x, _primitive) for x in actual)
        and all(isinstance(x, _primitive) for x in expected)
    ):
        try:
            return sorted(actual) == sorted(expected)
        except TypeError:
            pass

    return False


# ──────────────────────────────────────────────────────────────────────────────
# Public API
# ──────────────────────────────────────────────────────────────────────────────

async def run_tests(
    db,
    question_id: str,
    code: str,
    hide_inputs: bool = True,
) -> Dict[str, Any]:
    """
    Run candidate code against every test case for the given question.

    Steps
    -----
    1. Validate syntax.
    2. Detect the submitted function's name via AST.
    3. Fetch hidden test cases from MongoDB.
    4. Run each test case under a timeout in a restricted namespace.
    5. Compare output and aggregate results.

    Parameters
    ----------
    db           : Motor database instance
    question_id  : MongoDB _id of the question document
    code         : Raw Python source submitted by the candidate
    hide_inputs  : If True, replaces raw input values with "<hidden>" in results

    Returns
    -------
    Structured evaluation dict — see module docstring for schema.
    NEVER includes raw test_cases data; safe to pass through to the frontend.
    """
    # ── 1. Syntax check ───────────────────────────────────────────────────────
    syntax_error = _validate_syntax(code)
    if syntax_error:
        logger.info("run_tests: syntax error for question '%s': %s", question_id, syntax_error)
        return _error_result(syntax_error)

    # ── 1b. Forbidden import check (AST-level, before exec) ───────────────────
    import_error = _check_forbidden_imports(code)
    if import_error:
        logger.info("run_tests: forbidden import for question '%s': %s", question_id, import_error)
        return _error_result(import_error)

    # ── 2. Detect function name ───────────────────────────────────────────────
    func_name = _detect_function_name(code)
    if not func_name:
        return _error_result(
            "No top-level function definition found in submitted code. "
            "Please define your solution as a function."
        )

    # ── 3. Pre-compile (catches any late parse issues) ────────────────────────
    try:
        compiled = compile(code, "<candidate>", "exec")
    except SyntaxError as exc:
        return _error_result(f"SyntaxError: {exc.msg} (line {exc.lineno})")

    # ── 4. Fetch test cases from MongoDB ──────────────────────────────────────
    test_cases = await fetch_test_cases(db, question_id)

    # ── 5. Run each test case ─────────────────────────────────────────────────
    results: List[Dict[str, Any]] = []
    passed = 0
    failed = 0

    for idx, tc in enumerate(test_cases):
        raw_input = tc.get("input")
        expected  = tc.get("output")

        actual, run_error = await _run_candidate_function(
            func_name=func_name,
            compiled_code=compiled,
            args=raw_input,
        )

        if run_error:
            test_passed = False
            failed += 1
        else:
            test_passed = _outputs_match(actual, expected)
            if test_passed:
                passed += 1
            else:
                failed += 1

        results.append({
            "test_index": idx + 1,
            "input":      "<hidden>" if hide_inputs else raw_input,
            "expected":   "<hidden>" if hide_inputs else expected,
            "actual":     actual if not run_error else None,
            "passed":     test_passed,
            "error":      run_error,
        })

    total = passed + failed
    # If any test-level runtime/timeout error occurred → overall is 'error'
    any_runtime_error = any(r["error"] is not None for r in results)
    if any_runtime_error:
        overall = "error"
    elif passed == total:
        overall = "passed"
    elif passed == 0:
        overall = "failed"
    else:
        overall = "partial"

    logger.info(
        "run_tests: question='%s' — %d/%d passed (%s)",
        question_id, passed, total, overall,
    )

    return {
        "passed_tests": passed,
        "failed_tests": failed,
        "total_tests":  total,
        "result":       overall,
        "error":        None,
        "results":      results,
    }


# ──────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ──────────────────────────────────────────────────────────────────────────────

def _error_result(message: str) -> Dict[str, Any]:
    """Return a top-level error result (code never ran against test cases)."""
    return {
        "passed_tests": 0,
        "failed_tests": 0,
        "total_tests":  0,
        "result":       "error",
        "error":        message,
        "results":      [],
    }
