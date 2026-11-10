import React from 'react';
import { AlertTriangle, ArrowDownRight, Layers, FileX2 } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export const ProblemSection: React.FC = () => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`editorial-inverted-block ${isRevealed ? 'revealed' : ''}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="swiss-grid">
        {/* Editorial Top Metadata */}
        <div className="col-12">
          <div className="editorial-header-row" style={{ borderBottomColor: '#D1CDCA', color: '#666666' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="editorial-stamp" style={{ background: '#000000', color: '#FFFFFF', borderColor: '#000000' }}>
                SECTION [ 03 ]
              </span>
              <span>THE ROOT VULNERABILITY // INFORMATION DECAY</span>
            </div>
            <div>
              <span>SURFACE: 70% OF INDIAN COMMERCE RUNS ON UNRECORDED SPEECH</span>
            </div>
          </div>
        </div>

        {/* Section Headline Across Full 12 Cols — NO OVERFLOW, NO COLLISION */}
        <div className="col-12" style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}>
          <div style={{ maxWidth: '1000px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent-wine)',
              display: 'block',
              marginBottom: '14px',
            }}>
              THESIS STATEMENT // INFORMATION EVAPORATION
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(2.4rem, 5vw, 4.8rem)',
                fontWeight: 900,
                lineHeight: 1.02,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#000000',
                margin: 0,
                marginBottom: '20px',
              }}
            >
              CONVERSATIONS ARE FULL OF INFORMATION.<br />
              <span style={{
                color: 'var(--accent-wine)',
                borderBottom: '4px solid var(--accent-wine)',
                paddingBottom: '2px',
              }}>
                MOST OF IT GETS LOST.
              </span>
            </h2>

            <p style={{
              fontSize: 'clamp(15px, 1.15vw, 18px)',
              lineHeight: 1.6,
              color: '#333333',
              fontWeight: 500,
              maxWidth: '720px',
              margin: 0,
            }}>
              Human memory is not an auditable database. Spoken instructions, prices, and quantities exchanged in Indian languages vanish within minutes of a phone call ending.
            </p>
          </div>
        </div>

        {/* Left 4 Cols: Audit Metric & Thesis Summary */}
        <div className="col-4" style={{ marginBottom: '32px' }}>
          <div style={{
            position: 'sticky',
            top: '100px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            <div style={{
              padding: '24px',
              border: '2px solid #000000',
              background: '#FFFFFF',
              boxShadow: '4px 4px 0px #000000',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#000000', marginBottom: '6px' }}>
                AUDIT FAILURE RATE
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 900, color: 'var(--accent-wine)', lineHeight: 1 }}>
                64.2%
              </div>
              <div style={{ fontSize: '12px', color: '#555555', marginTop: '10px', lineHeight: 1.5 }}>
                of verbal commitments lack written provenance across B2B wholesale calls.
              </div>
            </div>

            <div style={{
              padding: '20px',
              border: '1px solid #C4C0BE',
              background: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#444444',
              lineHeight: 1.6,
            }}>
              <strong style={{ color: '#000000' }}>DIAGNOSTIC SUMMARY:</strong> Unstructured voice notes and quick phone agreements lead to invoicing discrepancies, lost quantities, and unfulfilled commitments across sectors.
            </div>
          </div>
        </div>

        {/* Staggered Asymmetrical Sector Breakdowns (Right 8 Columns) */}
        <div className="col-8">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Sector 1: Agriculture */}
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              padding: 'clamp(20px, 3vw, 32px)',
              boxShadow: '4px 4px 0px #000000',
              marginLeft: '0px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-wine)' }}>
                  [ SEC // 01 ] AGRICULTURE & MANDIS
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#666666' }}>REF: AGRI-VOICE</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#000000', margin: '0 0 10px' }}>
                Mandi Price Agreements & Pesticide Formulations Disappear
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444444', margin: 0 }}>
                Farmers and commission agents rapidly negotiate quintal rates and chemical dosages in regional vernaculars over noisy field calls. Without an instant structured transcript, disputable quantities are dispatched and disputes erupt during settlement.
              </p>
            </div>

            {/* Sector 2: Retail Wholesale (Staggered Right) */}
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              padding: 'clamp(20px, 3vw, 32px)',
              boxShadow: '4px 4px 0px #000000',
              marginLeft: 'clamp(0px, 3vw, 40px)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-wine)' }}>
                  [ SEC // 02 ] WHOLESALE & DISTRIBUTION
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#666666' }}>REF: DIST-B2B</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#000000', margin: '0 0 10px' }}>
                WhatsApp Voice Notes Jumbled on Handwritten Slips
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444444', margin: 0 }}>
                Wholesale hardware and FMCG distributors receive hundreds of rapid mixed-language audio snippets every morning. Billing clerks manually re-listen and transcribe them by hand, resulting in incorrect SKU counts and lost invoices.
              </p>
            </div>

            {/* Sector 3: Grocery & Kirana */}
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              padding: 'clamp(20px, 3vw, 32px)',
              boxShadow: '4px 4px 0px #000000',
              marginLeft: '0px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-wine)' }}>
                  [ SEC // 03 ] KIRANA STORES & LOCAL KHATA
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#666666' }}>REF: KHATA-LEDGER</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#000000', margin: '0 0 10px' }}>
                Credit Ledgers Fall Out of Sync with Telephone Orders
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444444', margin: 0 }}>
                Neighbourhood storekeepers manage multi-item provision orders phoned in by apartment customers. Peak hours leave no time to write down every item into the physical ledger, creating monthly payment discrepancies.
              </p>
            </div>

            {/* Sector 4: Healthcare Support (Staggered Right) */}
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              padding: 'clamp(20px, 3vw, 32px)',
              boxShadow: '4px 4px 0px #000000',
              marginLeft: 'clamp(0px, 3vw, 40px)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-wine)' }}>
                  [ SEC // 04 ] CLINICAL DOCUMENTATION SUPPORT
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#666666' }}>REF: MED-HANDOFF</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#000000', margin: '0 0 10px' }}>
                Verbal Patient Handovers Suffer Memory-Based Omissions
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444444', margin: 0 }}>
                Critical nurse handovers and physician verbal summaries between clinical shifts get truncated. Without auditable evidence links, follow-up checkups lack exact spoken symptom history. *(Clinical documentation support only; not medical diagnosis).*
              </p>
            </div>

            {/* Sector 5: Operations & Meeting Syncs */}
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #000000',
              padding: 'clamp(20px, 3vw, 32px)',
              boxShadow: '4px 4px 0px #000000',
              marginLeft: '0px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-wine)' }}>
                  [ SEC // 05 ] ENGINEERING & OPS SYNCS
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#666666' }}>REF: OPS-TASKS</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#000000', margin: '0 0 10px' }}>
                Decisions Evaporate into Meeting Minutes Nobody Reads
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#444444', margin: 0 }}>
                Sprint reviews and crisis syncs conclude with clear verbal assignments ("Priya to deploy before EOD", "Rahul to review terms"). By Friday, nobody remembers who agreed to what without timestamped, verified action items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
