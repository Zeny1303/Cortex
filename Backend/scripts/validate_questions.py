"""
STEP 1 & 2 — Dataset Validation & Quality Check
Validates questions.json against schema rules and generates a report.
Usage: python scripts/validate_questions.py
"""

import json
import re
import os
from collections import Counter

# ──────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────
DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "questions.json")
VALID_DIFFICULTIES = {"easy", "medium", "hard"}
REQUIRED_FIELDS = {"_id", "title", "difficulty", "description", "starter_code", "test_cases"}
MIN_TEST_CASES = 3


# ──────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────
def is_snake_case(s: str) -> bool:
    return bool(re.fullmatch(r"[a-z][a-z0-9_]*", s))


def to_snake_case(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9\s]", "", s)
    s = re.sub(r"\s+", "_", s)
    return s


def fix_question(q: dict, index: int) -> tuple[dict, list[str]]:
    """Auto-fix a question and return (fixed_question, list_of_fixes_applied)."""
    fixes = []

    # Fix missing fields
    if "_id" not in q or not q["_id"]:
        title = q.get("title", f"question_{index}")
        q["_id"] = to_snake_case(title)
        fixes.append(f"Auto-generated _id: {q['_id']}")

    if not is_snake_case(q.get("_id", "")):
        old = q["_id"]
        q["_id"] = to_snake_case(old)
        fixes.append(f"Fixed _id to snake_case: {old} → {q['_id']}")

    if q.get("difficulty", "").lower() not in VALID_DIFFICULTIES:
        old = q.get("difficulty", "")
        q["difficulty"] = "medium"  # default fallback
        fixes.append(f"Fixed invalid difficulty: '{old}' → 'medium'")
    else:
        q["difficulty"] = q["difficulty"].lower()

    if "description" not in q:
        q["description"] = ""
        fixes.append("Added empty description field")

    if "starter_code" not in q or not isinstance(q["starter_code"], dict):
        q["starter_code"] = {"python": ""}
        fixes.append("Added empty starter_code.python")
    elif "python" not in q["starter_code"]:
        q["starter_code"]["python"] = ""
        fixes.append("Added missing python key in starter_code")

    if "test_cases" not in q or not isinstance(q["test_cases"], list):
        q["test_cases"] = []
        fixes.append("Reset invalid test_cases to empty list")

    # Fix malformed test cases (must have input and output)
    valid_tcs = []
    for i, tc in enumerate(q["test_cases"]):
        if "input" in tc and "output" in tc:
            valid_tcs.append(tc)
        else:
            fixes.append(f"Removed malformed test case #{i} (missing input/output)")
    q["test_cases"] = valid_tcs

    return q, fixes


# ──────────────────────────────────────────────
# MAIN VALIDATION
# ──────────────────────────────────────────────
def validate(data: list[dict]) -> dict:
    report = {
        "total_questions": len(data),
        "missing_fields": [],
        "duplicates": [],
        "invalid_testcases": [],
        "fixes_applied": [],
        "empty_descriptions": [],
    }

    id_counter = Counter(q.get("_id", "") for q in data)
    report["duplicates"] = [id_ for id_, count in id_counter.items() if count > 1]

    fixed_data = []
    for i, q in enumerate(data):
        title = q.get("title", f"[index {i}]")

        # Check for missing required fields
        missing = REQUIRED_FIELDS - set(q.keys())
        if missing:
            report["missing_fields"].append({"question": title, "missing": list(missing)})

        # Auto-fix
        q, fixes = fix_question(q, i)
        if fixes:
            report["fixes_applied"].append({"question": title, "fixes": fixes})

        # Post-fix checks
        if not q.get("description"):
            report["empty_descriptions"].append(q["_id"])

        if len(q["test_cases"]) < MIN_TEST_CASES:
            report["invalid_testcases"].append({
                "question": title,
                "found": len(q["test_cases"]),
                "required": MIN_TEST_CASES
            })

        fixed_data.append(q)

    return report, fixed_data


# ──────────────────────────────────────────────
# ENTRY POINT
# ──────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  DATASET VALIDATION REPORT")
    print("=" * 60)

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    report, fixed_data = validate(data)

    print(f"\n[INFO] Total Questions:       {report['total_questions']}")
    print(f"[FAIL] Missing Fields Issues: {len(report['missing_fields'])}")
    print(f"[WARN] Duplicate _ids:        {len(report['duplicates'])}")
    print(f"[WARN] Invalid Test Cases:    {len(report['invalid_testcases'])}")
    print(f"[INFO] Empty Descriptions:    {len(report['empty_descriptions'])}")
    print(f"[FIX ] Auto-Fixes Applied:    {len(report['fixes_applied'])}")

    if report["duplicates"]:
        print(f"\n[WARN] Duplicate IDs Found: {report['duplicates']}")

    if report["missing_fields"]:
        print("\n[FAIL] Missing Fields:")
        for item in report["missing_fields"]:
            print(f"  * {item['question']}: {item['missing']}")

    if report["invalid_testcases"]:
        print("\n[WARN] Questions with < 3 test cases:")
        for item in report["invalid_testcases"]:
            print(f"  * {item['question']}: {item['found']} found (need {item['required']})")

    if report["empty_descriptions"]:
        print(f"\n[INFO] Empty Descriptions: {report['empty_descriptions']}")

    if report["fixes_applied"]:
        print("\n[FIX ] Auto-Fixes Applied:")
        for item in report["fixes_applied"]:
            print(f"  * {item['question']}:")
            for fix in item["fixes"]:
                print(f"      - {fix}")

    # Save fixed dataset back
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(fixed_data, f, indent=2, ensure_ascii=False)
    print(f"\n[OK] Fixed dataset saved to: {DATA_FILE}")

    if (not report["duplicates"] and
        not report["missing_fields"] and
        not report["invalid_testcases"]):
        print("\n[OK] ALL VALIDATIONS PASSED -- dataset is clean!")
    else:
        print("\n[!] Some issues found. Review the report above.")


if __name__ == "__main__":
    main()
