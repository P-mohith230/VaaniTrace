"""API routes for Voice Dispute Simulator & Forensic Audit Replay."""

import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas import DisputeSimulateRequest, DisputeSimulateResponse
from app.services.dispute_simulator import dispute_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/dispute", tags=["Dispute Simulator & Forensic Replay"])


@router.post("/simulate", response_model=DisputeSimulateResponse)
async def simulate_dispute(request: DisputeSimulateRequest):
    """Execute forensic acoustic analysis comparing spoken evidence against counterparty claims."""
    try:
        result = await dispute_service.simulate_dispute(
            transcript=request.transcript,
            fields=request.fields,
            disputed_field=request.disputed_field,
            claimed_value=request.claimed_value,
            record_type=request.record_type,
            record_id=request.record_id,
            language=request.language or "en-IN",
        )
        return DisputeSimulateResponse(**result)
    except Exception as exc:
        logger.error(f"Failed to execute dispute simulation: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to execute dispute audit simulation: {str(exc)}",
        )
