'use client';

import { RevealSection } from '@/components/animations/RevealSection';
import { StaggerChildren } from '@/components/animations/StaggerChildren';

type TrustCard = {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  description: string;
};

const trustCards: TrustCard[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-accent">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    iconClass: 'ti-shield-check',
    label: 'Credential-verified only',
    description: 'Every candidate is license and certification checked before appearing in any shortlist.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-accent">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconClass: 'ti-clock',
    label: 'Shortlists within 18 hours',
    description: 'Urgent roles get a ranked candidate shortlist delivered to your HR inbox the same day.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-accent">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a9 9 0 0118 0z" />
      </svg>
    ),
    iconClass: 'ti-map-pin',
    label: 'Bengaluru-first network',
    description: 'Our active candidate pool is concentrated across Whitefield, Koramangala, Hebbal, and Jayanagar.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-accent">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    iconClass: 'ti-lock',
    label: 'Privacy-first matching',
    description: 'Candidates remain anonymous until they choose to apply to your specific vacancy.'
  }
];

export function TrustStrip() {
  return (
    <RevealSection className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <StaggerChildren className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
        {trustCards.map((card) => (
          <div
            key={card.label}
            className="group rounded-[2rem] border-[0.5px] border-border bg-surface p-7 md:p-8 flex flex-col items-start text-left hover:border-accent/40 transition-colors duration-300"
          >
            <div className={`p-3 rounded-2xl bg-accent/10 mb-6 flex items-center justify-center ${card.iconClass}`}>
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-text mb-2">
              {card.label}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {card.description}
            </p>
          </div>
        ))}
      </StaggerChildren>
    </RevealSection>
  );
}
