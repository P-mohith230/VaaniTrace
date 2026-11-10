"""Evidence mapping service for linking extracted fields to transcript passages."""

import re
from typing import List, Optional, Tuple
from app.schemas import TranscriptSegment, EvidenceRefSchema, ExtractedFieldSchema


class EvidenceMapper:
    """Service to segment transcripts and map extracted facts to exact text evidence."""

    @staticmethod
    def segment_transcript(transcript: str) -> List[TranscriptSegment]:
        """Deconstruct transcript into indexed sentence/clause segments with character offsets."""
        if not transcript or not transcript.strip():
            return []

        # Split on sentence terminals in English, Hindi/Indic (danda ।), and newlines
        pattern = re.compile(r'[^.?!।\n]+(?:[.?!।\n]+|$)')
        raw_matches = list(pattern.finditer(transcript))

        segments: List[TranscriptSegment] = []
        seg_id = 0

        for match in raw_matches:
            text = match.group(0).strip()
            if not text:
                continue
            # Find the actual start within the match group after stripping leading whitespace
            leading_spaces = len(match.group(0)) - len(match.group(0).lstrip())
            start_char = match.start() + leading_spaces
            end_char = start_char + len(text)

            segments.append(
                TranscriptSegment(
                    id=seg_id,
                    text=text,
                    start_char=start_char,
                    end_char=end_char,
                    start_time=None,
                    end_time=None,
                )
            )
            seg_id += 1

        if not segments:
            segments.append(
                TranscriptSegment(
                    id=0,
                    text=transcript.strip(),
                    start_char=0,
                    end_char=len(transcript.strip()),
                )
            )

        return segments

    @staticmethod
    def locate_phrase(
        transcript: str,
        segments: List[TranscriptSegment],
        phrase: str,
    ) -> Optional[Tuple[int, int, int]]:
        """Find the start_char, end_char, and segment_index for a target phrase."""
        if not phrase or not transcript:
            return None

        clean_phrase = phrase.strip()
        if not clean_phrase:
            return None

        # 1. Exact case-insensitive match in transcript
        pattern = re.escape(clean_phrase)
        match = re.search(pattern, transcript, re.IGNORECASE)
        if match:
            start_char = match.start()
            end_char = match.end()
            # Find segment
            seg_idx = 0
            for seg in segments:
                if seg.start_char <= start_char < seg.end_char or (seg.start_char <= end_char <= seg.end_char):
                    seg_idx = seg.id
                    break
            return (start_char, end_char, seg_idx)

        # 2. Token-level subset search (if phrase has multiple words)
        words = [w for w in re.split(r'\s+', clean_phrase) if len(w) > 2]
        if len(words) >= 2:
            # Try matching consecutive first and last keywords
            sub_pattern = rf"{re.escape(words[0])}.*?{re.escape(words[-1])}"
            sub_match = re.search(sub_pattern, transcript, re.IGNORECASE | re.DOTALL)
            if sub_match and (sub_match.end() - sub_match.start()) < 120:
                start_char = sub_match.start()
                end_char = sub_match.end()
                seg_idx = 0
                for seg in segments:
                    if seg.start_char <= start_char <= seg.end_char:
                        seg_idx = seg.id
                        break
                return (start_char, end_char, seg_idx)

        # 3. Fallback: Search across segments
        for seg in segments:
            if clean_phrase.lower() in seg.text.lower():
                idx_in_seg = seg.text.lower().find(clean_phrase.lower())
                start_char = seg.start_char + idx_in_seg
                end_char = start_char + len(clean_phrase)
                return (start_char, end_char, seg.id)

        return None

    def build_evidence(
        self,
        transcript: str,
        segments: List[TranscriptSegment],
        supporting_text: str,
    ) -> Optional[EvidenceRefSchema]:
        """Construct EvidenceRefSchema with offsets and segment linkage."""
        if not supporting_text:
            return None

        loc = self.locate_phrase(transcript, segments, supporting_text)
        if loc:
            start_char, end_char, seg_id = loc
            return EvidenceRefSchema(
                supporting_text=supporting_text,
                segment_index=seg_id,
                start_char=start_char,
                end_char=end_char,
            )

        # Unsupported in plain text or inferred from broader context
        return EvidenceRefSchema(
            supporting_text=supporting_text,
            segment_index=0 if segments else None,
            start_char=None,
            end_char=None,
        )

    def create_field(
        self,
        field_name: str,
        value: Optional[str],
        supporting_text: Optional[str],
        evidence_type: str,
        transcript: str,
        segments: List[TranscriptSegment],
        notes: Optional[str] = None,
        verification_status: str = "unverified",
    ) -> ExtractedFieldSchema:
        """Create a validated ExtractedFieldSchema with attached evidence."""
        evidence = None
        if supporting_text:
            evidence = self.build_evidence(transcript, segments, supporting_text)

        # If no supporting text and evidence_type is spoken, flag as needs_review
        status = verification_status
        if evidence_type == "spoken" and (not evidence or evidence.start_char is None):
            status = "needs_review"

        return ExtractedFieldSchema(
            field_name=field_name,
            original_value=value,
            current_value=value,
            evidence_type=evidence_type,
            is_edited=False,
            verification_status=status,
            notes=notes,
            evidence=evidence,
        )


evidence_mapper = EvidenceMapper()

