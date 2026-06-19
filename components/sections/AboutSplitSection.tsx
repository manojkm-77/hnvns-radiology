import { RevealSection } from '@/components/animations/RevealSection';

const bullets = [
  'Verified credential checks for every candidate',
  'AI-ranked shortlists that match specialty and availability',
  'Transparent pay bands and direct HR communication',
  'One-click onboarding documents and audit-ready summaries'
];

export function AboutSplitSection() {
  return (
    <RevealSection id="about" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">About HNVNS</p>
          <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
            Full-stack healthcare staffing built around precision, speed, and trust.
          </h2>
          <p className="mt-6 text-base leading-8 text-muted md:text-lg">
            HNVNS is a staffing marketplace that connects hospitals and diagnostic centres with verified imaging professionals — from technologists to reporting specialists.
          </p>
          <p className="mt-6 text-base leading-8 text-muted md:text-lg">
            We reduce time-to-hire with AI-driven matching, transparent pay bands, and end-to-end onboarding documentation so clinical teams can focus on care.
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface p-8">
          <ul className="space-y-6">
            {bullets.map((bullet) => (
              <li key={bullet} className="rounded-2xl border-l-2 border-accent bg-bg/40 p-5 text-sm leading-7 text-muted">
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </RevealSection>
  );
}
