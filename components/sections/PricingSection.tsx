'use client';

import { RevealSection } from '@/components/animations/RevealSection';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';

type PricingTier = {
  name: string;
  price: string;
  period?: string;
  features: string[];
  badge?: string;
  ctaText: string;
  ctaHref: string;
  highlighted?: boolean;
};

const tiers: PricingTier[] = [
  {
    name: 'Per Placement',
    price: '₹40,000',
    period: 'flat per hire',
    features: [
      'Single role posting',
      'AI-matched shortlist within 24 hours',
      'Credential verification included',
      'No monthly commitment'
    ],
    ctaText: 'Post a vacancy →',
    ctaHref: '/contact'
  },
  {
    name: 'Priority Partner',
    price: '₹75,000',
    period: '/month',
    features: [
      'Unlimited vacancy postings',
      '18-hour guaranteed shortlist',
      'Dedicated account manager',
      'Credential verification included',
      'Unlimited placements, zero per-hire fee'
    ],
    badge: 'Most popular',
    ctaText: 'Become a partner →',
    ctaHref: '/contact',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Multi-department coverage',
      'Dedicated sourcing team',
      'SLA-backed delivery',
      'Analytics dashboard'
    ],
    ctaText: 'Talk to us →',
    ctaHref: '/contact'
  }
];

export function PricingSection() {
  return (
    <RevealSection id="pricing" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32 border-t border-border">
      <SectionHeader
        eyebrow="Pricing Plans"
        title="Simple, transparent pricing"
        description="Choose the right staffing model for your clinical team's needs."
      />

      <StaggerChildren className="mt-14 grid gap-8 grid-cols-1 md:grid-cols-3" stagger={0.07}>
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`relative rounded-[2rem] border bg-surface p-8 transition-colors duration-300 flex flex-col justify-between hover:border-accent/40 ${
              tier.highlighted
                ? 'border-accent shadow-[0_0_40px_rgba(45,212,191,0.04)]'
                : 'border-border'
            }`}
          >
            {tier.badge && (
              <span className="absolute top-0 right-8 -translate-y-1/2 rounded-full border border-accent bg-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-bg">
                {tier.badge}
              </span>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                {tier.name}
              </p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-light tracking-tight text-text md:text-5xl">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-muted font-normal ml-1">
                    {tier.period}
                  </span>
                )}
              </div>
              <ul className="mt-8 space-y-4 border-t border-border/40 pt-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-3 text-sm text-muted items-start">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <Button
                href={tier.ctaHref}
                variant={tier.highlighted ? 'primary' : 'outline'}
                className={`w-full ${
                  tier.highlighted
                    ? 'bg-gradient-to-r from-[#5df3c3] to-[#15a684] text-black shadow-[0_20px_80px_-30px_rgba(45,212,191,0.85)] hover:scale-[1.02] hover:shadow-[0_24px_90px_-35px_rgba(45,212,191,0.95)]'
                    : ''
                }`}
              >
                {tier.ctaText}
              </Button>
            </div>
          </article>
        ))}
      </StaggerChildren>

      <div className="mt-12 text-center">
        <p className="text-xs text-muted leading-relaxed">
          * All placements include credential verification and onboarding documentation at no extra cost.
        </p>
      </div>
    </RevealSection>
  );
}
