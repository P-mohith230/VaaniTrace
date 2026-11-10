import React from 'react';
import { ArrowRight, ChevronRight, Mic } from 'lucide-react';

interface FinalCtaProps {
  onStart: () => void;
  onExploreTech: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaProps> = ({ onStart, onExploreTech }) => {
  return (
    <section style={{
      padding: '120px 24px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 60%, rgba(74, 16, 27, 0.4) 0%, rgba(0, 0, 0, 0.98) 75%)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <span className="section-tag">START YOUR INTELLIGENCE PIPELINE</span>

        <h2 style={{
          fontSize: 'clamp(36px, 5.5vw, 62px)',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.035em',
          lineHeight: 1.1,
          marginBottom: '24px',
        }}>
          Every Conversation Has <br />
          <span style={{ color: '#fff', background: 'linear-gradient(180deg, #FFFFFF 30%, #C47984 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Something Worth Keeping.
          </span>
        </h2>

        <p style={{
          fontSize: 'clamp(16px, 2vw, 19px)',
          color: 'var(--color-muted-grey)',
          lineHeight: 1.6,
          maxWidth: '680px',
          margin: '0 auto 44px',
        }}>
          Transform everyday spoken audio into organized data, verifiable details, and meaningful action across Indian languages.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={onStart}
            className="btn btn-primary"
            style={{ padding: '16px 36px', fontSize: '16px', fontWeight: 600 }}
          >
            <Mic size={18} />
            <span>Start Using VaaniTrace</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={onExploreTech}
            className="btn btn-burgundy-outline"
            style={{ padding: '16px 30px', fontSize: '16px' }}
          >
            <span>Explore the Technology</span>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
};
