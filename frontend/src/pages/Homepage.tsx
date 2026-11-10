import React from 'react';
import { HeroSection } from '../components/Homepage/HeroSection';
import { ConversationFragmentSection } from '../components/Homepage/ConversationFragmentSection';
import { ProblemSection } from '../components/Homepage/ProblemSection';
import { HowItWorksSection } from '../components/Homepage/HowItWorksSection';
import { IndustryUseCasesSection } from '../components/Homepage/IndustryUseCasesSection';
import { MultilingualSection } from '../components/Homepage/MultilingualSection';
import { EvidenceTraceabilitySection } from '../components/Homepage/EvidenceTraceabilitySection';
import { GnaniTechnologySection } from '../components/Homepage/GnaniTechnologySection';
import { FinalCtaSection } from '../components/Homepage/FinalCtaSection';
import { FooterSection } from '../components/Homepage/FooterSection';

interface HomepageProps {
  onNavigateToWorkspace: () => void;
  onNavigateTab: (tab: string) => void;
}

export const Homepage: React.FC<HomepageProps> = ({
  onNavigateToWorkspace,
  onNavigateTab,
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: 'var(--color-black)', minHeight: '100vh', width: '100%' }}>
      {/* SECTION 01 — EXPERIMENTAL EDITORIAL HERO */}
      <HeroSection
        onExplore={onNavigateToWorkspace}
        onSeeHowItWorks={() => scrollToSection('how-it-works')}
      />

      {/* SECTION 02 — THE CONVERSATION FRAGMENT (MAGAZINE SPREAD) */}
      <ConversationFragmentSection />

      {/* SECTION 03 — THE PROBLEM / INVERTED EDITORIAL TYPOGRAPHY */}
      <ProblemSection />

      {/* SECTION 04 — HOW VAANITRACE WORKS (PROCESS DIAGRAM) */}
      <HowItWorksSection />

      {/* SECTION 05 — INDUSTRY APPLICATIONS (4 DISTINCT LAYOUTS) */}
      <IndustryUseCasesSection />

      {/* SECTION 06 — MULTILINGUAL VOICE (CODE-MIXING) */}
      <MultilingualSection />

      {/* SECTION 07 — EVIDENCE TRACEABILITY (TYPESETTING PROOF) */}
      <EvidenceTraceabilitySection />

      {/* SECTION 08 — GNANI TECHNOLOGY */}
      <GnaniTechnologySection />

      {/* SECTION 09 — FINAL STATEMENT */}
      <FinalCtaSection
        onStart={onNavigateToWorkspace}
        onExploreTech={() => scrollToSection('technology')}
      />

      {/* SECTION 10 — SWISS EDITORIAL FOOTER */}
      <FooterSection onNavigate={onNavigateTab} />
    </div>
  );
};
