"""
speech_to_text_service.py

Transcribes candidate audio using AssemblyAI's REST API.

Why REST instead of the streaming WebSocket?
--------------------------------------------
The original implementation opened a brand-new AssemblyAI WebSocket for
every single audio chunk, paid the SessionBegins handshake cost (~1-2 s)
on every turn, then immediately tore it down.  For a conversational
interview — where each "chunk" is a complete candidate answer — the REST
Upload → Transcript → Poll pattern is simpler, more reliable, and just as
fast (AssemblyAI typically returns a result in 2-4 s for clips under 60 s).

Flow
----
1. FFmpeg converts incoming audio (any format/rate) to 16-bit 16 kHz mono PCM.
2. The PCM bytes are uploaded to AssemblyAI's /v2/upload endpoint.
3. A transcript job is created via POST /v2/transcript.
4. We poll GET /v2/transcript/{id} with exponential back-off until the status
   is "completed" or "error".
5. The final text is returned; empty string on any failure.
"""

import asyncio
import logging
import subprocess

import httpx

from app.config.settings import settings

logger = logging.getLogger(__name__)

# ── Constants ────────────────────────────────────────────────────────────────

_ASSEMBLYAI_BASE = "https://api.assemblyai.com/v2"

# Maximum wall-clock seconds we will wait for a transcript job to complete.
# 99 % of clips under 2 min finish in < 10 s.
_TRANSCRIPT_TIMEOUT_S = 45

# How long to wait between status polls (doubles each time, capped at 3 s)
_POLL_INITIAL_INTERVAL_S = 0.5
_POLL_MAX_INTERVAL_S = 3.0


# ── Audio conversion ─────────────────────────────────────────────────────────

async def _convert_to_pcm(audio_bytes: bytes) -> bytes:
    """
    Convert any incoming audio format to raw 16-bit 16 kHz mono PCM using
    ffmpeg.  Returns b"" on failure.
    """
    try:
        process = await asyncio.create_subprocess_exec(
            "ffmpeg", "-y",
            "-i", "pipe:0",
            "-f", "s16le",
            "-acodec", "pcm_s16le",
            "-ar", "16000",
            "-ac", "1",
            "pipe:1",
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        stdout_data, stderr_data = await asyncio.wait_for(
            process.communicate(input=audio_bytes),
            timeout=15.0,
        )
        if process.returncode != 0:
            logger.error("FFmpeg conversion failed: %s", stderr_data.decode(errors="replace"))
            return b""
        return stdout_data
    except asyncio.TimeoutError:
        logger.error("FFmpeg conversion timed out.")
        return b""
    except Exception as exc:
        logger.error("Error during audio conversion: %s", exc)
        return b""


# ── Main public API ───────────────────────────────────────────────────────────

async def transcribe_audio(audio_bytes: bytes) -> str:
    """
    Transcribe a complete audio chunk (one candidate turn) and return the text.

    Args:
        audio_bytes: Raw audio bytes in any format that ffmpeg can decode
                     (webm, opus, wav, mp4, etc.).

    Returns:
        Transcribed text string, or "" on silence / error.
    """
    if not audio_bytes:
        logger.warning("[STT] Received empty audio chunk — skipping.")
        return ""

    api_key = settings.ASSEMBLYAI_API_KEY
    if not api_key:
        logger.error("[STT] ASSEMBLYAI_API_KEY is not set.")
        raise ValueError("ASSEMBLYAI_API_KEY missing from environment")

    # Step 1 — Convert to PCM
    pcm_bytes = await _convert_to_pcm(audio_bytes)
    if not pcm_bytes:
        logger.error("[STT] PCM conversion produced no output — skipping transcription.")
        return ""

    headers = {
        "authorization": api_key,
        "content-type": "application/octet-stream",
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(30.0)) as client:

        # Step 2 — Upload raw PCM
        try:
            upload_resp = await client.post(
                f"{_ASSEMBLYAI_BASE}/upload",
                headers=headers,
                content=pcm_bytes,
            )
            upload_resp.raise_for_status()
            upload_url: str = upload_resp.json()["upload_url"]
            logger.info("[STT] Audio uploaded successfully.")
        except Exception as exc:
            logger.error("[STT] Upload failed: %s", exc)
            return ""

        # Step 3 — Create transcript job
        try:
            tx_resp = await client.post(
                f"{_ASSEMBLYAI_BASE}/transcript",
                headers={
                    "authorization": api_key,
                    "content-type": "application/json",
                },
                json={
                    "audio_url": upload_url,
                    # Ask AssemblyAI to filter out silence/filler before returning
                    "filter_profanity": False,
                    "punctuate": True,
                    "format_text": True,
                },
            )
            tx_resp.raise_for_status()
            tx_id: str = tx_resp.json()["id"]
            logger.info("[STT] Transcript job created: %s", tx_id)
        except Exception as exc:
            logger.error("[STT] Transcript job creation failed: %s", exc)
            return ""

        # Step 4 — Poll for completion with exponential back-off
        poll_url = f"{_ASSEMBLYAI_BASE}/transcript/{tx_id}"
        poll_headers = {"authorization": api_key}
        elapsed = 0.0
        interval = _POLL_INITIAL_INTERVAL_S

        while elapsed < _TRANSCRIPT_TIMEOUT_S:
            await asyncio.sleep(interval)
            elapsed += interval
            # Exponential back-off, capped
            interval = min(interval * 1.5, _POLL_MAX_INTERVAL_S)

            try:
                poll_resp = await client.get(poll_url, headers=poll_headers)
                poll_resp.raise_for_status()
                data = poll_resp.json()
            except Exception as exc:
                logger.warning("[STT] Poll request failed (will retry): %s", exc)
                continue

            status = data.get("status")
            logger.debug("[STT] Job %s status: %s (elapsed %.1fs)", tx_id, status, elapsed)

            if status == "completed":
                text = (data.get("text") or "").strip()
                if text:
                    logger.info("[STT] Transcript ready (%d chars): %r", len(text), text[:80])
                else:
                    logger.info("[STT] Transcript completed but text is empty (silence).")
                return text

            if status == "error":
                logger.error("[STT] AssemblyAI error for job %s: %s", tx_id, data.get("error"))
                return ""

            # status is "queued" or "processing" — keep polling

        logger.error("[STT] Transcript job %s timed out after %ss.", tx_id, _TRANSCRIPT_TIMEOUT_S)
        return ""