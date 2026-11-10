import React, { useEffect, useState } from 'react';
import { RecordSummary, SystemHealth, GnaniHealth } from '../types';
import { api } from '../services/api';
import { RecordCard } from '../components/RecordCard';
import { Mic, FileCheck, Clock, Layers, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

interface DashboardProps {
  onNavigateToWorkspace: () => void;
  onOpenRecord: (id: string) => void;
  systemHealth: SystemHealth | null;
  gnaniHealth: GnaniHealth | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateToWorkspace,
  onOpenRecord,
  systemHealth,
  gnaniHealth,
}) => {
  const [records, setRecords] = useState<RecordSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await api.listRecords();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load recent records for dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalRecords = records.length;
  const verifiedRecords = records.filter((r) => r.verification_status === 'verified').length;
  const pendingRecords = records.filter((r) => r.verification_status === 'unverified' || r.verification_status === 'needs_review').length;

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div style={{
        background: 'linear-gradient(145deg, #18090d 0%, #0d0608 100%)',
        border: '1px solid var(--accent-wine)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        marginBottom: '32px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        boxShadow: '0 16px 40px rgba(74, 16, 27, 0.25)',
      }}>
        <div style={{ maxWidth: '680px' }}>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontWeight: 700,
            color: 'var(--accent-crimson)',
            display: 'block',
            marginBottom: '8px',
          }}>
            VOICE-TO-ACTION INTELLIGENCE PLATFORM
          </span>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '10px', letterSpacing: '-0.02em' }}>
            Beyond Transcription. Into Action.
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--color-muted-grey)', lineHeight: 1.65 }}>
            VaaniTrace structures everyday multilingual conversations into verified records where every item, price, deadline, and task is cross-linked to exact transcript evidence.
          </p>
        </div>

        <button
          onClick={onNavigateToWorkspace}
          className="btn btn-primary"
          style={{ padding: '14px 28px', fontSize: '15px' }}
        >
          <Mic size={18} />
          <span>New Voice Session</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Layers size={22} color="var(--color-white)" />
          </div>
          <div>
            <div className="stat-value">{totalRecords}</div>
            <div className="stat-label">Total Voice Records</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ borderColor: 'var(--accent-wine)', background: 'var(--accent-burgundy)' }}>
            <FileCheck size={22} color="#fff" />
          </div>
          <div>
            <div className="stat-value">{verifiedRecords}</div>
            <div className="stat-label">Human Verified Records</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={22} color="var(--accent-crimson)" />
          </div>
          <div>
            <div className="stat-value">{pendingRecords}</div>
            <div className="stat-label">Awaiting Verification</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <ShieldCheck size={22} color="var(--color-white)" />
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '18px', color: '#fff' }}>
              {gnaniHealth?.model_stt || 'Prisma v2.5'}
            </div>
            <div className="stat-label">Gnani Speech Engine</div>
          </div>
        </div>
      </div>

      {/* Recent Records Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0 }}>Recent Voice Sessions</h3>
            <p className="card-subtitle" style={{ margin: '4px 0 0' }}>Your latest transcribed and extracted conversations</p>
          </div>

          <button onClick={onNavigateToWorkspace} className="btn btn-secondary btn-sm">
            <Mic size={14} /> New Session
          </button>
        </div>

        {isLoading ? (
          <p style={{ color: 'var(--color-muted-grey)', fontSize: '14px', padding: '24px 0' }}>Loading records...</p>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--color-muted-grey)' }}>
            <Mic size={40} style={{ margin: '0 auto 14px', opacity: 0.3 }} />
            <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '8px' }}>No Voice Records Stored Yet</h4>
            <p style={{ fontSize: '13px', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              Record or upload an audio conversation in the Workspace to see structured extraction and evidence mapping in action.
            </p>
            <button onClick={onNavigateToWorkspace} className="btn btn-primary btn-sm">
              Start Your First Session
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {records.slice(0, 6).map((rec) => (
              <RecordCard
                key={rec.id}
                record={rec}
                onOpen={onOpenRecord}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
