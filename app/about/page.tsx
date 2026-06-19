import type { Metadata } from 'next';
import { RevealSection } from '@/components/animations/RevealSection';
import { AboutSplitSection } from '@/components/sections/AboutSplitSection';
import { CTASection } from '@/components/sections/CTASection';
import { PageHero } from '@/components/sections/PageHero';
import { StatsBar } from '@/components/sections/StatsBar';

export const metadata: Metadata = {
  title: 'About | HNVNS',
  description: 'Learn how HNVNS connects hospitals and healthcare teams with verified clinical talent through AI-powered recruitment.'
};

const principles = [
  {
    title: 'Clinical first',
    description: 'Every staffing decision starts with the care team and the confidence required to keep coverage safe.'
  },
  {
    title: 'AI with accountability',
    description: 'AI support prioritizes candidates, validates credentials, and keeps hiring managers in control of every placement.'
  },
  {
    title: 'Systems that integrate',
    description: 'HNVNS is built to connect with existing HR, credentialing, and scheduling workflows instead of creating more friction.'
  }
];

export default function AboutPage() {
  return (
    <div className="animate-page-fade">
      <PageHero
        eyebrow="About HNVNS"
        title="A healthcare staffing marketplace for imaging and diagnostic teams."
        description="HNVNS connects hospitals, clinics, and diagnostic centres with verified clinical talent through AI-powered matching and credential verification."
      />
      <AboutSplitSection />
      <RevealSection className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <article key={principle.title} className="rounded-3xl border border-border bg-surface p-7">
              <span className="h-px w-12 bg-accent" />
              <h2 className="mt-7 text-2xl font-light tracking-[-0.04em] text-text">{principle.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{principle.description}</p>
            </article>
          ))}
        </div>
      </RevealSection>
      <StatsBar />
      <CTASection />
    </div>
  );
}
