import React, { useState } from 'react';
import { TranscriptSegment, ExtractedField } from '../types';
import { MessageSquare, Globe, Sparkles, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

interface TranscriptViewerProps {
  transcript: string;
  segments: TranscriptSegment[];
  fields?: ExtractedField[];
  detectedLanguage?: string;
  activeSegmentId?: number | null;
  activeCharRange?: { start: number; end: number } | null;
  activeFieldId?: string | null;
  onSegmentClick?: (segment: TranscriptSegment) => void;
  onFieldSelect?: (field: ExtractedField) => void;
}

interface EvidenceSpan {
  index: number;
  start: number;
  end: number;
  field: ExtractedField;
  text: string;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  segments,
  fields = [],
  detectedLanguage = 'indic-auto',
  activeSegmentId,
  activeCharRange,
  activeFieldId,
  onSegmentClick,
  onFieldSelect,
}) => {
  const [viewMode, setViewMode] = useState<'anchors' | 'segments'>('anchors');

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

  // 1. Collect all valid character evidence anchors from extracted fields
  const rawSpans: EvidenceSpan[] = [];
  fields.forEach((f) => {
    if (
      f.evidence &&
      f.evidence.start_char != null &&
      f.evidence.end_char != null &&
      f.evidence.start_char >= 0 &&
      f.evidence.end_char <= transcript.length &&
      f.evidence.start_char < f.evidence.end_char
    ) {
      rawSpans.push({
        index: 0,
        start: f.evidence.start_char,
        end: f.evidence.end_char,
        field: f,
        text: transcript.slice(f.evidence.start_char, f.evidence.end_char),
      });
    }
  });

  // Sort by start position
  rawSpans.sort((a, b) => a.start - b.start);

  // Assign sequential indices [01], [02], [03]... and deduplicate identical spans
  const anchors: EvidenceSpan[] = [];
  let anchorCounter = 1;
  let lastEnd = -1;

  rawSpans.forEach((span) => {
    // Avoid conflicting overlapping intervals in character slice rendering
    if (span.start >= lastEnd) {
      anchors.push({
        ...span,
        index: anchorCounter++,
      });
      lastEnd = span.end;
    }
  });

  // Check which anchor is currently active
  const activeAnchor = anchors.find((a) => {
    if (activeCharRange) {
      return a.start === activeCharRange.start && a.end === activeCharRange.end;
    }
    if (activeFieldId) {
      return a.field.id === activeFieldId || a.field.field_name === activeFieldId;
    }
    return false;
  });

  // 2. Build precision text fragments (non-anchored text vs anchored interactive tokens)
  const renderAnchorFragments = () => {
    if (anchors.length === 0) {
      return <span>“{transcript}”</span>;
    }

    const fragments: React.ReactNode[] = [];
    let currentIdx = 0;

    anchors.forEach((anchor) => {
      // Plain text before this anchor
      if (anchor.start > currentIdx) {
        fragments.push(
          <span key={`plain-${currentIdx}-${anchor.start}`} style={{ color: 'var(--color-soft-white)' }}>
            {transcript.slice(currentIdx, anchor.start)}
          </span>
        );
      }

      const isSelected = activeAnchor?.index === anchor.index;
      const indexTag = String(anchor.index).padStart(2, '0');

      fragments.push(
        <span
          key={`anchor-${anchor.index}-${anchor.start}`}
          onClick={() => onFieldSelect && onFieldSelect(anchor.field)}
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            whiteSpace: 'nowrap',
            background: isSelected ? 'var(--accent-wine)' : 'var(--color-charcoal)',
            border: `1px solid ${isSelected ? '#FFFFFF' : 'var(--color-border)'}`,
            borderBottom: isSelected ? '2px solid #FFFFFF' : '2px solid var(--accent-crimson)',
            boxShadow: isSelected ? '3px 3px 0px var(--color-black)' : 'none',
            padding: '2px 8px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            color: isSelected ? '#FFFFFF' : 'var(--color-white)',
            margin: '0 4px',
            borderRadius: '2px',
          }}
          title={`[${indexTag}] Spoken evidence for "${anchor.field.field_name.replace(/_/g, ' ')}" (Chars ${anchor.start}-${anchor.end})`}
        >
          <span style={{ fontWeight: 700 }}>{anchor.text}</span>
          <sup style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55em',
            verticalAlign: 'super',
            marginLeft: '4px',
            color: isSelected ? '#FFFFFF' : 'var(--accent-crimson)',
            fontWeight: 800,
          }}>
            [{indexTag}]
          </sup>
        </span>
      );

      currentIdx = anchor.end;
    });

    // Plain text trailing after last anchor
    if (currentIdx < transcript.length) {
      fragments.push(
        <span key={`plain-tail-${currentIdx}`} style={{ color: 'var(--color-soft-white)' }}>
          {transcript.slice(currentIdx)}
        </span>
      );
    }

    return fragments;
  };

  return (
    <div>
      {/* Top Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={16} color="var(--accent-crimson)" />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Acoustic Evidence Buffer
          </span>
          <span style={{
            background: 'var(--color-charcoal)',
            border: '1px solid var(--color-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '2px 8px',
            color: 'var(--accent-crimson)',
            fontWeight: 700,
          }}>
            {anchors.length} ANCHORS LOCKED
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-muted-grey)' }}>
            <Globe size={13} />
            <span>Language: <strong style={{ color: '#fff' }}>{detectedLanguage}</strong></span>
          </div>

          {/* Toggle View Mode */}
          <div style={{
            display: 'inline-flex',
            background: 'var(--color-charcoal)',
            border: '1px solid var(--color-border)',
            padding: '2px',
          }}>
            <button
              type="button"
              onClick={() => setViewMode('anchors')}
              style={{
                background: viewMode === 'anchors' ? 'var(--accent-wine)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '3px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              [0X] Evidence Anchors
            </button>
            <button
              type="button"
              onClick={() => setViewMode('segments')}
              style={{
                background: viewMode === 'segments' ? 'var(--accent-wine)' : 'transparent',
                color: '#fff',
                border: 'none',
                padding: '3px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Sentences ({segments.length})
            </button>
          </div>
        </div>
      </div>

      {/* The Editorial Brutalist Deconstructed Conversation Spread */}
      <div style={{
        background: 'var(--color-black)',
        border: '2px solid var(--color-white)',
        padding: 'clamp(20px, 3vw, 36px)',
        position: 'relative',
        boxShadow: '4px 4px 0px var(--accent-wine)',
      }}>
        {/* Top Header Label */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '14px',
          marginBottom: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--color-muted-grey)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={12} color="var(--accent-crimson)" />
            AUDIO TRANSCRIPT BUFFER [00:00 - 00:06]
          </span>
          <span style={{ color: 'var(--accent-crimson)', fontWeight: 700 }}>
            TAP FRAGMENTS TO TRACE DATA
          </span>
        </div>

        {/* The Spoken Sentence Display */}
        {viewMode === 'anchors' ? (
          <blockquote style={{
            margin: 0,
            fontSize: 'clamp(1.25rem, 2.2vw, 1.85rem)',
            fontWeight: 700,
            lineHeight: 1.85,
            color: 'var(--color-soft-white)',
            letterSpacing: '-0.015em',
          }}>
            “ {renderAnchorFragments()} ”
          </blockquote>
        ) : (
          <div className="transcript-box" style={{ border: 'none', background: 'transparent', padding: 0 }}>
            {segments.map((seg) => {
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
                  title={`Segment #${seg.id + 1} (${seg.start_char}-${seg.end_char})`}
                >
                  {seg.text}{' '}
                </span>
              );
            })}
          </div>
        )}

        {/* Active Anchor Footer Notification */}
        {activeAnchor && (
          <div style={{
            marginTop: '24px',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '14px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            gap: '10px',
            color: 'var(--color-muted-grey)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: 'var(--accent-wine)',
                color: '#fff',
                padding: '2px 8px',
                fontWeight: 800,
              }}>
                ANCHOR [{String(activeAnchor.index).padStart(2, '0')}] TRACED
              </span>
              <span>
                Field: <strong style={{ color: '#fff' }}>{activeAnchor.field.field_name}</strong>
              </span>
              <span>
                Current Value: <strong style={{ color: 'var(--accent-crimson)' }}>{activeAnchor.field.current_value}</strong>
              </span>
            </div>
            <div>
              <span style={{ color: '#fff' }}>Character Range: [{activeAnchor.start}–{activeAnchor.end}]</span>
            </div>
          </div>
        )}
      </div>

      {/* Helpful Citation Caption */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '12px',
        fontSize: '12px',
        color: 'var(--color-muted-grey)',
        fontFamily: 'var(--font-mono)',
      }}>
        <Sparkles size={13} color="var(--accent-crimson)" />
        <span>Every numbered badge [0X] represents a mathematical, zero-hallucination link to raw acoustic audio.</span>
      </div>
    </div>
  );
};
