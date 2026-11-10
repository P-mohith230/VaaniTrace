import React, { useState, useEffect } from 'react';
import { ArrowRight, CornerDownRight, Activity, Terminal, ShieldCheck } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface HeroSectionProps {
  onExplore: () => void;
  onSeeHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onSeeHowItWorks }) => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });
  const [pulseCount, setPulseCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseCount((prev) => (prev + 1) % 24);
    }, 180);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={ref}
      className={`editorial-section ${isRevealed ? 'revealed' : ''}`}
      style={{
        paddingTop: 'clamp(40px, 6vw, 80px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
        background: 'var(--color-black)',
        borderBottom: '2px solid var(--color-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Kinetic Watermark */}
      <div
        className="watermark-kinetic"
        style={{
          top: '10%',
          right: '-2%',
          opacity: 0.45,
        }}
      >
        VOICE.
      </div>

      <div className="swiss-grid" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Editorial Index Row (Full 12 cols) */}
        <div className="col-12">
          <div className="editorial-header-row" style={{ marginBottom: 'clamp(28px, 4vw, 54px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="editorial-stamp wine">VT / 001</span>
              <span>SYS.SPEC: INDIC V2.5 // PROVENANCE VERIFIED</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ display: 'none', md: 'inline' } as any}>VOICE INTELLIGENCE / POWERED BY GNANI AI</span>
              <span className="editorial-stamp">EST. 2026 // BLR</span>
            </div>
          </div>
        </div>

        {/* Main Asymmetrical Left Area: 8 Columns */}
        <div className="col-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Small Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '12px', height: '12px', background: 'var(--accent-wine)', border: '1px solid #FFFFFF' }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-muted-grey)',
              }}>
                ARCHITECTURAL SPECIFICATION // SPEECH-TO-ACTION
              </span>
            </div>

            {/* Massive Display Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(3.4rem, 7.8vw, 8.4rem)',
                fontWeight: 900,
                lineHeight: 0.94,
                letterSpacing: '-0.045em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
                margin: 0,
                marginBottom: '36px',
              }}
            >
              <div className="word-reveal-wrap">
                <span className="word-reveal-inner" style={{ transitionDelay: '0.05s' }}>YOUR</span>
              </div>
              <div className="word-reveal-wrap">
                <span className="word-reveal-inner" style={{ color: 'var(--color-white)', transitionDelay: '0.12s' }}>
                  VOICE.
                </span>
              </div>
              <br />
              <div className="word-reveal-wrap">
                <span className="word-reveal-inner" style={{ transitionDelay: '0.2s' }}>MORE</span>
              </div>
              <div className="word-reveal-wrap">
                <span className="word-reveal-inner" style={{ transitionDelay: '0.28s' }}>THAN</span>
              </div>
              <br />
              <div className="word-reveal-wrap">
                <span
                  className="word-reveal-inner"
                  style={{
                    color: 'var(--color-white)',
                    borderBottom: '4px solid var(--accent-wine)',
                    paddingBottom: '2px',
                    transitionDelay: '0.36s',
                  }}
                >
                  WORDS.
                </span>
              </div>
            </h1>

            {/* Asymmetrical Supporting Statement */}
            <div style={{
              maxWidth: '620px',
              borderLeft: '2px solid var(--accent-wine)',
              paddingLeft: '20px',
              marginBottom: '44px',
            }}>
              <p style={{
                fontSize: 'clamp(16px, 1.3vw, 21px)',
                lineHeight: 1.5,
                color: 'var(--color-soft-white)',
                fontWeight: 500,
                margin: 0,
                marginBottom: '8px',
              }}>
                From spoken conversations to structured, verifiable action.
              </p>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-muted-grey)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: 0,
              }}>
                — Beyond Transcription. Into Action.
              </p>
            </div>
          </div>

          {/* Neo-Brutalist Tactile CTA Group */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onExplore}
              className="btn-brutalist-white"
            >
              <span>Explore The System</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={onSeeHowItWorks}
              className="btn-brutalist-ghost"
            >
              <span>See How It Works</span>
              <CornerDownRight size={15} color="var(--accent-crimson)" />
            </button>
          </div>
        </div>

        {/* Right Information Column: 4 Columns */}
        <div
          className="col-4"
          style={{
            borderLeft: '1px solid var(--color-border)',
            paddingLeft: 'clamp(16px, 2.5vw, 32px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '32px',
          }}
        >
          {/* Audio Waveform Kinetic Box */}
          <div style={{
            background: 'var(--color-rich-black)',
            border: '1px solid var(--color-border)',
            padding: '20px',
            position: 'relative',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-muted-grey)',
            }}>
              <span>SIGNAL INPUT // STREAM</span>
              <span style={{ color: 'var(--accent-crimson)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', background: 'var(--accent-crimson)', borderRadius: '0' }} />
                LIVE
              </span>
            </div>

            {/* 24-Bar Minimalist Brutalist Waveform */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '52px',
              gap: '2px',
              paddingBottom: '4px',
              borderBottom: '1px solid var(--color-border-subtle)',
            }}>
              {Array.from({ length: 24 }).map((_, idx) => {
                const heights = [12, 28, 44, 20, 36, 16, 48, 32, 24, 40, 18, 46, 26, 14, 38, 42, 22, 34, 16, 48, 30, 20, 14, 28];
                const active = (idx + pulseCount) % 24 < 8;
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${heights[idx]}px`,
                      background: active ? 'var(--accent-wine)' : 'var(--color-graphite)',
                      transition: 'background 0.2s ease, height 0.3s ease',
                    }}
                  />
                );
              })}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--color-muted-grey)',
            }}>
              <span>FORMAT: 16kHZ PCM</span>
              <span>LID: INDIC-AUTO</span>
            </div>
          </div>

          {/* Technical Index Block */}
          <div style={{
            background: 'var(--color-charcoal)',
            border: '1px solid var(--color-border)',
            padding: '24px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Terminal size={14} color="var(--accent-crimson)" />
              <span>CORE CAPABILITY SPECS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>STT ENGINE</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--color-white)' }}>Gnani Prisma v2.5</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>TTS ENGINE</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--color-white)' }}>Gnani Timbre v2.5</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>ALIGNMENT</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--color-white)' }}>Exact Character Span</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>PROVENANCE</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--accent-crimson)' }}>Dual Audit Trail</span>
              </div>
            </div>
          </div>

          {/* Operational Assurance Stamp */}
          <div style={{
            border: '1px dashed var(--color-border)',
            padding: '14px 18px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--color-muted-grey)',
            lineHeight: 1.5,
          }}>
            <strong style={{ color: 'var(--color-white)' }}>DATA ISOLATION:</strong> Audio files are processed in-flight and spooled temporarily with zero client-side credential exposure.
          </div>
        </div>
      </div>
    </section>
  );
};
