import React from 'react';
import { RecordSummary } from '../types';
import { FileText, Calendar, CheckCircle2, Download, Trash2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface RecordCardProps {
  record: RecordSummary;
  onOpen: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({ record, onOpen, onDelete }) => {
  const formattedDate = new Date(record.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div style={{
      background: 'var(--color-charcoal)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-md)',
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '14px',
      transition: 'all 0.2s ease',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-white)', lineHeight: 1.3 }}>
            {record.title}
          </h4>
          <span className={`badge badge-${record.verification_status}`}>
            {record.verification_status}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <span style={{
            background: 'var(--color-graphite)',
            padding: '2px 8px',
            borderRadius: '4px',
            textTransform: 'capitalize',
            border: '1px solid var(--color-border-subtle)',
          }}>
            {record.record_type.replace(/_/g, ' ')}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} /> {formattedDate}
          </span>
        </div>

        <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--color-white)' }}>{record.field_count}</strong> extracted fields • <strong style={{ color: 'var(--color-white)' }}>{record.action_item_count}</strong> action items
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
        <button
          type="button"
          onClick={() => onOpen(record.id)}
          className="btn btn-primary btn-sm"
        >
          <span>Open Workspace</span>
          <ArrowRight size={13} />
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          <a
            href={api.getExportUrl(record.id, 'xlsx')}
            download
            className="btn btn-secondary btn-sm"
            title="Export Excel (.xlsx)"
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            XLSX
          </a>
          <a
            href={api.getExportUrl(record.id, 'csv')}
            download
            className="btn btn-secondary btn-sm"
            title="Export CSV"
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            CSV
          </a>
          <a
            href={api.getExportUrl(record.id, 'json')}
            download
            className="btn btn-secondary btn-sm"
            title="Export JSON"
            style={{ fontSize: '11px', padding: '4px 8px' }}
          >
            <Download size={13} />
          </a>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(record.id)}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--accent-crimson)' }}
              title="Delete record"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

