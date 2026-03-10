import os
import json
import base64
import asyncio
import logging
import websockets
from websockets.exceptions import WebSocketException

logger = logging.getLogger(__name__)

ASSEMBLYAI_WS_URL = "wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000"

async def transcribe_audio(audio_bytes: bytes) -> str:
    """
    Transcribes an audio chunk using AssemblyAI's Streaming (Real-time) API.

    Args:
        audio_bytes (bytes): The raw audio binary data to transcribe.

    Returns:
        str: The final transcribed text for the given chunk. 
             Returns an empty string on error or if no speech is detected.
    """
    # 1. Handle empty audio
    if not audio_bytes:
        logger.warning("Received empty audio chunk in transcribe_audio. Skipping.")
        return ""

    # Ensure we have the API key
    api_key = os.getenv("ASSEMBLYAI_API_KEY")
    if not api_key:
        logger.error("ASSEMBLYAI_API_KEY environment variable is not set.")
        raise ValueError("ASSEMBLYAI_API_KEY is missing from the environment")

    headers = {
        "Authorization": api_key
    }

    try:
        # Establish a WebSocket connection per request
        # We use a 10s open timeout, and tight ping intervals to maintain stability
        async with websockets.connect(
            ASSEMBLYAI_WS_URL,
            extra_headers=headers,
            open_timeout=10,
            ping_interval=5,
            ping_timeout=20
        ) as ws:

            # 2. Wait for SessionBegins from AssemblyAI API
            try:
                session_start_msg = await asyncio.wait_for(ws.recv(), timeout=5.0)
                session_start_data = json.loads(session_start_msg)
                
                if session_start_data.get("message_type") != "SessionBegins":
                    logger.error(f"Failed to start AssemblyAI session. Response: {session_start_data}")
                    return ""
            except asyncio.TimeoutError:
                logger.error("Timeout waiting for AssemblyAI SessionBegins.")
                return ""

            # 3. Send the audio chunk
            # AssemblyAI requires audio data to be base64-encoded strings
            audio_data_b64 = base64.b64encode(audio_bytes).decode('utf-8')
            payload = {
                "audio_data": audio_data_b64
            }
            await ws.send(json.dumps(payload))

            # Send the termination command immediately to complete transcription for this single chunk
            terminate_payload = {"terminate_session": True}
            await ws.send(json.dumps(terminate_payload))

            # 4. Receive and accumulate transcripts
            transcript_text = []

            while True:
                try:
                    # Using a 10-second timeout to bound the total processing time
                    message_str = await asyncio.wait_for(ws.recv(), timeout=10.0)
                    message = json.loads(message_str)

                    message_type = message.get("message_type")

                    if message_type == "SessionTerminated":
                        logger.debug("AssemblyAI session terminated successfully.")
                        break

                    elif message_type == "FinalTranscript":
                        text = message.get("text", "")
                        if text:
                            transcript_text.append(text)

                    elif message_type == "Error":
                        error_msg = message.get("error")
                        logger.error(f"AssemblyAI processing error: {error_msg}")
                        break

                    # We can safely ignore PartialTranscript as we wait for FinalTranscript
                    elif message_type == "PartialTranscript":
                        pass
                    
                    else:
                        pass # Ignore unhandled message types

                except asyncio.TimeoutError:
                    logger.error("Timeout occurred while waiting for transcript from AssemblyAI.")
                    break

            # 5. Return transcript text
            return " ".join(transcript_text).strip()

    # Handling connection errors and timeouts at the connection level
    except asyncio.TimeoutError:
        logger.error("Connection attempt to AssemblyAI timed out.")
        return ""
    except WebSocketException as e:
        logger.error(f"WebSocket connection error with AssemblyAI: {e}")
        return ""
    except Exception as e:
        logger.error(f"Unexpected error in transcribe_audio: {e}", exc_info=True)
        return ""
