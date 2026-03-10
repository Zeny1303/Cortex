"""
Interview Engine — services/interview_engine.py

Orchestrates the full lifecycle of an interview session:
    start → INTRO → QUESTION → [APPROACH_DISCUSSION/CODING/TESTING] → NEXT_QUESTION → … → END

Dependencies
------------
- session_manager       : in-memory session store
- question_service      : fetches questions from MongoDB
- code_execution_service: runs candidate code against hidden test cases
- database              : Motor db injected at call-site

Design
------
The engine is a stateless service object; all state lives inside
InterviewSessionModel instances owned by session_manager.

Public API
----------
start_interview(user_id, difficulty, question_count, db)
get_current_question(session_id)
submit_code(session_id, code, db)          ← db added for test-case lookup
advance_stage(session_id)
end_interview(session_id, db)
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Any, Dict, Optional

from fastapi import HTTPException

from app.models.interview_model import InterviewSessionModel, InterviewStage, QuestionRef
from app.services.session_manager import session_manager
from app.services.question_service import get_random_questions
from app.services import code_execution_service

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Stage transition map
# Each stage maps to the next stage triggered by a generic "advance" call.
# Branching transitions (e.g. submit_code → TESTING) are handled separately.
# ──────────────────────────────────────────────────────────────────────────────

STAGE_TRANSITIONS: Dict[InterviewStage, InterviewStage] = {
    InterviewStage.INTRO:               InterviewStage.QUESTION,
    InterviewStage.QUESTION:            InterviewStage.APPROACH_DISCUSSION,
    InterviewStage.APPROACH_DISCUSSION: InterviewStage.CODING,
    InterviewStage.CODING:              InterviewStage.TESTING,
    InterviewStage.TESTING:             InterviewStage.NEXT_QUESTION,
    InterviewStage.NEXT_QUESTION:       InterviewStage.QUESTION,   # or END — handled in advance_stage
    InterviewStage.END:                 InterviewStage.END,         # terminal
}


class InterviewEngine:
    """
    Stateless orchestrator for the interview state machine.
    Use the module-level singleton `interview_engine` rather than
    instantiating this class directly.
    """

    # ─────────────────────────────────────────────────────────────────────────
    # START
    # ─────────────────────────────────────────────────────────────────────────

    async def start_interview(
        self,
        user_id: str,
        difficulty: str,
        question_count: int,
        db,                        # Motor database instance
    ) -> InterviewSessionModel:
        """
        Create a new interview session.

        Steps
        -----
        1. Fetch `question_count` random questions from MongoDB.
        2. Build an InterviewSessionModel in session_manager.
        3. Transition stage from INTRO → QUESTION.
        4. Append an opening system message to conversation_history.

        Parameters
        ----------
        user_id        : authenticated user's ObjectId string
        difficulty     : "easy" | "medium" | "hard"
        question_count : 1-10
        db             : Motor database (from get_database() dependency)

        Returns
        -------
        InterviewSessionModel at QUESTION stage.
        """
        # 1. Fetch questions
        questions = await get_random_questions(db, difficulty, question_count)
        if not questions:
            raise HTTPException(
                status_code=404,
                detail=f"No '{difficulty}' questions available in the database.",
            )

        # 2. Create session
        session = await session_manager.create_session(
            user_id=user_id,
            questions=questions,
        )

        # 3. Advance to QUESTION stage
        session = await session_manager.update_stage(
            session.session_id, InterviewStage.QUESTION
        )

        # 4. System message to seed conversation history
        opening = (
            f"Welcome! This interview has {len(questions)} "
            f"{difficulty.capitalize()} question(s). "
            "Let's begin with the first one."
        )
        await session_manager.append_message(
            session.session_id, role="system", content=opening
        )

        logger.info(
            "start_interview: session %s started for user %s (%d questions, %s)",
            session.session_id, user_id, len(questions), difficulty,
        )
        return session

    # ─────────────────────────────────────────────────────────────────────────
    # READ CURRENT QUESTION
    # ─────────────────────────────────────────────────────────────────────────

    async def get_current_question(
        self,
        session_id: str,
    ) -> Optional[QuestionRef]:
        """
        Return the active QuestionRef for the session.

        Returns None when the session is in INTRO or END stage.

        Raises
        ------
        HTTPException 404 — session not found
        """
        session = await session_manager.get_session(session_id)
        return session.current_question

    # ─────────────────────────────────────────────────────────────────────────
    # SUBMIT CODE
    # ─────────────────────────────────────────────────────────────────────────

    async def submit_code(
        self,
        session_id: str,
        code: str,
        db,                        # Motor database — needed for test-case lookup
    ) -> Dict[str, Any]:
        """
        Accept a code submission, execute it against hidden test cases, record
        the result, and transition the session to TESTING stage.

        Steps
        -----
        1. Validate code is non-empty and session is in CODING stage.
        2. Retrieve question_id from the session's current question.
        3. Run code_execution_service.run_tests() with hide_inputs=True.
        4. Append submission + AI feedback to conversation_history.
        5. Update session stage to TESTING.
        6. Return structured pass/fail summary.

        Returns
        -------
        dict with keys:
            result        : "passed" | "partial" | "failed" | "error"
            feedback      : human-readable summary string
            passed_tests  : int
            failed_tests  : int
            total_tests   : int
            exec_error    : top-level compile/syntax error string or None
            session       : updated InterviewSessionModel

        Raises
        ------
        HTTPException 400 — code is blank or no current question
        HTTPException 409 — session is not in CODING stage
        """
        if not code or not code.strip():
            raise HTTPException(status_code=400, detail="Code submission cannot be empty.")

        session = await session_manager.get_session(session_id)

        if session.stage != InterviewStage.CODING:
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Code submission is only allowed during the CODING stage. "
                    f"Current stage: {session.stage}"
                ),
            )

        # ── Step 1: Get question_id ───────────────────────────────────────────
        q_ref = session.current_question
        if q_ref is None:
            raise HTTPException(
                status_code=400,
                detail="No active question found for this session.",
            )
        question_id = q_ref.question_id

        # ── Step 2: Record submission ─────────────────────────────────────────
        await session_manager.append_message(
            session_id=session_id,
            role="user",
            content=f"[Code submission — {q_ref.title}]\n```python\n{code}\n```",
        )

        # ── Step 3: Execute against hidden test cases ─────────────────────────
        exec_result = await code_execution_service.run_tests(
            db=db,
            question_id=question_id,
            code=code,
            hide_inputs=True,       # test_cases NEVER sent to frontend
        )

        passed  = exec_result["passed_tests"]
        failed  = exec_result["failed_tests"]
        total   = exec_result["total_tests"]
        outcome = exec_result["result"]      # "passed" | "partial" | "failed" | "error"

        # ── Step 4: Generate AI feedback message ──────────────────────────────
        if outcome == "passed":
            feedback = (
                f"✅ All {total} test case(s) passed! Great work. "
                "We'll now move to the testing discussion."
            )
        elif outcome == "partial":
            feedback = (
                f"⚠️  {passed}/{total} test case(s) passed. "
                "Some edge cases failed — review your logic before we discuss."
            )
        elif outcome == "failed":
            feedback = (
                f"❌ None of the {total} test case(s) passed. "
                "Let's walk through your approach and identify the issue."
            )
        else:  # "error"
            feedback = (
                f"⛔ Your code could not be executed: {exec_result.get('error', 'Unknown error')}. "
                "Please check your syntax and try again."
            )

        await session_manager.append_message(
            session_id=session_id,
            role="ai",
            content=feedback,
        )

        # ── Step 5: Transition to TESTING ────────────────────────────────────
        session = await session_manager.update_stage(session_id, InterviewStage.TESTING)

        logger.info(
            "submit_code: session=%s question='%s' → %s (%d/%d passed)",
            session_id, question_id, outcome, passed, total,
        )

        return {
            "result":       outcome,
            "feedback":     feedback,
            "passed_tests": passed,
            "failed_tests": failed,
            "total_tests":  total,
            "exec_error":   exec_result.get("error"),
            "session":      session,
        }

    # ─────────────────────────────────────────────────────────────────────────
    # ADVANCE STAGE
    # ─────────────────────────────────────────────────────────────────────────

    async def advance_stage(
        self,
        session_id: str,
    ) -> InterviewSessionModel:
        """
        Drive the state machine forward by one step.

        When current stage is NEXT_QUESTION:
            - If more questions remain  → advance_question (resets to QUESTION)
            - If no more questions      → END

        For all other stages the next stage is looked up from STAGE_TRANSITIONS.

        Returns
        -------
        Updated InterviewSessionModel.

        Raises
        ------
        HTTPException 409 — session already ended
        """
        session = await session_manager.get_session(session_id)

        if session.stage == InterviewStage.END:
            raise HTTPException(status_code=409, detail="Session has already ended.")

        if session.stage == InterviewStage.NEXT_QUESTION:
            # advance_question handles the QUESTION / END decision internally
            session = await session_manager.advance_question(session_id)
            logger.info("advance_stage: %s — advanced question pointer", session_id)
            return session

        next_stage = STAGE_TRANSITIONS.get(session.stage)
        if next_stage is None:
            raise HTTPException(
                status_code=400,
                detail=f"No transition defined from stage '{session.stage}'.",
            )

        session = await session_manager.update_stage(session_id, next_stage)
        logger.info(
            "advance_stage: %s %s → %s",
            session_id, session.stage, next_stage,
        )
        return session

    # ─────────────────────────────────────────────────────────────────────────
    # END INTERVIEW
    # ─────────────────────────────────────────────────────────────────────────

    async def end_interview(
        self,
        session_id: str,
        db,
    ) -> Dict[str, Any]:
        """
        Gracefully end the session:
        1. Compute aggregate score from conversation_history length (placeholder).
        2. Set the score on the session.
        3. Persist the session document to MongoDB ``interviews`` collection.
        4. Remove the session from in-memory store.

        Returns
        -------
        Dict with session snapshot and feedback_summary.

        Raises
        ------
        HTTPException 404 — session not found
        """
        session = await session_manager.get_session(session_id)

        # Placeholder scoring — replace with AI evaluator for production
        total_messages = len(session.conversation_history)
        score = min(100.0, round(total_messages * 5.0, 1))

        await session_manager.set_score(session_id, score)

        # Persist to MongoDB before removing from memory
        final_snapshot = await session_manager.end_session(session_id)

        try:
            doc = final_snapshot.to_mongo()
            await db["interviews"].replace_one(
                {"_id": final_snapshot.session_id},
                doc,
                upsert=True,
            )
            logger.info("end_interview: session %s persisted to MongoDB", session_id)
        except Exception as exc:
            logger.error("end_interview: failed to persist session %s: %s", session_id, exc)
            # Don't raise — session is functionally over; log and continue.

        feedback_summary = {
            "questions_attempted": final_snapshot.current_question_index + 1,
            "total_questions":     len(final_snapshot.questions),
            "score":               score,
            "duration_seconds": (
                (final_snapshot.end_time or datetime.utcnow()) - final_snapshot.start_time
            ).seconds,
        }

        return {
            "session":         final_snapshot,
            "score":           score,
            "feedback_summary": feedback_summary,
        }


# ──────────────────────────────────────────────────────────────────────────────
# Module-level singleton
# ──────────────────────────────────────────────────────────────────────────────
interview_engine = InterviewEngine()
