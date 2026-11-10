import React, { useState } from 'react';
import { Check, ShieldCheck, Link2, Calculator, Info, Edit3, ArrowRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface EvidenceItem {
  id: string;
  field: string;
  value: string;
  evidenceType: 'SPOKEN' | 'INFERRED' | 'CALCULATED' | 'MANUAL';
  startChar?: number;
  endChar?: number;
  phrase: string;
  note: string;
  status: 'VERIFIED' | 'NEEDS_REVIEW';
}

const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'item',
    field: 'ORDER_ITEM',
    value: 'surgical gloves',
    evidenceType: 'SPOKEN',
    startChar: 58,
    endChar: 73,
    phrase: 'surgical gloves',
    note: 'Verbatim extraction of primary medical commodity',
    status: 'VERIFIED',
  },
  {
    id: 'qty',
    field: 'QUANTITY',
    value: '20 boxes',
    evidenceType: 'SPOKEN',
    startChar: 46,
    endChar: 54,
    phrase: '20 boxes',
    note: 'Packaged quantity unit: boxes',
    status: 'VERIFIED',
  },
  {
    id: 'price',
    field: 'UNIT_PRICE',
    value: '₹1,200.00',
    evidenceType: 'SPOKEN',
    startChar: 77,
    endChar: 88,
    phrase: '1200 rupees',
    note: 'Quoted rate per box in Indian Rupees',
    status: 'VERIFIED',
  },
  {
    id: 'total',
    field: 'TOTAL_AMOUNT',
    value: '₹24,000.00',
    evidenceType: 'CALCULATED',
    phrase: '20 boxes ... 1200 rupees',
    note: 'Mathematical lineage: 20 (quantity) × ₹1,200 (unit rate) = ₹24,000',
    status: 'VERIFIED',
  },
  {
    id: 'deadline',
    field: 'DELIVERY_DEADLINE',
    value: 'Friday',
    evidenceType: 'SPOKEN',
    startChar: 109,
    endChar: 115,
    phrase: 'by Friday',
    note: 'Mandatory fulfillment cutoff',
    status: 'VERIFIED',
  },
  {
    id: 'urgency',
    field: 'URGENCY_LEVEL',
    value: 'Time-Critical',
    evidenceType: 'INFERRED',
    phrase: 'deliver them by Friday to our central warehouse',
    note: 'Inferred from specific day constraint and central warehouse destination',
    status: 'NEEDS_REVIEW',
  },
];

const FULL_TRANSCRIPT = "Hello Rajesh, this is Suresh speaking. I need 20 boxes of surgical gloves at 1200 rupees each. Please deliver them by Friday to our central warehouse.";

