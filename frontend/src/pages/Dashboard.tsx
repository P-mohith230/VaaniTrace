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
        background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(6, 182, 212, 0.05))',
        border: '1px solid rgba(2, 132, 199, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
      }}>
        <div style={{ maxWidth: '650px' }}>
          <span style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: 'var(--accent-cyan)',
            display: 'block',
            marginBottom: '6px',
          }}>
            Multilingual Voice-to-Action Platform
          </span>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            Transform Spoken Words into Verified Business Action
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            VaaniTrace listens to voice orders, site debriefs, and customer conversations, structuring them into action items with unbreakable evidence links back to the original transcript.
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
          <div className="stat-icon" style={{ background: 'rgba(2, 132, 199, 0.15)', color: 'var(--accent-cyan)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="stat-value">{totalRecords}</div>
            <div className="stat-label">Total Voice Records</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-success)' }}>
            <FileCheck size={22} />
          </div>
          <div>
            <div className="stat-value">{verifiedRecords}</div>
            <div className="stat-label">Human Verified Records</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-value">{pendingRecords}</div>
            <div className="stat-label">Awaiting Verification</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="stat-value" style={{ fontSize: '18px', color: gnaniHealth?.configured ? '#34d399' : '#f87171' }}>
              {gnaniHealth?.configured ? 'Prisma v2.5' : 'Unconfigured'}
            </div>
            <div className="stat-label">Gnani Speech Engine</div>
          </div>
        </div>
      </div>

      {/* Recent Records Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 className="card-title" style={{ margin: 0 }}>Recent Voice Sessions</h3>
            <p className="card-subtitle" style={{ margin: '4px 0 0' }}>Your latest transcribed and extracted conversations</p>
          </div>

          <button onClick={onNavigateToWorkspace} className="btn btn-secondary btn-sm">
            <Mic size={14} /> New Session
          </button>
        </div>

        {isLoading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '20px 0' }}>Loading records...</p>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <Mic size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <h4 style={{ fontSize: '15px', color: '#fff', marginBottom: '6px' }}>No Voice Records Stored Yet</h4>
            <p style={{ fontSize: '13px', maxWidth: '400px', margin: '0 auto 16px' }}>
              Record or upload an audio conversation to see structured extraction and evidence mapping in action.
            </p>
            <button onClick={onNavigateToWorkspace} className="btn btn-primary btn-sm">
              Start Your First Session
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
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
