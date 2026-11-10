"""Structured information extraction service with evidence linking."""

import re
from typing import List, Dict, Any, Optional, Tuple
from app.schemas import (
    ExtractionResponse,
    TranscriptSegment,
    ExtractedFieldSchema,
    ActionItemSchema,
    UncertainFieldSchema,
)
from app.services.evidence_mapper import evidence_mapper


class InformationExtractor:
    """Extracts structured fields, action items, and calculations from transcripts."""

    def extract(
        self,
        transcript: str,
        record_type: str = "general_conversation",
        segments: Optional[List[TranscriptSegment]] = None,
    ) -> ExtractionResponse:
        """Execute structured extraction for the designated record type."""
        clean_text = transcript.strip()
        if not segments:
            segments = evidence_mapper.segment_transcript(clean_text)

        handler_map = {
            "business_order": self._extract_business_order,
            "meeting_action_items": self._extract_meeting_action_items,
            "field_report": self._extract_field_report,
            "customer_complaint": self._extract_customer_complaint,
            "general_conversation": self._extract_general_conversation,
        }

        handler = handler_map.get(record_type, self._extract_general_conversation)
        return handler(clean_text, segments)

    # -------------------------------------------------------------
    # Helper Extractors (Numbers, Currency, Dates, Entities)
    # -------------------------------------------------------------

    def _extract_amounts(self, text: str) -> List[Dict[str, Any]]:
        """Extract currency amounts with spoken phrases."""
        amounts = []
        # Pattern for ₹ or Rs. or Rupees or INR or numbers followed by currency
        patterns = [
            r'(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)',
            r'([\d,]+(?:\.\d{1,2})?)\s*(?:rupees|rs|INR|dollars|\$)',
            r'([\d,]+)\s*(?:hazaar|thousand|lakh)',
        ]
        for pat in patterns:
            for match in re.finditer(pat, text, re.IGNORECASE):
                val_str = match.group(1).replace(",", "")
                supporting = match.group(0)
                try:
                    num_val = float(val_str)
                    amounts.append({"value": num_val, "raw": val_str, "phrase": supporting})
                except ValueError:
                    pass
        return amounts

    def _extract_quantities(self, text: str) -> List[Dict[str, Any]]:
        """Extract numeric quantities with their units."""
        quantities = []
        # Matches: 20 boxes, 50 units, 100 packets, 5 meters, 10 pcs
        pat = r'\b(\d+)\s*(boxes|units|packets|pieces|pcs|cartons|kg|kilos|liters|tonnes|items|sets)\b'
        for match in re.finditer(pat, text, re.IGNORECASE):
            qty_str = match.group(1)
            unit = match.group(2)
            supporting = match.group(0)
            try:
                quantities.append({
                    "quantity": int(qty_str),
                    "unit": unit,
                    "phrase": supporting,
                })
            except ValueError:
                pass
        return quantities

    def _extract_dates_or_deadlines(self, text: str) -> List[Dict[str, Any]]:
        """Extract temporal expressions or explicit dates."""
        dates = []
        patterns = [
            r'\b(?:by|before|on|due)\s+(tomorrow|today|yesterday|friday|monday|tuesday|wednesday|thursday|saturday|sunday|next week|eod|end of day)\b',
            r'\b(tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b',
            r'\b(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)\b',
            r'\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b',
            r'\b(kal tak|aaj shaam tak|agle hafte)\b',  # Hinglish common deadlines
        ]
        seen = set()
        for pat in patterns:
            for match in re.finditer(pat, text, re.IGNORECASE):
                phrase = match.group(0).strip()
                val = match.group(1).strip() if match.groups() else phrase
                if val.lower() not in seen:
                    seen.add(val.lower())
                    dates.append({"value": val, "phrase": phrase})
        return dates

    def _extract_people_or_entities(self, text: str) -> List[str]:
        """Extract names mentioned after greetings or introductions."""
        names = []
        patterns = [
            r'(?:this is|I am|myself|speaking to|call with|hi|hello)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)',
            r'([A-Z][a-z]+)\s+here',
            r'(?:Ramesh|Suresh|Priya|Rahul|Ankit|Amit|Vikram|Neha|Sunita|Sharma|Verma|Patel)',
        ]
        seen = set()
        for pat in patterns:
            for match in re.finditer(pat, text):
                name = match.group(1) if match.groups() else match.group(0)
                name = name.strip()
                if name.lower() not in seen and len(name) > 2:
                    seen.add(name.lower())
                    names.append(name)
        return names

    # -------------------------------------------------------------
    # 1. Business Order Extractor
    # -------------------------------------------------------------

    def _extract_business_order(self, text: str, segments: List[TranscriptSegment]) -> ExtractionResponse:
        fields: List[ExtractedFieldSchema] = []
        action_items: List[ActionItemSchema] = []
        uncertain_fields: List[UncertainFieldSchema] = []

        quantities = self._extract_quantities(text)
        amounts = self._extract_amounts(text)
        deadlines = self._extract_dates_or_deadlines(text)
        entities = self._extract_people_or_entities(text)

        # Item detection (look for noun phrase around quantity or order verbs)
        item_name = None
        item_phrase = None
        item_match = re.search(
            r'(?:need|order|send|deliver|want|mangwane|bhejo)\s+(?:about\s+)?(\d+\s+\w+(?:\s+\w+)?(?:\s+of\s+([A-Za-z0-9\s-]+?)(?:\s+at|\s+by|\s+for|\.|$)))',
            text,
            re.IGNORECASE,
        )
        if item_match:
            item_phrase = item_match.group(0).strip()
            item_name = item_match.group(2) if item_match.group(2) else item_match.group(1)
            item_name = item_name.strip()
        elif quantities:
            item_phrase = quantities[0]["phrase"]
            item_name = f"{quantities[0]['quantity']} {quantities[0]['unit']}"

        # 1. Item Field
        if item_name:
            fields.append(
                evidence_mapper.create_field(
                    field_name="order_item",
                    value=item_name,
                    supporting_text=item_phrase or item_name,
                    evidence_type="spoken",
                    transcript=text,
                    segments=segments,
                    notes="Primary item requested in the conversation",
                )
            )
        else:
            uncertain_fields.append(
                UncertainFieldSchema(
                    field_name="order_item",
                    reason="No specific catalog item name or product model clearly stated.",
                )
            )

        # 2. Quantity Field
        qty_val = None
        if quantities:
            qty = quantities[0]
            qty_val = qty["quantity"]
            fields.append(
                evidence_mapper.create_field(
                    field_name="quantity",
                    value=str(qty["quantity"]),
                    supporting_text=qty["phrase"],
                    evidence_type="spoken",
                    transcript=text,
                    segments=segments,
                    notes=f"Unit: {qty['unit']}",
                )
            )
        else:
            # Fallback: check bare numbers near order
            bare_num_match = re.search(r'\b(\d+)\b', text)
            if bare_num_match:
                qty_val = int(bare_num_match.group(1))
                fields.append(
                    evidence_mapper.create_field(
                        field_name="quantity",
                        value=str(qty_val),
                        supporting_text=bare_num_match.group(0),
                        evidence_type="spoken",
                        transcript=text,
                        segments=segments,
                        notes="Extracted from numeric count",
                    )
                )

        # 3. Unit Price Field
        unit_price_val = None
        if amounts:
            unit_price = amounts[0]
            unit_price_val = unit_price["value"]
            fields.append(
                evidence_mapper.create_field(
                    field_name="unit_price",
                    value=f"₹{unit_price_val:,.2f}" if unit_price_val else str(unit_price['raw']),
                    supporting_text=unit_price["phrase"],
                    evidence_type="spoken",
                    transcript=text,
                    segments=segments,
                    notes="Quoted unit price",
                )
            )

        # 4. Calculated Total (Mathematical Derivation)
        if qty_val is not None and unit_price_val is not None:
            total_calc = qty_val * unit_price_val
            formula_note = f"Calculated: {qty_val} (quantity) × ₹{unit_price_val:,.2f} (unit price) = ₹{total_calc:,.2f}"
            supporting_context = f"{quantities[0]['phrase']} ... {amounts[0]['phrase']}" if quantities else amounts[0]['phrase']
            fields.append(
                evidence_mapper.create_field(
                    field_name="total_amount",
                    value=f"₹{total_calc:,.2f}",
                    supporting_text=supporting_context,
                    evidence_type="calculated",
                    transcript=text,
                    segments=segments,
                    notes=formula_note,
                )
            )

        # 5. Delivery Deadline
        if deadlines:
            dl = deadlines[0]
            fields.append(
                evidence_mapper.create_field(
                    field_name="delivery_deadline",
                    value=dl["value"],
                    supporting_text=dl["phrase"],
                    evidence_type="spoken",
                    transcript=text,
                    segments=segments,
                )
            )
            action_items.append(
                ActionItemSchema(
                    description=f"Fulfill and deliver order ({item_name or 'goods'})",
                    deadline=dl["value"],
                    status="pending",
                )
            )

        # Summary
        summary = f"Customer placed an order for {item_name or 'items'}"
        if qty_val:
            summary += f" (Quantity: {qty_val})"
        if unit_price_val:
            summary += f" at ₹{unit_price_val:,.2f} each"
        if deadlines:
            summary += f", required by {deadlines[0]['value']}"
        summary += "."

        return ExtractionResponse(
            record_type="business_order",
            summary=summary,
            participants=entities,
            entities=entities,
            items=[{"name": item_name, "quantity": qty_val}] if item_name else [],
            amounts=[{"amount": unit_price_val, "type": "unit_price"}] if unit_price_val else [],
            dates=[{"date": d["value"]} for d in deadlines],
            requests=[f"Deliver {item_name or 'goods'}"] if item_name else [],
            commitments=[],
            action_items=action_items,
            uncertain_fields=uncertain_fields,
            fields=fields,
        )

    # -------------------------------------------------------------
    # 2. Meeting Action Items Extractor
    # -------------------------------------------------------------

    def _extract_meeting_action_items(self, text: str, segments: List[TranscriptSegment]) -> ExtractionResponse:
        fields: List[ExtractedFieldSchema] = []
        action_items: List[ActionItemSchema] = []
        uncertain_fields: List[UncertainFieldSchema] = []

        entities = self._extract_people_or_entities(text)
        deadlines = self._extract_dates_or_deadlines(text)

        # Look for action verbs / assignment patterns
        # e.g., "Priya will prepare the slide deck by Friday", "Ankit to review the contract"
        action_patterns = [
            r'([A-Z][a-z]+)\s+(?:will|should|is going to|to)\s+([^.?!।\n]+)',
            r'(?:please|need to|we must|action item:?)\s+([^.?!।\n]+)',
        ]

        found_actions = []
        for pat in action_patterns:
            for match in re.finditer(pat, text):
                phrase = match.group(0).strip()
                if match.groups() and len(match.groups()) == 2:
                    assignee = match.group(1).strip()
                    task = match.group(2).strip()
                else:
                    assignee = entities[0] if entities else "Team"
                    task = match.group(1).strip() if match.groups() else phrase

                # Extract deadline if embedded in task
                dl_match = re.search(r'(?:by|before|on)\s+([A-Za-z0-9\s]+)$', task, re.IGNORECASE)
                task_deadline = dl_match.group(1).strip() if dl_match else (deadlines[0]["value"] if deadlines else None)

                found_actions.append((task, assignee, task_deadline, phrase))

        if found_actions:
            for idx, (task, assignee, dl, phrase) in enumerate(found_actions[:5]):
                act = ActionItemSchema(
                    id=f"act-{idx+1}",
                    description=task,
                    assignee=assignee,
                    deadline=dl,
                    status="pending",
                )
                action_items.append(act)

                fields.append(
                    evidence_mapper.create_field(
                        field_name=f"action_item_{idx+1}",
                        value=f"{task} (Assignee: {assignee or 'Unassigned'})",
                        supporting_text=phrase,
                        evidence_type="spoken",
                        transcript=text,
                        segments=segments,
                        notes=f"Deadline: {dl or 'Not specified'}",
                    )
                )
        else:
            uncertain_fields.append(
                UncertainFieldSchema(
                    field_name="action_items",
                    reason="No explicit task assignments or action commitments detected.",
                )
            )

        summary = f"Meeting discussion involving {', '.join(entities) if entities else 'participants'}. "
        summary += f"Identified {len(action_items)} action items."

        return ExtractionResponse(
            record_type="meeting_action_items",
            summary=summary,
            participants=entities,
            entities=entities,
            items=[],
            amounts=[],
            dates=[{"date": d["value"]} for d in deadlines],
            requests=[],
            commitments=[a.description for a in action_items],
            action_items=action_items,
            uncertain_fields=uncertain_fields,
            fields=fields,
        )

    # -------------------------------------------------------------
    # 3. Field Report Extractor
    # -------------------------------------------------------------

    def _extract_field_report(self, text: str, segments: List[TranscriptSegment]) -> ExtractionResponse:
        fields: List[ExtractedFieldSchema] = []
        action_items: List[ActionItemSchema] = []
        uncertain_fields: List[UncertainFieldSchema] = []

        entities = self._extract_people_or_entities(text)

        # Location detection
        loc_match = re.search(r'(?:at|site|location|facility|plant|warehouse|station)\s+([A-Z0-9][a-zA-Z0-9\s-]+?)(?:,|\.|\s+and|\s+is|$)', text)
        location = loc_match.group(1).strip() if loc_match else None
        if location:
            fields.append(
                evidence_mapper.create_field(
                    field_name="site_location",
                    value=location,
                    supporting_text=loc_match.group(0).strip(),
                    evidence_type="spoken",
                    transcript=text,
                    segments=segments,
                )
            )
        else:
            uncertain_fields.append(
                UncertainFieldSchema(
                    field_name="site_location",
                    reason="Specific site, warehouse, or facility name not clearly specified.",
                )
            )

        # Condition or status
        status_match = re.search(r'\b(damaged|functional|operational|leak|leakage|faulty|repaired|inspected|critical|warning|normal)\b', text, re.IGNORECASE)
        status_val = status_match.group(0).lower() if status_match else "inspected"
        fields.append(
            evidence_mapper.create_field(
                field_name="equipment_status",
                value=status_val,
                supporting_text=status_match.group(0) if status_match else text[:50],
                evidence_type="spoken" if status_match else "inferred",
                transcript=text,
                segments=segments,
            )
        )

        summary = f"Field inspection report for {location or 'site'}. Status observed: {status_val}."

        return ExtractionResponse(
            record_type="field_report",
            summary=summary,
            participants=entities,
            entities=entities,
            items=[],
            amounts=[],
            dates=[],
            requests=[],
            commitments=[],
            action_items=action_items,
            uncertain_fields=uncertain_fields,
            fields=fields,
        )

    # -------------------------------------------------------------
    # 4. Customer Complaint Extractor
    # -------------------------------------------------------------

    def _extract_customer_complaint(self, text: str, segments: List[TranscriptSegment]) -> ExtractionResponse:
        fields: List[ExtractedFieldSchema] = []
        action_items: List[ActionItemSchema] = []
        uncertain_fields: List[UncertainFieldSchema] = []

        entities = self._extract_people_or_entities(text)

        # Issue keywords
        issue_match = re.search(
            r'(?:complaint|issue|problem|defective|not working|failed|broken|delay|late|poor)\s*(?:is|with|in)?\s*([^.?!।\n]+)',
            text,
            re.IGNORECASE,
        )
        issue_text = issue_match.group(0).strip() if issue_match else "General customer dissatisfaction"

        fields.append(
            evidence_mapper.create_field(
                field_name="reported_issue",
                value=issue_text,
                supporting_text=issue_match.group(0).strip() if issue_match else text[:60],
                evidence_type="spoken",
                transcript=text,
                segments=segments,
                verification_status="unverified",
            )
        )

        # Severity assessment
        severity = "medium"
        if re.search(r'\b(urgent|critical|immediately|terrible|unacceptable|escalate)\b', text, re.IGNORECASE):
            severity = "high"
        elif re.search(r'\b(minor|small issue|slight)\b', text, re.IGNORECASE):
            severity = "low"

        fields.append(
            evidence_mapper.create_field(
                field_name="severity",
                value=severity,
                supporting_text=issue_text,
                evidence_type="inferred",
                transcript=text,
                segments=segments,
                notes="Inferred from tone and grievance terminology",
            )
        )

        action_items.append(
            ActionItemSchema(
                description=f"Investigate complaint: {issue_text[:60]}",
                assignee="Customer Support",
                deadline="Within 24 hours",
                status="pending",
            )
        )

        summary = f"Customer complaint regarding {issue_text[:80]}. Urgency assessed as {severity}."

        return ExtractionResponse(
            record_type="customer_complaint",
            summary=summary,
            participants=entities,
            entities=entities,
            items=[],
            amounts=[],
            dates=[],
            requests=[issue_text],
            commitments=["Review and follow-up with customer"],
            action_items=action_items,
            uncertain_fields=uncertain_fields,
            fields=fields,
        )

    # -------------------------------------------------------------
    # 5. General Conversation Extractor
    # -------------------------------------------------------------

    def _extract_general_conversation(self, text: str, segments: List[TranscriptSegment]) -> ExtractionResponse:
        fields: List[ExtractedFieldSchema] = []
        action_items: List[ActionItemSchema] = []
        uncertain_fields: List[UncertainFieldSchema] = []

        entities = self._extract_people_or_entities(text)
        amounts = self._extract_amounts(text)
        deadlines = self._extract_dates_or_deadlines(text)

        # Primary discussion statement
        first_sentence = segments[0].text if segments else text[:100]
        fields.append(
            evidence_mapper.create_field(
                field_name="main_topic",
                value=first_sentence,
                supporting_text=first_sentence,
                evidence_type="spoken",
                transcript=text,
                segments=segments,
                notes="Primary opening statement or topic",
            )
        )

        if entities:
            fields.append(
                evidence_mapper.create_field(
                    field_name="participants_mentioned",
                    value=", ".join(entities),
                    supporting_text=entities[0],
                    evidence_type="spoken",
                    transcript=text,
                    segments=segments,
                )
            )

        if amounts:
            fields.append(
                evidence_mapper.create_field(
                    field_name="financial_mention",
                    value=f"₹{amounts[0]['value']:,.2f}",
                    supporting_text=amounts[0]["phrase"],
                    evidence_type="spoken",
                    transcript=text,
                    segments=segments,
                )
            )

        summary = f"Spoken conversation with {len(segments)} segments. "
        if entities:
            summary += f"Participants identified: {', '.join(entities)}. "
        summary += f"Initial remark: \"{first_sentence[:80]}...\""

        return ExtractionResponse(
            record_type="general_conversation",
            summary=summary,
            participants=entities,
            entities=entities,
            items=[],
            amounts=amounts,
            dates=deadlines,
            requests=[],
            commitments=[],
            action_items=action_items,
            uncertain_fields=uncertain_fields,
            fields=fields,
        )


information_extractor = InformationExtractor()

