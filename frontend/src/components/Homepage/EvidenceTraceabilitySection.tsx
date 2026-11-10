import React, { useState } from 'react';
import { Sparkles, Check, Calculator, Eye, ShieldCheck } from 'lucide-react';

interface TraceItem {
  id: string;
  field: string;
  value: string;
  type: 'spoken' | 'calculated';
  supportingText: string;
  charStart: number;
  charEnd: number;
  notes?: string;
}

const TRACE_ITEMS: TraceItem[] = [
  {
    id: 'customer',
    field: 'Customer / Recipient',
    value: 'Ramesh',
    type: 'spoken',
    supportingText: 'Send 20 rice bags to Ramesh',
    charStart: 25,
    charEnd: 31,
  },
  {
    id: 'quantity',
    field: 'Product & Quantity',
    value: '20 Rice Bags',
    type: 'spoken',
    supportingText: '20 rice bags',
    charStart: 5,
    charEnd: 17,
  },
  {
    id: 'price',
    field: 'Unit Price',
    value: '₹1,200.00',
    type: 'spoken',
    supportingText: 'costs 1,200 rupees',
    charStart: 66,
    charEnd: 84,
  },
  {
    id: 'total',
    field: 'Total Amount (Calculated)',
    value: '₹24,000.00',
    type: 'calculated',
    supportingText: '20 rice bags ... costs 1,200 rupees',
    charStart: 5,
    charEnd: 84,
    notes: 'Formula: 20 (quantity) × ₹1,200.00 (unit price) = ₹24,000.00',
  },
  {
    id: 'delivery',
    field: 'Delivery Deadline',
    value: 'Tomorrow morning',
    type: 'spoken',
    supportingText: 'tomorrow morning',
    charStart: 32,
    charEnd: 48,
  },
];

const FULL_TRANSCRIPT = "Send 20 rice bags to Ramesh tomorrow morning. Each bag costs 1,200 rupees.";

export const EvidenceTraceabilitySection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<TraceItem>(TRACE_ITEMS[1]); // Default to quantity

  return (
    <section className="home-section" id="evidence-traceability">
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
        <span className="section-tag">VERIFIABLE EXTRACTION ARCHITECTURE</span>
        <h2 className="section-heading">
          Every Important Detail Has a Story. <br />
          See Where It Came From.
        </h2>
        <p className="section-subheading" style={{ margin: '0 auto' }}>
          Don't just trust a black-box AI extraction. Click any extracted attribute below to audit its supporting passage in the source transcript.
        </p>
      </div>

      <div style={{
        maxWidth: '1080px',
        margin: '0 auto',
        background: 'var(--color-rich-black)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(74, 16, 27, 0.2)',
        overflow: 'hidden',
      }}>
        {/* Banner quote */}
        <div style={{
          padding: '14px 24px',
          background: 'linear-gradient(90deg, #18090d, #0f0709)',
          borderBottom: '1px solid var(--accent-burgundy)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
        }}>
          <span style={{ color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="var(--accent-crimson)" />
            <span>Interactive Traceability Workbench</span>
          </span>
          <span style={{ color: '#d17785', fontStyle: 'italic', fontSize: '12px' }}>
            "Don't just trust the extracted result. Review the evidence behind it."
          </span>
        </div>

        {/* Two-Panel Interactive Comparison */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 0,
        }}>
          {/* Left Panel: Transcript Display */}
          <div style={{
            padding: '36px',
            borderRight: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#0a0a0a',
          }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted-grey)', fontWeight: 600 }}>
                ORIGINAL SPOKEN TRANSCRIPT (SOURCE)
              </span>

              <div style={{
                fontSize: '18px',
                lineHeight: 1.9,
                color: '#fff',
                marginTop: '20px',
                padding: '24px',
                background: '#121212',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}>
                {/* Dynamically render text with highlight */}
                <span>Send </span>
                <mark style={{
                  background: activeItem.id === 'quantity' || activeItem.id === 'total' ? 'var(--accent-wine)' : 'transparent',
                  color: '#fff',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  transition: 'all 0.25s ease',
                  border: activeItem.id === 'quantity' ? '1px solid var(--accent-crimson)' : 'none',
                }}>
                  20 rice bags
                </mark>
                <span> to </span>
                <mark style={{
                  background: activeItem.id === 'customer' ? 'var(--accent-wine)' : 'transparent',
                  color: '#fff',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  transition: 'all 0.25s ease',
                  border: activeItem.id === 'customer' ? '1px solid var(--accent-crimson)' : 'none',
                }}>
                  Ramesh
                </mark>
                <span> </span>
                <mark style={{
                  background: activeItem.id === 'delivery' ? 'var(--accent-wine)' : 'transparent',
                  color: '#fff',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  transition: 'all 0.25s ease',
                  border: activeItem.id === 'delivery' ? '1px solid var(--accent-crimson)' : 'none',
                }}>
                  tomorrow morning
                </mark>
                <span>. Each bag </span>
                <mark style={{
                  background: activeItem.id === 'price' || activeItem.id === 'total' ? 'var(--accent-wine)' : 'transparent',
                  color: '#fff',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  transition: 'all 0.25s ease',
                  border: activeItem.id === 'price' ? '1px solid var(--accent-crimson)' : 'none',
                }}>
                  costs 1,200 rupees
                </mark>
                <span>.</span>
              </div>
            </div>

            <div style={{ marginTop: '28px', padding: '16px', background: '#141414', borderRadius: 'var(--radius-sm)', border: '1px solid #242424' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-crimson)', fontWeight: 600 }}>
                Active Supporting Evidence Passage:
              </span>
              <p style={{ fontSize: '13px', color: '#fff', fontStyle: 'italic', marginTop: '4px' }}>
                "{activeItem.supportingText}"
              </p>
              {activeItem.notes && (
                <p style={{ fontSize: '11px', color: '#e2a8b0', marginTop: '6px', fontFamily: 'var(--font-mono)' }}>
                  {activeItem.notes}
                </p>
              )}
            </div>
          </div>

          {/* Right Panel: Extracted Structured Fields */}
          <div style={{ padding: '36px', background: '#0e0e0e' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-muted-grey)', fontWeight: 600 }}>
              STRUCTURED FIELDS (CLICK ANY FIELD TO AUDIT)
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
              {TRACE_ITEMS.map((item) => {
                const isSelected = activeItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    style={{
                      background: isSelected ? 'rgba(74, 16, 27, 0.4)' : 'var(--color-charcoal)',
                      border: `1px solid ${isSelected ? 'var(--accent-wine)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 16px var(--accent-wine-glow)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', color: isSelected ? '#ff9da9' : 'var(--color-muted-grey)', textTransform: 'uppercase', fontWeight: 600 }}>
                        {item.field}
                      </span>
                      <span className={`badge ${item.type === 'calculated' ? 'badge-calculated' : 'badge-spoken'}`}>
                        {item.type}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                        {item.value}
                      </span>
                      {isSelected && (
                        <span style={{ fontSize: '11px', color: '#ff9da9', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={13} /> Active Evidence
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
