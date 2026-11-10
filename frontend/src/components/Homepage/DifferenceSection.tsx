import React from 'react';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const DifferenceSection: React.FC = () => {
  return (
    <section className="home-section" id="difference">
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 64px' }}>
        <span className="section-tag">ARCHITECTURAL PARADIGM SHIFT</span>
        <h2 className="section-heading">
          Not Another AI Transcription Tool.
        </h2>
        <p className="section-subheading" style={{ margin: '0 auto' }}>
          Traditional voice tools treat transcription as the final destination. VaaniTrace treats accurate transcription as merely step one of an auditable, evidence-backed action pipeline.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        alignItems: 'stretch',
      }}>
        {/* Ordinary Transcription Card */}
        <div style={{
          background: 'var(--color-rich-black)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-muted-grey)',
              marginBottom: '16px',
            }}>
              Conventional Workflow
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Standard Speech Transcription
            </h3>

            <p style={{ fontSize: '14px', color: 'var(--color-muted-grey)', lineHeight: 1.6, marginBottom: '28px' }}>
              Dumps raw words into large text files, leaving users to decipher what was agreed, who committed to what, and what numbers actually mean.
            </p>

            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'Audio converted into unformatted walls of text.',
                'Critical numbers, dates, and names remain unstructured.',
                'No mathematical verification or formula tracking.',
                'Manual copy-pasting required for ERPs or ledgers.',
                'Zero connection between summaries and supporting proof.',
              ].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#999' }}>
                  <XCircle size={16} color="#666" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '32px', padding: '16px', background: '#121212', borderRadius: 'var(--radius-sm)', border: '1px solid #222' }}>
            <span style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', letterSpacing: '0.05em' }}>End Result</span>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#ccc', marginTop: '4px' }}>
              Unstructured text blocks requiring hours of manual post-processing.
            </p>
          </div>
        </div>

        {/* VaaniTrace Workflow Card */}
        <div style={{
          background: 'linear-gradient(160deg, #181013 0%, #0d0608 100%)',
          border: '1px solid var(--accent-wine)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 12px 40px rgba(74, 16, 27, 0.25)',
          position: 'relative',
        }}>
          {/* Subtle burgundy corner indicator */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '20px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent-crimson)',
          }}>
            THE VAANITRACE STANDARD
          </div>

          <div>
            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              background: 'var(--accent-burgundy)',
              border: '1px solid var(--accent-wine)',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#fff',
              marginBottom: '16px',
            }}>
              Voice-To-Action Workflow
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
              Structured, Evidence-Linked Action
            </h3>

            <p style={{ fontSize: '14px', color: '#d9b3ba', lineHeight: 1.6, marginBottom: '28px' }}>
              Converts multilingual spoken audio into verified business facts where every quantity, total, and task points back to its supporting transcript phrase.
            </p>

            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                'High-fidelity telephony transcription powered by Gnani Prisma v2.5.',
                'Automatic extraction of dates, quantities, unit prices, and assignees.',
                'Transparent calculated totals with preserved formulas (e.g. 20 × ₹1,200).',
                'Character-accurate evidence linkage for every extracted data point.',
                'Human verification controls with audit preservation for manual edits.',
                'Optional natural spoken readout confirmation powered by Gnani Timbre.',
              ].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#f5f3f1' }}>
                  <CheckCircle2 size={16} color="var(--accent-crimson)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{
            marginTop: '32px',
            padding: '18px 20px',
            background: 'rgba(74, 16, 27, 0.45)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--accent-wine)',
          }}>
            <span style={{ fontSize: '11px', color: '#ff9da9', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              The Core Philosophy
            </span>
            <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
              "From spoken words to verified information."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
