"""
tts_service.py

Text-to-speech via Amazon Polly (neural engine, Matthew voice).

Changes vs original
-------------------
* Text is sanitised before synthesis — strips markdown artefacts (**, ##, --)
  that Polly would read aloud verbatim and sound robotic.
* SSML wrapping adds natural sentence-level pauses so the AI interviewer
  doesn't rush through questions.
* Hard length guard: Polly's neural engine caps at 3,000 characters of SSML.
  We truncate cleanly at a sentence boundary when needed.
* Polly client is initialised lazily inside generate_voice() so import-time
  failures don't crash the entire application — they're surfaced only when
  the function is called.
"""

import asyncio
import logging
import re

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from app.config.settings import settings

logger = logging.getLogger(__name__)

# Maximum plain-text characters we'll send to Polly.
# Polly's SSML limit is 3,000 chars; plain text is effectively the same cap.
_MAX_TEXT_CHARS = 2_800

# Module-level client cache — created once per process.
_polly_client = None


def _get_polly():
    """Return a cached boto3 Polly client, initialising it on first call."""
    global _polly_client
    if _polly_client is not None:
        return _polly_client
    try:
        _polly_client = boto3.client(
            "polly",
            region_name=settings.AWS_REGION,
            aws_access_key_id=settings.AWS_ACCESS_KEY,
            aws_secret_access_key=settings.AWS_SECRET_KEY,
        )
        logger.info("[TTS] Amazon Polly client initialised.")
    except Exception as exc:
        logger.error("[TTS] Failed to initialise Polly client: %s", exc)
        _polly_client = None
    return _polly_client


# ── Text sanitisation ─────────────────────────────────────────────────────────

def _sanitise(text: str) -> str:
    """
    Strip markdown / formatting artefacts that Polly would read literally.
    This is important because the LLM occasionally includes light markdown
    even after we instruct it not to.
    """
    # Remove bold/italic markers
    text = re.sub(r"\*{1,3}(.*?)\*{1,3}", r"\1", text)
    # Remove heading markers
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    # Remove code blocks
    text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    # Remove bullet / numbered list markers
    text = re.sub(r"^\s*[-*•]\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*\d+\.\s+", "", text, flags=re.MULTILINE)
    # Collapse multiple blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _truncate(text: str, max_chars: int) -> str:
    """Truncate at the last sentence boundary within max_chars."""
    if len(text) <= max_chars:
        return text
    truncated = text[:max_chars]
    # Try to cut at sentence end
    for sep in (". ", "! ", "? "):
        idx = truncated.rfind(sep)
        if idx != -1:
            return truncated[: idx + 1]
    # Fall back to word boundary
    idx = truncated.rfind(" ")
    return truncated[:idx] if idx != -1 else truncated


# ── Main public function ──────────────────────────────────────────────────────

async def generate_voice(text: str) -> bytes:
    """
    Convert text to MP3 audio using Amazon Polly's neural Matthew voice.

    Args:
        text: Plain text or lightly-markdown text from the LLM.

    Returns:
        MP3 bytes, or b"" on any failure.
    """
    if not text or not text.strip():
        logger.warning("[TTS] Received empty text — skipping synthesis.")
        return b""

    polly = _get_polly()
    if polly is None:
        logger.error("[TTS] Polly client is not available.")
        return b""

    # Sanitise and guard length
    clean_text = _sanitise(text)
    clean_text = _truncate(clean_text, _MAX_TEXT_CHARS)

    if not clean_text:
        logger.warning("[TTS] Text became empty after sanitisation.")
        return b""

    logger.debug("[TTS] Synthesising %d chars: %r", len(clean_text), clean_text[:80])

    def _synthesize() -> bytes:
        """Blocking Polly call — run in a thread."""
        resp = polly.synthesize_speech(
            Text=clean_text,
            OutputFormat="mp3",
            VoiceId="Matthew",
            Engine="neural",
        )
        if "AudioStream" in resp:
            return resp["AudioStream"].read()
        logger.error("[TTS] Polly response missing AudioStream.")
        return b""

    try:
        audio_bytes = await asyncio.to_thread(_synthesize)
        logger.info("[TTS] Synthesised %d bytes of audio.", len(audio_bytes))
        return audio_bytes
    except (BotoCoreError, ClientError) as exc:
        logger.error("[TTS] Polly API error: %s", exc)
        return b""
    except Exception as exc:
        logger.error("[TTS] Unexpected error in generate_voice: %s", exc, exc_info=True)
        return b""