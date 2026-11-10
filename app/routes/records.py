"""Record management and persistence API routes."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import Record, ExtractedField, EvidenceRef, ActionItem
from app.schemas import (
    RecordCreate,
    RecordUpdate,
    RecordSummary,
    RecordDetail,
    ExtractedFieldSchema,
    EvidenceRefSchema,
    ActionItemSchema,
)
from app.services.export_service import export_service

router = APIRouter(prefix="/api/records", tags=["Records"])


@router.get("", response_model=List[RecordSummary])
def list_records(
    record_type: Optional[str] = Query(None, description="Filter by record type"),
    verification_status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search in title or transcript"),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Retrieve list of saved voice session records with summary statistics."""
    query = db.query(Record)

    if record_type:
        query = query.filter(Record.record_type == record_type)
    if verification_status:
        query = query.filter(Record.verification_status == verification_status)
    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            (Record.title.ilike(search_filter)) | (Record.original_transcript.ilike(search_filter))
        )

    records = query.order_by(desc(Record.created_at)).offset(offset).limit(limit).all()

    results = []
    for r in records:
        results.append(
            RecordSummary(
                id=r.id,
                title=r.title,
                record_type=r.record_type,
                language_code=r.language_code,
                verification_status=r.verification_status,
                field_count=len(r.fields),
                action_item_count=len(r.action_items),
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
        )
    return results


@router.post("", response_model=RecordDetail, status_code=status.HTTP_201_CREATED)
def create_record(payload: RecordCreate, db: Session = Depends(get_db)):
    """Persist a new voice recording, structured fields, evidence, and action items."""
    new_record = Record(
        title=payload.title,
        record_type=payload.record_type,
        original_transcript=payload.original_transcript,
        cleaned_summary=payload.cleaned_summary,
        language_code=payload.language_code,
        verification_status=payload.verification_status,
        audio_summary_base64=payload.audio_summary_base64,
    )
    db.add(new_record)
    db.flush()

    # Add extracted fields and evidence references
    for f in payload.fields:
        field_model = ExtractedField(
            record_id=new_record.id,
            field_name=f.field_name,
            original_value=f.original_value,
            current_value=f.current_value or f.original_value,
            evidence_type=f.evidence_type,
            is_edited=False,
            verification_status=f.verification_status,
            notes=f.notes,
        )
        db.add(field_model)
        db.flush()

        if f.evidence:
            ev_model = EvidenceRef(
                field_id=field_model.id,
                supporting_text=f.evidence.supporting_text,
                segment_index=f.evidence.segment_index,
                start_char=f.evidence.start_char,
                end_char=f.evidence.end_char,
                start_time=f.evidence.start_time,
                end_time=f.evidence.end_time,
            )
            db.add(ev_model)

    # Add action items
    for a in payload.action_items:
        act_model = ActionItem(
            record_id=new_record.id,
            description=a.description,
            assignee=a.assignee,
            deadline=a.deadline,
            status=a.status,
        )
        db.add(act_model)

    db.commit()
    db.refresh(new_record)
    return _build_record_detail(new_record)


@router.get("/{record_id}", response_model=RecordDetail)
def get_record(record_id: str, db: Session = Depends(get_db)):
    """Fetch complete record details including fields, evidence links, and action items."""
    record = db.query(Record).filter(Record.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record '{record_id}' not found.",
        )
    return _build_record_detail(record)


@router.put("/{record_id}", response_model=RecordDetail)
def update_record(record_id: str, payload: RecordUpdate, db: Session = Depends(get_db)):
    """Update record details, field values, and verification status."""
    record = db.query(Record).filter(Record.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record '{record_id}' not found.",
        )

    if payload.title is not None:
        record.title = payload.title
    if payload.record_type is not None:
        record.record_type = payload.record_type
    if payload.cleaned_summary is not None:
        record.cleaned_summary = payload.cleaned_summary
    if payload.verification_status is not None:
        record.verification_status = payload.verification_status
    if payload.audio_summary_base64 is not None:
        record.audio_summary_base64 = payload.audio_summary_base64

    # Update fields if provided
    if payload.fields is not None:
        # Delete existing fields and re-create to keep sync clean
        db.query(ExtractedField).filter(ExtractedField.record_id == record.id).delete()
        for f in payload.fields:
            is_edited = f.current_value != f.original_value
            ev_type = "manual" if is_edited else f.evidence_type
            field_model = ExtractedField(
                record_id=record.id,
                field_name=f.field_name,
                original_value=f.original_value,
                current_value=f.current_value,
                evidence_type=ev_type,
                is_edited=is_edited,
                verification_status=f.verification_status,
                notes=f.notes,
            )
            db.add(field_model)
            db.flush()

            if f.evidence:
                ev_model = EvidenceRef(
                    field_id=field_model.id,
                    supporting_text=f.evidence.supporting_text,
                    segment_index=f.evidence.segment_index,
                    start_char=f.evidence.start_char,
                    end_char=f.evidence.end_char,
                    start_time=f.evidence.start_time,
                    end_time=f.evidence.end_time,
                )
                db.add(ev_model)

    # Update action items if provided
    if payload.action_items is not None:
        db.query(ActionItem).filter(ActionItem.record_id == record.id).delete()
        for a in payload.action_items:
            act_model = ActionItem(
                record_id=record.id,
                description=a.description,
                assignee=a.assignee,
                deadline=a.deadline,
                status=a.status,
            )
            db.add(act_model)

    db.commit()
    db.refresh(record)
    return _build_record_detail(record)


@router.delete("/{record_id}", status_code=status.HTTP_200_OK)
def delete_record(record_id: str, db: Session = Depends(get_db)):
    """Permanently delete a voice session record and all linked data."""
    record = db.query(Record).filter(Record.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record '{record_id}' not found.",
        )
    db.delete(record)
    db.commit()
    return {"success": True, "message": f"Record '{record_id}' successfully deleted."}


@router.get("/{record_id}/export")
def export_record_file(
    record_id: str,
    format: str = Query("json", description="Export format: 'json' or 'csv'"),
    db: Session = Depends(get_db),
):
    """Download record in structured JSON or tabular CSV format."""
    record = db.query(Record).filter(Record.id == record_id).first()
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Record '{record_id}' not found.",
        )

    if format.lower() == "csv":
        content, filename = export_service.export_csv(record)
        media_type = "text/csv; charset=utf-8"
    else:
        content, filename = export_service.export_json(record)
        media_type = "application/json; charset=utf-8"

    return Response(
        content=content,
        media_type=media_type,
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
        },
    )


