"""
voice_interview_service.py

Orchestrates one complete voice turn:
    candidate audio → STT → LLM → TTS → AI audio bytes

Changes vs original
-------------------
* Returns a typed VoiceTurnResult dataclass so the router knows whether to
  send audio, send a silence event, or skip — instead of guessing from b"".
* Conversation history is appended here with the full schema
  {question, answer, ai_response} that ai_interviewer_service expects.
* Per-step timeouts are enforced so a slow upstream never blocks the WS loop.
* Structured logging with step timings to aid debugging.
"""

import asyncio
import logging
import time
from dataclasses import dataclass, field
from typing import Dict, List, Optional

from app.services.ai_interviewer_service import ask_followup
from app.services.speech_to_text_service import transcribe_audio
from app.services.tts_service import generate_voice

logger = logging.getLogger(__name__)

# ── Timeouts ─────────────────────────────────────────────────────────────────
# Give STT the most time — it includes an upload + poll cycle.
_STT_TIMEOUT_S = 50.0
_LLM_TIMEOUT_S = 15.0
_TTS_TIMEOUT_S = 15.0


# ── Result type ───────────────────────────────────────────────────────────────

@dataclass
class VoiceTurnResult:
    """Outcome of a single voice turn."""

    # Audio bytes to stream to the client. Empty if no speech was detected
    # or if any upstream step failed.
    audio: bytes = field(default=b"")

    # True when the candidate's audio contained intelligible speech.
    has_speech: bool = False

    # The STT transcript (useful for logging / front-end display).
    transcript: str = ""

    # The AI text response before TTS (useful for logging / front-end display).
    ai_text: str = ""

    # Human-readable reason when audio is empty.
    skip_reason: Optional[str] = None


# ── Main public function ──────────────────────────────────────────────────────

async def process_voice_turn(
    audio_chunk: bytes,
    current_question: str,
    conversation_history: List[Dict[str, str]],
) -> VoiceTurnResult:
    """
    Run one full STT → LLM → TTS pipeline for a single candidate turn.

    Args:
        audio_chunk:          Raw audio bytes from the candidate's microphone.
        current_question:     The interview question currently on the table.
        conversation_history: Mutable list of past turns; appended in-place.

    Returns:
        VoiceTurnResult with .audio populated on success.
    """
    t0 = time.monotonic()

    # ── Step 1: Speech-to-text ────────────────────────────────────────────────
    try:
        transcript = await asyncio.wait_for(
            transcribe_audio(audio_chunk),
            timeout=_STT_TIMEOUT_S,
        )
    except asyncio.TimeoutError:
        logger.error("[Turn] STT timed out after %.0fs", _STT_TIMEOUT_S)
        return VoiceTurnResult(skip_reason="stt_timeout")
    except Exception as exc:
        logger.error("[Turn] STT raised an exception: %s", exc, exc_info=True)
        return VoiceTurnResult(skip_reason="stt_error")

    t1 = time.monotonic()
    logger.info("[Turn] STT done in %.2fs — transcript: %r", t1 - t0, transcript[:120])

    if not transcript or not transcript.strip():
        logger.info("[Turn] No speech detected — skipping LLM+TTS.")
        return VoiceTurnResult(has_speech=False, skip_reason="no_speech")

    # ── Step 2: LLM follow-up ─────────────────────────────────────────────────
    try:
        ai_text = await asyncio.wait_for(
            ask_followup(current_question, transcript, conversation_history),
            timeout=_LLM_TIMEOUT_S,
        )
    except asyncio.TimeoutError:
        logger.error("[Turn] LLM timed out after %.0fs", _LLM_TIMEOUT_S)
        ai_text = "Could you give me a moment — I'd like you to continue from where you left off."
    except Exception as exc:
        logger.error("[Turn] LLM raised an exception: %s", exc, exc_info=True)
        ai_text = "Let's continue — could you elaborate on your approach?"

    t2 = time.monotonic()
    logger.info("[Turn] LLM done in %.2fs — response: %r", t2 - t1, ai_text[:120])

    # ── Persist turn to history (BEFORE TTS so failures don't lose context) ───
    conversation_history.append({
        "question": current_question,
        "answer": transcript,
        "ai_response": ai_text,
    })

    # ── Step 3: Text-to-speech ────────────────────────────────────────────────
    try:
        audio_bytes = await asyncio.wait_for(
            generate_voice(ai_text),
            timeout=_TTS_TIMEOUT_S,
        )
    except asyncio.TimeoutError:
        logger.error("[Turn] TTS timed out after %.0fs", _TTS_TIMEOUT_S)
        return VoiceTurnResult(
            has_speech=True,
            transcript=transcript,
            ai_text=ai_text,
            skip_reason="tts_timeout",
        )
    except Exception as exc:
        logger.error("[Turn] TTS raised an exception: %s", exc, exc_info=True)
        return VoiceTurnResult(
            has_speech=True,
            transcript=transcript,
            ai_text=ai_text,
            skip_reason="tts_error",
        )

    t3 = time.monotonic()
    logger.info(
        "[Turn] TTS done in %.2fs — %d bytes audio. Total turn: %.2fs",
        t3 - t2, len(audio_bytes), t3 - t0,
    )

    if not audio_bytes:
        logger.warning("[Turn] TTS returned empty audio.")
        return VoiceTurnResult(
            has_speech=True,
            transcript=transcript,
            ai_text=ai_text,
            skip_reason="tts_empty",
        )

    return VoiceTurnResult(
        audio=audio_bytes,
        has_speech=True,
        transcript=transcript,
        ai_text=ai_text,
    )