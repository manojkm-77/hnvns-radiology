import { RevealSection } from '@/components/animations/RevealSection';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  return (
    <RevealSection className="border-y border-border bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.13),transparent_36%)]">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-8 md:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Hire faster. Hire with confidence.</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">
          Post vacancies, get verified shortlists, and onboard faster.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          Reach verified imaging professionals with AI-ranked shortlists, transparent pay bands, and audit-ready onboarding documents.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/contact">Post a Vacancy</Button>
          <Button href="/register" variant="outline">Register as a Candidate</Button>
        </div>
      </div>
    </RevealSection>
  );
}
