"""
Session Manager — services/session_manager.py

Maintains an in-memory dictionary of active interview sessions.
Each value is an InterviewSessionModel instance.

Thread-safety
-------------
All mutations go through asyncio.Lock so the manager is safe under
FastAPI's async request handlers running on a single event loop.

Session expiry
--------------
Sessions older than SESSION_TTL_SECONDS are automatically pruned from
memory the next time any read/write call is made (lazy cleanup).
For production deployments with multiple workers, swap the in-memory
dict for Redis.
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from fastapi import HTTPException

from app.models.interview_model import (
    ConversationMessage,
    InterviewSessionModel,
    InterviewStage,
    QuestionRef,
)

logger = logging.getLogger(__name__)

# Sessions idle longer than this are eligible for cleanup (1 hour)
SESSION_TTL_SECONDS: int = 3600


class SessionManager:
    """
    Singleton-style in-memory store for active interview sessions.

    Usage
    -----
    from app.services.session_manager import session_manager

    session = await session_manager.create_session(user_id, questions)
    session = await session_manager.get_session(session_id)
    """

    def __init__(self) -> None:
        # Public so tests can inspect it directly if needed
        self.sessions: Dict[str, InterviewSessionModel] = {}
        self._lock = asyncio.Lock()

    # ─────────────────────────────────────────────────────────────────────────
    # CREATE
    # ─────────────────────────────────────────────────────────────────────────

    async def create_session(
        self,
        user_id: str,
        questions: List[dict],
    ) -> InterviewSessionModel:
        """
        Build a new InterviewSessionModel and store it.

        Parameters
        ----------
        user_id   : ObjectId string of the authenticated user
        questions : List of sanitised question dicts from question_service
                    (keys: _id, title, difficulty, category, tags)

        Returns
        -------
        The freshly-created InterviewSessionModel.
        """
        question_refs = [
            QuestionRef(
                question_id=q.get("_id", ""),
                title=q.get("title", ""),
                difficulty=q.get("difficulty", "medium"),
                category=q.get("category", ""),
                tags=q.get("tags", []),
            )
            for q in questions
        ]

        session = InterviewSessionModel(
            user_id=user_id,
            questions=question_refs,
            stage=InterviewStage.INTRO,
        )

        async with self._lock:
            self.sessions[session.session_id] = session
            self._lazy_cleanup()

        logger.info(
            "create_session: created %s for user %s with %d questions",
            session.session_id,
            user_id,
            len(question_refs),
        )
        return session

    # ─────────────────────────────────────────────────────────────────────────
    # READ
    # ─────────────────────────────────────────────────────────────────────────

    async def get_session(self, session_id: str) -> InterviewSessionModel:
        """
        Retrieve an active session by ID.

        Raises
        ------
        HTTPException 404 — session not found or already expired
        """
        async with self._lock:
            session = self.sessions.get(session_id)

        if session is None:
            raise HTTPException(
                status_code=404,
                detail=f"Session not found: '{session_id}'",
            )
        return session

    # ─────────────────────────────────────────────────────────────────────────
    # UPDATE — stage
    # ─────────────────────────────────────────────────────────────────────────

    async def update_stage(
        self,
        session_id: str,
        new_stage: InterviewStage,
    ) -> InterviewSessionModel:
        """
        Transition the session to a new stage.

        Sets ``end_time`` automatically when transitioning to END.

        Returns
        -------
        The updated InterviewSessionModel.

        Raises
        ------
        HTTPException 404 — session not found
        HTTPException 409 — session already ended
        """
        async with self._lock:
            session = self._require(session_id)
            if session.stage == InterviewStage.END:
                raise HTTPException(
                    status_code=409,
                    detail="Session has already ended. No further stage transitions allowed.",
                )
            session.stage = new_stage
            if new_stage == InterviewStage.END and session.end_time is None:
                session.end_time = datetime.utcnow()

        logger.info("update_stage: %s → %s", session_id, new_stage)
        return session

    # ─────────────────────────────────────────────────────────────────────────
    # UPDATE — question pointer
    # ─────────────────────────────────────────────────────────────────────────

    async def advance_question(self, session_id: str) -> InterviewSessionModel:
        """
        Move current_question_index forward by one.

        If there are no more questions the stage is automatically set to END.

        Returns
        -------
        The updated InterviewSessionModel.
        """
        async with self._lock:
            session = self._require(session_id)
            next_index = session.current_question_index + 1

            if next_index >= len(session.questions):
                # Out of questions — finish the session
                session.stage = InterviewStage.END
                session.end_time = datetime.utcnow()
                logger.info(
                    "advance_question: %s — no more questions, moving to END",
                    session_id,
                )
            else:
                session.current_question_index = next_index
                session.stage = InterviewStage.QUESTION
                logger.info(
                    "advance_question: %s → question index %d",
                    session_id,
                    next_index,
                )
        return session

    # ─────────────────────────────────────────────────────────────────────────
    # UPDATE — conversation
    # ─────────────────────────────────────────────────────────────────────────

    async def append_message(
        self,
        session_id: str,
        role: str,
        content: str,
    ) -> None:
        """Append a single turn to conversation_history."""
        async with self._lock:
            session = self._require(session_id)
            session.conversation_history.append(
                ConversationMessage(role=role, content=content)
            )

    # ─────────────────────────────────────────────────────────────────────────
    # UPDATE — score
    # ─────────────────────────────────────────────────────────────────────────

    async def set_score(self, session_id: str, score: float) -> None:
        """Persist the final aggregate score (0-100)."""
        async with self._lock:
            session = self._require(session_id)
            session.score = max(0.0, min(100.0, score))

    # ─────────────────────────────────────────────────────────────────────────
    # DELETE
    # ─────────────────────────────────────────────────────────────────────────

    async def end_session(self, session_id: str) -> InterviewSessionModel:
        """
        Mark the session as ended (stage → END) and remove it from memory.

        The returned snapshot can be persisted to MongoDB before discard.

        Returns
        -------
        Final InterviewSessionModel snapshot.
        """
        async with self._lock:
            session = self._require(session_id)
            session.stage = InterviewStage.END
            if session.end_time is None:
                session.end_time = datetime.utcnow()
            # Remove from in-memory store
            del self.sessions[session_id]

        logger.info("end_session: %s removed from memory", session_id)
        return session

    # ─────────────────────────────────────────────────────────────────────────
    # INTERNAL HELPERS  (must be called while holding self._lock)
    # ─────────────────────────────────────────────────────────────────────────

    def _require(self, session_id: str) -> InterviewSessionModel:
        """Fetch session or raise 404. MUST be called inside lock."""
        session = self.sessions.get(session_id)
        if session is None:
            raise HTTPException(
                status_code=404,
                detail=f"Session not found: '{session_id}'",
            )
        return session

    def _lazy_cleanup(self) -> None:
        """
        Remove sessions older than SESSION_TTL_SECONDS.
        Called lazily on every create to avoid keeping stale data forever.
        MUST be called inside lock.
        """
        cutoff = datetime.utcnow() - timedelta(seconds=SESSION_TTL_SECONDS)
        stale = [
            sid
            for sid, s in self.sessions.items()
            if s.start_time < cutoff
        ]
        for sid in stale:
            logger.warning("lazy_cleanup: expiring stale session %s", sid)
            del self.sessions[sid]


# ──────────────────────────────────────────────────────────────────────────────
# Module-level singleton — import this everywhere
# ──────────────────────────────────────────────────────────────────────────────
session_manager = SessionManager()
