import React, { useState, useEffect } from 'react';
import { Mic, ArrowRight, Sparkles, CheckCircle2, ChevronRight, Play, Volume2 } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onSeeHowItWorks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onSeeHowItWorks }) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  // Progressive product workflow animation in the hero visual
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-container">
      {/* Background ambient subtle burgundy glow */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(114, 47, 55, 0.18) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', width: '100%' }}>
        {/* Technology Pill */}
        <div className="hero-pill">
          <span className="status-dot-accent" />
          <span>POWERED BY GNANI AI SPEECH TECHNOLOGY</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-headline">
          Your Conversations Deserve <br />
          <span className="accent-text">More Than Transcription.</span>
        </h1>

        {/* Supporting Subhead */}
        <p className="hero-subhead">
          Speak naturally. Capture what matters. Turn everyday multilingual conversations into structured information, verifiable evidence, and meaningful business action.
        </p>

        {/* Action Buttons */}
        <div className="hero-cta-group">
          <button onClick={onExplore} className="btn btn-primary" style={{ padding: '14px 32px', fontSize: '15px' }}>
            <span>Explore VaaniTrace</span>
            <ArrowRight size={17} />
          </button>
          <button onClick={onSeeHowItWorks} className="btn btn-burgundy-outline" style={{ padding: '14px 28px', fontSize: '15px' }}>
            <span>See How It Works</span>
            <ChevronRight size={17} />
          </button>
        </div>

        {/* Interactive Animated Product Workflow Simulation */}
        <div style={{
          maxWidth: '920px',
          margin: '0 auto',
          background: 'rgba(14, 14, 14, 0.85)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(74, 16, 27, 0.25)',
          backdropFilter: 'blur(16px)',
          overflow: 'hidden',
          textAlign: 'left',
        }}>
          {/* Simulation Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0d0d0d',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#303030' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#303030' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#303030' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-muted-grey)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
                vaanitrace-live-intelligence.session
              </span>
            </div>

            {/* Stepper tabs */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['1. Spoken Audio', '2. Prisma STT', '3. Evidence Link', '4. Structured Action'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setActiveStep(i)}
                  style={{
                    background: activeStep === i ? 'var(--accent-burgundy)' : 'transparent',
                    border: `1px solid ${activeStep === i ? 'var(--accent-wine)' : 'transparent'}`,
                    color: activeStep === i ? '#fff' : 'var(--color-muted-grey)',
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Content Body */}
          <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px', alignItems: 'center' }}>
            {/* Left: Spoken Speech & Audio Waveform */}
            <div style={{
              background: '#080808',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Volume2 size={16} color="var(--accent-crimson)" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-white)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Spoken Telephony Input
                  </span>
                </div>
                <span className="badge badge-spoken">Audio: 8kHz Indic-Auto</span>
              </div>

              {/* Dynamic Waveform Visualizer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '36px', marginBottom: '18px' }}>
                {[12, 28, 16, 32, 24, 18, 30, 22, 14, 26, 34, 20, 15, 29, 21, 13, 27, 31, 19, 12, 25, 33, 17, 24, 16].map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${h}px`,
                      background: idx < 16 ? 'var(--accent-wine)' : '#242424',
                      borderRadius: '1px',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>

              {/* Spoken Transcript Bubble */}
              <div style={{
                fontSize: '13px',
                lineHeight: 1.7,
                color: '#d4d4d4',
                background: '#121212',
                padding: '12px 14px',
                borderRadius: '6px',
                borderLeft: '3px solid var(--accent-wine)',
              }}>
                "Hello Rajesh, please send <strong style={{ color: '#fff', background: activeStep >= 2 ? 'var(--accent-wine)' : 'transparent', padding: '0 4px', borderRadius: '2px' }}>20 boxes of surgical gloves</strong> at <strong style={{ color: '#fff', background: activeStep >= 2 ? 'var(--accent-wine)' : 'transparent', padding: '0 4px', borderRadius: '2px' }}>1200 rupees</strong> each by Friday."
              </div>
            </div>

            {/* Right: Structured Facts & Evidence Linkage */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-muted-grey)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Extracted Intelligence
                </span>
                <span className="badge badge-calculated">Calculated & Linked</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  background: '#080808',
                  border: '1px solid var(--color-border)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--color-muted-grey)', textTransform: 'uppercase' }}>Item & Quantity</span>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>20 Boxes (Surgical Gloves)</p>
                  </div>
                  <span className="badge badge-spoken">Spoken Evidence</span>
                </div>

                <div style={{
                  background: activeStep >= 2 ? 'rgba(74, 16, 27, 0.4)' : '#080808',
                  border: `1px solid ${activeStep >= 2 ? 'var(--accent-wine)' : 'var(--color-border)'}`,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: activeStep >= 2 ? '#ff9da9' : 'var(--color-muted-grey)', textTransform: 'uppercase' }}>
                      Calculated Total Amount
                    </span>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>₹24,000.00</p>
                    <span style={{ fontSize: '11px', color: '#d17785', fontFamily: 'var(--font-mono)' }}>20 × ₹1,200.00</span>
                  </div>
                  <span className="badge badge-calculated">Calculated</span>
                </div>

                <div style={{
                  background: '#080808',
                  border: '1px solid var(--color-border)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--color-muted-grey)', textTransform: 'uppercase' }}>Action Item</span>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>Deliver to Central Warehouse by Friday</p>
                  </div>
                  <span className="badge badge-verified">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
