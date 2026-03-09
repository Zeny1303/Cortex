"""
Question Pydantic Schemas — schemas/question_schema.py

Response models for the /api/questions endpoints.
test_cases is intentionally excluded from all response models.
"""

from pydantic import BaseModel, Field
from typing import Optional


# ──────────────────────────────────────────────────────────────────
# RESPONSE MODELS (frontend-safe, no test_cases)
# ──────────────────────────────────────────────────────────────────

class StarterCode(BaseModel):
    python: str = ""


class QuestionResponse(BaseModel):
    """Full question response — includes description and starter_code."""
    id:           str         = Field(..., alias="_id")
    title:        str
    difficulty:   str
    category:     str         = ""
    tags:         list[str]   = []
    description:  str         = ""
    starter_code: StarterCode = StarterCode()

    class Config:
        populate_by_name = True   # allow both _id and id


class QuestionSummary(BaseModel):
    """Lightweight question for question browser/list views."""
    id:         str       = Field(..., alias="_id")
    title:      str
    difficulty: str
    category:   str       = ""
    tags:       list[str] = []

    class Config:
        populate_by_name = True


# ──────────────────────────────────────────────────────────────────
# REQUEST MODELS
# ──────────────────────────────────────────────────────────────────

class RandomQuestionsRequest(BaseModel):
    difficulty: str   = "medium"
    count:      int   = 1