def _build_record_detail(record: Record) -> RecordDetail:
    """Helper to convert SQLAlchemy Record into Pydantic RecordDetail."""
    fields_list = []
    for f in record.fields:
        ev_schema = None
        if f.evidence:
            ev_schema = EvidenceRefSchema(
                id=f.evidence.id,
                supporting_text=f.evidence.supporting_text,
                segment_index=f.evidence.segment_index,
                start_char=f.evidence.start_char,
                end_char=f.evidence.end_char,
                start_time=f.evidence.start_time,
                end_time=f.evidence.end_time,
            )
        fields_list.append(
            ExtractedFieldSchema(
                id=f.id,
                field_name=f.field_name,
                original_value=f.original_value,
                current_value=f.current_value,
                evidence_type=f.evidence_type,
                is_edited=f.is_edited,
                verification_status=f.verification_status,
                notes=f.notes,
                evidence=ev_schema,
            )
        )

    actions_list = [
        ActionItemSchema(
            id=a.id,
            description=a.description,
            assignee=a.assignee,
            deadline=a.deadline,
            status=a.status,
        )
        for a in record.action_items
    ]

    return RecordDetail(
        id=record.id,
        title=record.title,
        record_type=record.record_type,
        original_transcript=record.original_transcript,
        cleaned_summary=record.cleaned_summary,
        language_code=record.language_code,
        verification_status=record.verification_status,
        audio_summary_base64=record.audio_summary_base64,
        created_at=record.created_at,
        updated_at=record.updated_at,
        fields=fields_list,
        action_items=actions_list,
    )

