import type { Metadata } from 'next';
import { FadeUp } from '@/components/animations/FadeUp';
import { CandidateRegistrationForm } from '@/components/forms/CandidateRegistrationForm';

export const metadata: Metadata = {
  title: 'Candidates | HNVNS',
  description: 'Register your radiology, imaging, PACS, or clinical operations profile with HNVNS.'
};

export default function CandidatesPage() {
  return (
    <div className="animate-page-fade">
      <FadeUp as="section" className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Candidates</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">
          Join the HNVNS talent network.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          Submit your profile for radiology, imaging, PACS, nursing, and clinical operations opportunities.
        </p>
      </FadeUp>

      <FadeUp as="section" delay={0.1} className="mx-auto max-w-4xl px-6 pb-24 md:px-8 md:pb-32">
        <CandidateRegistrationForm />
      </FadeUp>
    </div>
  );
}
