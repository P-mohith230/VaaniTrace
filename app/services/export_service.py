"""Export service for serializing records into JSON and CSV formats."""

import io
import csv
import json
from typing import Tuple
from app.models import Record


class ExportService:
    """Handles serialization of structured records to portable files."""

    @staticmethod
    def export_json(record: Record) -> Tuple[str, str]:
        """Serialize a full Record into formatted JSON string."""
        data = {
            "id": record.id,
            "title": record.title,
            "record_type": record.record_type,
            "language_code": record.language_code,
            "verification_status": record.verification_status,
            "original_transcript": record.original_transcript,
            "cleaned_summary": record.cleaned_summary,
            "created_at": record.created_at.isoformat() if record.created_at else None,
            "updated_at": record.updated_at.isoformat() if record.updated_at else None,
            "fields": [
                {
                    "id": f.id,
                    "field_name": f.field_name,
                    "original_value": f.original_value,
                    "current_value": f.current_value,
                    "evidence_type": f.evidence_type,
                    "is_edited": f.is_edited,
                    "verification_status": f.verification_status,
                    "notes": f.notes,
                    "evidence": {
                        "supporting_text": f.evidence.supporting_text if f.evidence else None,
                        "segment_index": f.evidence.segment_index if f.evidence else None,
                        "start_char": f.evidence.start_char if f.evidence else None,
                        "end_char": f.evidence.end_char if f.evidence else None,
                    } if f.evidence else None,
                }
                for f in record.fields
            ],
            "action_items": [
                {
                    "id": a.id,
                    "description": a.description,
                    "assignee": a.assignee,
                    "deadline": a.deadline,
                    "status": a.status,
                }
                for a in record.action_items
            ],
        }
        json_str = json.dumps(data, indent=2, ensure_ascii=False)
        filename = f"vaanitrace_{record.id[:8]}_{record.record_type}.json"
        return json_str, filename

    @staticmethod
    def export_csv(record: Record) -> Tuple[str, str]:
        """Serialize Record fields and action items into tabular CSV."""
        output = io.StringIO()
        writer = csv.writer(output)

        # Record Metadata Section
        writer.writerow(["VAANITRACE STRUCTURED RECORD EXPORT"])
        writer.writerow(["Record ID", record.id])
        writer.writerow(["Title", record.title])
        writer.writerow(["Type", record.record_type])
        writer.writerow(["Verification Status", record.verification_status])
        writer.writerow(["Created At", record.created_at.isoformat() if record.created_at else ""])
        writer.writerow(["Summary", record.cleaned_summary or ""])
        writer.writerow([])

        # Extracted Fields Table
        writer.writerow([
            "Field Name",
            "Current Value",
            "Original Value",
            "Evidence Type",
            "Verified Status",
            "Edited by User",
            "Supporting Text Evidence",
            "Segment Index",
            "Start Char",
            "End Char",
            "Notes / Formula",
        ])

        for f in record.fields:
            ev_text = f.evidence.supporting_text if f.evidence else ""
            seg_idx = f.evidence.segment_index if f.evidence else ""
            start_ch = f.evidence.start_char if f.evidence else ""
            end_ch = f.evidence.end_char if f.evidence else ""

            writer.writerow([
                f.field_name,
                f.current_value or "",
                f.original_value or "",
                f.evidence_type,
                f.verification_status,
                "Yes" if f.is_edited else "No",
                ev_text,
                seg_idx,
                start_ch,
                end_ch,
                f.notes or "",
            ])

        # Action Items Table
        if record.action_items:
            writer.writerow([])
            writer.writerow(["ACTION ITEMS"])
            writer.writerow(["Description", "Assignee", "Deadline", "Status"])
            for a in record.action_items:
                writer.writerow([
                    a.description,
                    a.assignee or "Unassigned",
                    a.deadline or "None",
                    a.status,
                ])

        csv_str = output.getvalue()
        filename = f"vaanitrace_{record.id[:8]}_{record.record_type}.csv"
        return csv_str, filename


export_service = ExportService()

