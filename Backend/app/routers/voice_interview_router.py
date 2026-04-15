"""
voice_interview_router.py

WebSocket endpoint for the real-time voice interview.

Protocol — Server → Client
--------------------------
  Binary frame     — MP3 audio bytes. Play immediately.
  Text frame JSON  — typed control events:

    {"event": "connected",      "session_id": "...", "candidate_name": "..."}
    {"event": "greeting_text",  "text": "..."}        ← AI greeting shown while audio loads
    {"event": "ai_text",        "text": "..."}        ← AI response text each turn
    {"event": "user_text",      "text": "..."}        ← Candidate STT transcript
    {"event": "processing"}                            ← AI is thinking — show spinner
    {"event": "silence"}                               ← No speech detected this turn
    {"event": "tts_unavailable","text": "..."}        ← TTS failed; text still available
    {"event": "error",          "message": "..."}
    {"event": "end"}                                   ← Session closed

Protocol — Client → Server
--------------------------
  Binary frame     — Raw audio chunk (one complete candidate answer).
  Text frame JSON  — control messages:

    {"action": "end_session"}                          ← Graceful client-side close

Name resolution order
---------------------
1. "name" / "full_name" / "username" field in JWT payload
2. Prefix of the email field in JWT  (john.doe@... → "John Doe")
3. "username" query param in the WS URL  (?token=...&username=John)
4. Empty string — greeting falls back to a generic welcome
"""

import asyncio
import json
import logging
from typing import Any, Dict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from jose import JWTError, jwt

from app.config.settings import settings
from app.services.ai_interviewer_service import generate_intro
from app.services.tts_service import generate_voice
from app.services.voice_interview_service import process_voice_turn

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ws/interview", tags=["Voice Interview"])

# In-memory session store.
# For multi-worker deployments swap for a Redis-backed store.
active_sessions: Dict[str, Dict[str, Any]] = {}

# Hard ceiling on how long a single STT→LLM→TTS turn may take.
_TURN_TIMEOUT_S = 70.0


# ─────────────────────────────────────────────────────────────────────────────
# Auth helpers
# ─────────────────────────────────────────────────────────────────────────────

def _extract_name_from_email(email: str) -> str:
    """Turn 'john.doe@company.com' into 'John Doe'."""
    prefix = email.split("@")[0]
    return prefix.replace(".", " ").replace("_", " ").replace("-", " ").title()


