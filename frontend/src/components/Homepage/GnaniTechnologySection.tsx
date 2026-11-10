import React from 'react';
import { Cpu, Volume2, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

const ARCH_STEPS = [
  { id: '1', name: 'Audio Input', sub: 'WAV / MP3 / Mic' },
  { id: '2', name: 'Gnani Prisma v2.5', sub: 'Indic Telephony STT' },
  { id: '3', name: 'Segmented Transcript', sub: 'Clause Offsets' },
  { id: '4', name: 'Information Extraction', sub: 'Domain Schemas' },
  { id: '5', name: 'Evidence Mapping', sub: 'Audit Offsets' },
  { id: '6', name: 'Human Verification', sub: 'Operator Review' },
  { id: '7', name: 'Gnani Timbre v2.5', sub: 'Voice Synthesis' },
  { id: '8', name: 'Structured Record', sub: 'SQLite / JSON / CSV' },
];

export const GnaniTechnologySection: React.FC = () => {
  return (
    <section className="home-section" id="technology">
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
        <span className="section-tag">ENGINEERING INTEGRATION ARCHITECTURE</span>
        <h2 className="section-heading">
          Powered by Gnani AI Speech Intelligence.
        </h2>
        <p className="section-subheading" style={{ margin: '0 auto' }}>
          VaaniTrace orchestrates enterprise India-first speech AI models to bridge natural spoken dialogue with high-integrity database persistence.
        </p>
      </div>

      {/* Dual Technology Spotlight Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px',
        marginBottom: '54px',
      }}>
        {/* Gnani Prisma Card */}
        <div style={{
          background: 'var(--color-charcoal)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-graphite)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '20px',
          }}>
            <Cpu size={24} color="var(--accent-crimson)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-crimson)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              SPEECH-TO-TEXT ENGINE
            </span>
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
            Gnani Prisma v2.5
          </h3>

          <p style={{ fontSize: '14px', color: 'var(--color-muted-grey)', lineHeight: 1.65, marginBottom: '20px' }}>
            Engineered specifically for telephony-grade audio (8kHz PSTN/VoIP) and noisy field environments. Prisma handles complex Indian accents, regional phonetics, and code-mixed Indian-English conversations without acoustic breakdown.
          </p>

          <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '13px', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>• <strong>Automatic Language Identification (Auto-LID):</strong> Detects spoken languages dynamically.</li>
            <li>• <strong>Telephony Optimized:</strong> Native support for 8kHz / 16kHz PSTN and VoIP streams.</li>
            <li>• <strong>Inverse Text Normalization:</strong> Formats currency, dates, and numbers accurately.</li>
          </ul>
        </div>

        {/* Gnani Timbre Card */}
        <div style={{
          background: 'var(--color-charcoal)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-graphite)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '20px',
          }}>
            <Volume2 size={24} color="var(--accent-crimson)" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-crimson)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              TEXT-TO-SPEECH SYNTHESIS
            </span>
          </div>

          <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
            Gnani Timbre v2.5
          </h3>

          <p style={{ fontSize: '14px', color: 'var(--color-muted-grey)', lineHeight: 1.65, marginBottom: '20px' }}>
            Low-latency text-to-speech synthesis generating natural-sounding, expressive spoken briefings. Delivers spoken summary confirmations back to operators, drivers, and field workers in their native regional cadence.
          </p>

          <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '13px', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>• <strong>Multi-Voice Catalog:</strong> Natural voices including <em>Nalini</em> (Female) and <em>Avinash</em> (Male).</li>
            <li>• <strong>Regional Cadence:</strong> Preserves natural intonation and rhythmic cadence across Indian languages.</li>
            <li>• <strong>Instant Audio Playback:</strong> Delivers raw WAV binary and streaming data URIs for immediate browser playback.</li>
          </ul>
        </div>
      </div>

      {/* Monochromatic Technical Pipeline Diagram */}
      <div style={{
        background: 'var(--color-rich-black)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 28px',
        overflowX: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted-grey)' }}>
            System Architecture & Data Flow Pipeline
          </span>
          <span className="badge badge-verified">Single Server • FastAPI + SQLite</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: '980px',
          padding: '10px 0',
        }}>
          {ARCH_STEPS.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div style={{
                flex: 1,
                background: s.id === '2' || s.id === '7' ? 'rgba(74, 16, 27, 0.5)' : 'var(--color-charcoal)',
                border: `1px solid ${s.id === '2' || s.id === '7' ? 'var(--accent-wine)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px 14px',
                textAlign: 'center',
                boxShadow: s.id === '2' || s.id === '7' ? '0 0 16px var(--accent-wine-glow)' : 'none',
              }}>
                <span style={{ fontSize: '10px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  0{s.id}
                </span>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '4px', lineHeight: 1.3 }}>
                  {s.name}
                </p>
                <span style={{ fontSize: '11px', color: 'var(--color-muted-grey)', marginTop: '4px', display: 'block' }}>
                  {s.sub}
                </span>
              </div>

              {idx < ARCH_STEPS.length - 1 && (
                <div style={{ color: 'var(--accent-wine)', flexShrink: 0 }}>
                  <ArrowRight size={16} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