export const EvidenceTraceabilitySection: React.FC = () => {
  const { ref, isRevealed } = useScrollReveal({ threshold: 0.1 });
  const [activeId, setActiveId] = useState<string>('total');

  const selectedItem = EVIDENCE_ITEMS.find((item) => item.id === activeId) || EVIDENCE_ITEMS[0];

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
              <span className="editorial-stamp wine">SECTION [ 07 ]</span>
              <span>CORE DIFFERENTIATOR // BIDIRECTIONAL EVIDENCE ENGINE</span>
            </div>
            <div>
              <span>PROVENANCE STANDARD: EXACT CHARACTER OFFSET MAPPING</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="col-12" style={{ marginBottom: 'clamp(32px, 5vw, 64px)' }}>
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
              TRACEABILITY PROTOCOL //
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
              EVERY DETAIL ACCOUNTED FOR.<br />
              EVERY CLAIM VERIFIABLE.
            </h2>
            <p style={{
              fontSize: 'clamp(15px, 1.1vw, 18px)',
              lineHeight: 1.6,
              color: 'var(--color-muted-grey)',
              margin: 0,
            }}>
              AI tools that invent numbers or fail to cite their sources create unacceptable commercial liability. In VaaniTrace, every extracted detail cites its exact transcript origin and evidence classification.
            </p>
          </div>
        </div>

        {/* Technical Editorial Annotation System: Split Layout */}
        <div className="col-6" style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'var(--color-black)',
            border: '2px solid var(--color-white)',
            padding: 'clamp(20px, 3vw, 36px)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '12px',
                marginBottom: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-muted-grey)',
              }}>
                <span>SPOKEN TRANSCRIPT AUDIT STREAM</span>
                <span>CHAR COUNT: {FULL_TRANSCRIPT.length}</span>
              </div>

              {/* Highlighted Transcript Body */}
              <div style={{
                fontSize: 'clamp(17px, 1.6vw, 22px)',
                lineHeight: 1.6,
                color: 'var(--color-soft-white)',
                fontFamily: 'var(--font-mono)',
              }}>
                {selectedItem.startChar != null && selectedItem.endChar != null ? (
                  <>
                    <span>{FULL_TRANSCRIPT.slice(0, selectedItem.startChar)}</span>
                    <mark style={{
                      background: 'var(--accent-wine)',
                      color: '#FFFFFF',
                      padding: '2px 4px',
                      border: '1px solid #FFFFFF',
                    }}>
                      {FULL_TRANSCRIPT.slice(selectedItem.startChar, selectedItem.endChar)}
                    </mark>
                    <span>{FULL_TRANSCRIPT.slice(selectedItem.endChar)}</span>
                  </>
                ) : (
                  <span>
                    {FULL_TRANSCRIPT}
                    <div style={{
                      marginTop: '16px',
                      padding: '10px 14px',
                      background: 'var(--color-charcoal)',
                      border: '1px dashed var(--accent-wine)',
                      fontSize: '12px',
                      color: 'var(--accent-crimson)',
                    }}>
                      [EVIDENCE TYPE: {selectedItem.evidenceType}] — Derived across compound utterance: "{selectedItem.phrase}"
                    </div>
                  </span>
                )}
              </div>
            </div>

            {/* Coordinate Footer */}
            <div style={{
              marginTop: '28px',
              paddingTop: '16px',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
            }}>
              <span>SPAN: {selectedItem.startChar != null ? `${selectedItem.startChar}–${selectedItem.endChar}` : 'COMPOUND'}</span>
              <span style={{ color: 'var(--accent-crimson)' }}>PROVENANCE: VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Extracted Field Register */}
        <div className="col-6" style={{ marginBottom: '24px' }}>
          <div style={{
            background: 'var(--color-charcoal)',
            border: '2px solid var(--color-border)',
            padding: 'clamp(20px, 3vw, 36px)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '12px',
              marginBottom: '18px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
            }}>
              <span>STRUCTURED RECORD FIELDS</span>
              <span>TAP ROW TO ALIGN EVIDENCE</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {EVIDENCE_ITEMS.map((item) => {
                const isSelected = item.id === activeId;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveId(item.id)}
                    style={{
                      background: isSelected ? 'var(--color-rich-black)' : 'var(--color-graphite)',
                      border: `1px solid ${isSelected ? 'var(--accent-wine)' : 'var(--color-border-subtle)'}`,
                      padding: '12px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '3px 3px 0px var(--accent-wine)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                        {item.field}
                      </span>
                      <span className={`editorial-stamp ${item.evidenceType === 'CALCULATED' ? 'wine' : ''}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                        {item.evidenceType}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '4px' }}>
                      <strong style={{ fontSize: '15px', color: '#fff' }}>{item.value}</strong>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: item.status === 'VERIFIED' ? 'var(--color-white)' : 'var(--accent-crimson)' }}>
                        {item.status}
                      </span>
                    </div>

                    {isSelected && (
                      <div style={{
                        marginTop: '8px',
                        paddingTop: '6px',
                        borderTop: '1px solid var(--color-border-subtle)',
                        fontSize: '11px',
                        color: 'var(--color-soft-white)',
                      }}>
                        {item.note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Evidence Classification Legend (Full 12 cols) */}
        <div className="col-12">
          <div style={{
            background: 'var(--color-black)',
            border: '1px solid var(--color-border)',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}>
            <div>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', display: 'block', marginBottom: '4px' }}>
                [SPOKEN] EVIDENCE
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)', margin: 0 }}>
                Directly present in the transcript with exact character boundary offsets.
              </p>
            </div>

            <div>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', display: 'block', marginBottom: '4px' }}>
                [INFERRED] EVIDENCE
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)', margin: 0 }}>
                Contextually derived from surrounding conversational intent and relationships.
              </p>
            </div>

            <div>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-crimson)', display: 'block', marginBottom: '4px' }}>
                [CALCULATED] EVIDENCE
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)', margin: 0 }}>
                Mathematically computed (e.g. quantity × unit price = total) with formula lineage.
              </p>
            </div>

            <div>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#fff', display: 'block', marginBottom: '4px' }}>
                [MANUAL] AUDIT
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)', margin: 0 }}>
                Reviewed, adjusted, or confirmed by a human operator in the verification loop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
