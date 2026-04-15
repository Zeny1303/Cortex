from __future__ import annotations
from typing import Literal, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ── MongoDB ───────────────────────────────────────────────────────────────
    MONGO_URI: str = Field(..., description="Full MongoDB connection string")
    MAX_CONNECTIONS_COUNT: int = Field(10, ge=1)
    MIN_CONNECTIONS_COUNT: int = Field(1,  ge=1)

    # ── JWT Auth ──────────────────────────────────────────────────────────────
    JWT_SECRET:          str = Field(...)
    JWT_ALGORITHM:       str = Field("HS256")
    JWT_EXPIRATION_DAYS: int = Field(7, ge=1)

    # ── Groq / LLaMA ─────────────────────────────────────────────────────────
    GROQ_API_KEY: Optional[str] = Field(       # ← was missing entirely
        None,
        description="gsk_… key from console.groq.com"
    )
    AI_MODEL: str = Field(
        "llama-3.1-8b-instant",                # ← was defaulting to gpt-4o-mini
        description="Groq model identifier"
    )

    # ── Speech-to-Text ────────────────────────────────────────────────────────
    STT_PROVIDER: Literal["assemblyai", "openai_whisper"] = Field("assemblyai")
    ASSEMBLYAI_API_KEY: Optional[str] = Field(None)

    # ── Text-to-Speech (Amazon Polly) ─────────────────────────────────────────
    TTS_PROVIDER: Literal["polly", "openai_tts"] = Field("polly")
    AWS_ACCESS_KEY: Optional[str] = Field(     # ← was missing entirely
        None,
        description="AWS IAM access key for Polly"
    )
    AWS_SECRET_KEY: Optional[str] = Field(     # ← was missing entirely
        None,
        description="AWS IAM secret key for Polly"
    )
    AWS_REGION: str = Field(                   # ← was missing entirely
        "us-east-1",
        description="AWS region for Polly"
    )

    # ── Pydantic v2 config ────────────────────────────────────────────────────
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ── Convenience helpers ───────────────────────────────────────────────────
    @property
    def effective_stt_key(self) -> Optional[str]:
        if self.STT_PROVIDER == "assemblyai":
            return self.ASSEMBLYAI_API_KEY
        return None


settings = Settings()