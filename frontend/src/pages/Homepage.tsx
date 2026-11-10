import React from 'react';
import { HeroSection } from '../components/Homepage/HeroSection';
import { ProblemSection } from '../components/Homepage/ProblemSection';
import { DifferenceSection } from '../components/Homepage/DifferenceSection';
import { HowItWorksSection } from '../components/Homepage/HowItWorksSection';
import { IndustryUseCasesSection } from '../components/Homepage/IndustryUseCasesSection';
import { MultilingualSection } from '../components/Homepage/MultilingualSection';
import { EvidenceTraceabilitySection } from '../components/Homepage/EvidenceTraceabilitySection';
import { GnaniTechnologySection } from '../components/Homepage/GnaniTechnologySection';
import { ProductPreviewSection } from '../components/Homepage/ProductPreviewSection';
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
    <div>
      <HeroSection
        onExplore={onNavigateToWorkspace}
        onSeeHowItWorks={() => scrollToSection('how-it-works')}
      />

      <ProblemSection />

      <DifferenceSection />

      <HowItWorksSection />

      <IndustryUseCasesSection />

      <MultilingualSection />

      <EvidenceTraceabilitySection />

      <GnaniTechnologySection />

      <ProductPreviewSection onOpenWorkspace={onNavigateToWorkspace} />

      <FinalCtaSection
        onStart={onNavigateToWorkspace}
        onExploreTech={() => scrollToSection('technology')}
      />

      <FooterSection onNavigate={onNavigateTab} />
    </div>
  );
};
