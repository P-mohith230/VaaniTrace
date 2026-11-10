/**
 * Frontend TypeScript domain models and interfaces.
 */

export interface TranscriptSegment {
  id: number;
  text: string;
  start_char: number;
  end_char: number;
  start_time?: number | null;
  end_time?: number | null;
}

export interface EvidenceRef {
  id?: string;
  supporting_text: string;
  segment_index?: number | null;
  start_char?: number | null;
  end_char?: number | null;
  start_time?: number | null;
  end_time?: number | null;
}

export type EvidenceType = 'spoken' | 'inferred' | 'calculated' | 'manual';
export type VerificationStatus = 'unverified' | 'verified' | 'needs_review';

export interface ExtractedField {
  id?: string;
  field_name: string;
  original_value?: string | null;
  current_value?: string | null;
  evidence_type: EvidenceType;
  is_edited?: boolean;
  verification_status: VerificationStatus;
  notes?: string | null;
  evidence?: EvidenceRef | null;
}

export interface ActionItem {
  id?: string;
  description: string;
  assignee?: string | null;
  deadline?: string | null;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface UncertainField {
  field_name: string;
  extracted_text?: string | null;
  reason: string;
}

export interface TranscriptionResult {
  request_id: string;
  transcript: string;
  detected_language: string;
  model: string;
  processing_time?: number | null;
  segments: TranscriptSegment[];
}

export interface ExtractionResult {
  record_type: string;
  summary: string;
  participants: string[];
  entities: string[];
  items: Array<{ name?: string; quantity?: number }>;
  amounts: Array<{ amount?: number; type?: string }>;
  dates: Array<{ date?: string }>;
  requests: string[];
  commitments: string[];
  action_items: ActionItem[];
  uncertain_fields: UncertainField[];
  fields: ExtractedField[];
}

export interface RecordSummary {
  id: string;
  title: string;
  record_type: string;
  language_code?: string | null;
  verification_status: VerificationStatus;
  field_count: number;
  action_item_count: number;
  created_at: string;
  updated_at: string;
}

export interface RecordDetail {
  id: string;
  title: string;
  record_type: string;
  original_transcript: string;
  cleaned_summary?: string | null;
  language_code?: string | null;
  verification_status: VerificationStatus;
  audio_summary_base64?: string | null;
  created_at: string;
  updated_at: string;
  fields: ExtractedField[];
  action_items: ActionItem[];
}

export interface SystemHealth {
  status: string;
  backend: string;
  database: string;
  version: string;
}

export interface GnaniHealth {
  configured: boolean;
  connectivity: 'verified' | 'not_checked' | 'auth_failed' | 'unavailable' | 'not_configured';
  model_stt: string;
  model_tts: string;
  message: string;
  details?: Record<string, any>;
}
