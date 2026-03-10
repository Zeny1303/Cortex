import logging
from typing import List, Dict

from app.services.speech_to_text_service import transcribe_audio
from app.services.text_to_speech_service import generate_voice
from app.services.ai_interviewer_service import ask_followup

logger = logging.getLogger(__name__)

async def process_voice_turn(
    audio_chunk: bytes,
    current_question: str,
    conversation_history: List[Dict[str, str]]
) -> bytes:
    """
    Orchestrates a single turn of voice interview interaction.
    
    Responsibilities:
    1. Receive audio chunks from candidate (audio_chunk bytes).
    2. Send audio to speech_to_text_service (transcription).
    3. Send transcript to ai_interviewer_service (context generation).
    4. Generate AI response (text).
    5. Convert response to speech using text_to_speech_service.
    6. Return audio stream (bytes object) to client.
    
    Args:
        audio_chunk: Raw audio data from the candidate
        current_question: The active question being answered
        conversation_history: List of previous Q&A turns
        
    Returns:
        Generated MP3/audio bytes of the AI interviewer's voice
    """
    try:
        # Step 2: Convert candidate's speech to text
        transcript = await transcribe_audio(audio_chunk)
        
        if not transcript or not transcript.strip():
            logger.warning("No speech detected or transcription failed from candidate.")
            # Returning empty bytes so the client engine knows not to play anything
            return b""
            
        logger.info(f"Candidate transcript generated: {transcript}")

        # Step 3 & 4: Generate contextualized AI response
        # Using ask_followup as it continues the dynamic interview
        ai_response_text = await ask_followup(current_question, transcript, conversation_history)
        
        # Maintain conversation history state for future turns
        conversation_history.append({
            "question": current_question,
            "answer": transcript,
            "ai_response": ai_response_text
        })
        
        logger.info(f"AI Interviewer generated response: {ai_response_text}")

        # Step 5: Convert AI's text response back to speech
        ai_audio_bytes = await generate_voice(ai_response_text)
        
        # Step 6: Return the voice audio payload to stream to client
        return ai_audio_bytes

    except Exception as e:
        logger.error(f"Error processing voice orchestration turn: {e}", exc_info=True)
        return b""
