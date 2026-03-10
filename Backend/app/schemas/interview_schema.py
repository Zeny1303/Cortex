"""
Interview Pydantic Schemas — schemas/interview_schema.py

Request / response models for the /api/interview endpoints.
Keeps existing schemas intact and adds the three new ones
requested by the interview engine.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator

from app.models.interview_model import InterviewStage


# ──────────────────────────────────────────────────────────────────────────────
# Shared sub-schemas
# ──────────────────────────────────────────────────────────────────────────────

class QuestionOut(BaseModel):
    """Sanitised question payload sent to the frontend."""
    question_id: str
    title:       str
    difficulty:  str
    category:    str       = ""
    tags:        List[str] = []
    description: str       = ""
    starter_code: Dict[str, str] = Field(default_factory=lambda: {"python": ""})


# ──────────────────────────────────────────────────────────────────────────────
# REQUEST SCHEMAS
# ──────────────────────────────────────────────────────────────────────────────

class InterviewStartRequest(BaseModel):
    """
    Body for POST /api/interview/start.

    difficulty    — "easy" | "medium" | "hard"
    question_count — how many questions to include in this session (1-10)
    """
    difficulty:     str = Field("medium", description="easy | medium | hard")
    question_count: int = Field(3, ge=1, le=10, description="Number of questions (1-10)")

    @field_validator("difficulty")
    @classmethod
    def validate_difficulty(cls, v: str) -> str:
        allowed = {"easy", "medium", "hard"}
        v = v.lower().strip()
        if v not in allowed:
            raise ValueError(f"difficulty must be one of {sorted(allowed)}, got '{v}'")
        return v


class InterviewActionRequest(BaseModel):
    """
    Body for stage-transition actions:
        POST /api/interview/{session_id}/submit-code
        POST /api/interview/{session_id}/next

    action  — "submit_code" | "next_question" | "discuss" | "end"
    message — optional free-text (used for approach discussion)
    code    — candidate's code submission (required for submit_code)
    """
    action:  str            = Field(..., description="Action to perform")
    message: Optional[str]  = Field(None,  description="Free-text message from candidate")
    code:    Optional[str]  = Field(None,  description="Submitted code (Python)")

    @field_validator("action")
    @classmethod
    def validate_action(cls, v: str) -> str:
        allowed = {"submit_code", "next_question", "discuss", "end"}
        v = v.lower().strip()
        if v not in allowed:
            raise ValueError(f"action must be one of {sorted(allowed)}, got '{v}'")
        return v


# ──────────────────────────────────────────────────────────────────────────────
# RESPONSE SCHEMAS
# ──────────────────────────────────────────────────────────────────────────────

class InterviewSessionResponse(BaseModel):
    """
    Standard session snapshot returned after every state-mutating endpoint.

    session_id — opaque session identifier (UUID / ObjectId string)
    stage      — current InterviewStage value (e.g. "CODING")
    question   — the active question, or None when stage is INTRO / END
    """
    session_id: str
    stage:      InterviewStage
    question:   Optional[QuestionOut] = None


class CodeSubmitResponse(BaseModel):
    """Response for POST /api/interview/{session_id}/submit-code."""
    session_id:   str
    stage:        InterviewStage
    result:       str           = Field(..., description="'passed' | 'partial' | 'failed' | 'error'")
    feedback:     Optional[str] = None
    passed_tests: int           = Field(0, ge=0, description="Test cases that passed")
    failed_tests: int           = Field(0, ge=0, description="Test cases that failed")
    total_tests:  int           = Field(0, ge=0, description="Total test cases run")



class EndInterviewResponse(BaseModel):
    """Response for POST /api/interview/{session_id}/end."""
    session_id:       str
    stage:            InterviewStage
    score:            Optional[float] = Field(None, ge=0, le=100)
    feedback_summary: Dict[str, Any]  = Field(default_factory=dict)
    message:          str             = "Interview ended successfully."


# ──────────────────────────────────────────────────────────────────────────────
# Legacy schemas (kept for backward-compat with existing interview_router stub)
# ──────────────────────────────────────────────────────────────────────────────

class StartInterviewRequest(BaseModel):
    """Legacy — kept so existing imports don't break."""
    language:     str = "python"
    role_applied: str = "Software Engineer"


class StartInterviewResponse(BaseModel):
    session_id: str
    message:    str


class EndInterviewRequest(BaseModel):
    session_id: str

class CodeExecutionRequest(BaseModel):
    language: str = "python"
    code: str

class CodeExecutionResponse(BaseModel):
    output: Optional[str] = None
    error: Optional[str] = None
    execution_time_ms: float = 0.0
