import React, { useState } from 'react';
import { Wheat, ShoppingBag, Store, Stethoscope, RotateCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CardData {
  id: string;
  category: string;
  title: string;
  icon: React.ReactNode;
  summary: string;
  spokenSnippet: string;
  structuredFields: Array<{ label: string; value: string }>;
  badge: string;
  disclaimer?: string;
}

const USE_CASES: CardData[] = [
  {
    id: 'agri',
    category: 'AGRICULTURE',
    title: 'Giving Every Farmer a Voice.',
    icon: <Wheat size={28} />,
    summary: 'Farmers convey crop observations, field water pressure, and fertilizer requirements in their native mother tongue.',
    spokenSnippet: '"Borewell pump leakage aagide. 4 ekarakke water supply illa. Urgent repair bekku."',
    structuredFields: [
      { label: 'Field Issue', value: 'Borewell pump water leakage' },
      { label: 'Affected Area', value: '4 Acres' },
      { label: 'Immediate Need', value: 'Irrigation technician repair' },
      { label: 'Urgency', value: 'High (Water supply halted)' },
    ],
    badge: 'Regional Agronomy Workflow',
    disclaimer: 'VaaniTrace structures observational reporting and does not provide automated botanical or agronomic diagnosis.',
  },
  {
    id: 'retail',
    category: 'RETAIL STORES',
    title: 'Making Everyday Business Conversations Actionable.',
    icon: <ShoppingBag size={28} />,
    summary: 'Distributors turn rapid verbal phone calls into verified commercial invoices with automated calculation tracking.',
    spokenSnippet: '"Send 20 rice bags to Ramesh tomorrow morning. Each bag costs 1,200 rupees."',
    structuredFields: [
      { label: 'Customer', value: 'Ramesh' },
      { label: 'Product & Qty', value: '20 Rice Bags' },
      { label: 'Unit Price', value: '₹1,200.00' },
      { label: 'Calculated Total', value: '₹24,000.00 (20 × ₹1,200)' },
      { label: 'Delivery Schedule', value: 'Tomorrow morning' },
    ],
    badge: 'B2B Trade & Wholesale',
  },
  {
    id: 'grocery',
    category: 'GROCERY STORES',
    title: 'From Spoken Orders to Organized Records.',
    icon: <Store size={28} />,
    summary: 'Neighborhood merchants convert daily voice messages into clean digital line-item lists ready for packing and billing.',
    spokenSnippet: '"Two kilograms of tomatoes, one kilogram of onions and five kilograms of rice."',
    structuredFields: [
      { label: 'Item 1', value: 'Tomatoes — 2 kg' },
      { label: 'Item 2', value: 'Onions — 1 kg' },
      { label: 'Item 3', value: 'Rice — 5 kg' },
      { label: 'Order Status', value: 'Parsed & Linked to Voice' },
    ],
    badge: 'Local Commerce & Kirana',
  },
  {
    id: 'health',
    category: 'HEALTHCARE',
    title: 'Helping Healthcare Teams Organize Spoken Information.',
    icon: <Stethoscope size={28} />,
    summary: 'Clinical workers organize verbal patient intake debriefs, home health observations, and scheduled check-up dates.',
    spokenSnippet: '"Patient reports persistent fever for 3 days and joint aches. Follow-up scheduled for Tuesday morning."',
    structuredFields: [
      { label: 'Reported Symptoms', value: 'Persistent fever (3 days), Joint aches' },
      { label: 'Next Appointment', value: 'Tuesday morning' },
      { label: 'Record Type', value: 'Intake Observation Support' },
      { label: 'Assigned Nurse', value: 'Community Health Team' },
    ],
    badge: 'Clinical Information Support',
    disclaimer: 'VaaniTrace organizes administrative spoken details only and does not replace medical professionals or provide diagnosis.',
  },
];

export const IndustryUseCasesSection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="home-section" id="use-cases">
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 60px' }}>
        <span className="section-tag">REAL-WORLD IMPACT ACROSS SECTORS</span>
        <h2 className="section-heading">
          One Voice Platform. Real-World Impact.
        </h2>
        <p className="section-subheading" style={{ margin: '0 auto' }}>
          Explore interactive 3D case studies showing how VaaniTrace translates unstructured spoken vernacular into precision business and field data.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '24px',
      }}>
        {USE_CASES.map((uc) => {
          const isFlipped = !!flippedCards[uc.id];

          return (
            <div key={uc.id} className="card-3d-scene">
              <div
                className={`card-3d-inner ${isFlipped ? 'flipped' : ''}`}
                onClick={() => toggleFlip(uc.id)}
                title="Click or tap to flip card"
              >
                {/* FRONT FACE */}
                <div className="card-3d-face card-3d-front">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        color: 'var(--accent-crimson)',
                        textTransform: 'uppercase',
                      }}>
                        {uc.category}
                      </span>
                      <span className="badge badge-spoken">{uc.badge}</span>
                    </div>

                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-graphite)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-white)',
                      marginBottom: '18px',
                    }}>
                      {uc.icon}
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: 1.3 }}>
                      {uc.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: 'var(--color-muted-grey)', lineHeight: 1.6 }}>
                      {uc.summary}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #242424',
                    paddingTop: '16px',
                    fontSize: '12px',
                    color: 'var(--color-soft-white)',
                  }}>
                    <span>Tap to view structured extraction</span>
                    <RotateCw size={14} color="var(--accent-crimson)" />
                  </div>
                </div>

                {/* BACK FACE (REVERSE) */}
                <div className="card-3d-face card-3d-back">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: '#ff9da9', textTransform: 'uppercase' }}>
                        {uc.category} — STRUCTURED EVIDENCE
                      </span>
                      <RotateCw size={14} color="#ff9da9" />
                    </div>

                    {/* Spoken Speech Snippet */}
                    <div style={{
                      fontSize: '12px',
                      fontStyle: 'italic',
                      color: '#ffb3bd',
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '10px 12px',
                      borderRadius: '4px',
                      borderLeft: '2px solid var(--accent-wine)',
                      marginBottom: '14px',
                      lineHeight: 1.5,
                    }}>
                      {uc.spokenSnippet}
                    </div>

                    {/* Structured Extraction Table */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {uc.structuredFields.map((f, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: '1px solid #33151b',
                            fontSize: '12px',
                          }}
                        >
                          <span style={{ color: '#d17785', fontWeight: 500 }}>{f.label}</span>
                          <span style={{ color: '#ffffff', fontWeight: 600 }}>{f.value}</span>
                        </div>
                      ))}
                    </div>

                    {uc.disclaimer && (
                      <p style={{ fontSize: '10px', color: '#999', marginTop: '12px', lineHeight: 1.4 }}>
                        * {uc.disclaimer}
                      </p>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #4a101b', paddingTop: '12px', textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#ffb3bd' }}>Tap to flip back</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
