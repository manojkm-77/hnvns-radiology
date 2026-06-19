import type { Metadata } from 'next';
import { CTASection } from '@/components/sections/CTASection';
import { PageHero } from '@/components/sections/PageHero';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { StatsBar } from '@/components/sections/StatsBar';

export const metadata: Metadata = {
  title: 'Services | HNVNS',
  description: 'HNVNS delivers healthcare staffing services for imaging, diagnostics, and clinical operations teams.'
};

export default function ServicesPage() {
  return (
    <div className="animate-page-fade">
      <PageHero
        eyebrow="Services"
        title="Healthcare staffing services for imaging, diagnostics, and clinical operations."
        description="From candidate matching to credential verification and vacancy management, HNVNS helps teams hire faster with lower risk."
      />
      <ServicesSection />
      <StatsBar />
      <CTASection />
    </div>
  );
}
