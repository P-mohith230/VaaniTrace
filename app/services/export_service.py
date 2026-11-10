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
        """Serialize Record fields and action items into tabular CSV with UTF-8 BOM for Microsoft Excel."""
        output = io.StringIO()
        # Prepend UTF-8 Byte Order Mark (BOM) so Excel opens UTF-8 symbols (₹, Indic text, math) natively
        output.write("\ufeff")
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

    @staticmethod
    def export_excel(record: Record) -> Tuple[bytes, str]:
        """Serialize Record fields and action items into styled native Excel (.xlsx) workbook."""
        import openpyxl
        from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
        from openpyxl.utils import get_column_letter

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Structured Record"
        ws.views.sheetView[0].showGridLines = True

        # Styles
        title_font = Font(name="Segoe UI", size=13, bold=True, color="FFFFFF")
        title_fill = PatternFill(start_color="722F37", end_color="722F37", fill_type="solid")
        
        meta_label_font = Font(name="Segoe UI", size=10, bold=True, color="222222")
        meta_val_font = Font(name="Segoe UI", size=10, color="000000")

        table_header_font = Font(name="Segoe UI", size=10, bold=True, color="FFFFFF")
        table_header_fill = PatternFill(start_color="202020", end_color="202020", fill_type="solid")

        data_font = Font(name="Segoe UI", size=10, color="111111")
        thin_border = Border(
            left=Side(style="thin", color="D0D0D0"),
            right=Side(style="thin", color="D0D0D0"),
            top=Side(style="thin", color="D0D0D0"),
            bottom=Side(style="thin", color="D0D0D0"),
        )

        # Title Banner
        ws.merge_cells("A1:K1")
        title_cell = ws["A1"]
        title_cell.value = "VAANITRACE STRUCTURED RECORD EXPORT"
        title_cell.font = title_font
        title_cell.fill = title_fill
        title_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        ws.row_dimensions[1].height = 32

        # Metadata Section
        metadata = [
            ("Record ID", record.id),
            ("Title", record.title),
            ("Type", record.record_type),
            ("Verification Status", record.verification_status),
            ("Created At", record.created_at.isoformat() if record.created_at else ""),
            ("Summary", record.cleaned_summary or ""),
        ]

        row_num = 3
        for label, val in metadata:
            c_lbl = ws.cell(row=row_num, column=1, value=label)
            c_lbl.font = meta_label_font
            c_val = ws.cell(row=row_num, column=2, value=val)
            c_val.font = meta_val_font
            row_num += 1

        row_num += 1  # Blank row

        # Extracted Fields Table
        headers = [
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
        ]

        for col_idx, h_text in enumerate(headers, 1):
            c = ws.cell(row=row_num, column=col_idx, value=h_text)
            c.font = table_header_font
            c.fill = table_header_fill
            c.alignment = Alignment(horizontal="left", vertical="center", indent=1)
        ws.row_dimensions[row_num].height = 24
        row_num += 1

        for f in record.fields:
            ev_text = f.evidence.supporting_text if f.evidence else ""
            seg_idx = f.evidence.segment_index if f.evidence else ""
            start_ch = f.evidence.start_char if f.evidence else ""
            end_ch = f.evidence.end_char if f.evidence else ""

            row_vals = [
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
            ]
            for col_idx, val in enumerate(row_vals, 1):
                c = ws.cell(row=row_num, column=col_idx, value=val)
                c.font = data_font
                c.border = thin_border
                c.alignment = Alignment(vertical="center", indent=1)
            ws.row_dimensions[row_num].height = 20
            row_num += 1

        # Action Items Table
        if record.action_items:
            row_num += 1
            act_headers = ["Description", "Assignee", "Deadline", "Status"]
            for col_idx, h_text in enumerate(act_headers, 1):
                c = ws.cell(row=row_num, column=col_idx, value=h_text)
                c.font = table_header_font
                c.fill = table_header_fill
                c.alignment = Alignment(horizontal="left", vertical="center", indent=1)
            ws.row_dimensions[row_num].height = 24
            row_num += 1

            for a in record.action_items:
                act_vals = [
                    a.description,
                    a.assignee or "Unassigned",
                    a.deadline or "None",
                    a.status,
                ]
                for col_idx, val in enumerate(act_vals, 1):
                    c = ws.cell(row=row_num, column=col_idx, value=val)
                    c.font = data_font
                    c.border = thin_border
                    c.alignment = Alignment(vertical="center", indent=1)
                ws.row_dimensions[row_num].height = 20
                row_num += 1

        # Auto-adjust column widths
        for col in ws.columns:
            max_len = 0
            for cell in col:
                val_str = str(cell.value or "")
                # Skip merged cell A1 when calculating width
                if cell.row == 1:
                    continue
                if len(val_str) > max_len:
                    max_len = len(val_str)
            col_letter = get_column_letter(col[0].column)
            ws.column_dimensions[col_letter].width = max(min(max_len + 4, 45), 14)

        stream = io.BytesIO()
        wb.save(stream)
        excel_bytes = stream.getvalue()
        filename = f"vaanitrace_{record.id[:8]}_{record.record_type}.xlsx"
        return excel_bytes, filename

    @staticmethod
    def export_tally_xml(record: Record) -> Tuple[str, str]:
        """Serialize Record into a valid TallyPrime / Tally ERP 9 XML Sales Order / Purchase Order voucher."""
        from datetime import datetime

        date_str = (
            record.created_at.strftime("%Y%m%d")
            if record.created_at
            else datetime.utcnow().strftime("%Y%m%d")
        )

        qty = "1"
        unit = "Boxes"
        rate = "0.00"
        total = "0.00"
        item_name = "Voice Order Goods"
        party_name = "Customer Ledger"

        for f in record.fields:
            fn = f.field_name.lower()
            if "item" in fn or "product" in fn or "crop" in fn:
                item_name = f.current_value.title()
            elif "quantity" in fn or "qty" in fn:
                qty = f.current_value
                if f.notes and "unit:" in f.notes.lower():
                    unit = f.notes.split(":")[-1].strip().title()
            elif "price" in fn or "rate" in fn:
                rate = f.current_value.replace("₹", "").replace(",", "").strip()
            elif "total" in fn or "amount" in fn:
                total = f.current_value.replace("₹", "").replace(",", "").strip()
            elif "customer" in fn or "party" in fn or "client" in fn:
                party_name = f.current_value.title()

        try:
            if float(total) == 0 and float(qty) > 0 and float(rate) > 0:
                total = f"{float(qty) * float(rate):.2f}"
        except Exception:
            pass

        vch_type = "Sales Order" if record.record_type == "business_order" else "Journal"
        summary_clean = (record.cleaned_summary or record.original_transcript or "")[:120].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

        tally_xml = f"""<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>VaaniTrace Commerce</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="{vch_type}" ACTION="Create" OBJVIEW="Invoice Voucher View">
            <DATE>{date_str}</DATE>
            <VOUCHERTYPENAME>{vch_type}</VOUCHERTYPENAME>
            <PARTYLEDGERNAME>{party_name}</PARTYLEDGERNAME>
            <PERSISTEDVIEW>Invoice View</PERSISTEDVIEW>
            <NARRATION>VaaniTrace Voice-PO via Gnani AI Speech Recognition. Evidence: '{summary_clean}'. Record ID: {record.id}</NARRATION>
            <ALLINVENTORYENTRIES.LIST>
              <STOCKITEMNAME>{item_name}</STOCKITEMNAME>
              <RATE>{rate}/{unit}</RATE>
              <ACTUALQTY>{qty} {unit}</ACTUALQTY>
              <BILLEDQTY>{qty} {unit}</BILLEDQTY>
              <AMOUNT>-{total}</AMOUNT>
            </ALLINVENTORYENTRIES.LIST>
          </VOUCHER>
        </TALLYMESSAGE>
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>"""
        filename = f"vaanitrace_tally_{record.id[:8]}.xml"
        return tally_xml, filename


export_service = ExportService()

