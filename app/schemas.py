"""Pydantic v2 schemas for request and response validation."""

from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, ConfigDict


# ---------------------------------------------------------
# Health Schemas
# ---------------------------------------------------------

class HealthResponse(BaseModel):
    """System health check response."""
    status: str = "healthy"
    backend: str = "online"
    database: str = "connected"
    version: str = "1.0.0"


class GnaniHealthResponse(BaseModel):
    """Gnani AI configuration and connectivity status."""
    configured: bool
    connectivity: str  # verified, not_checked, auth_failed, unavailable
    model_stt: str
    model_tts: str
    message: str
    details: Optional[Dict[str, Any]] = None


# ---------------------------------------------------------
# Transcription Schemas
# ---------------------------------------------------------

class TranscriptSegment(BaseModel):
    """A segment or sentence within the transcript."""
    id: int
    text: str
    start_char: int
    end_char: int
    start_time: Optional[float] = None
    end_time: Optional[float] = None


class TranscriptionResponse(BaseModel):
    """Speech-to-text response from Gnani Prisma."""
    request_id: str
    transcript: str
    detected_language: str
    model: str
    processing_time: Optional[float] = None
    segments: List[TranscriptSegment] = Field(default_factory=list)


# ---------------------------------------------------------
# Extraction Schemas
# ---------------------------------------------------------

class EvidenceRefSchema(BaseModel):
    """Supporting passage evidence for an extracted field."""
    id: Optional[str] = None
    supporting_text: str
    segment_index: Optional[int] = None
    start_char: Optional[int] = None
    end_char: Optional[int] = None
    start_time: Optional[float] = None
    end_time: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class ExtractedFieldSchema(BaseModel):
    """An individual extracted structured field."""
    id: Optional[str] = None
    field_name: str
    original_value: Optional[str] = None
    current_value: Optional[str] = None
    evidence_type: str = "spoken"  # spoken, inferred, calculated, manual
    is_edited: bool = False
    verification_status: str = "unverified"  # unverified, verified, needs_review
    notes: Optional[str] = None
    evidence: Optional[EvidenceRefSchema] = None

    model_config = ConfigDict(from_attributes=True)


class ActionItemSchema(BaseModel):
    """Extracted action item or commitment."""
    id: Optional[str] = None
    description: str
    assignee: Optional[str] = None
    deadline: Optional[str] = None
    status: str = "pending"  # pending, in_progress, completed

    model_config = ConfigDict(from_attributes=True)


class UncertainFieldSchema(BaseModel):
    """Uncertain or ambiguous field flagged for human review."""
    field_name: str
    extracted_text: Optional[str] = None
    reason: str


class ExtractionRequest(BaseModel):
    """Request payload for structured information extraction."""
    transcript: str = Field(..., min_length=1, description="Transcript text to extract from")
    record_type: str = Field(default="general_conversation", description="Type of record schema to apply")
    segments: Optional[List[TranscriptSegment]] = None


class ExtractionResponse(BaseModel):
    """Validated structured extraction response."""
    record_type: str
    summary: str
    participants: List[str] = Field(default_factory=list)
    entities: List[str] = Field(default_factory=list)
    items: List[Dict[str, Any]] = Field(default_factory=list)
    amounts: List[Dict[str, Any]] = Field(default_factory=list)
    dates: List[Dict[str, Any]] = Field(default_factory=list)
    requests: List[str] = Field(default_factory=list)
    commitments: List[str] = Field(default_factory=list)
    action_items: List[ActionItemSchema] = Field(default_factory=list)
    uncertain_fields: List[UncertainFieldSchema] = Field(default_factory=list)
    fields: List[ExtractedFieldSchema] = Field(default_factory=list)


# ---------------------------------------------------------
# Speech Synthesis Schemas
# ---------------------------------------------------------

class SpeechRequest(BaseModel):
    """Text-to-speech synthesis request."""
    text: str = Field(..., min_length=1, max_length=5000)
    voice: Optional[str] = "Nalini"
    language: Optional[str] = "en-IN"
    speed: Optional[float] = 1.0


class SpeechResponse(BaseModel):
    """JSON response containing base64 audio."""
    audio_base64: str
    content_type: str = "audio/wav"
    model: str
    character_count: int


# ---------------------------------------------------------
# Record Persistence Schemas
# ---------------------------------------------------------

class RecordFieldCreate(BaseModel):
    """Field create payload."""
    field_name: str
    original_value: Optional[str] = None
    current_value: Optional[str] = None
    evidence_type: str = "spoken"
    verification_status: str = "unverified"
    notes: Optional[str] = None
    evidence: Optional[EvidenceRefSchema] = None


class ActionItemCreate(BaseModel):
    """Action item create payload."""
    description: str
    assignee: Optional[str] = None
    deadline: Optional[str] = None
    status: str = "pending"


class RecordCreate(BaseModel):
    """Create a new voice record."""
    title: str = Field(..., min_length=1, max_length=255)
    record_type: str = "general_conversation"
    original_transcript: str = Field(..., min_length=1)
    cleaned_summary: Optional[str] = None
    language_code: Optional[str] = "indic-auto"
    verification_status: str = "unverified"
    audio_summary_base64: Optional[str] = None
    fields: List[RecordFieldCreate] = Field(default_factory=list)
    action_items: List[ActionItemCreate] = Field(default_factory=list)


class RecordUpdate(BaseModel):
    """Update an existing record and its fields."""
    title: Optional[str] = None
    record_type: Optional[str] = None
    cleaned_summary: Optional[str] = None
    verification_status: Optional[str] = None
    audio_summary_base64: Optional[str] = None
    fields: Optional[List[RecordFieldCreate]] = None
    action_items: Optional[List[ActionItemCreate]] = None


class RecordSummary(BaseModel):
    """Summary listing representation of a record."""
    id: str
    title: str
    record_type: str
    language_code: Optional[str] = None
    verification_status: str
    field_count: int
    action_item_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class RecordDetail(BaseModel):
    """Complete detail representation of a record with fields & evidence."""
    id: str
    title: str
    record_type: str
    original_transcript: str
    cleaned_summary: Optional[str] = None
    language_code: Optional[str] = None
    verification_status: str
    audio_summary_base64: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    fields: List[ExtractedFieldSchema] = Field(default_factory=list)
    action_items: List[ActionItemSchema] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)

