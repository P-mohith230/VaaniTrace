import React, { useState } from 'react';
import { Save, Volume2, Download, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface VerificationControlsProps {
  summaryText: string;
  onSaveRecord: () => Promise<void>;
  isSaving: boolean;
  savedRecordId?: string | null;
  onAudioSummaryGenerated?: (audioBase64: string) => void;
  existingAudioSummary?: string | null;
}

export const VerificationControls: React.FC<VerificationControlsProps> = ({
  summaryText,
  onSaveRecord,
  isSaving,
  savedRecordId,
  onAudioSummaryGenerated,
  existingAudioSummary,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<'Nalini' | 'Avinash'>('Nalini');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthError, setSynthError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioSummary || null);

  const handleGenerateSpokenSummary = async () => {
    if (!summaryText || summaryText.trim().length === 0) {
      setSynthError('Summary text is empty.');
      return;
    }

    setIsSynthesizing(true);
    setSynthError(null);

    try {
      const res = await api.synthesizeSpeech(summaryText, selectedVoice, 'en-IN', 1.0);
      setAudioUrl(res.audio_base64);
      if (onAudioSummaryGenerated) {
        onAudioSummaryGenerated(res.audio_base64);
      }
    } catch (err: any) {
      console.error('Spoken summary generation error:', err);
      setSynthError(err.message || 'Failed to synthesize speech with Gnani Timbre.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      marginTop: '24px',
    }}>
      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', marginBottom: '14px' }}>
        Record Finalization & Export
      </h4>

      {/* Spoken Summary Section (Timbre TTS) */}
      <div style={{
        background: 'var(--color-rich-black)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={16} color="var(--accent-crimson)" />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-white)' }}>Spoken Audio Summary (Gnani Timbre)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="form-control"
              style={{ width: 'auto', padding: '4px 10px', fontSize: '12px' }}
              disabled={isSynthesizing}
            >
              <option value="Nalini">Voice: Nalini (Female)</option>
              <option value="Avinash">Voice: Avinash (Male)</option>
            </select>

            <button
              type="button"
              onClick={handleGenerateSpokenSummary}
              className="btn btn-secondary btn-sm"
              disabled={isSynthesizing || !summaryText}
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw size={12} className="spin" /> Synthesizing...
                </>
              ) : (
                <>
                  <Volume2 size={12} /> Generate Voice Readout
                </>
              )}
            </button>
          </div>
        </div>

        {audioUrl ? (
          <div style={{ marginTop: '10px' }}>
            <audio controls src={audioUrl} style={{ width: '100%', height: '36px' }} />
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Generate a high-fidelity synthetic voice briefing of this structured record via Gnani Timbre v2.5.
          </p>
        )}

        {synthError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-crimson)', fontSize: '12px', marginTop: '8px' }}>
            <AlertCircle size={14} />
            <span>{synthError}</span>
          </div>
        )}
      </div>

      {/* Persistence & Export Actions */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={onSaveRecord}
          className="btn btn-primary"
          disabled={isSaving}
          style={{ minWidth: '160px' }}
        >
          {isSaving ? (
            <>
              <RefreshCw size={16} className="spin" /> Saving...
            </>
          ) : (
            <>
              <Save size={16} /> Save Record
            </>
          )}
        </button>

        {savedRecordId && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a
              href={api.getExportUrl(savedRecordId, 'xlsx')}
              download
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'var(--accent-wine)', color: 'var(--color-white)' }}
              title="Download formatted Excel workbook"
            >
              <Download size={14} /> Excel (.xlsx)
            </a>
            <a
              href={api.getExportUrl(savedRecordId, 'tally')}
              download
              className="btn btn-secondary btn-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-soft-white)' }}
              title="Download TallyPrime / Tally ERP 9 XML Voucher"
            >
              <Download size={14} /> Tally XML
            </a>
            <a
              href={api.getExportUrl(savedRecordId, 'csv')}
              download
              className="btn btn-secondary btn-sm"
              title="Download UTF-8 CSV"
            >
              <Download size={14} /> CSV
            </a>
            <a
              href={api.getExportUrl(savedRecordId, 'json')}
              download
              className="btn btn-secondary btn-sm"
            >
              <Download size={14} /> JSON
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

