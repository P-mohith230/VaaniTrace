"""Application configuration module using pydantic-settings."""

import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """VaaniTrace global application settings."""

    # Application settings
    APP_NAME: str = "VaaniTrace"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = Field(default="production", description="development or production")
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    # Database & Storage
    DATABASE_URL: str = "sqlite:///./data/vaanitrace.db"
    DATA_DIR: str = "./data"
    STATIC_DIR: str = "./static/dist"

    # Gnani AI Configuration
    GNANI_API_KEY: str = Field(default="", description="Gnani AI API key")
    GNANI_BASE_URL: str = Field(default="https://api.vachana.ai", description="Gnani base URL")
    GNANI_STT_MODEL: str = Field(default="prisma-v2.5", description="Default STT model: prisma-v2.5 or prisma-v3.0")
    GNANI_TTS_MODEL: str = Field(default="timbre-v2.5", description="Default TTS model: timbre-v2.5 or timbre-v3.0")
    GNANI_TIMEOUT_SECONDS: float = 45.0

    # CORS Settings
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,http://localhost:8000,http://127.0.0.1:8000"

    # Audio Limits
    MAX_AUDIO_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def cors_origins(self) -> List[str]:
        """Parse ALLOWED_ORIGINS comma-separated string into a list."""
        if not self.ALLOWED_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def is_gnani_configured(self) -> bool:
        """Check if a non-empty Gnani API key is configured."""
        return bool(self.GNANI_API_KEY and self.GNANI_API_KEY.strip())


settings = Settings()

