import type { Metadata } from 'next';
import { RevealSection } from '@/components/animations/RevealSection';
import { AboutSplitSection } from '@/components/sections/AboutSplitSection';
import { CTASection } from '@/components/sections/CTASection';
import { PageHero } from '@/components/sections/PageHero';
import { StatsBar } from '@/components/sections/StatsBar';

export const metadata: Metadata = {
  title: 'About | HNVNS',
  description: 'Learn how HNVNS combines radiologist expertise, AI diagnostics, and reporting workflows for modern imaging teams.'
};

const principles = [
  {
    title: 'Clinical first',
    description: 'Every workflow starts with the decision a care team needs to make and the confidence required to act.'
  },
  {
    title: 'AI with accountability',
    description: 'AI support is designed to prioritize, measure, and assist while keeping radiologists responsible for final interpretation.'
  },
  {
    title: 'Systems that integrate',
    description: 'HNVNS is built to connect with existing imaging, reporting, and operational infrastructure instead of replacing it overnight.'
  }
];

export default function AboutPage() {
  return (
    <div className="animate-page-fade">
      <PageHero
        eyebrow="About HNVNS"
        title="A full-stack radiology company for teams that need precision at scale."
        description="HNVNS unites imaging operations, AI diagnostics, and reporting into a single clinical workflow for hospitals, clinics, and research organizations."
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
