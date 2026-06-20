import type { Metadata } from 'next';
import { AboutSplitSection } from '@/components/sections/AboutSplitSection';
import { BlogPreviewSection } from '@/components/sections/BlogPreviewSection';
import { CTASection } from '@/components/sections/CTASection';
import { HeroSection } from '@/components/sections/HeroSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { SpecializationsSection } from '@/components/sections/SpecializationsSection';
import { StatsBar } from '@/components/sections/StatsBar';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { TickerStrip } from '@/components/sections/TickerStrip';
import { TrustBadgesSection } from '@/components/sections/TrustBadgesSection';
import { ValuePropSection } from '@/components/sections/ValuePropSection';
import { ZoneHeatmap } from '@/components/sections/ZoneHeatmap';
import { HospitalTrustStrip } from '@/components/site/HospitalTrustStrip';

export const metadata: Metadata = {
  title: 'HNVNS | Healthcare Staffing Marketplace for Imaging',
  description: 'Explore HNVNS healthcare staffing solutions for imaging departments, candidate matching, and AI-assisted recruitment.'
};

export default function HomePage() {
  return (
    <div className="animate-page-fade">
      <HeroSection />
      <TickerStrip />
      <ValuePropSection />
      <ZoneHeatmap />
      <HospitalTrustStrip />
      <StatsBar />
      <HowItWorksSection />
      <SpecializationsSection />
      <TestimonialsSection />
      <TrustBadgesSection />
      <AboutSplitSection />
      <BlogPreviewSection />
      <CTASection />
    </div>
  );
}
