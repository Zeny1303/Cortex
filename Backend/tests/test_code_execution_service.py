"""
Unit tests for services/code_execution_service.py

Run with:
    cd e:\\Prep\\Backend
    python -m pytest tests/test_code_execution_service.py -v

MongoDB is not required — test cases are injected via a mock db fixture.
"""

from __future__ import annotations

import asyncio
from typing import Any
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.services.code_execution_service import run_tests, _outputs_match


# ──────────────────────────────────────────────────────────────────────────────
# Mock DB fixture
# ──────────────────────────────────────────────────────────────────────────────

def _make_db(test_cases: list[dict]) -> Any:
    """
    Build a minimal Motor-compatible mock that returns `test_cases`
    when find_one() is called on the questions collection.
    """
    doc = {"test_cases": test_cases}
    find_one = AsyncMock(return_value=doc)
    collection = MagicMock()
    collection.find_one = find_one
    db = MagicMock()
    db.__getitem__ = MagicMock(return_value=collection)
    return db


TWO_SUM_CASES = [
    {"input": [[2, 7, 11, 15], 9],  "output": [0, 1]},
    {"input": [[3, 2, 4], 6],        "output": [1, 2]},
    {"input": [[3, 3], 6],           "output": [0, 1]},
]


# ──────────────────────────────────────────────────────────────────────────────
# Helper
# ──────────────────────────────────────────────────────────────────────────────

def run(coro):
    return asyncio.get_event_loop().run_until_complete(coro)


# ──────────────────────────────────────────────────────────────────────────────
# Tests
# ──────────────────────────────────────────────────────────────────────────────

class TestPassingCode:
    def test_all_pass(self):
        code = """
def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
"""
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code, hide_inputs=False))

        assert result["result"] == "passed"
        assert result["passed_tests"] == 3
        assert result["failed_tests"] == 0
        assert result["error"] is None


class TestFailingCode:
    def test_wrong_answer(self):
        code = """
def twoSum(nums, target):
    return [0, 0]   # always wrong
"""
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code, hide_inputs=False))

        assert result["result"] in ("failed", "partial")
        assert result["failed_tests"] > 0

    def test_partial_pass(self):
        """Passes only the first test (hardcoded answer)."""
        code = """
def twoSum(nums, target):
    return [0, 1]
"""
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code, hide_inputs=False))

        assert result["result"] == "partial"
        assert result["passed_tests"] >= 1
        assert result["failed_tests"] >= 1


class TestSyntaxError:
    def test_syntax_error_caught(self):
        code = "def twoSum(nums target):\n    return []\n"  # missing comma
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code))

        assert result["result"] == "error"
        assert result["error"] is not None
        assert "SyntaxError" in result["error"]
        assert result["passed_tests"] == 0


class TestInfiniteLoop:
    def test_timeout_caught(self):
        code = """
def twoSum(nums, target):
    while True:
        pass
"""
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code))

        # Should not hang; result should be error
        assert result["result"] == "error"
        # At least one test-level error about TLE
        tle_errors = [
            r for r in result["results"]
            if r["error"] and "Time Limit" in r["error"]
        ]
        assert len(tle_errors) >= 1


class TestForbiddenImport:
    def test_import_os_blocked(self):
        code = """
import os
def twoSum(nums, target):
    return os.listdir('.')
"""
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code))

        # import not in safe builtins → NameError or ImportError at exec time
        assert result["result"] == "error"

    def test_import_subprocess_blocked(self):
        code = """
import subprocess
def twoSum(nums, target):
    return subprocess.run(['ls'])
"""
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code))
        assert result["result"] == "error"


class TestNoFunctionDefined:
    def test_no_function(self):
        code = "x = 1 + 2\n"
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code))

        assert result["result"] == "error"
        assert "function" in result["error"].lower()


class TestOutputComparison:
    def test_strict_equal(self):
        assert _outputs_match([0, 1], [0, 1]) is True

    def test_order_insensitive_list(self):
        """[1, 0] should match expected [0, 1] for index-pair answers."""
        assert _outputs_match([1, 0], [0, 1]) is True

    def test_wrong_values(self):
        assert _outputs_match([0, 2], [0, 1]) is False

    def test_wrong_type(self):
        assert _outputs_match("0 1", [0, 1]) is False

    def test_nested_list_no_sort_fallback(self):
        """Nested lists should NOT be sorted — strict equality only."""
        assert _outputs_match([[1, 0]], [[0, 1]]) is False


class TestHideInputs:
    def test_inputs_hidden_by_default(self):
        code = """
def twoSum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
"""
        db = _make_db(TWO_SUM_CASES)
        result = run(run_tests(db, "two_sum", code))   # hide_inputs=True default

        for r in result["results"]:
            assert r["input"]    == "<hidden>"
            assert r["expected"] == "<hidden>"
