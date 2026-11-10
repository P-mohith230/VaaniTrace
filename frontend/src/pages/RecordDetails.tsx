import React, { useState, useEffect } from 'react';
import { RecordDetail, ExtractedField, VerificationStatus } from '../types';
import { api } from '../services/api';
import { TranscriptViewer } from '../components/TranscriptViewer';
import { ExtractionPanel } from '../components/ExtractionPanel';
import { VerificationControls } from '../components/VerificationControls';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ArrowLeft, Save, Download, CheckCircle2, Clock } from 'lucide-react';

interface RecordDetailsProps {
  recordId: string;
  onBack: () => void;
}

export const RecordDetails: React.FC<RecordDetailsProps> = ({ recordId, onBack }) => {
  const [record, setRecord] = useState<RecordDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Highlighting State
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [activeCharRange, setActiveCharRange] = useState<{ start: number; end: number } | null>(null);

  useEffect(() => {
    loadRecord();
  }, [recordId]);

  const loadRecord = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await api.getRecord(recordId);
      setRecord(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load record details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = (index: number, updatedField: ExtractedField) => {
    if (!record) return;
    const updatedFields = [...record.fields];
    updatedFields[index] = updatedField;
    setRecord({ ...record, fields: updatedFields });
  };

  const handleFieldVerify = (index: number, newStatus: VerificationStatus) => {
    if (!record) return;
    const updatedFields = [...record.fields];
    updatedFields[index] = { ...updatedFields[index], verification_status: newStatus };
    setRecord({ ...record, fields: updatedFields });
  };

  const handleSaveUpdates = async () => {
    if (!record) return;
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await api.updateRecord(record.id, {
        title: record.title,
        record_type: record.record_type,
        cleaned_summary: record.cleaned_summary,
        verification_status: record.verification_status,
        audio_summary_base64: record.audio_summary_base64,
        fields: record.fields.map((f) => ({
          field_name: f.field_name,
          original_value: f.original_value,
          current_value: f.current_value,
          evidence_type: f.evidence_type,
          is_edited: f.is_edited ?? false,
          verification_status: f.verification_status,
          notes: f.notes,
          evidence: f.evidence,
        })),
        action_items: record.action_items.map((a) => ({
          description: a.description,
          assignee: a.assignee,
          deadline: a.deadline,
          status: a.status,
        })),
      });

      setRecord(updated);
      setSuccessMessage('Record and evidence updates saved successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update record.');
    } finally {
      setIsSaving(false);
    }
  };

  // Convert transcript text into segments if not stored in segments table
  const deriveSegments = (text: string) => {
    if (!text) return [];
    const rawMatches = text.split(/(?<=[.?!।\n]+)/);
    let charOffset = 0;
    return rawMatches.filter((s) => s.trim().length > 0).map((t, idx) => {
      const clean = t.trim();
      const start = text.indexOf(clean, charOffset);
      const end = start + clean.length;
      charOffset = end;
      return {
        id: idx,
        text: clean,
        start_char: start,
        end_char: end,
      };
    });
  };

  const segments = record ? deriveSegments(record.original_transcript) : [];

  const handleFieldSelect = (field: ExtractedField) => {
    setActiveFieldId(field.id || field.field_name);
    if (field.evidence?.start_char != null && field.evidence?.end_char != null) {
      setActiveCharRange({ start: field.evidence.start_char, end: field.evidence.end_char });
      setActiveSegmentId(field.evidence.segment_index ?? null);
    } else {
      setActiveCharRange(null);
      setActiveSegmentId(null);
    }
  };

  const handleSegmentClick = (segment: any) => {
    setActiveSegmentId(segment.id);
    setActiveCharRange({ start: segment.start_char, end: segment.end_char });

    const match = record?.fields.find(
      (f) =>
        f.evidence?.segment_index === segment.id ||
        (f.evidence?.start_char != null &&
          f.evidence.start_char >= segment.start_char &&
          f.evidence.start_char < segment.end_char)
    );
    setActiveFieldId(match ? match.id || match.field_name : null);
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message="Loading record details..." />;
  }

  if (!record) {
    return (
      <div>
        <ErrorAlert message={errorMessage || 'Record not found.'} />
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Records
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Back to Records
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <a
            href={api.getExportUrl(record.id, 'xlsx')}
            download
            className="btn btn-secondary btn-sm"
            style={{ borderColor: 'var(--accent-wine)', color: 'var(--color-white)' }}
            title="Download formatted Excel workbook"
          >
            <Download size={13} /> Excel (.xlsx)
          </a>
          <a
            href={api.getExportUrl(record.id, 'csv')}
            download
            className="btn btn-secondary btn-sm"
            title="Download UTF-8 CSV"
          >
            <Download size={13} /> CSV
          </a>
          <a
            href={api.getExportUrl(record.id, 'json')}
            download
            className="btn btn-secondary btn-sm"
          >
            <Download size={13} /> JSON
          </a>
          <button
            onClick={handleSaveUpdates}
            className="btn btn-primary btn-sm"
            disabled={isSaving}
          >
            <Save size={13} /> Save Changes
          </button>
        </div>
      </div>

      <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />

      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Title & Metadata Header */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ flex: '1 1 300px' }}>
            <span style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              color: 'var(--accent-crimson)',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              {record.record_type.replace(/_/g, ' ')}
            </span>
            <input
              type="text"
              value={record.title}
              onChange={(e) => setRecord({ ...record, title: e.target.value })}
              className="form-control"
              style={{ fontSize: '18px', fontWeight: 700, marginTop: '6px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Status:</div>
              <select
                value={record.verification_status}
                onChange={(e) => setRecord({ ...record, verification_status: e.target.value as VerificationStatus })}
                className="form-control"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              >
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
                <option value="needs_review">Needs Review</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Panel Workspace */}
      <div className="workspace-grid">
        <div className="card">
          <TranscriptViewer
            transcript={record.original_transcript}
            segments={segments}
            detectedLanguage={record.language_code || 'indic-auto'}
            activeSegmentId={activeSegmentId}
            activeCharRange={activeCharRange}
            onSegmentClick={handleSegmentClick}
          />
        </div>

        <div className="card">
          <ExtractionPanel
            summary={record.cleaned_summary || ''}
            fields={record.fields}
            actionItems={record.action_items}
            uncertainFields={[]}
            activeFieldId={activeFieldId}
            onFieldSelect={handleFieldSelect}
            onFieldUpdate={handleFieldUpdate}
            onFieldVerify={handleFieldVerify}
          />

          <VerificationControls
            summaryText={record.cleaned_summary || ''}
            onSaveRecord={handleSaveUpdates}
            isSaving={isSaving}
            savedRecordId={record.id}
            onAudioSummaryGenerated={(b64) => setRecord({ ...record, audio_summary_base64: b64 })}
            existingAudioSummary={record.audio_summary_base64}
          />
        </div>
      </div>
    </div>
  );
};
