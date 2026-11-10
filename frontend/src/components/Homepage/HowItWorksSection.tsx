import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Terminal, Cpu, FileSpreadsheet, Headphones } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const STAGES = [
  {
    num: '01',
    name: 'CAPTURE',
    tagline: 'Record or upload audio',
    detail: 'Direct in-browser microphone capture (16kHz PCM WebM) or drag-and-drop audio files (WAV, MP3, FLAC, M4A up to 25MB). Pre-flight magic byte inspection rejects invalid payloads.',
    spec: 'INPUT: RAW AUDIO STREAM',
    badge: 'MIC + UPLOAD',
  },
  {
    num: '02',
    name: 'TRANSCRIBE',
    tagline: 'Convert speech into text using Gnani Prisma v2.5',
    detail: 'Secure in-flight streaming to official Gnani Prisma v2.5 ASR gateway. Resilient against background mandi noise, street ambient, and Indian linguistic dialect variations.',
    spec: 'ENGINE: GNANI PRISMA V2.5',
    badge: 'STT PIPELINE',
  },
  {
    num: '03',
    name: 'UNDERSTAND',
    tagline: 'Extract structured information',
    detail: 'Syntactic and domain parsing extracts discrete commercial entities: counterparties, products, counts, unit prices, deadlines, and mathematical calculations without ungrounded hallucinations.',
    spec: 'SCHEMA: 5 DOMAIN EXTRACTORS',
    badge: 'ENTITY PARSER',
  },
  {
    num: '04',
    name: 'TRACE',
    tagline: 'Connect extracted fields to supporting transcript evidence',
    detail: 'Core differentiator: Every single extracted field binds directly to its exact transcript character boundary (start_char to end_char). Zero detached assertions.',
    spec: 'ALIGNMENT: CHAR-OFFSET LEVEL',
    badge: 'PROVENANCE BIND',
  },
  {
    num: '05',
    name: 'VERIFY',
    tagline: 'Allow users to review and correct extracted information',
    detail: 'Human-in-the-loop review interface. Operators can edit values in place, inspect arithmetic derivations, and toggle record verification status (verified, unverified, needs_review).',
    spec: 'AUDIT: DUAL HISTORICAL VALUES',
    badge: 'HUMAN-IN-LOOP',
  },
  {
    num: '06',
    name: 'EXPORT',
    tagline: 'Save or export verified information',
    detail: 'Permanent SQLite persistence with WAL mode. One-click export to structured UTF-8 JSON or tabular CSV, alongside optional high-naturalness audio briefings via Gnani Timbre v2.5.',
    spec: 'OUTPUT: JSON / CSV / TIMBRE TTS',
    badge: 'DATA PORTABILITY',
  },
];

export const HowItWorksSection: React.FC = () => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section
      id="how-it-works"
      ref={ref}
      className={`editorial-section ${isRevealed ? 'revealed' : ''}`}
      style={{
        background: 'var(--color-black)',
        borderBottom: '2px solid var(--color-border)',
      }}
    >
      <div className="swiss-grid">
        {/* Top Header */}
        <div className="col-12">
          <div className="editorial-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="editorial-stamp">SECTION [ 04 ]</span>
              <span>OPERATIONAL METHODOLOGY & SYSTEM ARCHITECTURE</span>
            </div>
            <div>
              <span>EXECUTION: 6 DETERMINISTIC STAGES</span>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="col-12" style={{ marginBottom: 'clamp(32px, 5vw, 64px)' }}>
          <div style={{ maxWidth: '820px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-crimson)',
              display: 'block',
              marginBottom: '12px',
            }}>
              PIPELINE ARCHITECTURE //
            </span>
            <h2 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.4rem, 4.8vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              margin: 0,
              marginBottom: '16px',
            }}>
              FROM SPOKEN AUDIO TO VERIFIED AUDIT RECORD.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.1vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--color-muted-grey)',
              margin: 0,
            }}>
              VaaniTrace does not treat speech as a black-box prompt. It runs a deterministic, 6-stage evidence pipeline where every step is auditable, editable, and preserved.
            </p>
          </div>
        </div>

        {/* Process Diagram: Asymmetric Interactive Grid */}
        <div className="col-12">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1px',
            background: 'var(--color-border)',
            border: '2px solid var(--color-border)',
          }}>
            {STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <div
                  key={stage.num}
                  onMouseEnter={() => setActiveStage(idx)}
                  onClick={() => setActiveStage(idx)}
                  style={{
                    background: isActive ? 'var(--color-rich-black)' : 'var(--color-charcoal)',
                    padding: 'clamp(24px, 3vw, 36px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '290px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Active Indicator Top Bar */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'var(--accent-wine)',
                    }} />
                  )}

                  <div>
                    {/* Stage Header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '18px',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(28px, 3.5vw, 42px)',
                        fontWeight: 900,
                        color: isActive ? 'var(--accent-crimson)' : 'var(--color-muted-grey)',
                        lineHeight: 1,
                      }}>
                        {stage.num}
                      </span>
                      <span className={`editorial-stamp ${isActive ? 'wine' : ''}`} style={{ fontSize: '10px' }}>
                        {stage.badge}
                      </span>
                    </div>

                    {/* Stage Name */}
                    <h3 style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '20px',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      textTransform: 'uppercase',
                      color: 'var(--color-white)',
                      margin: 0,
                      marginBottom: '6px',
                    }}>
                      {stage.name}
                    </h3>

                    {/* Tagline */}
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: isActive ? 'var(--color-white)' : 'var(--color-muted-grey)',
                      marginBottom: '16px',
                      fontWeight: 600,
                    }}>
                      {stage.tagline}
                    </div>

                    {/* Details */}
                    <p style={{
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: 'var(--color-soft-white)',
                      margin: 0,
                    }}>
                      {stage.detail}
                    </p>
                  </div>

                  {/* Spec Bar */}
                  <div style={{
                    marginTop: '24px',
                    paddingTop: '14px',
                    borderTop: '1px solid var(--color-border-subtle)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--color-muted-grey)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <span>{stage.spec}</span>
                    <ChevronRight size={13} color={isActive ? 'var(--accent-crimson)' : 'var(--color-muted-grey)'} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
