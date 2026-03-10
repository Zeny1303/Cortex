"""
Interview Router — routers/interview_router.py

FastAPI REST endpoints for the interview session lifecycle.

All routes (except health-check style ones) require a valid JWT
via the get_current_user dependency (HTTPBearer middleware).

Prefix: /api/interview  (registered in main.py)

Endpoints
---------
POST   /start                          → Create session, return first question
GET    /{session_id}/question          → Current question
POST   /{session_id}/submit-code       → Submit candidate code
POST   /{session_id}/next              → Advance to next stage / question
POST   /{session_id}/end               → End session, persist, return score

Legacy endpoints (from previous stub) are preserved at the bottom.
"""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, Body, Depends, HTTPException, status

from app.database.mongodb import get_database
from app.middleware.auth_middleware import get_current_user
from app.models.interview_model import InterviewStage
from app.schemas.interview_schema import (
    # New schemas
    InterviewActionRequest,
    InterviewStartRequest,
    InterviewSessionResponse,
    CodeSubmitResponse,
    EndInterviewResponse,
    QuestionOut,
    # Legacy schemas (kept for backward compat)
    EndInterviewRequest,
)
from app.services.interview_engine import interview_engine

router = APIRouter()


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _question_out(session) -> QuestionOut | None:
    """Convert the active QuestionRef to a QuestionOut response schema."""
    qref = session.current_question
    if qref is None:
        return None
    return QuestionOut(
        question_id=qref.question_id,
        title=qref.title,
        difficulty=qref.difficulty,
        category=qref.category,
        tags=qref.tags,
        description="",          # full description fetched separately via GET /question
        starter_code={"python": ""},
    )


# ──────────────────────────────────────────────────────────────────────────────
# POST /start
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/start",
    response_model=InterviewSessionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start a new interview session",
)
async def start_interview(
    body: InterviewStartRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """
    Create a new interview session for the authenticated user.

    - Fetches `question_count` random questions at the given `difficulty`.
    - Transitions stage to QUESTION immediately.
    - Returns the session ID, current stage, and first question summary.
    """
    user_id = current_user.get("id")

    session = await interview_engine.start_interview(
        user_id=user_id,
        difficulty=body.difficulty,
        question_count=body.question_count,
        db=db,
    )

    return InterviewSessionResponse(
        session_id=session.session_id,
        stage=session.stage,
        question=_question_out(session),
    )


# ──────────────────────────────────────────────────────────────────────────────
# GET /{session_id}/question
# ──────────────────────────────────────────────────────────────────────────────

@router.get(
    "/{session_id}/question",
    response_model=InterviewSessionResponse,
    summary="Get the current question for a session",
)
async def get_current_question(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """
    Return the active question for the given session.

    Also fetches the full question description from MongoDB so the
    frontend can render it.
    """
    from app.services.session_manager import session_manager
    from app.services.question_service import get_question_by_id

    session = await session_manager.get_session(session_id)

    # Authorisation: only the session owner can read it
    if session.user_id != current_user.get("id"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this session.",
        )

    q_ref = session.current_question
    if q_ref is None:
        return InterviewSessionResponse(
            session_id=session_id,
            stage=session.stage,
            question=None,
        )

    # Enrich with full description
    full_q = await get_question_by_id(db, q_ref.question_id)

    return InterviewSessionResponse(
        session_id=session_id,
        stage=session.stage,
        question=QuestionOut(
            question_id=q_ref.question_id,
            title=full_q.get("title", q_ref.title),
            difficulty=full_q.get("difficulty", q_ref.difficulty),
            category=full_q.get("category", q_ref.category),
            tags=full_q.get("tags", q_ref.tags),
            description=full_q.get("description", ""),
            starter_code=full_q.get("starter_code", {"python": ""}),
        ),
    )


# ──────────────────────────────────────────────────────────────────────────────
# POST /{session_id}/submit-code
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/{session_id}/submit-code",
    response_model=CodeSubmitResponse,
    summary="Submit candidate code for the current question",
)
async def submit_code(
    session_id: str,
    body: InterviewActionRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """
    Accept a code submission.

    - Requires `action == "submit_code"` and a non-empty `code` field.
    - Executes the code against hidden test cases in MongoDB.
    - Transitions the session from CODING → TESTING.
    - Returns real pass/fail counts and feedback.
    """
    if body.action != "submit_code":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="This endpoint requires action='submit_code'.",
        )
    if not body.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="'code' field is required for submit_code action.",
        )

    result = await interview_engine.submit_code(
        session_id=session_id,
        code=body.code,
        db=db,                      # ← pass db for test-case lookup
    )

    session = result["session"]
    return CodeSubmitResponse(
        session_id=session_id,
        stage=session.stage,
        result=result["result"],
        feedback=result["feedback"],
        passed_tests=result.get("passed_tests", 0),
        failed_tests=result.get("failed_tests", 0),
        total_tests=result.get("total_tests", 0),
    )


