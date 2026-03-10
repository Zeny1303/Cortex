import boto3
import os
import logging
import asyncio
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Initialize boto3 client for Polly
# It picks up aws_access_key_id from AWS_ACCESS_KEY, aws_secret_access_key from AWS_SECRET_KEY as specified by the user.
try:
    polly = boto3.client(
        "polly",
        region_name=os.getenv("AWS_REGION"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
        aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
    )
except Exception as e:
    logger.error(f"Failed to initialize boto3 Polly client: {e}")
    polly = None


async def generate_voice(text: str) -> bytes:
    """
    Generates speech audio from text using Amazon Polly TTS.

    Args:
        text (str): The text to be converted to speech.

    Returns:
        bytes: The raw MP3 audio data suitable for streaming to the browser.
               Returns empty bytes on error.
    """
    if not text or not text.strip():
        logger.warning("Received empty text in generate_voice. Skipping.")
        return b""

    if not polly:
        logger.error("Amazon Polly client is not initialized.")
        return b""

    # Use asyncio.to_thread to run the synchronous boto3 call in a thread pool
    try:
        def _synthesize():
            return polly.synthesize_speech(
                Text=text,
                OutputFormat="mp3",
                VoiceId="Matthew",
                Engine="neural" # neural offers better quality if needed, can revert to standard if issues arise
            )

        response = await asyncio.to_thread(_synthesize)

        if "AudioStream" in response:
            return response["AudioStream"].read()
        else:
            logger.error("Amazon Polly response did not contain AudioStream")
            return b""
    except Exception as e:
        logger.error(f"Error generating voice with Amazon Polly: {e}", exc_info=True)
        return b""
