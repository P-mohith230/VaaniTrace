import React from 'react';
import { AlertTriangle, Wheat, ShoppingBag, Store, Stethoscope, Users, Headset } from 'lucide-react';

const PROBLEMS = [
  {
    icon: <Wheat size={22} />,
    sector: 'Agriculture & Field Operations',
    scenario: 'A farmer calls an agronomist describing yellowing leaves and low borewell pressure in mixed Marathi and Hindi.',
    pain: 'Crucial irrigation deadlines and chemical dosages get buried in rambling voice notes without structured follow-up.',
  },
  {
    icon: <ShoppingBag size={22} />,
    sector: 'Wholesale & Retail Trade',
    scenario: 'A distributor accepts 15 voice orders per hour over phone calls with rapid spoken discounts and fluctuating delivery terms.',
    pain: 'Paper notes lead to incorrect unit pricing, mismatched quantities, and delivery failures that cost margin.',
  },
  {
    icon: <Store size={22} />,
    sector: 'Grocery & Local Commerce',
    scenario: 'Customers place daily voice orders mixing regional terms (kilo, pav, bundle) across Kannada, Telugu, and English.',
    pain: 'Storekeepers waste hours manually transcribing voice notes into ledger books, introducing calculation errors.',
  },
  {
    icon: <Stethoscope size={22} />,
    sector: 'Community Healthcare',
    scenario: 'Rural health workers verbally log symptom observations and home-visit appointments between village rounds.',
    pain: 'Verbal clinical notes lack organized structure, making longitudinal patient tracking difficult for medical supervisors.',
  },
  {
    icon: <Users size={22} />,
    sector: 'Enterprise Meetings',
    scenario: 'Executive leadership spends an hour debating sprint blockers and strategy across rapid Hinglish dialogue.',
    pain: 'Key decisions are lost in 10-page text transcripts where nobody knows who was assigned which action item.',
  },
  {
    icon: <Headset size={22} />,
    sector: 'Customer Service & Grievances',
    scenario: 'Frustrated callers report complex equipment or service failures with urgent verbal timelines.',
    pain: 'Support agents summarize inaccurately, losing the caller\'s exact spoken words when disputes or escalations arise.',
  },
];

export const ProblemSection: React.FC = () => {
  return (
    <section className="home-section" id="problem">
      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 64px' }}>
        <span className="section-tag">THE CRITICAL COMMUNICATION GAP</span>
        <h2 className="section-heading">
          Important Information Gets Lost <br />
          in Everyday Conversations.
        </h2>
        <p className="section-subheading" style={{ margin: '0 auto' }}>
          Across trade, agriculture, healthcare, and enterprise, people naturally conduct business through fluid, multilingual dialogue. When audio is merely saved or transcribed as raw paragraphs, actionable intelligence dissolves.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
      }}>
        {PROBLEMS.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--color-charcoal)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle top wine accent line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--accent-wine), transparent)',
            }} />

            <div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-graphite)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-white)',
                marginBottom: '18px',
              }}>
                {item.icon}
              </div>

              <h4 style={{ fontSize: '17px', fontWeight: 600, color: '#fff', marginBottom: '10px' }}>
                {item.sector}
              </h4>

              <div style={{
                fontSize: '13px',
                color: '#d4d4d4',
                background: 'var(--color-rich-black)',
                padding: '12px 14px',
                borderRadius: '6px',
                borderLeft: '2px solid var(--accent-burgundy)',
                marginBottom: '14px',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}>
                "{item.scenario}"
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--color-muted-grey)', borderTop: '1px solid #222', paddingTop: '14px' }}>
              <AlertTriangle size={15} color="var(--accent-crimson)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span><strong>The Risk:</strong> {item.pain}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
