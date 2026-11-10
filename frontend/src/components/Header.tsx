import React from 'react';
import { Mic2, Activity, CheckCircle2, AlertTriangle, FileText, Settings as SettingsIcon, LayoutDashboard, Home } from 'lucide-react';
import { SystemHealth, GnaniHealth } from '../types';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  systemHealth: SystemHealth | null;
  gnaniHealth: GnaniHealth | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  systemHealth,
  gnaniHealth,
}) => {
  const isHealthy = systemHealth?.status === 'healthy';
  const isGnaniReady = gnaniHealth?.configured;

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-section" onClick={() => onTabChange('home')}>
          <div className="brand-logo-mark">
            <Mic2 size={20} />
          </div>
          <div>
            <span className="brand-title">VaaniTrace</span>
            <span className="brand-tagline-sub">Beyond Transcription. Into Action.</span>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item ${currentTab === 'home' ? 'active' : ''}`}
                onClick={() => onTabChange('home')}
              >
                <Home size={15} />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentTab === 'workspace' ? 'active' : ''}`}
                onClick={() => onTabChange('workspace')}
              >
                <Mic2 size={15} />
                <span>Workspace</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange('dashboard')}
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentTab === 'records' ? 'active' : ''}`}
                onClick={() => onTabChange('records')}
              >
                <FileText size={15} />
                <span>Records</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`}
                onClick={() => onTabChange('settings')}
              >
                <SettingsIcon size={15} />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div className="header-status-badge" title={`Server: ${systemHealth?.backend || 'Offline'}`}>
            <span className={isHealthy ? 'status-dot-active' : 'status-dot-accent'} />
            <span style={{ fontSize: '12px' }}>{isHealthy ? 'Backend 8000' : 'Backend Degraded'}</span>
          </div>

          <div className="header-status-badge" title={`Gnani AI: ${gnaniHealth?.model_stt || 'Prisma v2.5'}`}>
            <span className={isGnaniReady ? 'status-dot-accent' : 'status-dot-active'} />
            <span style={{ fontSize: '12px' }}>{isGnaniReady ? 'Prisma v2.5' : 'Gnani API'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
