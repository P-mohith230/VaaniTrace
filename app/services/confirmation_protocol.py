"""Closed-Loop Voice Confirmation Protocol Service (Rank 3 Innovation).

Implements the Confirm-Before-Commit state machine:
1. Synthesizes an auditable, legally sound verbal confirmation readback.
2. Gates statutory ERP / Tally commit behind explicit human-in-the-loop confirmation.
3. Supports live voice/text corrective amendments with immediate delta recalculation.
"""

import re
from typing import List, Dict, Any, Optional, Tuple
from app.services.indic_normalizer import indic_normalizer


class ConfirmationProtocolService:
    """Manages the closed-loop voice confirmation protocol lifecycle."""

    @staticmethod
    def generate_confirmation_script(
        record_type: str,
        fields: List[Dict[str, Any]],
        uncertain_fields: Optional[List[Dict[str, Any]]] = None,
        language: str = "en-IN",
    ) -> Dict[str, Any]:
        """Generate an explicit, auditable verbal confirmation readback script."""
        field_map = {f.get("field_name", ""): f for f in fields}
        uncertain_list = uncertain_fields or []
        facts: List[str] = []
        clarifications: List[str] = [u.get("reason", "") for u in uncertain_list if u.get("reason")]

        if record_type == "business_order":
            # Extract key business order values
            item = field_map.get("order_item", {}).get("current_value") or field_map.get("product_name", {}).get("current_value") or "items"
            qty = field_map.get("quantity", {}).get("current_value") or "1"
            qty_notes = field_map.get("quantity", {}).get("notes") or ""
            pack = field_map.get("standardized_packaging", {}).get("current_value")
            price = field_map.get("unit_price", {}).get("current_value") or "market rate"
            total = field_map.get("total_amount", {}).get("current_value")
            deadline = field_map.get("delivery_deadline", {}).get("current_value")
            consignee = field_map.get("consignee", {}).get("current_value") or field_map.get("customer_name", {}).get("current_value")

            # Clean prices for spoken clarity
            clean_price = price.replace("₹", "rupees ").replace(",", "") if price else ""
            clean_total = total.replace("₹", "rupees ").replace(",", "") if total else ""

            # Build verbal packaging clause
            pack_clause = ""
            if pack:
                pack_clause = f", standardized as {pack}"
            elif "standard si:" in qty_notes.lower():
                si_part = qty_notes.split("Standard SI:")[-1].split("•")[0].strip()
                pack_clause = f", equivalent to {si_part}"

            script_parts = [
                f"Please confirm your purchase order details.",
                f"You have requested {qty} of {item}{pack_clause}",
            ]
            facts.append(f"Item: {item}")
            facts.append(f"Quantity: {qty}{pack_clause}")

            if clean_price and clean_price != "market rate":
                script_parts.append(f"at {clean_price} each.")
                facts.append(f"Unit Price: {price}")

            if clean_total:
                script_parts.append(f"Calculated net total is {clean_total}.")
                facts.append(f"Net Total: {total}")

            if deadline:
                script_parts.append(f"Delivery is requested by {deadline}.")
                facts.append(f"Delivery: {deadline}")

            if consignee:
                facts.append(f"Consignee: {consignee}")

            # Highlight uncertain or acoustic ambiguity alerts
            if uncertain_list:
                for u in uncertain_list:
                    reason = u.get("reason", "")
                    fn = u.get("field_name", "").replace("_", " ")
                    script_parts.append(f"Notice: Please verify {fn}, {reason}.")

            script_parts.append("Say or click 'Confirm' to commit this transaction to the ledger, or state your correction.")
            script_text = " ".join(script_parts)

        elif record_type == "meeting_action_items":
            script_parts = ["Please confirm the recorded meeting commitments and action items:"]
            for f in fields:
                fn = f.get("field_name", "").replace("_", " ")
                cv = f.get("current_value", "")
                if cv:
                    script_parts.append(f"{fn}: {cv}.")
                    facts.append(f"{fn}: {cv}")
            script_parts.append("Please confirm to approve these action items, or state your changes.")
            script_text = " ".join(script_parts)

        else:
            script_parts = ["Please confirm the extracted details for this record:"]
            for f in fields[:4]:
                fn = f.get("field_name", "").replace("_", " ")
                cv = f.get("current_value", "")
                if cv:
                    script_parts.append(f"{fn}: {cv}.")
                    facts.append(f"{fn}: {cv}")
            script_parts.append("Do you confirm this record, or do you have any corrections?")
            script_text = " ".join(script_parts)

        return {
            "script_text": script_text,
            "summary_facts": facts,
            "requires_clarification": len(clarifications) > 0,
            "clarification_questions": clarifications,
        }

    @staticmethod
    def evaluate_voice_intent(spoken_response: str) -> str:
        """Classify user's spoken confirmation response into CONFIRM, REJECT, or CORRECT."""
        text = spoken_response.lower().strip()

        # Confirmation tokens (English + Indic Romanized)
        confirm_tokens = [
            "confirm", "confirmed", "yes", "yeah", "yup", "correct", "approve", "approved",
            "haan", "haanji", "theek hai", "sahi hai", "ok", "okay", "done", "pakka",
            "lock it", "proceed", "commit", "save kar do", "bhej do"
        ]
        if any(re.search(rf'\b{re.escape(tok)}\b', text) for tok in confirm_tokens):
            return "CONFIRM"

        # Rejection tokens
        reject_tokens = [
            "reject", "rejected", "cancel", "cancelled", "no", "nope", "nahi", "nahin",
            "mat karo", "galat hai", "discard", "void", "stop", "abort"
        ]
        if any(re.search(rf'\b{re.escape(tok)}\b', text) for tok in reject_tokens):
            return "REJECT"

        # Otherwise assume it's a correction / amendment
        return "CORRECT"

    @classmethod
    def apply_verbal_correction(
        cls,
        current_fields: List[Dict[str, Any]],
        correction_text: str,
        record_type: str = "business_order",
    ) -> Dict[str, Any]:
        """Apply a verbal or typed corrective amendment and recompute dependent calculations."""
        updated_fields = [dict(f) for f in current_fields]
        changes_applied: List[str] = []
        text = correction_text.strip()

        # 1. Check for Quantity amendment (e.g., 'make it 60 bori', 'change to 30', '40 bags')
        vernacular_parsed = indic_normalizer.parse_vernacular_phrase(text)
        qty_match = re.search(r'(?:quantity|qty|make it|change to|instead of\s+\d+\s+make it|actually)\s*(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?', text, re.IGNORECASE)
        
        new_qty_num = None
        new_unit = None
        new_phrase = None

        if vernacular_parsed:
            new_qty_num, new_unit, new_phrase = vernacular_parsed
        elif qty_match:
            new_qty_num = float(qty_match.group(1))
            new_unit = qty_match.group(2) or "units"
            new_phrase = qty_match.group(0).strip()
        elif re.search(r'\b(\d+)\s*(?:bori|katta|peti|boxes|bags|quintals|kg|tins|dabba)\b', text, re.I):
            m = re.search(r'\b(\d+)\s*([a-zA-Z]+)\b', text, re.I)
            if m:
                new_qty_num = float(m.group(1))
                new_unit = m.group(2)
                new_phrase = m.group(0)

        # 2. Check for Unit Price amendment (e.g., 'price is 2100', 'rate 350', '2100 rupees')
        price_match = re.search(r'(?:price|rate|rupees|rs\.?|₹|at)\s*(?:is\s*)?(\d+(?:,\d+)*(?:\.\d+)?)\b', text, re.IGNORECASE)
        new_price_str = None
        if price_match:
            new_price_num = float(price_match.group(1).replace(",", ""))
            new_price_str = f"₹{new_price_num:,.2f}"

        # 3. Check for Delivery Deadline amendment (e.g., 'deliver by monday', 'tuesday tak')
        deadline_match = re.search(r'(?:deliver|delivery|by|tak|on)\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|next week)', text, re.IGNORECASE)
        new_deadline_str = None
        if deadline_match:
            new_deadline_str = deadline_match.group(1).title()

        # 4. Check for Item amendment (e.g., 'item is cement', 'not rice, it is wheat')
        for c_key in indic_normalizer.COMMODITY_STANDARDS:
            if re.search(rf'\b(?:item|product|commodity|crop)?\s*(?:is|to)?\s*{re.escape(c_key)}\b', text, re.I):
                item_field = next((f for f in updated_fields if f.get("field_name") in ("order_item", "product_name")), None)
                if item_field:
                    old_item = item_field.get("current_value", "")
                    item_field["current_value"] = c_key.title()
                    item_field["is_edited"] = True
                    item_field["evidence_type"] = "manual"
                    item_field["notes"] = f"Corrected via Voice Protocol: '{c_key.title()}'"
                    changes_applied.append(f"Item updated: {old_item} → {c_key.title()}")
                break

        # Apply Quantity update
        commodity_name = "Goods"
        item_field = next((f for f in updated_fields if f.get("field_name") in ("order_item", "product_name")), None)
        if item_field:
            commodity_name = item_field.get("current_value", "Goods")

        if new_qty_num is not None:
            qty_field = next((f for f in updated_fields if f.get("field_name") == "quantity"), None)
            if qty_field:
                old_val = qty_field.get("current_value", "")
                norm = indic_normalizer.normalize(
                    commodity_name=commodity_name,
                    raw_phrase=new_phrase or f"{new_qty_num:g} {new_unit or 'units'}",
                    qty=new_qty_num,
                    unit=new_unit or "units",
                    context_text=text,
                )
                qty_field["current_value"] = str(int(new_qty_num) if new_qty_num.is_integer() else new_qty_num)
                qty_field["is_edited"] = True
                qty_field["evidence_type"] = "manual"
                qty_field["notes"] = (
                    f"Colloquial: {norm.colloquial_quantity:g} {norm.colloquial_unit} • "
                    f"Standard SI: {norm.standardized_display} • "
                    f"HSN {norm.hsn_code} • Corrected via Voice Protocol: '{text}'"
                )
                changes_applied.append(f"Quantity updated: {old_val} → {qty_field['current_value']} ({norm.standardized_display})")

                # Update standardized_packaging field if present
                pack_field = next((f for f in updated_fields if f.get("field_name") == "standardized_packaging"), None)
                if pack_field:
                    pack_field["current_value"] = norm.standardized_display
                    pack_field["is_edited"] = True
                    pack_field["notes"] = f"Recalculated via Indic Normalizer ({norm.conversion_formula})"

        # Apply Unit Price update
        if new_price_str is not None:
            price_field = next((f for f in updated_fields if f.get("field_name") == "unit_price"), None)
            if price_field:
                old_p = price_field.get("current_value", "")
                price_field["current_value"] = new_price_str
                price_field["is_edited"] = True
                price_field["evidence_type"] = "manual"
                price_field["notes"] = f"Corrected via Voice Protocol: '{text}'"
                changes_applied.append(f"Unit price updated: {old_p} → {new_price_str}")

        # Apply Deadline update
        if new_deadline_str is not None:
            dl_field = next((f for f in updated_fields if f.get("field_name") == "delivery_deadline"), None)
            if dl_field:
                old_dl = dl_field.get("current_value", "")
                dl_field["current_value"] = new_deadline_str
                dl_field["is_edited"] = True
                dl_field["evidence_type"] = "manual"
                dl_field["notes"] = f"Amended via Voice Protocol: '{text}'"
                changes_applied.append(f"Delivery deadline updated: {old_dl} → {new_deadline_str}")

        # Recalculate Total Amount if Quantity or Price changed
        qty_field = next((f for f in updated_fields if f.get("field_name") == "quantity"), None)
        price_field = next((f for f in updated_fields if f.get("field_name") == "unit_price"), None)
        total_field = next((f for f in updated_fields if f.get("field_name") == "total_amount"), None)

        if qty_field and price_field and total_field:
            try:
                q_val = float(qty_field.get("current_value", 0))
                p_clean = price_field.get("current_value", "").replace("₹", "").replace(",", "").strip()
                p_val = float(p_clean) if p_clean else 0.0
                if q_val > 0 and p_val > 0:
                    calc_total = q_val * p_val
                    total_field["current_value"] = f"₹{calc_total:,.2f}"
                    total_field["is_edited"] = True
                    total_field["evidence_type"] = "calculated"
                    total_field["notes"] = f"Recalculated: {q_val:g} × ₹{p_val:,.2f} = ₹{calc_total:,.2f}"
                    changes_applied.append(f"Net total recalculated: {total_field['current_value']}")
            except Exception:
                pass

        if not changes_applied:
            changes_applied.append(f"Amendment noted: '{text}' (no numeric fields altered)")

        # Generate updated confirmation script
        new_script_data = cls.generate_confirmation_script(record_type, updated_fields)

        return {
            "updated_fields": updated_fields,
            "changes_applied": changes_applied,
            "new_confirmation_script": new_script_data["script_text"],
        }


confirmation_service = ConfirmationProtocolService()
