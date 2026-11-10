import React, { useState } from 'react';
import { ExtractedField, ActionItem, UncertainField, VerificationStatus } from '../types';
import { Check, Edit2, AlertTriangle, Calculator, Sparkles, CheckCircle2, X } from 'lucide-react';

interface ExtractionPanelProps {
  summary: string;
  fields: ExtractedField[];
  actionItems: ActionItem[];
  uncertainFields: UncertainField[];
  activeFieldId?: string | null;
  onFieldSelect?: (field: ExtractedField) => void;
  onFieldUpdate?: (index: number, updatedField: ExtractedField) => void;
  onFieldVerify?: (index: number, newStatus: VerificationStatus) => void;
}

export const ExtractionPanel: React.FC<ExtractionPanelProps> = ({
  summary,
  fields,
  actionItems,
  uncertainFields,
  activeFieldId,
  onFieldSelect,
  onFieldUpdate,
  onFieldVerify,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const startEdit = (index: number, currentValue: string) => {
    setEditingIndex(index);
    setEditValue(currentValue || '');
  };

  const saveEdit = (index: number) => {
    if (!onFieldUpdate) return;
    const originalField = fields[index];
    const isNowEdited = editValue !== originalField.original_value;

    const updated: ExtractedField = {
      ...originalField,
      current_value: editValue,
      is_edited: isNowEdited,
      evidence_type: isNowEdited ? 'manual' : originalField.evidence_type,
      verification_status: 'verified',
    };

    onFieldUpdate(index, updated);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <div>
      {/* Summary Card */}
      {summary && (
        <div style={{
          background: 'rgba(74, 16, 27, 0.25)',
          border: '1px solid var(--accent-wine)',
          borderRadius: 'var(--radius-md)',
          padding: '18px',
          marginBottom: '22px',
        }}>
          <h4 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-crimson)', fontWeight: 700, marginBottom: '6px', letterSpacing: '0.08em' }}>
            Structured Summary
          </h4>
          <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#f5f3f1' }}>{summary}</p>
        </div>
      )}

      {/* Action Items Section */}
      {actionItems.length > 0 && (
        <div style={{ marginBottom: '26px' }}>
          <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--color-muted-grey)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={15} color="var(--accent-crimson)" />
            <span>Action Items & Commitments ({actionItems.length})</span>
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {actionItems.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  background: 'var(--color-rich-black)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{item.description}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-muted-grey)', marginTop: '4px' }}>
                    {item.assignee ? `Assignee: ${item.assignee}` : 'Assignee: Team'} • {item.deadline ? `Due: ${item.deadline}` : 'Due: None'}
                  </p>
                </div>
                <span className="badge badge-spoken">{item.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Business Fields */}
      <div style={{ marginBottom: '26px' }}>
        <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--color-muted-grey)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} color="var(--accent-crimson)" />
          <span>Extracted Business Facts & Evidence ({fields.length})</span>
        </h4>

        {fields.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--color-muted-grey)' }}>No structured fields extracted yet.</p>
        ) : (
          <div className="fields-container">
            {fields.map((field, idx) => {
              const isSelected = activeFieldId === field.id || activeFieldId === field.field_name;
              const isEditing = editingIndex === idx;

              return (
                <div
                  key={field.id || `${field.field_name}-${idx}`}
                  className={`field-card ${isSelected ? 'highlighted' : ''}`}
                  onClick={() => onFieldSelect && onFieldSelect(field)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="field-header">
                    <span className="field-name">{field.field_name.replace(/_/g, ' ')}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className={`badge badge-${field.evidence_type}`}>
                        {field.evidence_type === 'calculated' && <Calculator size={10} />}
                        {field.evidence_type}
                      </span>
                      <span className={`badge badge-${field.verification_status}`}>
                        {field.verification_status}
                      </span>
                    </div>
                  </div>

                  {isEditing ? (
                    <div style={{ marginTop: '10px' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="form-control"
                        style={{ marginBottom: '10px' }}
                        autoFocus
                      />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => saveEdit(idx)}
                        >
                          <Check size={13} /> Save Value
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEdit}
                        >
                          <X size={13} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p className="field-value">
                          {field.current_value || <span style={{ color: 'var(--color-muted-grey)' }}>null</span>}
                        </p>
                        <div style={{ display: 'flex', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => startEdit(idx, field.current_value || '')}
                            title="Edit this extracted value"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          {field.verification_status !== 'verified' && onFieldVerify && (
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => onFieldVerify(idx, 'verified')}
                              title="Mark verified by human operator"
                            >
                              <Check size={12} /> Verify
                            </button>
                          )}
                        </div>
                      </div>

                      {field.is_edited && (
                        <p style={{ fontSize: '11px', color: '#ffb3bd', marginTop: '2px' }}>
                          ✎ Manually modified (Original: "{field.original_value}")
                        </p>
                      )}

                      {field.notes && (
                        <p className="field-formula">{field.notes}</p>
                      )}

                      {field.evidence?.supporting_text && (
                        <div className="field-evidence-quote" title="Click card to highlight in transcript">
                          "{field.evidence.supporting_text}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Uncertain Fields Warning */}
      {uncertainFields.length > 0 && (
        <div style={{
          background: 'rgba(74, 16, 27, 0.25)',
          border: '1px solid var(--accent-wine)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
        }}>
          <h5 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-crimson)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <AlertTriangle size={14} />
            <span>Uncertain Information Flagged for Review ({uncertainFields.length})</span>
          </h5>
          <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '12px', color: '#f5f3f1' }}>
            {uncertainFields.map((u, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>
                • <strong>{u.field_name}:</strong> {u.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
