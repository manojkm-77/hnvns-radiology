import type { Metadata } from 'next';
import Link from 'next/link';
import { RevealSection } from '@/components/animations/RevealSection';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';
import { insights } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Insights | HNVNS',
  description: 'Read HNVNS insights on healthcare staffing, imaging recruitment, and workforce optimization for medical teams.'
};

export default function InsightsPage() {
  return (
    <div className="animate-page-fade">
      <PageHero
        eyebrow="Insights"
        title="Staffing thinking for imaging, diagnostics, and clinical operations."
        description="Practical articles on candidate matching, credential compliance, and hiring operations for diagnostic teams."
      />
      <RevealSection className="mx-auto max-w-7xl px-6 pb-24 md:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {insights.map((post) => (
            <article key={post.title} className="group rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.22em] text-accent">{post.category}</span>
                <span className="text-xs text-muted">{post.date}</span>
              </div>
              <h2 className="mt-8 text-2xl font-light tracking-[-0.04em] text-text group-hover:text-accent">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{post.excerpt}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-border bg-surface p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Staffing notes</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
                Want deeper hiring guidance?
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-muted md:text-base">
                Get practical checklists for credential verification, candidate matching, and staffing operations across healthcare teams.
              </p>
            </div>
            <Button href="/contact">Request the guide</Button>
          </div>
        </div>
      </RevealSection>
    </div>
  );
}
