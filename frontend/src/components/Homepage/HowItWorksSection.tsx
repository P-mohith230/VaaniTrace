import React, { useState } from 'react';
import { Mic, Cpu, BrainCircuit, Link2, CheckSquare, Volume2, ArrowRight } from 'lucide-react';

const STAGES = [
  {
    step: '01',
    name: 'Capture',
    icon: <Mic size={22} />,
    title: 'Record or Ingest Audio',
    detail: 'Record high-clarity voice notes directly via browser microphone or upload pre-recorded telephony calls (WAV, MP3, OGG, WebM, FLAC).',
  },
  {
    step: '02',
    name: 'Transcribe',
    icon: <Cpu size={22} />,
    title: 'Gnani Prisma v2.5 Speech Recognition',
    detail: 'Enterprise speech-to-text tuned for Indian accents, regional telephony acoustics, and natural code-mixed vernacular (Hinglish, Kanglish).',
  },
  {
    step: '03',
    name: 'Understand',
    icon: <BrainCircuit size={22} />,
    title: 'Structured Information Extraction',
    detail: 'Intelligent schema engines identify products, quantities, dates, currency amounts, grievance severities, and assignees without hallucination.',
  },
  {
    step: '04',
    name: 'Trace',
    icon: <Link2 size={22} />,
    title: 'Verifiable Evidence Alignment',
    detail: 'Every extracted attribute connects with character offsets to its supporting transcript phrase. Calculations preserve formulas.',
  },
  {
    step: '05',
    name: 'Verify',
    icon: <CheckSquare size={22} />,
    title: 'Human Review & Verification',
    detail: 'Operators review facts, modify quantities if necessary, and approve. Manual edits preserve the original spoken extraction for auditability.',
  },
  {
    step: '06',
    name: 'Confirm',
    icon: <Volume2 size={22} />,
    title: 'Gnani Timbre Briefing & Export',
    detail: 'Generate a synthetic voice confirmation readout via Gnani Timbre v2.5 and export verified records instantly to clean JSON or CSV.',
  },
];

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section className="home-section" id="how-it-works">
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
        <span className="section-tag">SIX-STAGE END-TO-END PIPELINE</span>
        <h2 className="section-heading">
          From Voice to Verified Action.
        </h2>
        <p className="section-subheading" style={{ margin: '0 auto' }}>
          Every voice session traverses a deterministic, verifiable sequence from raw audio waveform to audit-ready structured action records.
        </p>
      </div>

      {/* Interactive Horizontal Track on Desktop / Vertical on Mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        position: 'relative',
      }}>
        {STAGES.map((stage, idx) => {
          const isSelected = activeStep === idx;
          return (
            <div
              key={stage.step}
              onClick={() => setActiveStep(idx)}
              style={{
                background: isSelected ? 'linear-gradient(160deg, #181013 0%, #12090b 100%)' : 'var(--color-charcoal)',
                border: `1px solid ${isSelected ? 'var(--accent-wine)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isSelected ? '0 12px 32px rgba(74, 16, 27, 0.3)' : 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Step indicator pill */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: isSelected ? 'var(--accent-crimson)' : 'var(--color-muted-grey)',
                  letterSpacing: '0.05em',
                }}>
                  PHASE {stage.step}
                </span>

                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--accent-burgundy)' : 'var(--color-graphite)',
                  border: `1px solid ${isSelected ? 'var(--accent-wine)' : '#333'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? '#fff' : 'var(--color-soft-white)',
                  transition: 'all 0.25s ease',
                }}>
                  {stage.icon}
                </div>
              </div>

              <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#fff', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                {stage.name}
              </h4>

              <p style={{ fontSize: '13px', fontWeight: 500, color: isSelected ? '#ffb3bd' : 'var(--color-soft-white)', marginBottom: '10px' }}>
                {stage.title}
              </p>

              <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)', lineHeight: 1.6 }}>
                {stage.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
