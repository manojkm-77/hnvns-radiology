import { RevealSection } from '@/components/animations/RevealSection';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { trustBadges } from '@/lib/data';

export function TrustBadgesSection() {
  return (
    <RevealSection className="border-y border-border bg-surface/35">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Trust badges</p>
            <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
              Accountability built into every handoff.
            </h2>
          </div>

          <StaggerChildren className="grid gap-4 md:grid-cols-3" stagger={0.06}>
            {trustBadges.map((badge) => (
              <div key={badge.title} className="rounded-3xl border border-border bg-bg/40 p-6">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-text">{badge.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{badge.description}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </div>
    </RevealSection>
  );
}
