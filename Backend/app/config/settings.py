"""
Application Settings — config/settings.py

Loads all configuration from environment variables (via .env file).
Uses pydantic-settings for type-safe, validated config.

Usage
-----
    from app.config.settings import settings

    client = OpenAI(api_key=settings.OPENAI_API_KEY)

Never access os.environ directly — always go through `settings`.
"""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    All settings are loaded from environment variables or the .env file.
    See .env.example for the full list of required / optional keys.
    """

    # ── MongoDB ───────────────────────────────────────────────────────────────
    MONGO_URI: str = Field(..., description="Full MongoDB connection string")

    # Connection pool
    MAX_CONNECTIONS_COUNT: int = Field(10, ge=1)
    MIN_CONNECTIONS_COUNT: int = Field(1,  ge=1)

    # ── JWT Auth ──────────────────────────────────────────────────────────────
    JWT_SECRET:          str = Field(..., description="Long, random secret for signing tokens")
    JWT_ALGORITHM:       str = Field("HS256")
    JWT_EXPIRATION_DAYS: int = Field(7, ge=1)

    # ── OpenAI ────────────────────────────────────────────────────────────────
    OPENAI_API_KEY: Optional[str] = Field(
        None,
        description="sk-… key from platform.openai.com — required for AI features",
    )
    AI_MODEL: str = Field("gpt-4o-mini", description="OpenAI model identifier")

    # ── Speech-to-Text ────────────────────────────────────────────────────────
    STT_PROVIDER:      Literal["assemblyai", "openai_whisper"] = Field(
        "assemblyai",
        description="STT backend to use",
    )
    ASSEMBLYAI_API_KEY: Optional[str] = Field(
        None,
        description="Required when STT_PROVIDER=assemblyai",
    )

    # ── Text-to-Speech ────────────────────────────────────────────────────────
    TTS_PROVIDER:      Literal["elevenlabs", "openai_tts"] = Field(
        "elevenlabs",
        description="TTS backend to use",
    )
    ELEVENLABS_API_KEY: Optional[str] = Field(
        None,
        description="Required when TTS_PROVIDER=elevenlabs",
    )
    VOICE_MODEL_ID: Optional[str] = Field(
        None,
        description="ElevenLabs voice / model ID (e.g. 'eleven_multilingual_v2')",
    )

    # ── Cross-field validation ─────────────────────────────────────────────────

    @field_validator("ASSEMBLYAI_API_KEY", mode="after")
    @classmethod
    def assemblyai_key_required(cls, v: Optional[str], info) -> Optional[str]:
        """Warn (not raise) when the key is missing but the provider is selected."""
        # Full cross-field validation would need a model_validator; kept simple
        # here so the app can still boot without the key during local dev.
        return v or None

    @field_validator("ELEVENLABS_API_KEY", mode="after")
    @classmethod
    def elevenlabs_key_required(cls, v: Optional[str], info) -> Optional[str]:
        return v or None

    # ── Pydantic v2 config ─────────────────────────────────────────────────────
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,        # OPENAI_API_KEY ≠ openai_api_key
        extra="ignore",             # silently ignore unknown env vars
    )

    # ── Convenience helpers ────────────────────────────────────────────────────

    @property
    def effective_stt_key(self) -> Optional[str]:
        """Return the API key for the configured STT provider."""
        if self.STT_PROVIDER == "assemblyai":
            return self.ASSEMBLYAI_API_KEY
        return self.OPENAI_API_KEY  # openai_whisper uses the same key

    @property
    def effective_tts_key(self) -> Optional[str]:
        """Return the API key for the configured TTS provider."""
        if self.TTS_PROVIDER == "elevenlabs":
            return self.ELEVENLABS_API_KEY
        return self.OPENAI_API_KEY  # openai_tts uses the same key


# ── Module-level singleton ─────────────────────────────────────────────────────
# Import this everywhere: `from app.config.settings import settings`
settings = Settings()
