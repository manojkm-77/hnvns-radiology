import { RevealSection } from '@/components/animations/RevealSection';
import { steps } from '@/lib/data';

export function ProcessSection() {
  return (
    <RevealSection id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">How it works</p>
        <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
          Three steps from raw studies to clinical action.
        </h2>
      </div>

      <div className="mt-16 space-y-0 border-l border-border pl-8 md:pl-12">
        {steps.map((step) => (
          <div key={step.number} className="relative pb-16 last:pb-0">
            <div className="absolute -left-[39px] top-1 h-5 w-5 rounded-full border-2 border-accent bg-bg" />
            <span className="text-[13vw] font-light leading-none text-border md:text-8xl">{step.number}</span>
            <h3 className="mt-4 text-2xl font-light tracking-[-0.04em] text-text">{step.title}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted md:text-base">{step.description}</p>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
