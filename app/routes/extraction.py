"""Structured information extraction API routes."""

from fastapi import APIRouter, HTTPException, status
from app.schemas import ExtractionRequest, ExtractionResponse
from app.services.extractor import information_extractor

router = APIRouter(prefix="/api/extract", tags=["Extraction"])


@router.post("", response_model=ExtractionResponse)
def extract_information(request: ExtractionRequest):
    """Extract structured, evidence-linked fields from conversational transcripts."""
    transcript = request.transcript.strip()
    if not transcript:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transcript text cannot be empty for information extraction.",
        )

    try:
        response = information_extractor.extract(
            transcript=transcript,
            record_type=request.record_type,
            segments=request.segments,
        )
        return response
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Information extraction failed: {str(exc)}",
        )

