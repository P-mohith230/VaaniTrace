"""API routes for Closed-Loop Voice Confirmation Protocol (Rank 3 Innovation)."""

import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas import (
    ConfirmationScriptRequest,
    ConfirmationScriptResponse,
    VoiceCorrectionRequest,
    VoiceCorrectionResponse,
    VoiceIntentEvaluateRequest,
    VoiceIntentEvaluateResponse,
)
from app.services.confirmation_protocol import confirmation_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/confirmation", tags=["Confirmation Protocol"])


@router.post("/script", response_model=ConfirmationScriptResponse)
async def generate_confirmation_script(request: ConfirmationScriptRequest):
    """Generate an explicit, auditable verbal confirmation readback script."""
    try:
        result = confirmation_service.generate_confirmation_script(
            record_type=request.record_type,
            fields=request.fields,
            uncertain_fields=request.uncertain_fields,
            language=request.language or "en-IN",
        )
        return ConfirmationScriptResponse(**result)
    except Exception as exc:
        logger.error(f"Failed to generate confirmation script: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to generate confirmation script: {str(exc)}",
        )


@router.post("/correct", response_model=VoiceCorrectionResponse)
async def apply_verbal_correction(request: VoiceCorrectionRequest):
    """Apply a verbal or typed corrective amendment and recompute totals."""
    try:
        result = confirmation_service.apply_verbal_correction(
            current_fields=request.current_fields,
            correction_text=request.correction_text,
            record_type=request.record_type,
        )
        return VoiceCorrectionResponse(**result)
    except Exception as exc:
        logger.error(f"Failed to apply verbal correction: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to apply verbal correction: {str(exc)}",
        )


@router.post("/intent", response_model=VoiceIntentEvaluateResponse)
async def evaluate_voice_intent(request: VoiceIntentEvaluateRequest):
    """Classify user's spoken confirmation response into CONFIRM, REJECT, or CORRECT."""
    try:
        intent = confirmation_service.evaluate_voice_intent(request.spoken_text)
        return VoiceIntentEvaluateResponse(intent=intent)
    except Exception as exc:
        logger.error(f"Failed to evaluate voice intent: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to evaluate voice intent: {str(exc)}",
        )