def _authenticate(token: str, username_fallback: str = "") -> Dict[str, str]:
    """
    Decode and validate the JWT.  Returns a dict with keys:
        user_id, email, name

    Raises ValueError on invalid / expired token.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
    except JWTError as exc:
        raise ValueError(f"JWT validation failed: {exc}") from exc

    user_id: str = payload.get("user_id", "")
    email: str   = payload.get("email", "")

    if not user_id and not email:
        raise ValueError("Token payload contains neither user_id nor email.")

    # Resolve display name
    name: str = (
        payload.get("name", "")
        or payload.get("full_name", "")
        or payload.get("username", "")
    )
    if not name and email:
        name = _extract_name_from_email(email)
    if not name and username_fallback:
        name = username_fallback.strip().title()

    return {"user_id": user_id, "email": email, "name": name.strip()}


# ─────────────────────────────────────────────────────────────────────────────
# WebSocket send helpers
# ─────────────────────────────────────────────────────────────────────────────

async def _send_event(ws: WebSocket, **kwargs: Any) -> None:
    """Emit a JSON control frame. Swallows errors so the loop stays alive."""
    try:
        await ws.send_text(json.dumps(kwargs))
    except Exception as exc:
        logger.warning("[VoiceWS] send_event(%s) failed: %s", kwargs.get("event"), exc)


async def _send_audio(ws: WebSocket, audio: bytes, label: str = "") -> None:
    """Emit a binary MP3 frame."""
    try:
        await ws.send_bytes(audio)
        logger.info(
            "[VoiceWS] Audio sent: %d bytes%s",
            len(audio),
            f" ({label})" if label else "",
        )
    except Exception as exc:
        logger.warning("[VoiceWS] send_audio failed: %s", exc)


# ─────────────────────────────────────────────────────────────────────────────
# Main WebSocket endpoint
# ─────────────────────────────────────────────────────────────────────────────

@router.websocket("/{session_id}")
async def voice_interview_endpoint(websocket: WebSocket, session_id: str):
    """
    Real-time voice interview WebSocket.

    Connect with:
        ws://<host>/ws/interview/<session_id>?token=<JWT>[&username=<display_name>]

    The optional &username param is a client-side hint for when the JWT
    does not carry a display name field (e.g. older tokens).
    """
    await websocket.accept()
    logger.info("[VoiceWS] Accepted  session=%s", session_id)

    # ── 1. JWT auth ───────────────────────────────────────────────────────────
    token = websocket.query_params.get("token", "")
    if not token:
        logger.warning("[VoiceWS] Missing token  session=%s", session_id)
        await websocket.close(code=1008, reason="Missing JWT token")
        return

    username_hint = websocket.query_params.get("username", "")

    try:
        user_info = _authenticate(token, username_fallback=username_hint)
    except ValueError as exc:
        logger.error("[VoiceWS] Auth failed  session=%s: %s", session_id, exc)
        await websocket.close(code=1008, reason="Authentication failed")
        return

    candidate_name: str = user_info["name"]
    logger.info(
        "[VoiceWS] Authenticated  user=%s  name=%r  session=%s",
        user_info.get("email") or user_info.get("user_id"),
        candidate_name,
        session_id,
    )

    # ── 2. Session init ───────────────────────────────────────────────────────
    if session_id not in active_sessions:
        active_sessions[session_id] = {
            "history":          [],
            "current_question": "Can you start by telling me a bit about yourself?",
            "user_id":          user_info["user_id"],
            "candidate_name":   candidate_name,
        }
    session = active_sessions[session_id]

    # ── 3. Main handler ───────────────────────────────────────────────────────
    try:

        # 3a. Tell client we're live
        await _send_event(
            websocket,
            event="connected",
            session_id=session_id,
            candidate_name=candidate_name,
        )

        # 3b. Generate personalised greeting (Groq)
        logger.info(
            "[VoiceWS] Generating greeting for %r  session=%s",
            candidate_name, session_id,
        )
        try:
            greeting_text = await asyncio.wait_for(
                generate_intro(candidate_name=candidate_name),
                timeout=20.0,
            )
        except asyncio.TimeoutError:
            logger.warning("[VoiceWS] generate_intro timed out — using fallback")
            first = candidate_name.split()[0] if candidate_name else ""
            greeting_text = (
                (f"Hi {first}, great to meet you! " if first else "Hi there, great to meet you! ")
                + "I'm Alex, your AI interviewer for today. "
                + "We'll work through a coding problem together — just think out loud "
                + "and we'll have a great session."
            )

        logger.info("[VoiceWS] Greeting: %r", greeting_text[:120])

        # Send text immediately so the UI can display it while audio loads
        await _send_event(websocket, event="greeting_text", text=greeting_text)

        # 3c. Synthesise greeting audio (Polly)
        try:
            greeting_audio = await asyncio.wait_for(
                generate_voice(greeting_text),
                timeout=20.0,
            )
        except asyncio.TimeoutError:
            logger.warning("[VoiceWS] generate_voice timed out for greeting")
            greeting_audio = b""

        if greeting_audio:
            await _send_audio(websocket, greeting_audio, label="greeting")
        else:
            logger.warning("[VoiceWS] Greeting audio unavailable — text already sent to client")
            await _send_event(websocket, event="tts_unavailable", text=greeting_text)

        # 3d. Main receive → process → respond loop
        while True:
            message = await websocket.receive()

            # Text control frame
            if "text" in message:
                try:
                    control = json.loads(message["text"])
                except json.JSONDecodeError:
                    continue

                if control.get("action") == "end_session":
                    logger.info("[VoiceWS] end_session  session=%s", session_id)
                    await _send_event(websocket, event="end")
                    break
                continue

            # Binary audio frame
            audio_data: bytes = message.get("bytes", b"")
            if not audio_data:
                continue

            logger.info(
                "[VoiceWS] Audio chunk: %d bytes  session=%s",
                len(audio_data), session_id,
            )

            await _send_event(websocket, event="processing")

            try:
                result = await asyncio.wait_for(
                    process_voice_turn(
                        audio_chunk=audio_data,
                        current_question=session["current_question"],
                        conversation_history=session["history"],
                    ),
                    timeout=_TURN_TIMEOUT_S,
                )
            except asyncio.TimeoutError:
                logger.error(
                    "[VoiceWS] process_voice_turn timed out (%.0fs)  session=%s",
                    _TURN_TIMEOUT_S, session_id,
                )
                await _send_event(
                    websocket,
                    event="error",
                    message="I took a bit long — please go ahead.",
                )
                continue

            # Route on result
            if result.skip_reason == "no_speech":
                await _send_event(websocket, event="silence")
                continue

            if result.skip_reason in ("stt_timeout", "stt_error"):
                await _send_event(
                    websocket,
                    event="error",
                    message="I had trouble hearing that — could you repeat it?",
                )
                continue

            if result.transcript:
                await _send_event(websocket, event="user_text", text=result.transcript)

            if result.ai_text:
                session["current_question"] = result.ai_text
                await _send_event(websocket, event="ai_text", text=result.ai_text)

            if result.skip_reason in ("tts_timeout", "tts_error", "tts_empty"):
                await _send_event(websocket, event="tts_unavailable", text=result.ai_text)
                continue

            if result.audio:
                await _send_audio(websocket, result.audio, label="turn")
            else:
                await _send_event(websocket, event="silence")

    except WebSocketDisconnect:
        logger.info("[VoiceWS] Client disconnected  session=%s", session_id)
    except Exception as exc:
        logger.error(
            "[VoiceWS] Unhandled error  session=%s: %s", session_id, exc, exc_info=True,
        )
        try:
            await _send_event(websocket, event="error", message="An unexpected error occurred.")
            await websocket.close(code=1011, reason="Internal server error")
        except RuntimeError:
            pass
    finally:
        active_sessions.pop(session_id, None)
        logger.info("[VoiceWS] Session cleaned up  session=%s", session_id)