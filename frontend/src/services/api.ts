/**
 * Centralized API client for VaaniTrace.
 * Uses relative URLs so it works out of the box in single-deployment production
 * and in Vite development proxy mode.
 */

import {
  SystemHealth,
  GnaniHealth,
  TranscriptionResult,
  ExtractionResult,
  RecordDetail,
  RecordSummary,
  TranscriptSegment,
} from '../types';

const API_BASE = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers = new Headers(options.headers || {});

    if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = typeof errorData.detail === 'string'
              ? errorData.detail
              : JSON.stringify(errorData.detail);
          }
        } catch {
          // Response was not JSON
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Unable to connect to the VaaniTrace backend server. Please verify the server is running.');
      }
      throw err;
    }
  }

  // Health
  async getHealth(): Promise<SystemHealth> {
    return this.request<SystemHealth>('/health');
  }

  async getGnaniHealth(): Promise<GnaniHealth> {
    return this.request<GnaniHealth>('/health/gnani');
  }

  // Transcription
  async transcribeAudio(
    audioFile: File | Blob,
    filename: string = 'recording.wav',
    language: string = 'indic-auto',
    model?: string
  ): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('file', audioFile, filename);
    formData.append('language', language);
    if (model) {
      formData.append('model', model);
    }

    return this.request<TranscriptionResult>('/transcribe', {
      method: 'POST',
      body: formData,
    });
  }

  // Extraction
  async extractInformation(
    transcript: string,
    recordType: string = 'general_conversation',
    segments?: TranscriptSegment[]
  ): Promise<ExtractionResult> {
    return this.request<ExtractionResult>('/extract', {
      method: 'POST',
      body: JSON.stringify({
        transcript,
        record_type: recordType,
        segments: segments || null,
      }),
    });
  }

  // Speech (Timbre TTS)
  async synthesizeSpeech(
    text: string,
    voice: string = 'Nalini',
    language: string = 'en-IN',
    speed: number = 1.0
  ): Promise<{ audio_base64: string; content_type: string; model: string }> {
    return this.request<{ audio_base64: string; content_type: string; model: string }>('/speech?output_format=json', {
      method: 'POST',
      body: JSON.stringify({
        text,
        voice,
        language,
        speed,
      }),
    });
  }

  // Closed-Loop Voice Confirmation Protocol (Rank 3)
  async getConfirmationScript(
    recordType: string,
    fields: any[],
    uncertainFields: any[] = [],
    language: string = 'en-IN'
  ): Promise<{
    script_text: string;
    summary_facts: string[];
    requires_clarification: boolean;
    clarification_questions: string[];
  }> {
    return this.request('/confirmation/script', {
      method: 'POST',
      body: JSON.stringify({
        record_type: recordType,
        fields,
        uncertain_fields: uncertainFields,
        language,
      }),
    });
  }

  async applyVoiceCorrection(
    correctionText: string,
    currentFields: any[],
    recordType: string = 'business_order'
  ): Promise<{
    updated_fields: any[];
    changes_applied: string[];
    new_confirmation_script: string;
    updated_summary?: string;
  }> {
    return this.request('/confirmation/correct', {
      method: 'POST',
      body: JSON.stringify({
        correction_text: correctionText,
        current_fields: currentFields,
        record_type: recordType,
      }),
    });
  }

  async evaluateVoiceIntent(spokenText: string): Promise<{ intent: 'CONFIRM' | 'REJECT' | 'CORRECT' }> {
    return this.request('/confirmation/intent', {
      method: 'POST',
      body: JSON.stringify({
        spoken_text: spokenText,
      }),
    });
  }

  // Records CRUD
  async listRecords(params: {
    record_type?: string;
    verification_status?: string;
    search?: string;
  } = {}): Promise<RecordSummary[]> {
    const query = new URLSearchParams();
    if (params.record_type) query.set('record_type', params.record_type);
    if (params.verification_status) query.set('verification_status', params.verification_status);
    if (params.search) query.set('search', params.search);

    const qs = query.toString();
    return this.request<RecordSummary[]>(`/records${qs ? `?${qs}` : ''}`);
  }

  async getRecord(recordId: string): Promise<RecordDetail> {
    return this.request<RecordDetail>(`/records/${encodeURIComponent(recordId)}`);
  }

  async createRecord(payload: Partial<RecordDetail>): Promise<RecordDetail> {
    return this.request<RecordDetail>('/records', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateRecord(recordId: string, payload: Partial<RecordDetail>): Promise<RecordDetail> {
    return this.request<RecordDetail>(`/records/${encodeURIComponent(recordId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteRecord(recordId: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/records/${encodeURIComponent(recordId)}`, {
      method: 'DELETE',
    });
  }

  // Multi-Party Commitment Knowledge Graph (Rank 4)
  async extractCommitmentGraph(
    transcript: string,
    recordType: string = 'business_order',
    fields: any[] = [],
    actionItems: any[] = []
  ): Promise<any> {
    return this.request('/graph/extract', {
      method: 'POST',
      body: JSON.stringify({
        transcript,
        record_type: recordType,
        fields,
        action_items: actionItems,
      }),
    });
  }

  async simulateCommitmentNode(
    nodes: any[],
    edges: any[],
    targetNodeId: string
  ): Promise<{ nodes: any[]; edges: any[]; toggled_node_id: string; message: string }> {
    return this.request('/graph/simulate', {
      method: 'POST',
      body: JSON.stringify({
        nodes,
        edges,
        target_node_id: targetNodeId,
      }),
    });
  }

  // Voice Dispute Simulator & Forensic Audit Replay (Candidate A)
  async simulateDispute(payload: {
    transcript: string;
    fields: any[];
    disputed_field: string;
    claimed_value: string;
    record_type?: string;
    record_id?: string | null;
    language?: string;
  }): Promise<any> {
    return this.request('/dispute/simulate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  getExportUrl(recordId: string, format: 'json' | 'csv' | 'xlsx' | 'tally' = 'json'): string {
    return `${API_BASE}/records/${encodeURIComponent(recordId)}/export?format=${format}`;
  }
}

export const api = new ApiClient();

