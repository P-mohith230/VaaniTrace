import React from 'react';
import { ArrowRight, Mic, Sparkles, FileText, Download, CheckCircle, Shield } from 'lucide-react';

interface ProductPreviewProps {
  onOpenWorkspace: () => void;
}

export const ProductPreviewSection: React.FC<ProductPreviewProps> = ({ onOpenWorkspace }) => {
  return (
    <section className="home-section" id="preview">
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
        <span className="section-tag">LIVE PLATFORM INTERFACE</span>
        <h2 className="section-heading">
          See VaaniTrace in Action.
        </h2>
        <p className="section-subheading" style={{ margin: '0 auto' }}>
          An uncompromising workspace engineered for operational speed. Inspect the dual-panel workbench where dialogue effortlessly synchronizes with verified business records.
        </p>
      </div>

      <div style={{
        maxWidth: '1160px',
        margin: '0 auto',
        background: 'var(--color-rich-black)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(74, 16, 27, 0.25)',
        overflow: 'hidden',
      }}>
        {/* Mock Application Top Bar */}
        <div style={{
          padding: '16px 24px',
          background: '#0d0d0d',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-wine)' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
              VaaniTrace Operational Workspace
            </span>
            <span className="badge badge-verified">Connected: SQLite Engine</span>
          </div>

          <button onClick={onOpenWorkspace} className="btn btn-primary btn-sm">
            <span>Launch Live Workspace</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Workspace Mock Content */}
        <div style={{ padding: '32px' }}>
          {/* Top Session Bar */}
          <div style={{
            background: 'var(--color-charcoal)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent-crimson)', fontWeight: 700 }}>
                ACTIVE RECORDING SESSION
              </span>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                B2B Wholesale Medical Supply Order
              </h4>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-verified">Status: Verified</span>
              <span className="badge badge-calculated">Total: ₹24,000.00</span>
            </div>
          </div>

          {/* Dual Panel Simulation */}
          <div className="workspace-grid" style={{ marginBottom: '24px' }}>
            {/* Left Transcript Box */}
            <div style={{
              background: '#080808',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-muted-grey)', fontWeight: 600 }}>
                  Spoken Transcript (16kHz PCM)
                </span>
                <span className="badge badge-spoken">Language: en-IN</span>
              </div>

              <div style={{ fontSize: '14px', lineHeight: 1.8, color: '#d4d4d4' }}>
                "Hello Rajesh, this is Suresh speaking. I need{' '}
                <mark style={{ background: 'var(--accent-wine)', color: '#fff', padding: '2px 4px', borderRadius: '2px' }}>
                  20 boxes of surgical gloves
                </mark>{' '}
                at{' '}
                <mark style={{ background: 'var(--accent-wine)', color: '#fff', padding: '2px 4px', borderRadius: '2px' }}>
                  1200 rupees each
                </mark>
                . Please deliver them by Friday to our central warehouse."
              </div>

              <div style={{ marginTop: '20px', padding: '12px', background: '#121212', borderRadius: '4px', border: '1px solid #222', fontSize: '12px', color: '#999' }}>
                Audio waveform analyzed with Gnani Prisma v2.5. Clause alignment verified.
              </div>
            </div>

            {/* Right Structured Fields Box */}
            <div style={{
              background: '#080808',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '24px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-muted-grey)', fontWeight: 600 }}>
                  Extracted Facts & Action Items
                </span>
                <span className="badge badge-calculated">3 Fields Verified</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px 14px', background: '#121212', borderRadius: '4px', border: '1px solid #222' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                    <span>QUANTITY</span>
                    <span className="badge badge-spoken">Spoken</span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginTop: '2px' }}>20 Boxes</p>
                </div>

                <div style={{ padding: '12px 14px', background: 'rgba(74, 16, 27, 0.35)', borderRadius: '4px', border: '1px solid var(--accent-wine)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#ff9da9' }}>
                    <span>TOTAL AMOUNT (CALCULATED)</span>
                    <span className="badge badge-calculated">Calculated</span>
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>₹24,000.00</p>
                  <span style={{ fontSize: '11px', color: '#d17785', fontFamily: 'var(--font-mono)' }}>20 × ₹1,200.00</span>
                </div>

                <div style={{ padding: '12px 14px', background: '#121212', borderRadius: '4px', border: '1px solid #222' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-muted-grey)' }}>
                    <span>ACTION ITEM</span>
                    <span className="badge badge-verified">Assigned: Rajesh</span>
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#fff', marginTop: '2px' }}>Deliver to Central Warehouse by Friday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '20px',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={onOpenWorkspace} className="btn btn-primary btn-sm">
                <FileText size={13} /> Try It Yourself in Workspace
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="btn btn-secondary btn-sm" style={{ cursor: 'default' }}>
                <Download size={13} /> Export JSON Ready
              </span>
              <span className="btn btn-secondary btn-sm" style={{ cursor: 'default' }}>
                <Download size={13} /> Export CSV Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

