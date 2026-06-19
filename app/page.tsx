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

export const metadata: Metadata = {
  title: 'HNVNS | Advanced Imaging, AI Diagnostics, and Reporting',
  description: 'Explore HNVNS full-stack radiology services across imaging operations, AI diagnostics, and precision reporting.'
};

export default function HomePage() {
  return (
    <div className="animate-page-fade">
      <HeroSection />
      <TickerStrip />
      <ValuePropSection />
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
