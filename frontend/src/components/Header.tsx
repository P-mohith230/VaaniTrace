import React from 'react';
import { Mic2, Activity, CheckCircle2, AlertTriangle, FileText, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react';
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
        <div className="brand-section" onClick={() => onTabChange('dashboard')}>
          <div className="brand-logo">
            <Mic2 size={22} />
          </div>
          <div>
            <span className="brand-name">VaaniTrace</span>
            <span className="brand-tagline">Voice-to-Action Intelligence • Powered by Gnani AI</span>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => onTabChange('dashboard')}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentTab === 'workspace' ? 'active' : ''}`}
                onClick={() => onTabChange('workspace')}
              >
                <Mic2 size={16} />
                <span>Workspace</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentTab === 'records' ? 'active' : ''}`}
                onClick={() => onTabChange('records')}
              >
                <FileText size={16} />
                <span>Records</span>
              </button>
            </li>
            <li>
              <button
                className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`}
                onClick={() => onTabChange('settings')}
              >
                <SettingsIcon size={16} />
                <span>Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className={`header-status-badge ${isHealthy ? 'status-online' : 'status-offline'}`}>
            <Activity size={13} />
            <span>{isHealthy ? 'Backend Online' : 'Backend Degraded'}</span>
          </div>
          <div className={`header-status-badge ${isGnaniReady ? 'status-online' : 'status-offline'}`}>
            {isGnaniReady ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
            <span>{isGnaniReady ? 'Gnani AI' : 'Gnani Unconfigured'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