# ──────────────────────────────────────────────────────────────────────────────
# POST /{session_id}/next
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/{session_id}/next",
    response_model=InterviewSessionResponse,
    summary="Advance the session to the next stage or question",
)
async def next_stage(
    session_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Drive the state machine forward one step.

    - If current stage is NEXT_QUESTION and more questions remain → QUESTION.
    - If current stage is NEXT_QUESTION and no more questions  → END.
    - Otherwise follows the default STAGE_TRANSITIONS map.
    """
    session = await interview_engine.advance_stage(session_id)
    return InterviewSessionResponse(
        session_id=session_id,
        stage=session.stage,
        question=_question_out(session),
    )


# ──────────────────────────────────────────────────────────────────────────────
# POST /{session_id}/end
# ──────────────────────────────────────────────────────────────────────────────

@router.post(
    "/{session_id}/end",
    response_model=EndInterviewResponse,
    summary="End the interview session",
)
async def end_interview(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
):
    """
    Gracefully end the session.

    - Computes the aggregate score.
    - Persists the session document to MongoDB.
    - Removes the session from in-memory store.
    - Returns score and feedback summary.
    """
    result = await interview_engine.end_interview(session_id=session_id, db=db)
    final = result["session"]

    return EndInterviewResponse(
        session_id=session_id,
        stage=InterviewStage.END,
        score=result["score"],
        feedback_summary=result["feedback_summary"],
        message="Interview ended successfully. Your results have been saved.",
    )


# ──────────────────────────────────────────────────────────────────────────────
# Legacy endpoints — kept for backward compatibility with existing frontend
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/create_room")
async def create_room(
    data: Dict[str, Any] = Body(...),
    db=Depends(get_database),
):
    """Legacy: creates a collaborative interview room (WebRTC)."""
    room_id = str(uuid.uuid4())[:8]
    interviewer_name = data.get("interviewer_name", "AI Assistant")

    room_data = {
        "room_id":          room_id,
        "interviewer_name": interviewer_name,
        "status":           "waiting",
        "created_at":       datetime.utcnow(),
    }
    await db["interviews"].insert_one(room_data)

    return {
        "room_url": f"/interview/room/{room_id}",
        "room_id":  room_id,
    }


@router.post("/end", response_model=EndInterviewResponse)
async def end_interview_legacy(payload: EndInterviewRequest):
    """Legacy: stub end endpoint from original router."""
    return EndInterviewResponse(
        session_id=payload.session_id,
        stage=InterviewStage.END,
        score=None,
        feedback_summary={"note": "Migrated to POST /{session_id}/end"},
        message="Interview ended.",
    )


@router.get("/question")
async def get_initial_question_legacy(
    language: str = "python",
    role: str = "Software Engineer",
):
    """Legacy: single initial question via AI engine (WebSocket flow)."""
    try:
        from app.services.question_engine import question_engine
        question = await question_engine.generate_question(role, language)
        return {"question": question}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
