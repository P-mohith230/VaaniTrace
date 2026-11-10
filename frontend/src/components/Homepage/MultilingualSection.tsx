import React from 'react';
import { Languages, Globe, ArrowRight, Check } from 'lucide-react';

const CODE_MIX_EXAMPLES = [
  {
    languagePair: 'Telugu + English (Tenglish)',
    spoken: '"Tomorrow morning order ready cheyyandi. 50 packets Dispatch department ki deliver avvali."',
    parsed: [
      { key: 'Order Status', value: 'Ready by tomorrow morning' },
      { key: 'Quantity', value: '50 Packets' },
      { key: 'Destination', value: 'Dispatch Department' },
    ],
  },
  {
    languagePair: 'Hindi + English (Hinglish)',
    spoken: '"Ramesh bhai, 20 boxes surgical gloves urgently bhej dena Friday tak. Rate wahi 1200 rupees rahega."',
    parsed: [
      { key: 'Recipient', value: 'Ramesh' },
      { key: 'Item & Qty', value: '20 Boxes (Surgical Gloves)' },
      { key: 'Total Quoted', value: '₹24,000.00 (20 × ₹1,200)' },
      { key: 'Deadline', value: 'Friday' },
    ],
  },
  {
    languagePair: 'Tamil + English (Tanglish)',
    spoken: '"Customer ki invoice confirm pannunga. Balance payment next week Monday kulla settle aaganum."',
    parsed: [
      { key: 'Action', value: 'Confirm customer invoice' },
      { key: 'Financial Term', value: 'Balance payment settlement' },
      { key: 'Deadline', value: 'Next week Monday' },
    ],
  },
];

const SUPPORTED_INDIC = [
  { name: 'Hindi', script: 'हिन्दी' },
  { name: 'Indian English', script: 'English' },
  { name: 'Telugu', script: 'తెలుగు' },
  { name: 'Tamil', script: 'தமிழ்' },
  { name: 'Kannada', script: 'ಕನ್ನಡ' },
  { name: 'Marathi', script: 'मराठी' },
  { name: 'Bengali', script: 'বাংলা' },
  { name: 'Gujarati', script: 'ગુજરાતી' },
  { name: 'Punjabi', script: 'ਪੰਜਾਬੀ' },
  { name: 'Malayalam', script: 'മലയാളം' },
];

export const MultilingualSection: React.FC = () => {
  return (
    <section className="home-section" id="multilingual">
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
        <span className="section-tag">CODE-MIXED NATIVE RECOGNITION</span>
        <h2 className="section-heading">
          Speak Naturally. <br />
          Don't Change Your Language.
        </h2>
        <p className="section-subheading" style={{ margin: '0 auto' }}>
          Real conversations across India rarely stick to a single textbook language. People intuitively switch between regional languages and English mid-sentence. VaaniTrace parses mixed speech without forcing speakers to adopt foreign speech habits.
        </p>
      </div>

      {/* Code-Mixed Dialogue Transformation Demo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        marginBottom: '54px',
      }}>
        {CODE_MIX_EXAMPLES.map((ex, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--color-charcoal)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--accent-crimson)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '16px',
              }}>
                <Globe size={13} />
                <span>{ex.languagePair}</span>
              </div>

              {/* Spoken Speech Bubble */}
              <div style={{
                background: 'var(--color-rich-black)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                fontSize: '14px',
                lineHeight: 1.7,
                color: '#fff',
                fontStyle: 'italic',
                marginBottom: '20px',
                position: 'relative',
              }}>
                {ex.spoken}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-muted-grey)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <ArrowRight size={13} color="var(--accent-wine)" />
                <span>Parsed Into Structured Action</span>
              </div>

              {/* Resulting Structured Fact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {ex.parsed.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      background: '#0d0d0d',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      border: '1px solid #222',
                    }}
                  >
                    <span style={{ color: 'var(--color-muted-grey)' }}>{p.key}</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Supported Languages Grid */}
      <div style={{
        background: 'var(--color-rich-black)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        textAlign: 'center',
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted-grey)', marginBottom: '20px' }}>
          Gnani Prisma Officially Supported Indic Dialects
        </h4>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center',
        }}>
          {SUPPORTED_INDIC.map((lang) => (
            <div
              key={lang.name}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--color-charcoal)',
                border: '1px solid var(--color-border)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 500 }}>{lang.name}</span>
              <span style={{ color: 'var(--accent-crimson)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>({lang.script})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
