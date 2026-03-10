"""
Question Router — routers/question_router.py

IMPORTANT: Route order matters in FastAPI.
  /random  and  /  must come BEFORE  /{question_id}
  otherwise "random" is matched as a question_id path param.
"""

from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.middleware.auth_middleware import get_current_user

from app.database.mongodb import get_database
from app.services.question_service import (
    get_random_questions,
    get_question_by_id,
    list_questions,
)
from app.schemas.question_schema import QuestionResponse, QuestionSummary

router = APIRouter()


# ──────────────────────────────────────────────────────────────────
# GET /api/questions/
# MUST be declared before /{question_id} to avoid route conflict
# ──────────────────────────────────────────────────────────────────

@router.get("/", response_model=list[QuestionSummary])
async def questions_list(
    difficulty: Optional[str] = Query(None, description="Filter by difficulty"),
    category:   Optional[str] = Query(None, description="Filter by category"),
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """
    List all questions (lightweight — no description or starter_code).
    Optionally filter by difficulty and/or category.

    Example:
        GET /api/questions?difficulty=medium&category=array
    """
    return await list_questions(db, difficulty, category)


# ──────────────────────────────────────────────────────────────────
# GET /api/questions/random
# MUST be declared before /{question_id} to avoid route conflict
# ──────────────────────────────────────────────────────────────────

@router.get("/random", response_model=list[QuestionResponse])
async def random_questions(
    difficulty: str = Query("medium", description="easy | medium | hard"),
    count:      int = Query(1,        description="Number of questions (1–20)", ge=1, le=20),
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """
    Fetch random questions by difficulty.

    Example:
        GET /api/questions/random?difficulty=easy&count=3
    """
    return await get_random_questions(db, difficulty, count)


# ──────────────────────────────────────────────────────────────────
# GET /api/questions/{question_id}
# MUST be declared LAST — catches all remaining path segments
# ──────────────────────────────────────────────────────────────────

@router.get("/{question_id}", response_model=QuestionResponse)
async def question_by_id(
    question_id: str,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """
    Fetch a single question by its snake_case _id.

    Example:
        GET /api/questions/two_sum
    """
    return await get_question_by_id(db, question_id)
