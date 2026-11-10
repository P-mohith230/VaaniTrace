import React, { useState } from 'react';
import {
  TranscriptSegment,
  ExtractedField,
  ActionItem,
  UncertainField,
  VerificationStatus,
} from '../types';
import { api } from '../services/api';
import { AudioUploader } from '../components/AudioUploader';
import { AudioRecorder } from '../components/AudioRecorder';
import { TranscriptViewer } from '../components/TranscriptViewer';
import { ExtractionPanel } from '../components/ExtractionPanel';
import { VerificationControls } from '../components/VerificationControls';
import { ErrorAlert } from '../components/ErrorAlert';
import { LoadingOverlay } from '../components/LoadingOverlay';
import {
  Mic,
  Upload,
  Sparkles,
  FileText,
  CheckCircle,
  HelpCircle,
  Languages,
} from 'lucide-react';

const INDIAN_LANGUAGES = [
  { code: 'indic-auto', label: 'Indic Auto-Detect (Auto-LID)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'hi-IN', label: 'Hindi (हिन्दी)' },
  { code: 'ta-IN', label: 'Tamil (தமிழ்)' },
  { code: 'te-IN', label: 'Telugu (తెలుగు)' },
  { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)' },
  { code: 'mr-IN', label: 'Marathi (मराठी)' },
  { code: 'bn-IN', label: 'Bengali (বাংলা)' },
  { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)' },
  { code: 'pa-IN', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ml-IN', label: 'Malayalam (മലയാളം)' },
];

const RECORD_TYPES = [
  { id: 'business_order', label: 'Business Order (B2B / Wholesale)' },
  { id: 'meeting_action_items', label: 'Meeting Action Items & Decisions' },
  { id: 'field_report', label: 'Field Inspection & Incident Report' },
  { id: 'customer_complaint', label: 'Customer Grievance & Escalation' },
  { id: 'general_conversation', label: 'General Conversation' },
];

const DEMO_SAMPLES = [
  {
    id: 'sample_order',
    title: 'B2B Medical Wholesale Order',
    record_type: 'business_order',
    language: 'en-IN',
    label: 'Demo 1: Wholesale Medical Order (English)',
    transcript: 'Hello Rajesh, this is Suresh speaking. I need 20 boxes of surgical gloves at 1200 rupees each. Please deliver them by Friday to our central warehouse.',
  },
  {
    id: 'sample_meeting',
    title: 'Weekly Engineering Sprint Sync',
    record_type: 'meeting_action_items',
    language: 'en-IN',
    label: 'Demo 2: Meeting Tasks & Deadlines (English)',
    transcript: 'In today\'s sync, Priya will prepare the slide deck by Friday. Rahul to review the client contract. Ankit will deploy the security patch before EOD.',
  },
  {
    id: 'sample_field',
    title: 'Site Inspection - Sector 4 Solar Facility',
    record_type: 'field_report',
    language: 'en-IN',
    label: 'Demo 3: Site Inspection Debrief (English)',
    transcript: 'Site inspection at Warehouse 4 completed. We identified a critical water leakage in the northern corridor near Inverter B. Immediate repair is required.',
  },
  {
    id: 'sample_complaint',
    title: 'Enterprise Fiber Outage Grievance',
    record_type: 'customer_complaint',
    language: 'en-IN',
    label: 'Demo 4: Customer Grievance & Escalation (English)',
    transcript: 'This is urgent! My broadband service has been disconnected since yesterday and no one is responding to my tickets. We are losing business operations.',
  },
  {
    id: 'sample_hindi',
    title: 'हिंदी व्यापार आदेश (Hindi Wholesale Order)',
    record_type: 'business_order',
    language: 'hi-IN',
    label: 'Demo 5: आम का थोक व्यापार (Hindi)',
    transcript: 'नमस्ते रमेश भाई। मुझे 50 कार्टन आम चाहिए। 600 रुपये प्रति कार्टन का भाव तय हुआ था। कल शाम तक दुकान पर भेज देना।',
  },
];

export const Workspace: React.FC = () => {
  // Capture State
  const [captureMode, setCaptureMode] = useState<'upload' | 'record'>('upload');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('indic-auto');
  const [selectedRecordType, setSelectedRecordType] = useState<string>('business_order');

  // Processing State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Results State
  const [sessionTitle, setSessionTitle] = useState<string>('New Voice Session');
  const [transcript, setTranscript] = useState<string>('');
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string>('indic-auto');
  const [summary, setSummary] = useState<string>('');
  const [fields, setFields] = useState<ExtractedField[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [uncertainFields, setUncertainFields] = useState<UncertainField[]>([]);
  const [savedRecordId, setSavedRecordId] = useState<string | null>(null);
  const [audioSummaryBase64, setAudioSummaryBase64] = useState<string | null>(null);
  const [overallVerification, setOverallVerification] = useState<VerificationStatus>('unverified');

  // Interactive Cross-Highlighting State
  const [activeSegmentId, setActiveSegmentId] = useState<number | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [activeCharRange, setActiveCharRange] = useState<{ start: number; end: number } | null>(null);

  // Handle Audio Ready
  const handleAudioSelected = (file: File) => {
    setAudioFile(file);
    setErrorMessage(null);
  };

  // Handle Demo Scenario Loading
  const handleLoadDemo = async (demoId: string) => {
    const demo = DEMO_SAMPLES.find((d) => d.id === demoId);
    if (!demo) return;

    setIsLoading(true);
    setLoadingMessage(`Extracting structured intelligence from ${demo.title}...`);
    setErrorMessage(null);
    setSuccessMessage(null);
    setSavedRecordId(null);
    setSelectedRecordType(demo.record_type);
    setSelectedLanguage(demo.language);
    setDetectedLanguage(demo.language);
    setSessionTitle(demo.title);
    setTranscript(demo.transcript);

    try {
      const extractRes = await api.extractInformation(demo.transcript, demo.record_type);
      setSummary(extractRes.summary || '');
      setFields(extractRes.fields || []);
      setActionItems(extractRes.action_items || []);
      setUncertainFields(extractRes.uncertain_fields || []);

      // derive segments
      let charOffset = 0;
      const rawMatches = demo.transcript.split(/(?<=[.?!।\n]+)/);
      const segs = rawMatches.filter((s) => s.trim().length > 0).map((t, idx) => {
        const clean = t.trim();
        const start = demo.transcript.indexOf(clean, charOffset);
        const end = start + clean.length;
        charOffset = end;
        return {
          id: idx,
          text: clean,
          start_char: start,
          end_char: end,
        };
      });
      setSegments(segs);
      setSuccessMessage(`Loaded "${demo.title}". Structured fields, calculations, and evidence mapping are ready.`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to extract demo scenario.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run Transcription & Structured Extraction
  const handleProcessAudio = async () => {
    if (!audioFile) {
      setErrorMessage('Please select or record audio first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setSavedRecordId(null);

    try {
      // 1. Transcribe with Gnani Prisma
      setLoadingMessage('Transcribing speech with Gnani Prisma...');
      const transcribeRes = await api.transcribeAudio(
        audioFile,
        audioFile.name,
        selectedLanguage
      );

      const rawTranscript = transcribeRes.transcript || '';
      const rawSegments = transcribeRes.segments || [];

      setTranscript(rawTranscript);
      setSegments(rawSegments);
      setDetectedLanguage(transcribeRes.detected_language || selectedLanguage);

      if (!rawTranscript.trim()) {
        setErrorMessage('The audio produced an empty transcript. Please check your recording volume.');
        setIsLoading(false);
        return;
      }

      // 2. Structured Extraction & Evidence Mapping
      setLoadingMessage('Extracting structured information & linking evidence...');
      const extractRes = await api.extractInformation(
        rawTranscript,
        selectedRecordType,
        rawSegments
      );

      setSummary(extractRes.summary || '');
      setFields(extractRes.fields || []);
      setActionItems(extractRes.action_items || []);
      setUncertainFields(extractRes.uncertain_fields || []);

      // Auto-generate a title from record type and content
      const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const typeLabel = RECORD_TYPES.find((r) => r.id === selectedRecordType)?.label.split('(')[0].trim() || 'Session';
      setSessionTitle(`${typeLabel} - ${dateStr}`);

      setSuccessMessage('Speech transcribed and structured intelligence extracted successfully.');
    } catch (err: any) {
      console.error('Processing workflow error:', err);
      setErrorMessage(err.message || 'An error occurred during audio processing.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cross-Highlighting: Clicking an extracted field
  const handleFieldSelect = (field: ExtractedField) => {
    setActiveFieldId(field.id || field.field_name);
    if (field.evidence && field.evidence.start_char != null && field.evidence.end_char != null) {
      setActiveCharRange({ start: field.evidence.start_char, end: field.evidence.end_char });
      setActiveSegmentId(field.evidence.segment_index ?? null);
    } else {
      setActiveCharRange(null);
      setActiveSegmentId(null);
    }
  };

  // Cross-Highlighting: Clicking a transcript segment
  const handleSegmentClick = (segment: TranscriptSegment) => {
    setActiveSegmentId(segment.id);
    setActiveCharRange({ start: segment.start_char, end: segment.end_char });

    // Find any field whose evidence matches this segment
    const matchingField = fields.find(
      (f) =>
        f.evidence?.segment_index === segment.id ||
        (f.evidence?.start_char != null &&
          f.evidence.start_char >= segment.start_char &&
          f.evidence.start_char < segment.end_char)
    );

    if (matchingField) {
      setActiveFieldId(matchingField.id || matchingField.field_name);
    } else {
      setActiveFieldId(null);
    }
  };

  // Field Edit Handler
  const handleFieldUpdate = (index: number, updated: ExtractedField) => {
    const updatedFields = [...fields];
    updatedFields[index] = updated;
    setFields(updatedFields);
  };

  // Field Verification Handler
  const handleFieldVerify = (index: number, newStatus: VerificationStatus) => {
    const updatedFields = [...fields];
    updatedFields[index] = {
      ...updatedFields[index],
      verification_status: newStatus,
    };
    setFields(updatedFields);
  };

  // Save Record to SQLite
  const handleSaveRecord = async () => {
    if (!transcript) {
      setErrorMessage('Cannot save an empty session.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Persisting record and evidence to database...');
    setErrorMessage(null);

    const payload = {
      title: sessionTitle,
      record_type: selectedRecordType,
      original_transcript: transcript,
      cleaned_summary: summary,
      language_code: detectedLanguage,
      verification_status: overallVerification,
      audio_summary_base64: audioSummaryBase64,
      fields: fields.map((f) => ({
        field_name: f.field_name,
        original_value: f.original_value,
        current_value: f.current_value,
        evidence_type: f.evidence_type,
        is_edited: f.is_edited ?? false,
        verification_status: f.verification_status,
        notes: f.notes,
        evidence: f.evidence,
      })),
      action_items: actionItems.map((a) => ({
        description: a.description,
        assignee: a.assignee,
        deadline: a.deadline,
        status: a.status,
      })),
    };

    try {
      let saved;
      if (savedRecordId) {
        saved = await api.updateRecord(savedRecordId, payload);
      } else {
        saved = await api.createRecord(payload);
      }
      setSavedRecordId(saved.id);
      setSuccessMessage(`Record successfully saved to database (ID: ${saved.id.slice(0, 8)})`);
    } catch (err: any) {
      console.error('Save record error:', err);
      setErrorMessage(err.message || 'Failed to save record to database.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <LoadingOverlay isLoading={isLoading} message={loadingMessage} />

      {/* Top Configuration & Audio Input Card */}
      <div className="card">
        <h3 className="card-title">
          <Mic size={20} color="var(--accent-wine)" />
          <span>New Voice-to-Action Session</span>
        </h3>
        <p className="card-subtitle">
          Record audio from your browser microphone or upload pre-recorded calls to convert spoken dialogue into structured records.
        </p>

        <ErrorAlert message={errorMessage} onDismiss={() => setErrorMessage(null)} />

        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Quick Demo Preloads */}
        <div style={{
          background: 'var(--accent-burgundy-subtle)',
          border: '1px solid var(--accent-wine)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-crimson)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-white)' }}>Try Sample Conversational Scenarios:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DEMO_SAMPLES.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleLoadDemo(demo.id)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '12px', padding: '4px 10px' }}
                disabled={isLoading}
              >
                {demo.id === 'sample_order' && 'Wholesale Order'}
                {demo.id === 'sample_meeting' && 'Sprint Sync'}
                {demo.id === 'sample_field' && 'Site Inspection'}
                {demo.id === 'sample_complaint' && 'Customer Grievance'}
                {demo.id === 'sample_hindi' && 'हिंदी आदेश'}
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode Selector */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            className={`btn ${captureMode === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCaptureMode('upload')}
          >
            <Upload size={16} /> File Upload
          </button>
          <button
            type="button"
            className={`btn ${captureMode === 'record' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setCaptureMode('record')}
          >
            <Mic size={16} /> Live Microphone
          </button>
        </div>

        {/* Capture Control */}
        {captureMode === 'upload' ? (
          <AudioUploader
            onAudioSelected={handleAudioSelected}
            selectedFile={audioFile}
            onClear={() => setAudioFile(null)}
            disabled={isLoading}
          />
        ) : (
          <AudioRecorder
            onRecordingComplete={handleAudioSelected}
            disabled={isLoading}
          />
        )}

        {/* Parameters Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Languages size={14} /> Spoken Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="form-control"
              disabled={isLoading}
            >
              {INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} /> Extraction Domain Schema
            </label>
            <select
              value={selectedRecordType}
              onChange={(e) => setSelectedRecordType(e.target.value)}
              className="form-control"
              disabled={isLoading}
            >
              {RECORD_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Action */}
        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleProcessAudio}
            className="btn btn-primary"
            disabled={!audioFile || isLoading}
            style={{ padding: '12px 28px', fontSize: '15px' }}
          >
            <Sparkles size={18} />
            <span>Transcribe & Extract with Gnani AI</span>
          </button>
        </div>
      </div>

      {/* Main Two-Panel Workspace Grid */}
      {transcript && (
        <div style={{ marginTop: '28px' }}>
          {/* Session Title Bar */}
          <div style={{
            background: 'var(--color-charcoal)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Record Title
              </label>
              <input
                type="text"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                className="form-control"
                style={{ fontSize: '16px', fontWeight: 600, padding: '6px 10px', marginTop: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Verification Status:</span>
              <select
                value={overallVerification}
                onChange={(e) => setOverallVerification(e.target.value as VerificationStatus)}
                className="form-control"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
              >
                <option value="unverified">Unverified</option>
                <option value="verified">Verified</option>
                <option value="needs_review">Needs Review</option>
              </select>
            </div>
          </div>

          <div className="workspace-grid">
            {/* Left Panel: Transcript & Evidence Alignment */}
            <div className="card">
              <TranscriptViewer
                transcript={transcript}
                segments={segments}
                detectedLanguage={detectedLanguage}
                activeSegmentId={activeSegmentId}
                activeCharRange={activeCharRange}
                onSegmentClick={handleSegmentClick}
              />
            </div>

            {/* Right Panel: Structured Extraction & Verification */}
            <div className="card">
              <ExtractionPanel
                summary={summary}
                fields={fields}
                actionItems={actionItems}
                uncertainFields={uncertainFields}
                activeFieldId={activeFieldId}
                onFieldSelect={handleFieldSelect}
                onFieldUpdate={handleFieldUpdate}
                onFieldVerify={handleFieldVerify}
              />

              <VerificationControls
                summaryText={summary}
                onSaveRecord={handleSaveRecord}
                isSaving={isLoading}
                savedRecordId={savedRecordId}
                onAudioSummaryGenerated={(b64) => setAudioSummaryBase64(b64)}
                existingAudioSummary={audioSummaryBase64}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
