import React from 'react';
import { Cpu, Radio, Shield, Link, Info, KeyRound, Terminal } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const GnaniTechnologySection: React.FC = () => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      id="technology"
      ref={ref}
      className={`editorial-section ${isRevealed ? 'revealed' : ''}`}
      style={{
        background: 'var(--color-black)',
        borderBottom: '2px solid var(--color-border)',
      }}
    >
      <div className="swiss-grid">
        {/* Header */}
        <div className="col-12">
          <div className="editorial-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="editorial-stamp">SECTION [ 08 ]</span>
              <span>INFRASTRUCTURE ARCHITECTURE // GNANI AI SPEECH MODELS</span>
            </div>
            <div>
              <span>INTEGRATION SPEC: REST V2.5 / V3.0</span>
            </div>
          </div>
        </div>

        {/* Section Headline */}
        <div className="col-12" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
          <div style={{ maxWidth: '880px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-crimson)',
              display: 'block',
              marginBottom: '12px',
            }}>
              TECHNICAL SPECIFICATIONS //
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
              INDIAN SPEECH INTELLIGENCE MEETS ACTIONABLE STRUCTURE.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.1vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--color-muted-grey)',
              margin: 0,
            }}>
              Speech recognition models transcribe what was said. VaaniTrace builds the complete verifiable intelligence layer around them—extracting structured fields, validating numbers, and linking every fact back to its source.
            </p>
          </div>
        </div>

        {/* Three Asymmetric Columns */}
        <div className="col-4" style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'var(--color-charcoal)',
            border: '2px solid var(--color-border)',
            padding: '28px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="editorial-stamp">STT // ASR</span>
                <Radio size={16} color="var(--accent-crimson)" />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', margin: '0 0 10px' }}>
                GNANI PRISMA v2.5
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-crimson)', marginBottom: '14px' }}>
                SPEECH-TO-TEXT ENGINE
              </div>

              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-soft-white)', margin: 0 }}>
                High-accuracy acoustic models tailored for Indian English, Hindi, and regional Indic phonetics. Low-latency streaming ASR ensures conversations are captured accurately even amidst background mandi noise, vehicle horns, and multi-speaker interruptions.
              </p>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>
              ENDPOINT: /stt/v3 • PROTOCOL: HTTPS
            </div>
          </div>
        </div>

        <div className="col-4" style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'var(--color-charcoal)',
            border: '2px solid var(--color-border)',
            padding: '28px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="editorial-stamp">TTS // SYNTHESIS</span>
                <Cpu size={16} color="var(--accent-crimson)" />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', margin: '0 0 10px' }}>
                GNANI TIMBRE v2.5
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-crimson)', marginBottom: '14px' }}>
                TEXT-TO-SPEECH BRIEFING
              </div>

              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-soft-white)', margin: 0 }}>
                High-naturalness voice synthesis reproducing authentic Indian prosody and bilingual cadence. Generates spoken executive briefings of finalized records with voice options (Nalini / Avinash), subject to provider endpoint availability and beta credentials.
              </p>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>
              ENDPOINT: /api/v1/tts/inference • WAV
            </div>
          </div>
        </div>

        <div className="col-4" style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'var(--color-charcoal)',
            border: '2px solid var(--accent-wine)',
            boxShadow: '4px 4px 0px var(--accent-wine)',
            padding: '28px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="editorial-stamp wine">VAANITRACE // LAYER</span>
                <Shield size={16} color="#FFFFFF" />
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', margin: '0 0 10px' }}>
                THE ACTION LAYER
              </h3>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-white)', marginBottom: '14px' }}>
                STRUCTURE + PROVENANCE + AUDIT
              </div>

              <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-soft-white)', margin: 0 }}>
                Raw transcripts cannot order products or file incidents. VaaniTrace layers on domain schemas, extracts quantities, derives mathematical totals, links character-level evidence, and provides an operator verification workbench with SQLite export.
              </p>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-white)' }}>
              ZERO EXPOSURE: 100% BACKEND KEY ISOLATION
            </div>
          </div>
        </div>

        {/* Builder Notice & Independence Disclaimer (Full 12 cols) */}
        <div className="col-12">
          <div style={{
            background: 'var(--color-rich-black)',
            border: '1px solid var(--color-border)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-muted-grey)',
            lineHeight: 1.5,
          }}>
            <Info size={16} color="var(--color-white)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--color-white)' }}>INDEPENDENT INTEGRATION NOTICE:</strong> VaaniTrace is an independently developed application engineered around the Gnani AI developer API ecosystem. VaaniTrace is not officially endorsed, sponsored, or certified by Gnani AI.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
