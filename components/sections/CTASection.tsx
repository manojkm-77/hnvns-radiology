"use client";

import { useRouter } from 'next/navigation';
import { RevealSection } from '@/components/animations/RevealSection';
import { Button } from '@/components/ui/Button';

export function CTASection() {
  const router = useRouter();

  const handleVacancyClick = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    event.preventDefault();
    const button = event.currentTarget;
    button.classList.add('btn-clicked');
    setTimeout(() => button.classList.remove('btn-clicked'), 400);
    setTimeout(() => router.push('/contact'), 300);
  };

  return (
    <RevealSection className="border-y border-border bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.13),transparent_36%)]">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center md:px-8 md:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Get Started</p>
        <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">
          Bring staffing, AI matching, and verified hiring into one precise system.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          Tell us where your team has a gap. We will match you with verified candidates and have a shortlist ready within 18 hours.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/contact" className="vacancy-button hero-cta-button" onClick={handleVacancyClick}>
            Post a Vacancy
          </Button>
          <Button href="/candidates" variant="outline">Register as a Candidate</Button>
        </div>
      </div>
    </RevealSection>
  );
}
