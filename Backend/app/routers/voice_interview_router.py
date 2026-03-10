import logging
from typing import Dict, Any, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from jose import jwt, JWTError

from app.config.settings import settings
from app.services.voice_interview_service import process_voice_turn
from app.services.ai_interviewer_service import generate_intro

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/ws/interview",
    tags=["Voice Interview"]
)

# In-memory session tracking. For a production system with multiple workers, 
# you'd back this with Redis or similar.
active_sessions: Dict[str, Dict[str, Any]] = {}

async def get_current_user_ws(token: str) -> str:
    """Validates the JWT token for WebSocket connections."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        user_email: str = payload.get("sub")
        if user_email is None:
            raise ValueError("Invalid authentication credentials")
        return user_email
    except JWTError:
        raise ValueError("Could not validate credentials")


@router.websocket("/{session_id}")
async def voice_interview_endpoint(websocket: WebSocket, session_id: str, token: str):
    """
    WebSocket endpoint for real-time voice interviews.
    
    Expected flow: 
    1. Client connects with a valid JWT token in the query params.
    2. Backend accepts connection, sends AI greeting audio.
    3. Client streams audio chunks (bytes).
    4. Backend orchestrates speech-to-text -> AI -> text-to-speech.
    5. Backend responds with AI audio stream (bytes).
    """
    try:
        # 1. Authentication
        await get_current_user_ws(token)
    except Exception as e:
        logger.error(f"WebSocket auth failed: {e}")
        await websocket.close(code=1008, reason="Authentication failed")
        return

    # 2. Accept connection
    await websocket.accept()
    logger.info(f"Accepted voice interview connection for session {session_id}")

    # Initialize a new conversation history if the session doesn't exist
    if session_id not in active_sessions:
        active_sessions[session_id] = {
            "history": [],
            "current_question": "Can you tell me about yourself?" # Fallback starting point
        }

    session_data = active_sessions[session_id]

    try:
        # Step: Generate and send AI Intro (greeting) using Voice Orchestration logic
        intro_text = await generate_intro()
        logger.info(f"Generated Intro for session {session_id}: {intro_text}")
        
        # NOTE: Ideally, the intro_text is also converted to speech and sent to the client immediately
        # For this turn specifically, we bypass transcription and just do AI -> TTS
        from app.services.text_to_speech_service import generate_voice 
        intro_audio = await generate_voice(intro_text)
        
        # Send initial audio to browser to play right away
        if intro_audio:
            await websocket.send_bytes(intro_audio)

        # 3. Main Communication Loop
        while True:
            # Receive audio chunk from frontend (Expected as binary data)
            audio_data = await websocket.receive_bytes()
            
            # If the user stops the recording or sends an empty chunk
            if not audio_data:
                continue

            logger.info(f"Received audio chunk ({len(audio_data)} bytes) for {session_id}")

            # 4. Process the turn
            ai_audio_response = await process_voice_turn(
                audio_chunk=audio_data,
                current_question=session_data["current_question"],
                conversation_history=session_data["history"]
            )
            
            # Update the theoretical 'current_question' to match the latest AI response 
            # so the next turn's ask_followup has correct context.
            if len(session_data["history"]) > 0:
                 session_data["current_question"] = session_data["history"][-1]["ai_response"]

            # 5. Return AI speech audio stream
            if ai_audio_response:
                await websocket.send_bytes(ai_audio_response)
                logger.info(f"Sent AI response audio ({len(ai_audio_response)} bytes) to {session_id}")
            else:
                 # Inform client there was no response generated (silent/empty)
                 await websocket.send_bytes(b"") 

    except WebSocketDisconnect:
        logger.info(f"Client disconnected from session {session_id}")
    except Exception as e:
        logger.error(f"WebSocket error in session {session_id}: {e}", exc_info=True)
        # Attempt to close cleanly if we hit a server-side error
        try:
             await websocket.close(code=1011, reason="Internal Server Error processing audio")
        except RuntimeError:
             pass # Connection already closed
    finally:
        # Note: We deliberately don't pop the session_id here in case
        # of brief disconnects where a client might reconnect to the same interview.
        # But in a true production system, you'd want TTL handling or explicit END messages.
        pass
