import os
import logging
import asyncio
import httpx
from app.config.settings import settings

logger = logging.getLogger(__name__)

async def generate_voice(text: str) -> bytes:
    """
    Generates speech audio from text using the ElevenLabs API.

    Args:
        text (str): The text to be converted to speech.

    Returns:
        bytes: The raw audio data (e.g., MP3 buffer) suitable for streaming to the browser.
               Returns empty bytes on error.
    """
    if not text or not text.strip():
        logger.warning("Received empty text in generate_voice. Skipping.")
        return b""

    # Using environment variables per user request, failing back to settings module
    api_key = os.getenv("ELEVENLABS_API_KEY", settings.ELEVENLABS_API_KEY)
    voice_id = os.getenv("VOICE_MODEL_ID", settings.VOICE_MODEL_ID)

    if not api_key or not voice_id:
        logger.error("ELEVENLABS_API_KEY or VOICE_MODEL_ID environment variables are not set.")
        raise ValueError("Missing ElevenLabs configuration in environment variables.")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream"

    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": api_key
    }

    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1", # fallback to eleven_multilingual_v2 if needed
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    max_retries = 3
    base_delay = 1.0

    # Retry logic
    for attempt in range(max_retries):
        try:
            # Setting a reasonable timeout for audio generation
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(url, json=data, headers=headers)
                
                if response.status_code == 200:
                    # httpx uses response.content for bytes body when not streamed
                    return response.content
                
                # Retry on rate limits (429) or server errors (5xx)
                elif response.status_code == 429 or response.status_code >= 500:
                    logger.warning(
                        f"ElevenLabs API returned {response.status_code}. "
                        f"Attempt {attempt + 1}/{max_retries}. Retrying..."
                    )
                    if attempt < max_retries - 1:
                        await asyncio.sleep(base_delay * (2 ** attempt)) # exponential backoff
                        continue
                else:
                    # For client errors like 400 Bad Request, 401 Unauthorized, we break immediately
                    logger.error(f"ElevenLabs API error: {response.status_code} - {response.text}")
                    break

        except httpx.RequestError as e:
            logger.error(f"Network error communicating with ElevenLabs (Attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(base_delay * (2 ** attempt))
            else:
                break
        except Exception as e:
            logger.error(f"Unexpected error in generate_voice: {e}", exc_info=True)
            break

    return b""
