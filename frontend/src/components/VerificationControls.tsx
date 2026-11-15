import React, { useState, useEffect } from 'react';
import {
  Save,
  Volume2,
  Download,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Check,
  X,
  Edit3,
  Mic,
  MicOff,
  Sparkles,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { ExtractedField, UncertainField, VerificationStatus } from '../types';

interface VerificationControlsProps {
  summaryText: string;
  onSaveRecord: () => Promise<void>;
  isSaving: boolean;
  savedRecordId?: string | null;
  onAudioSummaryGenerated?: (audioBase64: string) => void;
  existingAudioSummary?: string | null;
  recordType?: string;
  fields?: ExtractedField[];
  uncertainFields?: UncertainField[];
  onFieldsUpdate?: (updatedFields: ExtractedField[]) => void;
  onSummaryUpdate?: (summary: string) => void;
  verificationStatus?: VerificationStatus;
  onStatusUpdate?: (status: VerificationStatus) => void;
  detectedLanguage?: string;
}

type ProtocolState = 'PENDING_READBACK' | 'AWAITING_CONFIRMATION' | 'COMMITTED' | 'REJECTED';

export const VerificationControls: React.FC<VerificationControlsProps> = ({
  summaryText,
  onSaveRecord,
  isSaving,
  savedRecordId,
  onAudioSummaryGenerated,
  existingAudioSummary,
  recordType = 'business_order',
  fields = [],
  uncertainFields = [],
  onFieldsUpdate,
  onSummaryUpdate,
  verificationStatus = 'unverified',
  onStatusUpdate,
  detectedLanguage = 'en-IN',
}) => {
  const [selectedVoice, setSelectedVoice] = useState<'Nalini' | 'Avinash'>('Nalini');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthError, setSynthError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioSummary || null);

  // Rank 3 Protocol State Machine
  const [protocolState, setProtocolState] = useState<ProtocolState>(() => {
    if (verificationStatus === 'verified') return 'COMMITTED';
    if (verificationStatus === 'rejected') return 'REJECTED';
    if (existingAudioSummary) return 'AWAITING_CONFIRMATION';
    return 'PENDING_READBACK';
  });

  const [confirmationScript, setConfirmationScript] = useState<string>('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [showCorrectionInput, setShowCorrectionInput] = useState(false);
  const [correctionText, setCorrectionText] = useState('');
  const [isApplyingCorrection, setIsApplyingCorrection] = useState(false);
  const [correctionFeedback, setCorrectionFeedback] = useState<string[]>([]);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const isCorrectingRef = React.useRef(false);

  // Sync protocol state if external status changes
  useEffect(() => {
    if (verificationStatus === 'verified') setProtocolState('COMMITTED');
    else if (verificationStatus === 'rejected') setProtocolState('REJECTED');
  }, [verificationStatus]);

  // Fetch or regenerate the auditable confirmation script when fields change
  useEffect(() => {
    let isCancelled = false;

    // Skip redundant fetch if we just set the new confirmation script directly from the amendment endpoint
    if (isCorrectingRef.current) {
      isCorrectingRef.current = false;
      return;
    }

    const fetchScript = async () => {
      if (fields.length === 0) {
        setConfirmationScript(summaryText || '');
        return;
      }

      setIsGeneratingScript(true);
      try {
        const res = await api.getConfirmationScript(
          recordType,
          fields,
          uncertainFields,
          detectedLanguage
        );
        if (!isCancelled && res.script_text) {
          setConfirmationScript(res.script_text);
        }
      } catch (err) {
        if (!isCancelled) {
          setConfirmationScript(summaryText || 'Please review and confirm this record.');
        }
      } finally {
        if (!isCancelled) setIsGeneratingScript(false);
      }
    };

    fetchScript();
    return () => {
      isCancelled = true;
    };
  }, [recordType, fields, uncertainFields, summaryText, detectedLanguage]);

  // Handle Speech Synthesis of the Confirmation Readout via Gnani Timbre
  const handleGenerateSpokenReadout = async () => {
    const textToSpeak = confirmationScript || summaryText;
    if (!textToSpeak || textToSpeak.trim().length === 0) {
      setSynthError('Confirmation script is empty.');
      return;
    }

    setIsSynthesizing(true);
    setSynthError(null);

    try {
      const res = await api.synthesizeSpeech(textToSpeak, selectedVoice, detectedLanguage, 1.0);
      setAudioUrl(res.audio_base64);
      if (onAudioSummaryGenerated) {
        onAudioSummaryGenerated(res.audio_base64);
      }
      setProtocolState('AWAITING_CONFIRMATION');
    } catch (err: any) {
      console.error('Spoken readout generation error:', err);
      setSynthError(err.message || 'Failed to synthesize speech with Gnani Timbre.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Protocol Action: Confirm & Commit
  const handleConfirmAndCommit = async () => {
    if (onStatusUpdate) {
      onStatusUpdate('verified');
    }
    setProtocolState('COMMITTED');
    try {
      await onSaveRecord();
    } catch (err) {
      console.error('Commit save error:', err);
    }
  };

  // Protocol Action: Reject & Void
  const handleReject = () => {
    if (onStatusUpdate) {
      onStatusUpdate('rejected');
    }
    setProtocolState('REJECTED');
  };

  // Protocol Action: Apply Verbal/Typed Corrective Amendment
  const handleApplyCorrection = async (textToApply?: string) => {
    const query = textToApply || correctionText;
    if (!query || query.trim().length === 0) return;

    setIsApplyingCorrection(true);
    setSynthError(null);
    isCorrectingRef.current = true;

    try {
      const res = await api.applyVoiceCorrection(query, fields, recordType);
      if (onFieldsUpdate && res.updated_fields) {
        onFieldsUpdate(res.updated_fields);
      }
      if (onSummaryUpdate && res.updated_summary) {
        onSummaryUpdate(res.updated_summary);
      }
      if (res.new_confirmation_script) {
        setConfirmationScript(res.new_confirmation_script);
      }
      setCorrectionFeedback(res.changes_applied || ['Amendment applied successfully.']);
      setCorrectionText('');
      setProtocolState('PENDING_READBACK');
      setAudioUrl(null); // Reset audio so new readout can be generated
    } catch (err: any) {
      isCorrectingRef.current = false;
      setSynthError(err.message || 'Failed to apply correction amendment.');
    } finally {
      setIsApplyingCorrection(false);
    }
  };

  // Optional Voice Input via Browser Web Speech API for voice correction
  const handleToggleVoiceCorrection = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API is not supported in this browser. Please type your correction below.');
      return;
    }

    if (isListeningMic) {
      setIsListeningMic(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = detectedLanguage === 'hi-IN' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListeningMic(true);
      recognition.onend = () => setIsListeningMic(false);
      recognition.onerror = () => setIsListeningMic(false);
      recognition.onresult = (event: any) => {
        const spoken = event.results[0][0].transcript;
        setCorrectionText(spoken);
        handleApplyCorrection(spoken);
      };

      recognition.start();
    } catch (e) {
      setIsListeningMic(false);
    }
  };

  return (
    <div style={{
      background: 'var(--color-rich-black)',
      border: '2px solid var(--color-white)',
      padding: 'clamp(16px, 2.5vw, 24px)',
      boxShadow: '4px 4px 0px var(--accent-wine)',
      marginTop: '24px',
      position: 'relative',
      boxSizing: 'border-box',
    }}>
      {/* Editorial Header Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '2px solid var(--color-border)',
        paddingBottom: '14px',
        marginBottom: '16px',
        gap: '12px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--accent-wine)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 7px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              🥉 RANK 3 INNOVATION // CLOSED-LOOP PROTOCOL
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
            }}>
              CONFIRM-BEFORE-COMMIT GATE
            </span>
          </div>

          <h3 style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            margin: 0,
            color: '#FFFFFF',
            lineHeight: 1.25,
          }}>
            Closed-Loop Voice Confirmation Protocol
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-muted-grey)',
            marginTop: '4px',
            margin: 0,
          }}>
            No transaction is committed merely because AI extracted it. Explicit spoken/tactile verification required before ERP ledger export.
          </p>
        </div>

        {/* Protocol State Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '2px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 800,
          background: protocolState === 'COMMITTED'
            ? 'rgba(92, 219, 149, 0.2)'
            : protocolState === 'REJECTED'
            ? 'rgba(235, 87, 87, 0.2)'
            : protocolState === 'AWAITING_CONFIRMATION'
            ? 'rgba(112, 165, 255, 0.2)'
            : 'rgba(255, 179, 0, 0.2)',
          color: protocolState === 'COMMITTED'
            ? '#5cdb95'
            : protocolState === 'REJECTED'
            ? 'var(--accent-crimson)'
            : protocolState === 'AWAITING_CONFIRMATION'
            ? '#70a5ff'
            : '#ffb300',
          border: `1px solid ${
            protocolState === 'COMMITTED'
              ? '#5cdb95'
              : protocolState === 'REJECTED'
              ? 'var(--accent-crimson)'
              : protocolState === 'AWAITING_CONFIRMATION'
              ? '#70a5ff'
              : '#ffb300'
          }`,
        }}>
          {protocolState === 'COMMITTED' && <Check size={13} />}
          {protocolState === 'REJECTED' && <X size={13} />}
          {protocolState === 'AWAITING_CONFIRMATION' && <Volume2 size={13} />}
          {protocolState === 'PENDING_READBACK' && <RefreshCw size={13} className={isGeneratingScript ? 'spin' : ''} />}
          <span>
            {protocolState === 'COMMITTED' && 'STATE: COMMITTED & AUDITED (LEDGER LOCKED)'}
            {protocolState === 'REJECTED' && 'STATE: REJECTED & VOIDED (ZERO ENTRIES)'}
            {protocolState === 'AWAITING_CONFIRMATION' && 'STATE: READOUT READY // AWAITING EXPLICIT USER CONSENT'}
            {protocolState === 'PENDING_READBACK' && 'STATE: PENDING CONFIRMATION READBACK'}
          </span>
        </div>
      </div>

      {/* Confirmation Script & Timbre Readback Console */}
      <div style={{
        background: 'var(--color-charcoal)',
        border: '1px solid var(--color-border)',
        padding: '16px',
        marginBottom: '16px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={15} color="var(--accent-crimson)" />
            <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#FFFFFF', textTransform: 'uppercase' }}>
              Auditable Spoken Readback (Gnani Timbre v2.5)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              className="form-control"
              style={{ width: 'auto', padding: '3px 8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
              disabled={isSynthesizing}
            >
              <option value="Nalini">Voice: Nalini (Female)</option>
              <option value="Avinash">Voice: Avinash (Male)</option>
            </select>

            <button
              type="button"
              onClick={handleGenerateSpokenReadout}
              className="btn btn-secondary btn-sm"
              disabled={isSynthesizing || !confirmationScript}
              style={{ fontSize: '11px', padding: '4px 10px', fontFamily: 'var(--font-mono)' }}
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw size={12} className="spin" /> Synthesizing Readout...
                </>
              ) : (
                <>
                  <Volume2 size={12} /> {audioUrl ? 'Regenerate Voice Readout' : 'Generate Voice Readout'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Readback Script Text Display */}
        {correctionFeedback.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#5cdb95',
            fontWeight: 700,
          }}>
            <Sparkles size={12} color="#5cdb95" />
            <span>UPDATED READBACK SCRIPT (AMENDED IN REAL-TIME):</span>
          </div>
        )}
        <div style={{
          background: 'var(--color-black)',
          border: `1px solid ${correctionFeedback.length > 0 ? '#5cdb95' : 'var(--color-border)'}`,
          padding: '12px',
          fontSize: '13px',
          lineHeight: 1.6,
          color: '#F0ECE1',
          fontStyle: 'italic',
          position: 'relative',
        }}>
          "{confirmationScript || 'Loading confirmation readback script...'}"
        </div>

        {/* Audio Player if generated */}
        {audioUrl && (
          <div style={{ marginTop: '12px' }}>
            <audio controls src={audioUrl} style={{ width: '100%', height: '34px' }} autoPlay={false} />
          </div>
        )}

        {synthError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-crimson)', fontSize: '12px', marginTop: '8px' }}>
            <AlertCircle size={14} />
            <span>{synthError}</span>
          </div>
        )}
      </div>

      {/* Amendments & Feedback Strip */}
      {correctionFeedback.length > 0 && (
        <div style={{
          background: 'rgba(92, 219, 149, 0.1)',
          border: '1px solid #5cdb95',
          padding: '10px 14px',
          marginBottom: '16px',
          fontSize: '12px',
          fontFamily: 'var(--font-mono)',
          color: '#5cdb95',
        }}>
          <strong>⚡ Delta Corrections Applied:</strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
            {correctionFeedback.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Voice / Text Correction Input Console */}
      {showCorrectionInput && (
        <div style={{
          background: 'var(--color-charcoal)',
          border: '1px dashed var(--accent-wine)',
          padding: '14px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-crimson)', textTransform: 'uppercase' }}>
              State Your Corrective Amendment (Voice or Text)
            </label>
            <button
              type="button"
              onClick={() => setShowCorrectionInput(false)}
              style={{ background: 'none', border: 'none', color: 'var(--color-muted-grey)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder="e.g. Actually make it 60 bori, or rate is 2100 rupees, or deliver by Monday"
              className="form-control"
              style={{ fontSize: '12px', flex: 1 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyCorrection();
              }}
              autoFocus
            />

            <button
              type="button"
              onClick={handleToggleVoiceCorrection}
              className={`btn ${isListeningMic ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              title="Speak correction via microphone"
            >
              {isListeningMic ? <MicOff size={13} /> : <Mic size={13} />}
              <span>{isListeningMic ? 'Listening...' : 'Voice Input'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyCorrection()}
              className="btn btn-primary btn-sm"
              disabled={isApplyingCorrection || !correctionText.trim()}
            >
              {isApplyingCorrection ? <RefreshCw size={12} className="spin" /> : <Check size={12} />}
              <span>Apply</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '10px', color: 'var(--color-muted-grey)', fontFamily: 'var(--font-mono)' }}>Quick samples:</span>
            {['Change quantity to 50 bori', 'Rate is 2200 per bag', 'Delivery on Monday'].map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCorrectionText(sample);
                  handleApplyCorrection(sample);
                }}
                style={{
                  background: 'var(--color-black)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-soft-white)',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 6px',
                  cursor: 'pointer',
                }}
              >
                + {sample}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Protocol Decision Action Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '16px',
      }}>
        {/* Left Side: Commit / Correct / Reject Action Triggers */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {protocolState !== 'COMMITTED' ? (
            <>
              {/* Primary Green Confirm & Commit */}
              <button
                type="button"
                onClick={handleConfirmAndCommit}
                className="btn btn-primary"
                disabled={isSaving}
                style={{
                  background: '#235937',
                  borderColor: '#5cdb95',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Explicit operator confirmation: commit record to database ledger"
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={14} className="spin" /> Committing...
                  </>
                ) : (
                  <>
                    <Lock size={14} color="#5cdb95" />
                    <span>✓ CONFIRM & COMMIT TRANSACTION</span>
                  </>
                )}
              </button>

              {/* Secondary Voice/Text Correction Button */}
              <button
                type="button"
                onClick={() => setShowCorrectionInput(!showCorrectionInput)}
                className="btn btn-secondary"
                style={{
                  borderColor: 'var(--accent-wine)',
                  color: 'var(--color-white)',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Provide voice or text amendments to update extracted facts"
              >
                <Edit3 size={13} color="var(--accent-crimson)" />
                <span>↺ Voice / Text Correction</span>
              </button>

              {/* Ghost Reject Button */}
              <button
                type="button"
                onClick={handleReject}
                className="btn btn-secondary"
                style={{
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-muted-grey)',
                  fontSize: '12px',
                }}
                title="Reject and void this transaction"
              >
                <X size={13} />
                <span>✕ Reject & Void</span>
              </button>
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#5cdb95',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 800,
            }}>
              <CheckCircle size={18} />
              <span>TRANSACTION COMMITTED & LOCKED TO LEDGER</span>
            </div>
          )}
        </div>

        {/* Right Side: Direct ERP Export Links (Unlocked when saved / committed) */}
        {savedRecordId && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-muted-grey)' }}>
              AUDITED EXPORTS:
            </span>
            <a
              href={api.getExportUrl(savedRecordId, 'tally')}
              download
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: '#5cdb95',
                color: '#5cdb95',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '4px 8px',
              }}
              title="Download TallyPrime / Tally ERP 9 XML Voucher"
            >
              <Download size={12} /> Tally XML
            </a>
            <a
              href={api.getExportUrl(savedRecordId, 'xlsx')}
              download
              className="btn btn-secondary btn-sm"
              style={{
                borderColor: 'var(--accent-wine)',
                color: 'var(--color-white)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                padding: '4px 8px',
              }}
              title="Download formatted Excel workbook"
            >
              <Download size={12} /> Excel (.xlsx)
            </a>
            <a
              href={api.getExportUrl(savedRecordId, 'csv')}
              download
              className="btn btn-secondary btn-sm"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '4px 8px' }}
            >
              <Download size={12} /> CSV
            </a>
          </div>
        )}
      </div>

      {/* Brutalist Footer Guarantee */}
      <div style={{
        marginTop: '14px',
        paddingTop: '10px',
        borderTop: '1px solid var(--color-border)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        color: 'var(--color-muted-grey)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <ShieldCheck size={12} color="var(--accent-crimson)" />
        <span>ZERO-UNCONFIRMED-COMMITMENTS GUARANTEE: In accordance with statutory Indian trade guidelines, no unconfirmed AI extraction is posted to production accounting without explicit operator sign-off.</span>
      </div>
    </div>
  );
};
