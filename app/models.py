"""Database models for VaaniTrace records, fields, and evidence."""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Integer,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from app.database import Base


def generate_uuid() -> str:
    """Generate a random UUID string."""
    return str(uuid.uuid4())


def utc_now() -> datetime:
    """Return current UTC datetime."""
    return datetime.now(timezone.utc)


class Record(Base):
    """Voice session record model."""

    __tablename__ = "records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    record_type = Column(String(50), nullable=False, default="general_conversation")
    original_transcript = Column(Text, nullable=False)
    cleaned_summary = Column(Text, nullable=True)
    language_code = Column(String(20), nullable=True, default="indic-auto")
    verification_status = Column(String(20), nullable=False, default="unverified")
    audio_summary_base64 = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    # Relationships
    fields = relationship(
        "ExtractedField",
        back_populates="record",
        cascade="all, delete-orphan",
        order_by="ExtractedField.created_at",
    )
    action_items = relationship(
        "ActionItem",
        back_populates="record",
        cascade="all, delete-orphan",
        order_by="ActionItem.created_at",
    )


class ExtractedField(Base):
    """Individual extracted field linked to a record."""

    __tablename__ = "extracted_fields"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    record_id = Column(String(36), ForeignKey("records.id", ondelete="CASCADE"), nullable=False, index=True)
    field_name = Column(String(100), nullable=False)
    original_value = Column(Text, nullable=True)
    current_value = Column(Text, nullable=True)
    evidence_type = Column(String(20), nullable=False, default="spoken")  # spoken, inferred, calculated, manual
    is_edited = Column(Boolean, default=False, nullable=False)
    verification_status = Column(String(20), nullable=False, default="unverified")  # unverified, verified, needs_review
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    record = relationship("Record", back_populates="fields")
    evidence = relationship(
        "EvidenceRef",
        back_populates="field",
        cascade="all, delete-orphan",
        uselist=False,
    )


class EvidenceRef(Base):
    """Specific textual evidence supporting an extracted field."""

    __tablename__ = "evidence_refs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    field_id = Column(String(36), ForeignKey("extracted_fields.id", ondelete="CASCADE"), nullable=False, index=True)
    supporting_text = Column(Text, nullable=False)
    segment_index = Column(Integer, nullable=True)
    start_char = Column(Integer, nullable=True)
    end_char = Column(Integer, nullable=True)
    start_time = Column(Float, nullable=True)
    end_time = Column(Float, nullable=True)

    # Relationships
    field = relationship("ExtractedField", back_populates="evidence")


class ActionItem(Base):
    """Action item derived from conversation."""

    __tablename__ = "action_items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    record_id = Column(String(36), ForeignKey("records.id", ondelete="CASCADE"), nullable=False, index=True)
    description = Column(Text, nullable=False)
    assignee = Column(String(100), nullable=True)
    deadline = Column(String(100), nullable=True)
    status = Column(String(20), nullable=False, default="pending")  # pending, in_progress, completed
    created_at = Column(DateTime, default=utc_now, nullable=False)

    # Relationships
    record = relationship("Record", back_populates="action_items")
