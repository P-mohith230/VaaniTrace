import React from 'react';
import { ArrowRight, CornerDownRight, Terminal, Layers } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface FinalCtaSectionProps {
  onStart: () => void;
  onExploreTech: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onStart, onExploreTech }) => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`editorial-section ${isRevealed ? 'revealed' : ''}`}
      style={{
        paddingTop: 'clamp(80px, 12vw, 160px)',
        paddingBottom: 'clamp(80px, 12vw, 160px)',
        background: 'var(--color-black)',
        borderBottom: '2px solid var(--color-white)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Kinetic Watermark */}
      <div
        className="watermark-kinetic"
        style={{
          bottom: '-5%',
          left: '2%',
          opacity: 0.35,
        }}
      >
        TRACE.
      </div>

      <div className="swiss-grid" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="col-12">
          <div className="editorial-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="editorial-stamp wine">SECTION [ 09 ]</span>
              <span>FINAL STATEMENT // INITIATION</span>
            </div>
            <div>
              <span>SYS.EXEC: READY FOR INGESTION</span>
            </div>
          </div>
        </div>

        {/* Massive Editorial Headline */}
        <div className="col-12" style={{ marginBottom: 'clamp(28px, 4vw, 48px)' }}>
          <div style={{ maxWidth: '1100px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(3rem, 7.5vw, 8rem)',
                fontWeight: 900,
                lineHeight: 0.94,
                letterSpacing: '-0.045em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
                margin: 0,
                marginBottom: '28px',
              }}
            >
              EVERY CONVERSATION<br />
              HAS SOMETHING<br />
              <span style={{
                color: 'var(--color-white)',
                borderBottom: '5px solid var(--accent-wine)',
                paddingBottom: '4px',
              }}>
                WORTH KEEPING.
              </span>
            </h2>

            <p style={{
              fontSize: 'clamp(18px, 1.6vw, 24px)',
              lineHeight: 1.5,
              color: 'var(--color-soft-white)',
              fontWeight: 500,
              maxWidth: '720px',
              margin: 0,
              marginBottom: '40px',
            }}>
              Capture what was said. Understand what matters. Verify what happens next.
            </p>

            {/* Restrained Deep Burgundy Graphic Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 18px',
              background: 'var(--accent-burgundy)',
              border: '1px solid var(--accent-wine)',
              marginBottom: '48px',
              boxShadow: '3px 3px 0px #000000',
            }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--accent-crimson)', borderRadius: 0 }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-white)',
              }}>
                DISPATCH // UNIFIED SYSTEM OPERATIONAL ON PORT 8000
              </span>
            </div>
          </div>

          {/* Monumental Brutalist CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onStart}
              className="btn-brutalist-white"
              style={{ fontSize: '15px', padding: '18px 36px', boxShadow: '6px 6px 0px var(--accent-wine)' }}
            >
              <span>Explore VaaniTrace</span>
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              onClick={onExploreTech}
              className="btn-brutalist-ghost"
              style={{ fontSize: '15px', padding: '18px 32px' }}
            >
              <span>Review Architecture [↑]</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
