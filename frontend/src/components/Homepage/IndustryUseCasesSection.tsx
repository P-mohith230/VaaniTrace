import React from 'react';
import { Sprout, ShoppingBag, Store, HeartPulse, Check, AlertCircle, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const IndustryUseCasesSection: React.FC = () => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });

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
        {/* Header */}
        <div className="col-12">
          <div className="editorial-header-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="editorial-stamp">SECTION [ 05 ]</span>
              <span>SPECIALIZED SECTOR PROTOCOLS</span>
            </div>
            <div>
              <span>4 DISTINCT OPERATIONAL DOMAINS</span>
            </div>
          </div>
        </div>

        {/* Section Headline */}
        <div className="col-12" style={{ marginBottom: 'clamp(36px, 5vw, 64px)' }}>
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
              VERTICAL DOMAIN ARCHITECTURE //
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
              REAL-WORLD INTELLIGENCE FOR EVERYDAY INDIAN WORKFLOWS.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.1vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--color-muted-grey)',
              margin: 0,
            }}>
              Different industries communicate with fundamentally different vocabularies, tolerances, and structures. Each vertical protocol below demonstrates tailored entity extraction and mathematical tracking.
            </p>
          </div>
        </div>

        {/* LAYOUT 1: AGRICULTURE — FIELD TELEMETRY & MANDI DOCKET (Full 12 cols, wide split) */}
        <div className="col-12" style={{ marginBottom: 'clamp(24px, 3vw, 40px)' }}>
          <div style={{
            background: 'var(--color-black)',
            border: '2px solid var(--color-white)',
            boxShadow: '6px 6px 0px var(--accent-wine)',
            padding: 'clamp(24px, 3.5vw, 44px)',
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '16px',
              marginBottom: '24px',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="editorial-stamp wine">INDUSTRY // 01</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                  AGRICULTURE & MANDI TELEMETRY LOG
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                GPS: 16.5062° N, 80.6480° E // ANDHRA PRADESH
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent-crimson)', textTransform: 'uppercase' }}>
                  SPOKEN AUDIO TRANSCRIPT (TELUGU + ENGLISH)
                </span>
                <blockquote style={{
                  margin: '8px 0 16px',
                  fontSize: '18px',
                  lineHeight: 1.5,
                  fontWeight: 600,
                  color: 'var(--color-soft-white)',
                  borderLeft: '2px solid var(--accent-wine)',
                  paddingLeft: '14px',
                }}>
                  “Babu, paddy field lo pest attack kanapadutondi. 50 bags DAP fertilizer urgently kavali, Friday evening lopala delivery cheyyandi.”
                </blockquote>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                  LANGUAGE: INDIC-AUTO (te-IN + en-IN) • DURATION: 00:07s
                </div>
              </div>

              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-white)', textTransform: 'uppercase' }}>
                  STRUCTURED FIELD TELEMETRY EXTRACTED
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>CROP AFFECTED</span>
                    <strong style={{ fontSize: '12px', color: '#fff' }}>Paddy (Rice crop)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>FERTILIZER COMMODITY</span>
                    <strong style={{ fontSize: '12px', color: '#fff' }}>DAP Fertilizer (50 bags)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>DISPATCH DEADLINE</span>
                    <strong style={{ fontSize: '12px', color: 'var(--accent-crimson)' }}>Friday Evening (Urgent)</strong>
                  </div>
                </div>

                <div style={{
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'var(--color-charcoal)',
                  border: '1px dashed var(--color-border)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--color-muted-grey)',
                }}>
                  *Notice: Administrative field documentation only. Not a substitute for certified agronomical diagnosis.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT 2: RETAIL WHOLESALE — COMMERCIAL INVOICE DRAFT (Left 6 Columns) */}
        <div className="col-6" style={{ marginBottom: 'clamp(24px, 3vw, 40px)' }}>
          <div style={{
            background: 'var(--color-charcoal)',
            border: '2px solid var(--color-border)',
            padding: 'clamp(20px, 3vw, 32px)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="editorial-stamp">INDUSTRY // 02</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                  INVOICE RECONCILIATION #8849-B2B
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', margin: '0 0 10px' }}>
                RETAIL WHOLESALE & DISTRIBUTION
              </h3>

              <blockquote style={{
                margin: '0 0 18px',
                fontSize: '14px',
                lineHeight: 1.5,
                color: 'var(--color-soft-white)',
                fontStyle: 'italic',
                borderLeft: '2px solid var(--accent-wine)',
                paddingLeft: '12px',
              }}>
                “Bhaiya, Havells 16 Amp switchgear ke 40 units chahiye, rate 350 lagao. Bil GST ke sath bana dena.”
              </blockquote>

              <div style={{
                background: 'var(--color-black)',
                border: '1px solid var(--color-border)',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                marginBottom: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px', marginBottom: '6px' }}>
                  <span>ITEM: Havells 16A Switchgear</span>
                  <span>QTY: 40</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '6px', marginBottom: '6px' }}>
                  <span>UNIT RATE</span>
                  <span>₹350.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontWeight: 700 }}>
                  <span>TOTAL (CALCULATED)</span>
                  <span style={{ color: 'var(--accent-crimson)' }}>₹14,000.00</span>
                </div>
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>
              EVIDENCE: 40 (Spoken) × ₹350 (Spoken) = ₹14,000 (Calculated)
            </div>
          </div>
        </div>

        {/* LAYOUT 3: KIRANA & GROCERY — DAILY PROVISION REGISTER (Right 6 Columns) */}
        <div className="col-6" style={{ marginBottom: 'clamp(24px, 3vw, 40px)' }}>
          <div style={{
            background: 'var(--color-charcoal)',
            border: '2px solid var(--color-border)',
            padding: 'clamp(20px, 3vw, 32px)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="editorial-stamp">INDUSTRY // 03</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                  DAILY KHATA REGISTER // SHIFT: MORNING
                </span>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', margin: '0 0 10px' }}>
                KIRANA & LOCAL PROVISION ORDER
              </h3>

              <blockquote style={{
                margin: '0 0 18px',
                fontSize: '14px',
                lineHeight: 1.5,
                color: 'var(--color-soft-white)',
                fontStyle: 'italic',
                borderLeft: '2px solid var(--accent-wine)',
                paddingLeft: '12px',
              }}>
                “Send 5kg Basmati rice, 2kg Toor dal, 1L sunflower oil to Flat 402. Add it to our monthly account.”
              </blockquote>

              <div style={{
                background: 'var(--color-black)',
                border: '1px solid var(--color-border)',
                padding: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                marginBottom: '14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={12} color="var(--accent-crimson)" />
                  <span>5kg Basmati Rice</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-muted-grey)' }}>Verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={12} color="var(--accent-crimson)" />
                  <span>2kg Toor Dal</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-muted-grey)' }}>Verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={12} color="var(--accent-crimson)" />
                  <span>1L Sunflower Oil</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-muted-grey)' }}>Verified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '6px', marginTop: '2px' }}>
                  <span style={{ color: 'var(--accent-crimson)' }}>DESTINATION:</span>
                  <span>Flat 402 (Monthly Khata)</span>
                </div>
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)' }}>
              AUTOMATIC ENTITY SEGMENTATION FOR FAST STORE DISPATCH
            </div>
          </div>
        </div>

        {/* LAYOUT 4: HEALTHCARE SUPPORT — CLINICAL OBSERVATION DOCKET (Full 12 Columns, High-Contrast Alert) */}
        <div className="col-12">
          <div style={{
            background: 'var(--color-black)',
            border: '2px solid var(--accent-wine)',
            padding: 'clamp(24px, 3.5vw, 44px)',
            boxShadow: '4px 4px 0px #000000',
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '16px',
              marginBottom: '20px',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="editorial-stamp wine">INDUSTRY // 04</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                  HEALTHCARE DOCUMENTATION SUPPORT (NON-DIAGNOSTIC)
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-crimson)' }}>
                SAFETY PROTOCOL: ADMINISTRATIVE ASSISTANCE ONLY
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)', textTransform: 'uppercase' }}>
                  SPOKEN VERBAL HANDOVER AUDIO FRAGMENT
                </span>
                <blockquote style={{
                  margin: '8px 0 16px',
                  fontSize: '16px',
                  lineHeight: 1.5,
                  color: 'var(--color-soft-white)',
                  fontStyle: 'italic',
                  borderLeft: '2px solid var(--accent-crimson)',
                  paddingLeft: '14px',
                }}>
                  “Patient in Bed 12 reported persistent high fever for 3 days. Prescribed Paracetamol 650mg TDS after food. Schedule clinical follow-up for Tuesday morning.”
                </blockquote>
              </div>

              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-muted-grey)', textTransform: 'uppercase' }}>
                  STRUCTURED HANDOVER SUMMARY
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted-grey)' }}>SYMPTOM</span>
                    <strong>Persistent fever (3 days)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted-grey)' }}>MEDICATION</span>
                    <strong>Paracetamol 650mg TDS</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--color-charcoal)', border: '1px solid var(--color-border)', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted-grey)' }}>FOLLOW-UP</span>
                    <strong style={{ color: 'var(--accent-crimson)' }}>Tuesday Morning</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Mandatory Safety Disclaimer Banner */}
            <div style={{
              background: 'rgba(74, 16, 27, 0.35)',
              border: '1px solid var(--accent-wine)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-white)',
              lineHeight: 1.5,
            }}>
              <ShieldAlert size={16} color="var(--accent-crimson)" style={{ flexShrink: 0 }} />
              <div>
                <strong>MANDATORY CLINICAL SAFETY DISCLAIMER:</strong> VaaniTrace provides administrative and documentation recording support only. It does not perform clinical diagnosis, triage decisions, or automated prescription advice.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
