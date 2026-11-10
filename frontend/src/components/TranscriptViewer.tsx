import React from 'react';
import { TranscriptSegment } from '../types';
import { MessageSquare, Globe, Sparkles } from 'lucide-react';

interface TranscriptViewerProps {
  transcript: string;
  segments: TranscriptSegment[];
  detectedLanguage?: string;
  activeSegmentId?: number | null;
  activeCharRange?: { start: number; end: number } | null;
  onSegmentClick?: (segment: TranscriptSegment) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  segments,
  detectedLanguage = 'indic-auto',
  activeSegmentId,
  activeCharRange,
  onSegmentClick,
}) => {
  if (!transcript || transcript.trim().length === 0) {
    return (
      <div style={{
        background: '#0b1120',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '36px 20px',
        textAlign: 'center',
        color: 'var(--text-muted)',
      }}>
        <MessageSquare size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
        <p style={{ fontSize: '14px' }}>No transcript yet. Record audio or upload a sound file to transcribe.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Spoken Transcript</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({segments.length} segments)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <Globe size={13} />
          <span>Language: <strong>{detectedLanguage}</strong></span>
        </div>
      </div>

      <div className="transcript-box">
        {segments.length > 0 ? (
          segments.map((seg) => {
            const isActive = activeSegmentId === seg.id || (
              activeCharRange &&
              activeCharRange.start >= seg.start_char &&
              activeCharRange.start < seg.end_char
            );

            return (
              <span
                key={seg.id}
                onClick={() => onSegmentClick && onSegmentClick(seg)}
                className={`segment-span ${isActive ? 'active' : ''}`}
                title={`Segment #${seg.id + 1} (${seg.start_char}-${seg.end_char}) • Click to filter linked extractions`}
              >
                {seg.text}{' '}
              </span>
            );
          })
        ) : (
          <p>{transcript}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <Sparkles size={13} color="var(--accent-primary)" />
        <span>Click any sentence segment to pinpoint the extracted business facts linked to it.</span>
      </div>
    </div>
  );
};
