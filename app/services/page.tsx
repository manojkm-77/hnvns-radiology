import type { Metadata } from 'next';
import { CTASection } from '@/components/sections/CTASection';
import { PageHero } from '@/components/sections/PageHero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { StatsBar } from '@/components/sections/StatsBar';

export const metadata: Metadata = {
  title: 'Services | HNVNS',
  description: 'HNVNS delivers imaging operations, AI-assisted diagnostics, and structured radiology reporting for healthcare teams.'
};

export default function ServicesPage() {
  return (
    <div className="animate-page-fade">
      <PageHero
        eyebrow="Services"
        title="One radiology operating layer for imaging, AI, and reporting."
        description="From acquisition workflows to AI-assisted triage and radiologist-authored reports, HNVNS helps clinical teams reduce ambiguity and move faster."
      />
      <ServicesSection />
      <StatsBar />
      <CTASection />
    </div>
  );
}
