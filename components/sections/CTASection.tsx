import { RevealSection } from '@/components/animations/RevealSection';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <RevealSection className="border-y border-border bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.13),transparent_36%)]">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-8 md:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Ready for clearer imaging workflows</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">
          Bring imaging, AI diagnostics, and reporting into one precise system.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          Tell us where your imaging workflow slows down. We will map the fastest path to measurable turnaround, quality, and clinical clarity.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/contact">Start a conversation</Button>
          <Button href="/about" variant="outline">Learn about HNVNS</Button>
        </div>
      </div>
    </RevealSection>
  );
}
