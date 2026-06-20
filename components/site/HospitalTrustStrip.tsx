'use client';

import { RevealSection } from '@/components/animations/RevealSection';

const hospitals = [
  'Manipal Hospitals, Whitefield',
  'Aster CMI Hospital',
  'Sakra Premium Referral Hospital',
  'Fortis Hospital, Cunningham Road',
  'Columbia Asia, Hebbal',
  'Narayana Health City'
];

export function HospitalTrustStrip() {
  return (
    <RevealSection className="pt-16 pb-6 bg-bg/30 border-t border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-8 text-center mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          Trusted by imaging departments across Bengaluru
        </p>
      </div>
      <div className="relative overflow-hidden w-full py-2">
        <div className="ticker-track flex w-max items-center gap-6 whitespace-nowrap px-4">
          {[...hospitals, ...hospitals, ...hospitals, ...hospitals].map((hospital, index) => (
            <div
              key={`${hospital}-${index}`}
              className="rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-medium text-muted transition-colors hover:border-accent/40 hover:text-text cursor-default select-none"
            >
              {hospital}
            </div>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
