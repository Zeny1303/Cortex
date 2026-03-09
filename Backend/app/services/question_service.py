"""
Question Service — services/question_service.py

Provides async functions to query the 'questions' MongoDB collection.
Uses Motor async driver via the shared get_database() dependency.

Public API:
    get_random_questions(db, difficulty, count)  → list of sanitized questions
    get_question_by_id(db, question_id)          → single sanitized question
    sanitize_question(question)                   → removes test_cases from doc
"""

import logging
from typing import Optional
from fastapi import HTTPException

logger = logging.getLogger(__name__)

COLLECTION = "questions"
VALID_DIFFICULTIES = {"easy", "medium", "hard"}


# ──────────────────────────────────────────────────────────────────
# SANITIZER — strips internal fields before sending to frontend
# ──────────────────────────────────────────────────────────────────

def sanitize_question(question: dict) -> dict:
    """
    Remove sensitive/internal fields from a question document
    before returning it to the frontend.

    Removes:
        - test_cases  (used only for backend evaluation)
    """
    if not question:
        return {}

    sanitized = {
        "_id":          question.get("_id", ""),
        "title":        question.get("title", ""),
        "difficulty":   question.get("difficulty", ""),
        "category":     question.get("category", ""),
        "tags":         question.get("tags", []),
        "description":  question.get("description", ""),
        "starter_code": question.get("starter_code", {"python": ""}),
    }
    return sanitized


# ──────────────────────────────────────────────────────────────────
# GET RANDOM QUESTIONS
# ──────────────────────────────────────────────────────────────────

async def get_random_questions(
    db,
    difficulty: str,
    count: int = 1,
) -> list[dict]:
    """
    Fetch `count` random questions from MongoDB filtered by difficulty.

    Pipeline:
        $match  → filter by difficulty
        $sample → randomly pick `count` documents

    Args:
        db:         Motor database instance (from get_database())
        difficulty: "easy" | "medium" | "hard"
        count:      Number of questions to return (default: 1)

    Returns:
        List of sanitized question dicts (test_cases removed)

    Raises:
        HTTPException 400 — invalid difficulty value
        HTTPException 404 — no questions found for given difficulty
    """
    # Validate difficulty
    difficulty = difficulty.lower().strip()
    if difficulty not in VALID_DIFFICULTIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid difficulty '{difficulty}'. Must be one of: {sorted(VALID_DIFFICULTIES)}"
        )

    # Clamp count between 1 and 20
    count = max(1, min(count, 20))

    try:
        pipeline = [
            {"$match":  {"difficulty": difficulty}},
            {"$sample": {"size": count}},
        ]

        collection = db[COLLECTION]
        cursor = collection.aggregate(pipeline)
        questions = await cursor.to_list(length=count)

        if not questions:
            raise HTTPException(
                status_code=404,
                detail=f"No questions found for difficulty: '{difficulty}'"
            )

        logger.info(
            "get_random_questions: fetched %d %s question(s)",
            len(questions), difficulty
        )

        return [sanitize_question(q) for q in questions]

    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_random_questions failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch questions from database."
        )


# ──────────────────────────────────────────────────────────────────
# GET QUESTION BY ID
# ──────────────────────────────────────────────────────────────────

async def get_question_by_id(
    db,
    question_id: str,
) -> dict:
    """
    Fetch a single question by its _id (snake_case string).

    Args:
        db:          Motor database instance (from get_database())
        question_id: The _id string e.g. "two_sum"

    Returns:
        Sanitized question dict (test_cases removed)

    Raises:
        HTTPException 404 — question not found
        HTTPException 500 — database error
    """
    if not question_id or not question_id.strip():
        raise HTTPException(
            status_code=400,
            detail="question_id cannot be empty."
        )

    try:
        collection = db[COLLECTION]
        question = await collection.find_one({"_id": question_id.strip()})

        if not question:
            raise HTTPException(
                status_code=404,
                detail=f"Question not found: '{question_id}'"
            )

        logger.info("get_question_by_id: found '%s'", question_id)
        return sanitize_question(question)

    except HTTPException:
        raise
    except Exception as e:
        logger.error("get_question_by_id failed for '%s': %s", question_id, str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch question from database."
        )


# ──────────────────────────────────────────────────────────────────
# LIST ALL QUESTIONS (lightweight — no description, no test_cases)
# ──────────────────────────────────────────────────────────────────

async def list_questions(
    db,
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
) -> list[dict]:
    """
    Return all questions as a lightweight index list.
    Useful for question browser / problem set UI.

    Projection excludes heavy fields (description, starter_code, test_cases).

    Args:
        db:         Motor database instance
        difficulty: Optional filter — "easy" | "medium" | "hard"
        category:   Optional filter — e.g. "array", "tree", "string"

    Returns:
        List of lightweight question dicts
    """
    query = {}
    if difficulty:
        difficulty = difficulty.lower().strip()
        if difficulty not in VALID_DIFFICULTIES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid difficulty '{difficulty}'. Must be one of: {sorted(VALID_DIFFICULTIES)}"
            )
        query["difficulty"] = difficulty

    if category:
        query["category"] = category.lower().strip()

    try:
        collection = db[COLLECTION]
        projection = {
            "_id": 1,
            "title": 1,
            "difficulty": 1,
            "category": 1,
            "tags": 1,
        }
        cursor = collection.find(query, projection).sort("title", 1)
        questions = await cursor.to_list(length=200)

        logger.info("list_questions: returned %d questions", len(questions))
        return questions

    except HTTPException:
        raise
    except Exception as e:
        logger.error("list_questions failed: %s", str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to list questions from database."
        )
