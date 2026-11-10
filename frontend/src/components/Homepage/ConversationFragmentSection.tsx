import React, { useState } from 'react';
import { Calculator, ArrowRight, CornerDownRight, Check, Hash, FileCode } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const ConversationFragmentSection: React.FC = () => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });
  const [activeToken, setActiveToken] = useState<string | null>('total');

  return (
    <section
      ref={ref}
      className={`editorial-section ${isRevealed ? 'revealed' : ''}`}
      style={{
        background: 'var(--color-rich-black)',
        borderBottom: '2px solid var(--color-border)',
      }}
    >
      <div className="swiss-grid">
        {/* Editorial Section Header */}
        <div className="col-12">
          <div className="editorial-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="editorial-stamp">SECTION [ 02 ]</span>
              <span>CONVERSATION DECONSTRUCTION & PROVENANCE MAPPING</span>
            </div>
            <div>
              <span>INPUT ARTIFACT: VERNACULAR COMMERCIAL PHONE CALL</span>
            </div>
          </div>
        </div>

        {/* Section Heading & Context */}
        <div className="col-12" style={{ marginBottom: 'clamp(28px, 4vw, 56px)' }}>
          <div style={{ maxWidth: '840px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-crimson)',
              display: 'block',
              marginBottom: '12px',
            }}>
              FIGURE 1.0 // THE TRANSCRIPTION GAP
            </span>
            <h2 style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.2rem, 4.4vw, 4.6rem)',
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
              margin: 0,
              marginBottom: '18px',
            }}>
              TRANSCRIPTION REVIEWS THE PAST.<br />
              VAANITRACE COMPUTES THE FUTURE.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.15vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--color-muted-grey)',
              margin: 0,
            }}>
              In real business conversations, people do not speak in clean JSON payloads. They speak in casual sentences mixing quantities, rates, and timelines. Notice how a single sentence contains both explicit spoken data and derived business mathematics.
            </p>
          </div>
        </div>

        {/* The Deconstructed Conversation Magazine Spread */}
        <div className="col-12" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
          <div style={{
            background: 'var(--color-black)',
            border: '2px solid var(--color-white)',
            padding: 'clamp(28px, 4vw, 56px)',
            position: 'relative',
          }}>
            {/* Top Corner Label */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '16px',
              marginBottom: '32px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
            }}>
              <span>AUDIO TRANSCRIPT BUFFER [00:00 - 00:06]</span>
              <span>TAP FRAGMENTS TO TRACE DATA</span>
            </div>

            {/* The Big Spoken Sentence with Interactive Fragment Callouts */}
            <blockquote style={{
              margin: 0,
              fontSize: 'clamp(1.8rem, 3.8vw, 3.6rem)',
              fontWeight: 700,
              lineHeight: 1.35,
              color: 'var(--color-soft-white)',
              letterSpacing: '-0.02em',
            }}>
              “
              <span
                onMouseEnter={() => setActiveToken('time')}
                onClick={() => setActiveToken('time')}
                style={{
                  background: activeToken === 'time' ? 'var(--accent-burgundy)' : 'transparent',
                  borderBottom: `3px solid ${activeToken === 'time' ? 'var(--accent-crimson)' : 'var(--color-border)'}`,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                Tomorrow morning
                <span style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--accent-crimson)',
                  fontWeight: 700,
                }}>
                  [01]
                </span>
              </span>{' '}
              send{' '}
              <span
                onMouseEnter={() => setActiveToken('qty-product')}
                onClick={() => setActiveToken('qty-product')}
                style={{
                  background: activeToken === 'qty-product' ? 'var(--accent-burgundy)' : 'transparent',
                  borderBottom: `3px solid ${activeToken === 'qty-product' ? 'var(--accent-crimson)' : 'var(--color-border)'}`,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                20 rice bags
                <span style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--accent-crimson)',
                  fontWeight: 700,
                }}>
                  [02]
                </span>
              </span>{' '}
              to{' '}
              <span
                onMouseEnter={() => setActiveToken('customer')}
                onClick={() => setActiveToken('customer')}
                style={{
                  background: activeToken === 'customer' ? 'var(--accent-burgundy)' : 'transparent',
                  borderBottom: `3px solid ${activeToken === 'customer' ? 'var(--accent-crimson)' : 'var(--color-border)'}`,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                Ramesh
                <span style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--accent-crimson)',
                  fontWeight: 700,
                }}>
                  [03]
                </span>
              </span>
              .{' '}
              Each bag costs{' '}
              <span
                onMouseEnter={() => setActiveToken('price')}
                onClick={() => setActiveToken('price')}
                style={{
                  background: activeToken === 'price' ? 'var(--accent-burgundy)' : 'transparent',
                  borderBottom: `3px solid ${activeToken === 'price' ? 'var(--accent-crimson)' : 'var(--color-border)'}`,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                1,200 rupees
                <span style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--accent-crimson)',
                  fontWeight: 700,
                }}>
                  [04]
                </span>
              </span>
              .”
            </blockquote>
          </div>
        </div>

        {/* Structured Output Cards — 5 Asymmetrical Field Columns */}
        <div className="col-12">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            {/* Card 1: Customer */}
            <div
              onMouseEnter={() => setActiveToken('customer')}
              style={{
                background: activeToken === 'customer' ? 'var(--color-graphite)' : 'var(--color-charcoal)',
                border: `1px solid ${activeToken === 'customer' ? 'var(--color-white)' : 'var(--color-border)'}`,
                padding: '20px',
                transition: 'all 0.15s ease',
                boxShadow: activeToken === 'customer' ? '4px 4px 0px var(--accent-wine)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)', marginBottom: '8px' }}>
                [03] FIELD // ENTITY
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-muted-grey)' }}>CUSTOMER</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>Ramesh</div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                <span className="editorial-stamp" style={{ fontSize: '9px', padding: '2px 6px' }}>SPOKEN</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>CHAR: 36–42</span>
              </div>
            </div>

            {/* Card 2: Product */}
            <div
              onMouseEnter={() => setActiveToken('qty-product')}
              style={{
                background: activeToken === 'qty-product' ? 'var(--color-graphite)' : 'var(--color-charcoal)',
                border: `1px solid ${activeToken === 'qty-product' ? 'var(--color-white)' : 'var(--color-border)'}`,
                padding: '20px',
                transition: 'all 0.15s ease',
                boxShadow: activeToken === 'qty-product' ? '4px 4px 0px var(--accent-wine)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)', marginBottom: '8px' }}>
                [02] FIELD // ITEM
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-muted-grey)' }}>COMMODITY</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>Rice bags</div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                <span className="editorial-stamp" style={{ fontSize: '9px', padding: '2px 6px' }}>SPOKEN</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>CHAR: 26–35</span>
              </div>
            </div>

            {/* Card 3: Quantity */}
            <div
              onMouseEnter={() => setActiveToken('qty-product')}
              style={{
                background: activeToken === 'qty-product' ? 'var(--color-graphite)' : 'var(--color-charcoal)',
                border: `1px solid ${activeToken === 'qty-product' ? 'var(--color-white)' : 'var(--color-border)'}`,
                padding: '20px',
                transition: 'all 0.15s ease',
                boxShadow: activeToken === 'qty-product' ? '4px 4px 0px var(--accent-wine)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)', marginBottom: '8px' }}>
                [02] FIELD // METRIC
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-muted-grey)' }}>QUANTITY</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>20 units</div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                <span className="editorial-stamp" style={{ fontSize: '9px', padding: '2px 6px' }}>SPOKEN</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>CHAR: 23–25</span>
              </div>
            </div>

            {/* Card 4: Unit Price */}
            <div
              onMouseEnter={() => setActiveToken('price')}
              style={{
                background: activeToken === 'price' ? 'var(--color-graphite)' : 'var(--color-charcoal)',
                border: `1px solid ${activeToken === 'price' ? 'var(--color-white)' : 'var(--color-border)'}`,
                padding: '20px',
                transition: 'all 0.15s ease',
                boxShadow: activeToken === 'price' ? '4px 4px 0px var(--accent-wine)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)', marginBottom: '8px' }}>
                [04] FIELD // RATE
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-muted-grey)' }}>UNIT PRICE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>₹1,200.00</div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                <span className="editorial-stamp" style={{ fontSize: '9px', padding: '2px 6px' }}>SPOKEN</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>CHAR: 60–72</span>
              </div>
            </div>

            {/* Card 5: Timeline */}
            <div
              onMouseEnter={() => setActiveToken('time')}
              style={{
                background: activeToken === 'time' ? 'var(--color-graphite)' : 'var(--color-charcoal)',
                border: `1px solid ${activeToken === 'time' ? 'var(--color-white)' : 'var(--color-border)'}`,
                padding: '20px',
                transition: 'all 0.15s ease',
                boxShadow: activeToken === 'time' ? '4px 4px 0px var(--accent-wine)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)', marginBottom: '8px' }}>
                [01] FIELD // DEADLINE
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-muted-grey)' }}>TIMELINE</div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginTop: '4px' }}>Tomorrow morning</div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '6px' }}>
                <span className="editorial-stamp" style={{ fontSize: '9px', padding: '2px 6px' }}>SPOKEN</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>CHAR: 00–16</span>
              </div>
            </div>
          </div>
        </div>

        {/* The Calculated Total Callout Box (Full 12 Columns, High-Contrast Wine Red) */}
        <div className="col-12">
          <div style={{
            background: 'var(--color-charcoal)',
            border: '2px solid var(--accent-wine)',
            padding: 'clamp(24px, 3.5vw, 40px)',
            boxShadow: '6px 6px 0px #000000',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}>
            <div style={{ flex: '1 1 340px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="editorial-stamp wine">EVIDENCE: CALCULATED</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                  FORMULA ID: DERIVATION-ARITHMETIC-01
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontWeight: 800,
                color: 'var(--color-white)',
                margin: 0,
                marginBottom: '8px',
              }}>
                DERIVED COMMERCIAL TRANSACTION VALUE
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-soft-white)',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '640px',
              }}>
                <strong>Critical distinction:</strong> The figure <strong>₹24,000.00</strong> was <em>never spoken</em> during the telephone call. Standard transcription leaves it uncomputed, requiring manual human arithmetic. VaaniTrace extracts the multiplicands, executes the formula, and embeds the verifiable lineage directly into the record.
              </p>
            </div>

            <div style={{
              background: 'var(--color-rich-black)',
              border: '1px solid var(--color-border)',
              padding: '20px 28px',
              textAlign: 'right',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--color-muted-grey)',
                marginBottom: '4px',
              }}>
                FORMULA: 20 × ₹1,200.00
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 900,
                color: 'var(--color-white)',
                letterSpacing: '-0.02em',
              }}>
                ₹24,000.00
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--accent-crimson)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                MATHEMATICAL PROVENANCE LINKED
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
