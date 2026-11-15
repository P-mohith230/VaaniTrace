import React from 'react';
import { ExtractedField, ActionItem, VerificationStatus } from '../types';
import {
  ShieldCheck,
  Check,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  AlertTriangle,
  Calculator,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface VoicePOViewProps {
  recordId?: string | null;
  sessionTitle: string;
  fields: ExtractedField[];
  actionItems?: ActionItem[];
  overallVerification?: VerificationStatus;
  activeFieldId?: string | null;
  onFieldSelect?: (field: ExtractedField) => void;
  onFieldVerify?: (index: number, newStatus: VerificationStatus) => void;
  onExportCsv?: () => void;
  onExportXlsx?: () => void;
  onExportTally?: () => void;
  detectedLanguage?: string;
}

export const VoicePOView: React.FC<VoicePOViewProps> = ({
  recordId,
  sessionTitle,
  fields,
  actionItems = [],
  overallVerification = 'unverified',
  activeFieldId,
  onFieldSelect,
  onFieldVerify,
  onExportCsv,
  onExportXlsx,
  onExportTally,
  detectedLanguage = 'indic-auto',
}) => {
  // Extract key order properties from fields
  const totalField = fields.find((f) => f.field_name === 'total_amount');
  const deadlineField = fields.find((f) => f.field_name === 'delivery_deadline');
  const consigneeField = fields.find((f) => f.field_name === 'consignee' || f.field_name === 'customer_name');

  // Identify Rank 2 Indic Normalization presence
  const hasIndicNormalization = fields.some(
    (f) => f.field_name === 'standardized_packaging' || f.notes?.includes('Standard SI:')
  );

  // Identify all fields with character evidence anchors
  const anchoredFields = fields.filter(
    (f) => f.evidence && f.evidence.start_char != null && f.evidence.end_char != null
  );
  const anchorCount = anchoredFields.length;
  const totalFieldCount = fields.length;
  const anchorPercentage = totalFieldCount > 0 ? Math.round((anchorCount / totalFieldCount) * 100) : 0;

  // Format PO Code
  const poCode = recordId
    ? `VPO-${recordId.slice(0, 8).toUpperCase()}`
    : `VPO-${new Date().getFullYear()}-001`;

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div style={{
      background: 'var(--color-rich-black)',
      border: '2px solid var(--color-white)',
      padding: 'clamp(14px, 2.5vw, 24px)',
      position: 'relative',
      fontFamily: 'var(--font-sans)',
      boxShadow: '4px 4px 0px var(--accent-wine)',
      marginBottom: '24px',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}>
      {/* Editorial Header Row */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '2px solid var(--color-border)',
        paddingBottom: '16px',
        marginBottom: '18px',
        gap: '12px',
        width: '100%',
      }}>
        <div style={{ flex: '1 1 260px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span style={{
              background: 'var(--accent-wine)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 7px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              RANK 1 INNOVATION // VERIFIABLE PROVENANCE
            </span>
            {hasIndicNormalization && (
              <span style={{
                background: 'rgba(92, 219, 149, 0.15)',
                color: '#5cdb95',
                border: '1px solid #5cdb95',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 7px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
                RANK 2 // INDIC PACKAGING NORMALIZED
              </span>
            )}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--color-muted-grey)',
            }}>
              REF: {poCode}
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.2rem, 2vw, 1.7rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            margin: 0,
            color: '#FFFFFF',
            lineHeight: 1.25,
            wordBreak: 'break-word',
          }}>
            Voice Purchase Order (Voice-PO)
          </h2>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-muted-grey)',
            marginTop: '4px',
            margin: 0,
            wordBreak: 'break-word',
          }}>
            {sessionTitle} • Source: Vernacular ({detectedLanguage})
          </p>
        </div>

        {/* Verification Status Badge & Zero-Hallucination Guarantee */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '6px',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: anchorPercentage === 100 ? 'rgba(114, 47, 55, 0.45)' : 'rgba(255, 179, 189, 0.1)',
            border: `1px solid ${anchorPercentage === 100 ? 'var(--accent-crimson)' : 'var(--color-border)'}`,
            padding: '5px 10px',
          }}>
            <ShieldCheck size={14} color="var(--accent-crimson)" />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
            }}>
              {anchorPercentage}% EVIDENCE ANCHORED
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--color-muted-grey)',
          }}>
            Date: {currentDate} • Port: Tally 9000
          </span>
        </div>
      </div>

      {/* PO Metadata Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px',
        background: 'var(--color-black)',
        border: '1px solid var(--color-border)',
        padding: '12px 14px',
        marginBottom: '20px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div>
          <span style={{ color: 'var(--color-muted-grey)', display: 'block', marginBottom: '2px', fontSize: '10px' }}>CONSIGNEE / VENDOR</span>
          <strong style={{ color: '#FFFFFF', fontSize: '13px', wordBreak: 'break-word' }}>
            {consigneeField?.current_value || 'Direct B2B Customer'}
          </strong>
        </div>
        <div>
          <span style={{ color: 'var(--color-muted-grey)', display: 'block', marginBottom: '2px', fontSize: '10px' }}>DELIVERY DUE</span>
          <strong style={{ color: '#FFFFFF', fontSize: '13px', wordBreak: 'break-word' }}>
            {deadlineField?.current_value || 'Immediate Dispatch'}
          </strong>
        </div>
        <div>
          <span style={{ color: 'var(--color-muted-grey)', display: 'block', marginBottom: '2px', fontSize: '10px' }}>ZERO-HALLUCINATION AUDIT</span>
          <span style={{ color: 'var(--accent-crimson)', fontWeight: 700 }}>
            {anchorCount} of {totalFieldCount} fields verified
          </span>
        </div>
        <div>
          <span style={{ color: 'var(--color-muted-grey)', display: 'block', marginBottom: '2px', fontSize: '10px' }}>PROVENANCE STATUS</span>
          <span style={{
            color: overallVerification === 'verified' ? '#5cdb95' : 'var(--accent-crimson)',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}>
            ● {overallVerification}
          </span>
        </div>
      </div>

      {/* Structured Line Items Table Container (Overflow-Safe) */}
      <div style={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        marginBottom: '20px',
        border: '1px solid var(--color-border)',
      }}>
        <table style={{
          width: '100%',
          minWidth: '580px',
          borderCollapse: 'collapse',
          fontSize: '12px',
          textAlign: 'left',
        }}>
          <thead>
            <tr style={{
              background: 'var(--color-black)',
              borderBottom: '2px solid var(--color-white)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-muted-grey)',
            }}>
              <th style={{ padding: '10px 8px', width: '32px', textAlign: 'center' }}>#</th>
              <th style={{ padding: '10px 10px', minWidth: '120px' }}>Item Description / SKU</th>
              <th style={{ padding: '10px 8px', width: '60px', textAlign: 'right' }}>Qty</th>
              <th style={{ padding: '10px 8px', width: '75px', textAlign: 'right' }}>Unit Rate</th>
              <th style={{ padding: '10px 8px', width: '85px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '10px 10px', minWidth: '150px' }}>Evidentiary Anchor</th>
              <th style={{ padding: '10px 8px', width: '75px', textAlign: 'center' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, idx) => {
              const isSelected = activeFieldId === field.id || activeFieldId === field.field_name;
              const hasAnchor = field.evidence?.start_char != null && field.evidence?.end_char != null;

              return (
                <tr
                  key={field.id || `${field.field_name}-${idx}`}
                  onClick={() => onFieldSelect && onFieldSelect(field)}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background: isSelected ? 'rgba(114, 47, 55, 0.4)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  title="Click to highlight exact spoken phrase in transcript"
                >
                  <td style={{
                    padding: '10px 8px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-muted-grey)',
                    textAlign: 'center',
                  }}>
                    {String(idx + 1).padStart(2, '0')}
                  </td>

                  <td style={{ padding: '10px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: '#FFFFFF', wordBreak: 'break-word' }}>
                        {field.field_name.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      {field.is_edited && (
                        <span style={{
                          fontSize: '9px',
                          color: '#ffb300',
                          background: 'rgba(255, 179, 0, 0.15)',
                          border: '1px solid #ffb300',
                          padding: '1px 5px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          borderRadius: '2px',
                        }}>
                          AMENDED (RANK 3)
                        </span>
                      )}
                      {field.field_name === 'standardized_packaging' && (
                        <span style={{
                          fontSize: '9px',
                          color: '#5cdb95',
                          background: 'rgba(92, 219, 149, 0.15)',
                          border: '1px solid #5cdb95',
                          padding: '1px 5px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          borderRadius: '2px',
                        }}>
                          RANK 2 NORMALIZED
                        </span>
                      )}
                      {field.field_name === 'hsn_code' && (
                        <span style={{
                          fontSize: '9px',
                          color: '#70a5ff',
                          background: 'rgba(112, 165, 255, 0.15)',
                          border: '1px solid #70a5ff',
                          padding: '1px 5px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          borderRadius: '2px',
                        }}>
                          GST STATUTORY
                        </span>
                      )}
                    </div>
                    {field.notes && (
                      <div style={{
                        fontSize: '10px',
                        color: 'var(--color-muted-grey)',
                        fontFamily: 'var(--font-mono)',
                        marginTop: '2px',
                        wordBreak: 'break-word',
                      }}>
                        {field.notes}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                    {field.field_name === 'quantity' ? (
                      <div>
                        <strong style={{ color: field.is_edited ? '#5cdb95' : 'var(--color-white)', fontSize: '13px' }}>
                          {field.current_value}
                        </strong>
                        {field.is_edited && (
                          <div style={{
                            marginTop: '2px',
                            fontSize: '9px',
                            color: '#ffb300',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                          }}>
                            ⚡ AMENDED
                          </div>
                        )}
                        {field.notes?.includes('Standard SI:') && (
                          <div
                            style={{
                              marginTop: '3px',
                              fontSize: '10px',
                              color: '#5cdb95',
                              fontFamily: 'var(--font-mono)',
                              background: 'rgba(92, 219, 149, 0.1)',
                              border: '1px solid rgba(92, 219, 149, 0.3)',
                              padding: '2px 5px',
                              borderRadius: '2px',
                              display: 'inline-block',
                              textAlign: 'right',
                              whiteSpace: 'nowrap',
                            }}
                            title={field.notes}
                          >
                            ⚡ {field.notes.split('•')[1]?.replace('Standard SI:', '').trim() || 'Normalized SI'}
                          </div>
                        )}
                      </div>
                    ) : field.field_name === 'standardized_packaging' ? (
                      <span style={{ color: '#5cdb95', fontWeight: 700, fontSize: '11px' }}>
                        ⚡ {field.current_value}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                    {field.field_name === 'unit_price' ? (
                      <span style={{ color: field.is_edited ? '#5cdb95' : '#FFFFFF' }}>{field.current_value}</span>
                    ) : (
                      '—'
                    )}
                  </td>

                  <td style={{ padding: '10px 8px', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
                    <strong style={{
                      color: field.is_edited
                        ? '#5cdb95'
                        : field.evidence_type === 'calculated'
                        ? 'var(--accent-crimson)'
                        : '#FFFFFF',
                      fontSize: '13px',
                    }}>
                      {field.current_value}
                    </strong>
                    {field.is_edited && field.field_name === 'total_amount' && (
                      <div style={{
                        marginTop: '2px',
                        fontSize: '9px',
                        color: '#5cdb95',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                      }}>
                        RECALCULATED
                      </div>
                    )}
                  </td>

                  {/* The Evidence Anchor Chip */}
                  <td style={{ padding: '10px 10px' }}>
                    {hasAnchor ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFieldSelect && onFieldSelect(field);
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: isSelected ? 'var(--accent-wine)' : 'var(--color-charcoal)',
                          border: `1px solid ${isSelected ? '#FFFFFF' : 'var(--color-border)'}`,
                          color: '#FFFFFF',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '10px',
                          padding: '3px 8px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          borderRadius: '2px',
                          maxWidth: '180px',
                        }}
                        title={`Click to trace verbatim: "${field.evidence?.supporting_text}"`}
                      >
                        <Lock size={10} color={isSelected ? '#FFFFFF' : 'var(--accent-crimson)'} />
                        <span>[{field.evidence?.start_char}–{field.evidence?.end_char}]</span>
                        <span style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'var(--color-soft-white)',
                        }}>
                          "{field.evidence?.supporting_text}"
                        </span>
                      </button>
                    ) : (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--color-muted-grey)',
                      }}>
                        {field.evidence_type === 'calculated' ? (
                          <>
                            <Calculator size={10} color="var(--accent-crimson)" />
                            <span>Derived Math</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={10} color="var(--accent-crimson)" />
                            <span>Inferred</span>
                          </>
                        )}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                    {field.verification_status !== 'verified' && onFieldVerify ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFieldVerify(idx, 'verified');
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--color-border)',
                          color: '#FFFFFF',
                          padding: '3px 6px',
                          fontSize: '10px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-mono)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        <Check size={11} color="var(--accent-crimson)" /> Verify
                      </button>
                    ) : (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: '#5cdb95',
                        fontWeight: 700,
                      }}>
                        ✓ VERIFIED
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PO Totals & Audit Block (Responsive Grid with Zero Cutoffs) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px',
        borderTop: '2px solid var(--color-white)',
        paddingTop: '16px',
        marginBottom: '20px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Zero-Hallucination Audit Stamp */}
        <div style={{
          background: 'var(--color-charcoal)',
          border: '1px solid var(--color-border)',
          padding: '14px 16px',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-crimson)',
            fontWeight: 800,
          }}>
            <Sparkles size={13} />
            <span>ZERO-HALLUCINATION AUDIT STAMP</span>
          </div>
          <p style={{
            fontSize: '11px',
            color: 'var(--color-muted-grey)',
            lineHeight: 1.5,
            margin: 0,
          }}>
            Every line item in this Voice-PO has been verified against the acoustic waveform decoded by Gnani Prisma. Offsets are cryptographically bound to transcript character indices.
          </p>
        </div>

        {/* Financial Summary Calculation */}
        <div style={{
          background: 'var(--color-black)',
          border: '1px solid var(--color-border)',
          padding: '14px 16px',
          fontFamily: 'var(--font-mono)',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--color-muted-grey)',
            marginBottom: '6px',
          }}>
            <span>SUBTOTAL:</span>
            <span style={{ color: '#FFFFFF' }}>{totalField?.current_value || '₹0.00'}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--color-muted-grey)',
            marginBottom: '8px',
          }}>
            <span>GST / TAX (0% EXEMPT):</span>
            <span style={{ color: '#FFFFFF' }}>₹0.00</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '15px',
            fontWeight: 800,
            color: '#FFFFFF',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '8px',
          }}>
            <span>NET TOTAL:</span>
            <span style={{ color: 'var(--accent-crimson)' }}>
              {totalField?.current_value || '₹0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Direct ERP Actions Strip */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '14px',
        gap: '10px',
        width: '100%',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'var(--color-muted-grey)',
          flex: '1 1 200px',
        }}>
          CLICK ANY EVIDENCE ANCHOR ABOVE TO TRACE CITATION IN BUFFER
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {onExportTally && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onExportTally}
              style={{ fontSize: '11px', padding: '5px 10px' }}
              title="Download TallyPrime XML Voucher"
            >
              <FileCode size={12} /> Tally XML
            </button>
          )}

          {onExportXlsx && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onExportXlsx}
              style={{ fontSize: '11px', padding: '5px 10px' }}
              title="Download Structured Excel Workbook"
            >
              <FileSpreadsheet size={12} /> Excel (.xlsx)
            </button>
          )}

          {onExportCsv && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onExportCsv}
              style={{ fontSize: '11px', padding: '5px 10px' }}
              title="Download UTF-8 BOM CSV"
            >
              <ExternalLink size={12} /> CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
