import React, { useState, useEffect } from 'react';
import { RecordSummary } from '../types';
import { api } from '../services/api';
import { RecordCard } from '../components/RecordCard';
import { Search, Filter, RefreshCw, FileText } from 'lucide-react';

interface RecordsListProps {
  onOpenRecord: (id: string) => void;
  onNavigateToWorkspace: () => void;
}

export const RecordsList: React.FC<RecordsListProps> = ({
  onOpenRecord,
  onNavigateToWorkspace,
}) => {
  const [records, setRecords] = useState<RecordSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [recordType, setRecordType] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchRecords();
  }, [recordType, statusFilter]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const data = await api.listRecords({
        record_type: recordType || undefined,
        verification_status: statusFilter || undefined,
        search: search.trim() || undefined,
      });
      setRecords(data);
    } catch (err) {
      console.error('Failed to load records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecords();
  };

  const handleDeleteRecord = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this voice record?')) {
      return;
    }
    try {
      await api.deleteRecord(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(`Failed to delete record: ${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
            Saved Voice Records
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Browse, search, edit and export structured conversation archives
          </p>
        </div>

        <button onClick={onNavigateToWorkspace} className="btn btn-primary">
          <FileText size={16} /> New Session
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '24px' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search in title or transcript keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ minWidth: '180px' }}>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="form-control"
            >
              <option value="">All Record Types</option>
              <option value="business_order">Business Orders</option>
              <option value="meeting_action_items">Meeting Action Items</option>
              <option value="field_report">Field Reports</option>
              <option value="customer_complaint">Customer Complaints</option>
              <option value="general_conversation">General Conversations</option>
            </select>
          </div>

          <div style={{ minWidth: '160px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-control"
            >
              <option value="">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="needs_review">Needs Review</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary">
            <Filter size={14} /> Filter
          </button>
        </form>
      </div>

      {/* Records Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontSize: '14px' }}>Loading records from SQLite database...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text-muted)' }}>
          <FileText size={44} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
            {search || recordType || statusFilter ? 'No Matching Records Found' : 'No Voice Records Stored Yet'}
          </h4>
          <p style={{ fontSize: '13px', maxWidth: '460px', margin: '0 auto 20px', lineHeight: 1.6, color: 'var(--color-muted-grey)' }}>
            {search || recordType || statusFilter
              ? 'Try clearing your search query or reset the filters to see all records.'
              : 'Your workspace database is in a clean, production-ready state. Start a new session using your microphone or an audio file to extract structured, evidence-linked data.'}
          </p>
          <button onClick={onNavigateToWorkspace} className="btn btn-primary" style={{ padding: '12px 24px' }}>
            <FileText size={16} /> Start Voice Session
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
          {records.map((r) => (
            <RecordCard
              key={r.id}
              record={r}
              onOpen={onOpenRecord}
              onDelete={handleDeleteRecord}
            />
          ))}
        </div>
      )}
    </div>
  );
};

