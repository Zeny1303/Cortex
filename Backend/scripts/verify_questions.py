"""
STEP 5 — Database Verification Script
Verifies the questions collection in MongoDB after seeding.

Checks:
  - Total questions inserted
  - Difficulty distribution 
  - Random sample query per difficulty
  - Data integrity (non-empty fields)

Usage:
    python scripts/verify_questions.py
"""

import asyncio
import os
import random

import motor.motor_asyncio

# ──────────────────────────────────────────────
# CONFIG
# ──────────────────────────────────────────────
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "prepdb")
COLLECTION_NAME = "questions"


# ──────────────────────────────────────────────
# VERIFICATION FUNCTIONS
# ──────────────────────────────────────────────
async def verify():
    print("=" * 60)
    print("  DATABASE VERIFICATION REPORT")
    print("=" * 60)

    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    # ── 1. Total Count ──────────────────────────
    total = await collection.count_documents({})
    print(f"\n[INFO] Total Questions in DB: {total}")

    if total == 0:
        print("[FAIL] No questions found! Run seed_questions.py first.")
        client.close()
        return

    # ── 2. Difficulty Distribution ───────────────
    print("\n[INFO] Difficulty Distribution:")
    pipeline_dist = [
        {"$group": {"_id": "$difficulty", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    dist_results = {}
    async for doc in collection.aggregate(pipeline_dist):
        dist_results[doc["_id"]] = doc["count"]

    for level in ["easy", "medium", "hard"]:
        count = dist_results.get(level, 0)
        pct = (count / total * 100) if total > 0 else 0
        bar = "#" * count
        print(f"   {level.capitalize():<8}: {bar} ({count}) -- {pct:.1f}%")

    # ── 3. Category Distribution ─────────────────
    print("\n[INFO] Category Distribution:")
    pipeline_cat = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    async for doc in collection.aggregate(pipeline_cat):
        print(f"   * {doc['_id']:<30}: {doc['count']}")

    # ── 4. Random Sample Per Difficulty ──────────
    print("\n[INFO] Random Sample (1 per difficulty):")
    for level in ["easy", "medium", "hard"]:
        pipeline_sample = [
            {"$match": {"difficulty": level}},
            {"$sample": {"size": 1}}
        ]
        async for doc in collection.aggregate(pipeline_sample):
            tc_count = len(doc.get("test_cases", []))
            print(f"   [{level.upper()}] {doc['title']} -- {tc_count} test cases")

    # ── 5. Data Integrity Check ───────────────────
    print("\n[INFO] Data Integrity Check:")

    empty_desc = await collection.count_documents({"description": ""})
    empty_code = await collection.count_documents({"starter_code.python": ""})
    no_testcases = await collection.count_documents({"test_cases": {"$size": 0}})

    print(f"   Empty descriptions:  {empty_desc}")
    print(f"   Empty starter_code:  {empty_code}")
    print(f"   No test cases:       {no_testcases}")

    integrity_ok = (empty_desc == 0 and empty_code == 0 and no_testcases == 0)

    # ── 6. Missing Fields Check ───────────────────
    print("\n[INFO] Checking for missing required fields:")
    required_fields = ["_id", "title", "difficulty", "description", "starter_code", "test_cases"]
    all_ok = True
    for field in required_fields:
        missing_count = await collection.count_documents({field: {"$exists": False}})
        status = "[OK]" if missing_count == 0 else f"[FAIL] {missing_count} missing"
        print(f"   {field:<20}: {status}")
        if missing_count > 0:
            all_ok = False

    # ── 7. Final Verdict ──────────────────────────
    print("\n" + "=" * 60)
    if all_ok and integrity_ok:
        print("  [OK] ALL CHECKS PASSED -- Database is healthy!")
    else:
        print("  [!] SOME ISSUES FOUND -- Review the report above.")
    print("=" * 60)

    client.close()


# ─────────────────────────────────────────────
# ENTRY POINT
# ──────────────────────────────────────────────
if __name__ == "__main__":
    asyncio.run(verify())
