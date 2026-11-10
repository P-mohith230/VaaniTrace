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
        background: 'var(--color-rich-black)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: '48px 24px',
        textAlign: 'center',
        color: 'var(--color-muted-grey)',
      }}>
        <MessageSquare size={36} style={{ margin: '0 auto 14px', opacity: 0.4 }} />
        <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '6px' }}>No Transcript Loaded</h4>
        <p style={{ fontSize: '13px' }}>Record audio, upload a file, or click a demo scenario to inspect spoken words.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="var(--accent-crimson)" />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Spoken Transcript</span>
          <span style={{ fontSize: '12px', color: 'var(--color-muted-grey)' }}>({segments.length} segments)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-muted-grey)' }}>
          <Globe size={13} />
          <span>Language: <strong style={{ color: '#fff' }}>{detectedLanguage}</strong></span>
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
                title={`Segment #${seg.id + 1} (${seg.start_char}-${seg.end_char}) • Click to highlight linked facts`}
              >
                {seg.text}{' '}
              </span>
            );
          })
        ) : (
          <p>{transcript}</p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '12px', color: 'var(--color-muted-grey)' }}>
        <Sparkles size={13} color="var(--accent-crimson)" />
        <span>Click any sentence segment above to filter and illuminate its extracted business facts.</span>
      </div>
    </div>
  );
};
