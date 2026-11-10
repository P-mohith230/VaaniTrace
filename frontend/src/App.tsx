import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Workspace } from './pages/Workspace';
import { RecordsList } from './pages/RecordsList';
import { RecordDetails } from './pages/RecordDetails';
import { SettingsPage } from './pages/Settings';
import { SystemHealth, GnaniHealth } from './types';
import { api } from './services/api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [gnaniHealth, setGnaniHealth] = useState<GnaniHealth | null>(null);

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const [sys, gnani] = await Promise.allSettled([
        api.getHealth(),
        api.getGnaniHealth(),
      ]);

      if (sys.status === 'fulfilled') {
        setSystemHealth(sys.value);
      } else {
        setSystemHealth({
          status: 'degraded',
          backend: 'offline',
          database: 'unknown',
          version: '1.0.0',
        });
      }

      if (gnani.status === 'fulfilled') {
        setGnaniHealth(gnani.value);
      }
    } catch (err) {
      console.error('Health fetch failed:', err);
    }
  };

  const handleOpenRecord = (id: string) => {
    setSelectedRecordId(id);
    setCurrentTab('record_details');
  };

  const handleBackToRecords = () => {
    setSelectedRecordId(null);
    setCurrentTab('records');
  };

  return (
    <div className="app-container">
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setSelectedRecordId(null);
          setCurrentTab(tab);
        }}
        systemHealth={systemHealth}
        gnaniHealth={gnaniHealth}
      />

      <main className="main-content">
        {currentTab === 'dashboard' && (
          <Dashboard
            onNavigateToWorkspace={() => setCurrentTab('workspace')}
            onOpenRecord={handleOpenRecord}
            systemHealth={systemHealth}
            gnaniHealth={gnaniHealth}
          />
        )}

        {currentTab === 'workspace' && <Workspace />}

        {currentTab === 'records' && (
          <RecordsList
            onOpenRecord={handleOpenRecord}
            onNavigateToWorkspace={() => setCurrentTab('workspace')}
          />
        )}

        {currentTab === 'record_details' && selectedRecordId && (
          <RecordDetails
            recordId={selectedRecordId}
            onBack={handleBackToRecords}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsPage
            systemHealth={systemHealth}
            gnaniHealth={gnaniHealth}
            onRefreshHealth={fetchHealthStatus}
          />
        )}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '20px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)',
      }}>
        VaaniTrace Platform • Powered by Gnani Prisma v2.5 STT & Timbre v2.5 TTS • Single-Deployment Unified Architecture
      </footer>
    </div>
  );
};

export default App;
