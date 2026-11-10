import React from 'react';
import { Mic2, ShieldCheck, Github } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const FooterSection: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      background: 'var(--color-rich-black)',
      borderTop: '1px solid var(--color-border)',
      padding: '64px 24px 36px',
      color: 'var(--color-muted-grey)',
      fontSize: '13px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: '48px',
      }}>
        {/* Brand Column */}
        <div style={{ maxWidth: '320px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', color: '#fff' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'var(--color-charcoal)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Mic2 size={18} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
              VaaniTrace
            </span>
          </div>

          <p style={{ lineHeight: 1.6, color: 'var(--color-muted-grey)' }}>
            Beyond transcription. Into action. Transforming everyday multilingual spoken conversations into structured, evidence-linked business intelligence powered by Gnani AI.
          </p>

          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ff9da9' }}>
            <span className="status-dot-accent" />
            <span>Gnani Prisma v2.5 & Timbre v2.5 Architecture</span>
          </div>
        </div>

        {/* Product Navigation */}
        <div>
          <h5 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '16px' }}>
            Product
          </h5>
          <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button
                onClick={() => onNavigate('workspace')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              >
                Live Workspace
              </button>
            </li>
            <li>
              <a href="#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>
                How It Works
              </a>
            </li>
            <li>
              <a href="#use-cases" style={{ color: 'inherit', textDecoration: 'none' }}>
                Industry Use Cases
              </a>
            </li>
            <li>
              <a href="#evidence-traceability" style={{ color: 'inherit', textDecoration: 'none' }}>
                Evidence Traceability
              </a>
            </li>
            <li>
              <a href="#technology" style={{ color: 'inherit', textDecoration: 'none' }}>
                Gnani AI Technology
              </a>
            </li>
          </ul>
        </div>

        {/* Application Views */}
        <div>
          <h5 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '16px' }}>
            Platform Views
          </h5>
          <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>
              <button
                onClick={() => onNavigate('dashboard')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('records')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              >
                Saved Records Archive
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('settings')}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}
              >
                System & API Diagnostics
              </button>
            </li>
            <li>
              <a href="/docs" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                OpenAPI Documentation
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div>
          <h5 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '16px' }}>
            Security & Trust
          </h5>
          <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li>Backend-Only Credentials Isolation</li>
            <li>Zero Permanent Audio Retention</li>
            <li>Mathematical Formula Tracking</li>
            <li>Single-Deployment Local Persistence</li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        fontSize: '12px',
      }}>
        <div>
          © {new Date().getFullYear()} VaaniTrace. Built with Gnani AI Speech Technology. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Monochromatic & Wine Red Edition</span>
          <span>•</span>
          <span>FastAPI + React Monorepo</span>
        </div>
      </div>
    </footer>
  );
};
