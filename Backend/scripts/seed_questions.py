"""
STEP 4 — MongoDB Seeder Script
Reads data/questions.json and inserts into MongoDB 'questions' collection.
Uses Motor async driver. Skips duplicates safely.

Usage:
    python scripts/seed_questions.py
"""

import asyncio
import json
import os
import sys

import motor.motor_asyncio
from pymongo.errors import BulkWriteError

# ──────────────────────────────────────────────
# CONFIG — adjust MONGO_URL if needed
# ──────────────────────────────────────────────
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "prepdb")
COLLECTION_NAME = "questions"
DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "questions.json")


# ──────────────────────────────────────────────
# SEEDER
# ──────────────────────────────────────────────
async def seed():
    print("=" * 60)
    print("  MONGODB QUESTION SEEDER")
    print("=" * 60)

    # Load dataset
    if not os.path.exists(DATA_FILE):
        print(f"❌ Dataset not found at: {DATA_FILE}")
        print("   Run validate_questions.py first.")
        sys.exit(1)

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        questions = json.load(f)

    print(f"\n[INFO] Loaded {len(questions)} questions from {DATA_FILE}")

    # Connect to MongoDB
    client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    collection = db[COLLECTION_NAME]

    print(f"[INFO] Connected to MongoDB: {MONGO_URL} -> database: '{DB_NAME}'")

    # Check existing questions to avoid duplicates
    existing_ids = set()
    async for doc in collection.find({}, {"_id": 1}):
        existing_ids.add(doc["_id"])

    print(f"[INFO] Existing questions in DB: {len(existing_ids)}")

    # Filter out already-inserted questions
    new_questions = [q for q in questions if q["_id"] not in existing_ids]

    if not new_questions:
        print("\n[OK] All questions already exist in DB. Nothing to insert.")
        client.close()
        return

    print(f"[INFO] New questions to insert: {len(new_questions)}")

    # Insert new questions
    try:
        result = await collection.insert_many(new_questions, ordered=False)
        inserted_count = len(result.inserted_ids)
    except BulkWriteError as e:
        inserted_count = e.details.get("nInserted", 0)
        print(f"[WARN] BulkWriteError -- {e.details.get('nInserted', 0)} inserted, some may be duplicates.")

    print(f"\n[OK] Successfully inserted: {inserted_count} questions")
    print(f"     Skipped (already existed): {len(questions) - inserted_count}")

    # Summary by difficulty
    difficulty_counts = {}
    for q in new_questions:
        d = q.get("difficulty", "unknown")
        difficulty_counts[d] = difficulty_counts.get(d, 0) + 1

    print("\n[INFO] Inserted Difficulty Breakdown:")
    for level in ["easy", "medium", "hard"]:
        count = difficulty_counts.get(level, 0)
        bar = "#" * count
        print(f"   {level.capitalize():<8}: {bar} ({count})")

    client.close()
    print("\n[DONE] Seeding complete!")


# ──────────────────────────────────────────────
# ENTRY POINT
# ──────────────────────────────────────────────
if __name__ == "__main__":
    asyncio.run(seed())
