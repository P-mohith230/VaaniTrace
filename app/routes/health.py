"""Health and readiness diagnostic routes."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import get_db
from app.schemas import HealthResponse, GnaniHealthResponse
from app.services.gnani_prisma import prisma_service

router = APIRouter(prefix="/api/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
def get_system_health(db: Session = Depends(get_db)):
    """Check general application availability and database connectivity."""
    db_status = "connected"
    try:
        # Check SQLite connectivity with lightweight query
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    return HealthResponse(
        status="healthy" if db_status == "connected" else "degraded",
        backend="online",
        database=db_status,
        version=settings.APP_VERSION,
    )


@router.get("/gnani", response_model=GnaniHealthResponse)
async def get_gnani_health():
    """Verify Gnani AI credential configuration and external gateway connectivity."""
    check = await prisma_service.verify_credentials()

    return GnaniHealthResponse(
        configured=check.get("configured", False),
        connectivity=check.get("connectivity", "not_checked"),
        model_stt=settings.GNANI_STT_MODEL,
        model_tts=settings.GNANI_TTS_MODEL,
        message=check.get("message", "Gnani status unknown"),
        details={
            "base_url": settings.GNANI_BASE_URL,
            "stt_model": settings.GNANI_STT_MODEL,
            "tts_model": settings.GNANI_TTS_MODEL,
            "timeout_seconds": settings.GNANI_TIMEOUT_SECONDS,
        },
    )
