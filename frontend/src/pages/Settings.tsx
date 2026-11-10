import React from 'react';
import { SystemHealth, GnaniHealth } from '../types';
import { Settings as SettingsIcon, ShieldCheck, Activity, Server, Radio, Database, RefreshCw, KeyRound } from 'lucide-react';

interface SettingsProps {
  systemHealth: SystemHealth | null;
  gnaniHealth: GnaniHealth | null;
  onRefreshHealth: () => void;
}

export const SettingsPage: React.FC<SettingsProps> = ({
  systemHealth,
  gnaniHealth,
  onRefreshHealth,
}) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
            System Settings & API Diagnostics
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Inspect application runtime, database status, and Gnani AI cloud gateway configuration
          </p>
        </div>

        <button onClick={onRefreshHealth} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} /> Refresh Diagnostics
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Backend & Database Health Card */}
        <div className="card" style={{ margin: 0 }}>
          <h3 className="card-title">
            <Server size={18} color="var(--accent-wine)" />
            <span>Backend Runtime Status</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Application Version</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-white)' }}>v{systemHealth?.version || '1.0.0'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Server Status</span>
              <span className={`badge ${systemHealth?.backend === 'online' ? 'badge-verified' : 'badge-needs-review'}`}>
                {systemHealth?.backend || 'offline'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Database Engine</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-white)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={13} color="var(--accent-crimson)" /> SQLite3 (WAL Mode)
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Database Connectivity</span>
              <span className={`badge ${systemHealth?.database === 'connected' ? 'badge-verified' : 'badge-needs-review'}`}>
                {systemHealth?.database || 'disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Gnani AI Integration Health Card */}
        <div className="card" style={{ margin: 0 }}>
          <h3 className="card-title">
            <Radio size={18} color="var(--accent-crimson)" />
            <span>Gnani AI Integration Diagnostics</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>API Credentials</span>
              <span className={`badge ${gnaniHealth?.configured ? 'badge-verified' : 'badge-needs-review'}`}>
                {gnaniHealth?.configured ? 'Configured (Backend-Only)' : 'Missing Key'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Target STT Model</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-white)' }}>
                {gnaniHealth?.model_stt || 'prisma-v2.5'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Target TTS Model</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-white)' }}>
                {gnaniHealth?.model_tts || 'timbre-v2.5'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Gateway Connectivity</span>
              <span className={`badge ${gnaniHealth?.connectivity === 'verified' ? 'badge-verified' : 'badge-unverified'}`}>
                {gnaniHealth?.connectivity || 'not_checked'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Credentials Notice */}
      <div className="card">
        <h3 className="card-title">
          <KeyRound size={18} color="var(--accent-wine)" />
          <span>Security & Credential Management Policy</span>
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
          In accordance with enterprise security standards, <strong>VaaniTrace strictly isolates API keys on the backend server</strong>. Credentials such as <code style={{ color: 'var(--color-white)', background: 'var(--color-graphite)', padding: '2px 6px', borderRadius: '4px' }}>GNANI_API_KEY</code> are loaded from local environment variables or an untracked <code style={{ color: 'var(--color-white)', background: 'var(--color-graphite)', padding: '2px 6px', borderRadius: '4px' }}>.env</code> file and are <em>never</em> sent to the browser or bundled in frontend assets.
        </p>

        <div style={{
          background: 'var(--color-rich-black)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 18px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: 'var(--color-soft-white)',
        }}>
          # Add your Gnani API key to the backend .env file:<br />
          GNANI_API_KEY=your_actual_gnani_api_key_here<br />
          GNANI_BASE_URL=https://api.vachana.ai<br />
          GNANI_STT_MODEL=prisma-v2.5<br />
          GNANI_TTS_MODEL=timbre-v2.5
        </div>
      </div>
    </div>
  );
};

