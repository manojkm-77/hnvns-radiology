'use client';

import { RevealSection } from '@/components/animations/RevealSection';
import { Button } from '@/components/ui/Button';

export function EarlyAccessSection() {
  return (
    <RevealSection className="border-y border-border bg-surface/30">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Early Access</p>
        <h2 className="mt-6 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
          Be among the first.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          {"We are onboarding our founding hospital partners in Bengaluru now. Early partners get zero placement fee for 60 days and direct access to our founding team."}
        </p>
        <div className="mt-10 flex justify-center">
          <Button
            href="/contact"
            className="hero-cta-button bg-gradient-to-r from-[#5df3c3] to-[#15a684] text-black shadow-[0_20px_80px_-30px_rgba(45,212,191,0.85)] hover:scale-[1.02] hover:shadow-[0_24px_90px_-35px_rgba(45,212,191,0.95)] transition-all duration-300"
          >
            Apply for early access →
          </Button>
        </div>
      </div>
    </RevealSection>
  );
}
