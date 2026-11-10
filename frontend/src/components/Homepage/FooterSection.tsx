import React from 'react';
import { Mic2, ShieldCheck, Terminal, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const FooterSection: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      background: 'var(--color-rich-black)',
      borderTop: '2px solid var(--color-border)',
      padding: 'clamp(50px, 8vw, 90px) 0 40px',
      color: 'var(--color-muted-grey)',
    }}>
      <div className="swiss-grid">
        {/* Top Footer Meta Row (Full 12 cols) */}
        <div className="col-12" style={{ marginBottom: '40px' }}>
          <div className="editorial-header-row" style={{ paddingBottom: '16px', marginBottom: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span className="editorial-stamp">FOOTER INDEX // 001</span>
              <span>VAANITRACE ENGINE // PRODUCTION INSTANCE</span>
            </div>
            <div>
              <span>SYS.ARCH: UNIFIED MONOREPO // PORT 8000</span>
            </div>
          </div>
        </div>

        {/* Brand & Manifesto Column (4 cols) */}
        <div className="col-4" style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'var(--color-charcoal)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}>
              <Mic2 size={16} />
            </div>
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '20px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-white)',
            }}>
              VAANITRACE
            </span>
          </div>

          <p style={{
            fontSize: '13px',
            lineHeight: 1.6,
            color: 'var(--color-soft-white)',
            margin: '0 0 16px',
          }}>
            Beyond transcription. Into action. Transforming multilingual Indian spoken conversations into structured, verifiable, evidence-linked business records.
          </p>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-crimson)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--accent-crimson)' }} />
            <span>POWERED BY GNANI PRISMA & TIMBRE APIS</span>
          </div>
        </div>

        {/* Navigation Column 1: System Views (3 cols) */}
        <div className="col-3" style={{ marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-white)',
            marginBottom: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '8px',
          }}>
            SYSTEM INTERFACES
          </div>

          <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('workspace')}
                style={{ background: 'none', border: 'none', color: 'var(--color-muted-grey)', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontFamily: 'inherit' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
              >
                [01] Live Speech Workspace
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                style={{ background: 'none', border: 'none', color: 'var(--color-muted-grey)', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontFamily: 'inherit' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
              >
                [02] Metrics Dashboard
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('records')}
                style={{ background: 'none', border: 'none', color: 'var(--color-muted-grey)', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontFamily: 'inherit' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
              >
                [03] Verified Records Archive
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                style={{ background: 'none', border: 'none', color: 'var(--color-muted-grey)', cursor: 'pointer', padding: 0, fontSize: 'inherit', fontFamily: 'inherit' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
              >
                [04] Diagnostics & Settings
              </button>
            </li>
          </ul>
        </div>

        {/* Navigation Column 2: Sections & Docs (3 cols) */}
        <div className="col-3" style={{ marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-white)',
            marginBottom: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '8px',
          }}>
            DOCUMENTATION
          </div>

          <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <li>
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-muted-grey)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
              >
                OpenAPI REST Spec (/docs)
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                style={{ color: 'var(--color-muted-grey)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
              >
                Pipeline Architecture
              </a>
            </li>
            <li>
              <a
                href="#technology"
                style={{ color: 'var(--color-muted-grey)', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-muted-grey)')}
              >
                Gnani Developer APIs
              </a>
            </li>
          </ul>
        </div>

        {/* System & Isolation Assurance (2 cols) */}
        <div className="col-2" style={{ marginBottom: '32px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-white)',
            marginBottom: '16px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '8px',
          }}>
            SECURITY
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', lineHeight: 1.6, color: 'var(--color-muted-grey)' }}>
            <div>• ZERO AUDIO RETENTION</div>
            <div>• BACKEND CREDENTIAL ISOLATION</div>
            <div>• EXACT CHAR SPAN AUDIT</div>
            <div>• LOCAL SQLITE PERSISTENCE</div>
          </div>
        </div>

        {/* Bottom Colophon (Full 12 cols) */}
        <div className="col-12" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
          }}>
            <div>
              © {new Date().getFullYear()} VAANITRACE. EXPERIMENTAL EDITORIAL BRUTALIST EDITION. ALL RIGHTS RESERVED.
            </div>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--color-muted-grey)' }}>
              <span>SWISS 12-COL GRID</span>
              <span>•</span>
              <span>MONOCHROMATIC + WINE RED</span>
              <span>•</span>
              <span>REACT 18 + FASTAPI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
