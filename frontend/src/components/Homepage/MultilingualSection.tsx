import React from 'react';
import { Languages, Globe, ArrowRight, CornerDownRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const CODE_MIX_SAMPLES = [
  {
    type: 'TENGLISH',
    pair: 'TELUGU + ENGLISH',
    quote: '“Tomorrow morning order ready cheyyandi.”',
    meaning: 'Please get the order ready by tomorrow morning.',
    lid: 'te-IN + en-IN',
    code: '01',
  },
  {
    type: 'HINGLISH',
    pair: 'HINDI + ENGLISH',
    quote: '“Billing GST ke saath generate kardo aur WhatsApp par bhej do.”',
    meaning: 'Generate the bill with GST included and dispatch it over WhatsApp.',
    lid: 'hi-IN + en-IN',
    code: '02',
  },
  {
    type: 'TANGLISH',
    pair: 'TAMIL + ENGLISH',
    quote: '“Warehouse inspection mudinjadhu, water leakage irukku immediate repair pannunga.”',
    meaning: 'Warehouse inspection is complete, there is a leak, repair it immediately.',
    lid: 'ta-IN + en-IN',
    code: '03',
  },
  {
    type: 'INDIAN ENGLISH',
    pair: 'PROFESSIONAL ENGLISH',
    quote: '“Please send the site progress report before today\'s evening sync.”',
    meaning: 'Operational task deadline assigned for current day closing.',
    lid: 'en-IN',
    code: '04',
  },
  {
    type: 'SHUDDH HINDI',
    pair: 'COMMERCE HINDI',
    quote: '“नमस्ते रमेश भाई, 50 कार्टन आम कल शाम तक दुकान पर भेज देना।”',
    meaning: 'Wholesale order for 50 cartons of mangoes requested by tomorrow evening.',
    lid: 'hi-IN',
    code: '05',
  },
];

const INDIC_SCRIPTS = [
  { script: 'हिन्दी', lang: 'Hindi (hi-IN)' },
  { script: 'தமிழ்', lang: 'Tamil (ta-IN)' },
  { script: 'తెలుగు', lang: 'Telugu (te-IN)' },
  { script: 'ಕನ್ನಡ', lang: 'Kannada (kn-IN)' },
  { script: 'मराठी', lang: 'Marathi (mr-IN)' },
  { script: 'বাংলা', lang: 'Bengali (bn-IN)' },
  { script: 'ગુજરાતી', lang: 'Gujarati (gu-IN)' },
  { script: 'ਪੰਜਾਬੀ', lang: 'Punjabi (pa-IN)' },
  { script: 'മലയാളം', lang: 'Malayalam (ml-IN)' },
  { script: 'English (India)', lang: 'English (en-IN)' },
];

export const MultilingualSection: React.FC = () => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
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
              <span className="editorial-stamp">SECTION [ 06 ]</span>
              <span>LINGUISTIC REALITY // INDIC CODE-MIXING</span>
            </div>
            <div>
              <span>SUPPORTED: 10 INDIAN REGIONAL LANGUAGES + MIXED-LID</span>
            </div>
          </div>
        </div>

        {/* Section Headline */}
        <div className="col-12" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
          <div style={{ maxWidth: '920px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-crimson)',
              display: 'block',
              marginBottom: '12px',
            }}>
              MULTILINGUAL SPEECH INGESTION //
            </span>
            <h2 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.6rem, 5.4vw, 5.8rem)',
              fontWeight: 900,
              lineHeight: 0.98,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              margin: 0,
              marginBottom: '16px',
            }}>
              PEOPLE DON'T SPEAK<br />
              IN ONE LANGUAGE.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.1vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--color-muted-grey)',
              margin: 0,
            }}>
              Everyday Indian commerce operates through spontaneous code-switching. A conversation starting in Hindi switches to English for numbers and ends in a regional idiom. VaaniTrace handles mixed-language streams without demanding single-language purity.
            </p>
          </div>
        </div>

        {/* Staggered Code-Mixing Conversation Cards */}
        <div className="col-12" style={{ marginBottom: 'clamp(32px, 4vw, 56px)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {CODE_MIX_SAMPLES.map((sample) => (
              <div
                key={sample.code}
                style={{
                  background: 'var(--color-charcoal)',
                  border: '1px solid var(--color-border)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '4px 4px 0px #000000',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="editorial-stamp wine" style={{ fontSize: '9px' }}>
                      {sample.type}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>
                      {sample.lid}
                    </span>
                  </div>

                  <blockquote style={{
                    margin: '0 0 14px',
                    fontSize: '17px',
                    fontWeight: 700,
                    lineHeight: 1.4,
                    color: 'var(--color-white)',
                  }}>
                    {sample.quote}
                  </blockquote>

                  <p style={{
                    fontSize: '12px',
                    lineHeight: 1.5,
                    color: 'var(--color-soft-white)',
                    margin: 0,
                    fontStyle: 'italic',
                  }}>
                    "{sample.meaning}"
                  </p>
                </div>

                <div style={{
                  marginTop: '18px',
                  paddingTop: '10px',
                  borderTop: '1px solid var(--color-border-subtle)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--color-muted-grey)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                  <span>PAIR: {sample.pair}</span>
                  <span style={{ color: 'var(--accent-crimson)' }}>AUTO-IDENTIFIED</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Indic Scripts Ticker (Full Width Swiss Block) */}
        <div className="col-12">
          <div style={{
            background: 'var(--color-rich-black)',
            border: '2px solid var(--color-white)',
            padding: '20px 24px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-crimson)',
              marginBottom: '14px',
            }}>
              VERIFIED SUPPORTED INDIC SCRIPTS // GNANI PRISMA ASR GATEWAY
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              {INDIC_SCRIPTS.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--color-charcoal)',
                    border: '1px solid var(--color-border)',
                    padding: '8px 14px',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                    {item.script}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                    {item.lang}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
