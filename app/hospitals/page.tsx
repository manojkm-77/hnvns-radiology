import type { Metadata } from 'next';
import { FadeUp } from '@/components/animations/FadeUp';
import { Button } from '@/components/ui/Button';
import { VacancyForm } from '@/components/forms/VacancyForm';
import { PricingSection } from '@/components/sections/PricingSection';

export const metadata: Metadata = {
  title: 'Hospitals | HNVNS',
  description: 'Request staffing support, submit vacancies, or speak with the HNVNS hospital partnerships team for clinical coverage and talent pipeline delivery.'
};

const actionCards = [
  {
    title: 'Request Staff',
    description: 'Tell us the role type, shift requirements, and coverage gaps your clinical team needs filled.',
    href: '#vacancy-form',
    label: 'Request Staff →'
  },
  {
    title: 'Submit Vacancy',
    description: 'Share an open role and we will match it with qualified talent across imaging, diagnostics, and clinical operations.',
    href: '#vacancy-form',
    label: 'Submit Vacancy →'
  },
  {
    title: 'Talk to HR',
    description: 'Connect with our partnerships team for staffing models, SLAs, and onboarding support.',
    href: '/contact',
    label: 'Talk to HR →'
  }
];

export default function HospitalsPage() {
  return (
    <div className="animate-page-fade">
      <FadeUp as="section" className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Hospitals</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">
          Build a reliable staffing pipeline.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          Request staff, submit vacancies, or speak with our team to align clinical coverage with patient demand.
        </p>
      </FadeUp>

      <FadeUp as="section" delay={0.1} className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 md:grid-cols-3 md:px-8">
        {actionCards.map((card) => (
          <article key={card.title} className="rounded-[2rem] border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40">
            <h2 className="text-2xl font-light tracking-[-0.04em] text-text">{card.title}</h2>
            <p className="mt-4 text-sm leading-7 text-muted">{card.description}</p>
            <Button href={card.href} variant="outline" className="mt-8">
              {card.label}
            </Button>
          </article>
        ))}
      </FadeUp>

      <FadeUp as="section" delay={0.2} className="mx-auto max-w-4xl px-6 pb-24 md:px-8 md:pb-32">
        <VacancyForm />
      </FadeUp>

      <PricingSection />
    </div>
  );
}
