"""
Interview Session Model — models/interview_model.py

Defines the MongoDB document structure for a single interview session.
Uses Pydantic v2 (model_config / ConfigDict) to stay consistent with
the rest of the project.
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional

from bson import ObjectId
from pydantic import BaseModel, Field
from pydantic import ConfigDict


# ──────────────────────────────────────────────────────────────────────────────
# Enum
# ──────────────────────────────────────────────────────────────────────────────

class InterviewStage(str, Enum):
    """
    Tracks which phase of the interview the session is currently in.

    Inheriting from `str` allows the value to be serialised directly as a
    JSON string (e.g. "INTRO") without extra conversion steps.
    """
    INTRO               = "INTRO"
    QUESTION            = "QUESTION"
    APPROACH_DISCUSSION = "APPROACH_DISCUSSION"
    CODING              = "CODING"
    TESTING             = "TESTING"
    NEXT_QUESTION       = "NEXT_QUESTION"
    END                 = "END"


# ──────────────────────────────────────────────────────────────────────────────
# Sub-documents
# ──────────────────────────────────────────────────────────────────────────────

class ConversationMessage(BaseModel):
    """A single turn in the interview conversation."""

    role: str = Field(
        ...,
        description="Speaker role: 'system' | 'ai' | 'user'",
        pattern=r"^(system|ai|user)$",
    )
    content: str = Field(..., min_length=1)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)


class QuestionRef(BaseModel):
    """
    Lightweight reference to a question document stored in the questions
    collection.  Embed the fields you need for display / scoring; keep heavy
    content (test cases, editorial) in the questions collection.
    """

    question_id: str = Field(..., description="ObjectId of the question document")
    title:       str = Field(..., description="Question title for display")
    difficulty:  str = Field("medium", description="easy | medium | hard")
    category:    str = Field("", description="e.g. Arrays, Graphs …")
    tags:        List[str] = Field(default_factory=list)

    model_config = ConfigDict(populate_by_name=True)


# ──────────────────────────────────────────────────────────────────────────────
# Root document
# ──────────────────────────────────────────────────────────────────────────────

class InterviewSessionModel(BaseModel):
    """
    MongoDB document that represents one end-to-end interview session.

    Field notes
    -----------
    session_id
        Auto-generated MongoDB ObjectId string.  Stored as ``_id`` in Mongo;
        exposed as ``session_id`` in Python / JSON via the alias.

    questions
        Ordered list of question refs selected for this session.  Populated
        at session creation and never mutated afterwards.

    current_question_index
        Zero-based pointer into ``questions``.  Incremented each time the
        stage transitions to NEXT_QUESTION or END.

    stage
        Current phase of the session (see InterviewStage enum).

    conversation_history
        Append-only list of all chat turns (system prompts, AI messages, and
        user responses) in chronological order.

    score
        Final aggregate score (0–100).  None until the session reaches END.
    """

    # ── identity ──────────────────────────────────────────────────────────────
    session_id: str = Field(
        default_factory=lambda: str(ObjectId()),
        alias="_id",
        description="MongoDB document ID",
    )
    user_id: str = Field(..., description="ObjectId of the owning user document")

    # ── question tracking ─────────────────────────────────────────────────────
    questions: List[QuestionRef] = Field(
        default_factory=list,
        description="Ordered list of questions for this session",
    )
    current_question_index: int = Field(
        default=0,
        ge=0,
        description="Zero-based index of the active question in `questions`",
    )

    # ── session state ─────────────────────────────────────────────────────────
    stage: InterviewStage = Field(
        default=InterviewStage.INTRO,
        description="Current phase of the interview",
    )
    conversation_history: List[ConversationMessage] = Field(
        default_factory=list,
        description="Chronological list of all conversation turns",
    )

    # ── timing ────────────────────────────────────────────────────────────────
    start_time: datetime = Field(
        default_factory=datetime.utcnow,
        description="UTC timestamp when the session was created",
    )
    end_time: Optional[datetime] = Field(
        default=None,
        description="UTC timestamp when the session reached END stage",
    )

    # ── outcome ───────────────────────────────────────────────────────────────
    score: Optional[float] = Field(
        default=None,
        ge=0,
        le=100,
        description="Aggregate score (0–100); populated only after END",
    )

    # ── pydantic v2 config ────────────────────────────────────────────────────
    model_config = ConfigDict(
        populate_by_name=True,       # accept both `session_id` and `_id`
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        use_enum_values=True,        # store "INTRO" not InterviewStage.INTRO
    )

    # ── convenience helpers ───────────────────────────────────────────────────

    @property
    def current_question(self) -> Optional[QuestionRef]:
        """Return the active QuestionRef, or None if the list is empty."""
        if not self.questions or self.current_question_index >= len(self.questions):
            return None
        return self.questions[self.current_question_index]

    @property
    def is_complete(self) -> bool:
        """True once the session has reached the END stage."""
        return self.stage == InterviewStage.END

    def to_mongo(self) -> Dict[str, Any]:
        """
        Serialise the document for insertion / replacement in MongoDB.

        Uses ``by_alias=True`` so the primary key is stored as ``_id``.
        Excludes ``None`` end-time / score to keep documents lean.
        """
        return self.model_dump(by_alias=True, exclude_none=False)
