'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { HeroHeadline } from '@/components/animations/HeroHeadline';
import { RevealSection } from '@/components/animations/RevealSection';

export function HeroSection() {
  return (
    <RevealSection className="relative min-h-screen overflow-hidden pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.06),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(rgba(240,240,240,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(240,240,240,0.12) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />

      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-7xl items-center gap-12 px-6 pb-20 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.1 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Healthcare staffing for imaging, AI, and verified hiring
          </motion.div>

          <HeroHeadline />

          <p className="mt-8 max-w-2xl text-lg leading-8 text-muted md:text-xl">
            HNVNS connects hospitals and healthcare teams with credentialed clinical talent through AI-powered matching — faster, smarter, with zero placement noise.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              href="/contact"
              className="bg-gradient-to-r from-[#5df3c3] to-[#15a684] text-black shadow-[0_20px_80px_-30px_rgba(45,212,191,0.85)] hover:scale-[1.02] hover:shadow-[0_24px_90px_-35px_rgba(45,212,191,0.95)] transition-all duration-300 animate-[pulse_2.8s_ease-in-out_infinite]"
            >
              Request Staff Now
            </Button>
            <Button
              href="/jobs"
              variant="outline"
              className="border-white/20 text-white/90 hover:border-white hover:text-white hover:shadow-[0_0_30px_rgba(255,255,255,0.18)] transition-all duration-300"
            >
              Browse Open Roles
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/10 blur-3xl" />
          <div className="rounded-[2rem] border border-border bg-surface/80 p-4 shadow-2xl backdrop-blur-xl md:p-6">
            <div className="rounded-[1.5rem] border border-border bg-bg p-5 md:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted">Live vacancy feed</p>
                  <p className="mt-1 text-sm font-medium text-text">Hospital staffing · AI match · Verified</p>
                </div>
                <span className="rounded-full border border-accent/30 px-3 py-1 text-xs text-accent">AI assisted</span>
              </div>

              <div className="space-y-3">
                {[
                  ['Senior MRI Technologist · Apollo Hospitals, Bengaluru', 'Urgent', 'AI match 94%'],
                  ['CT Radiographer · Manipal Hospital, Mangaluru', 'New', 'AI match 89%'],
                  ['Reporting Specialist · Narayana Health, Hyderabad', 'Open', 'AI match 87%']
                ].map((item, index) => (
                  <div key={item[0]} className="rounded-2xl border border-border bg-surface p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-text">{item[0]}</p>
                        <p className="mt-1 text-sm text-muted">{item[1]}</p>
                      </div>
                      <span className="text-sm text-accent">{item[2]}</span>
                    </div>
                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-border">
                      <motion.div
                        initial={{ width: '18%' }}
                        animate={{ width: `${34 + index * 18}%` }}
                        transition={{ duration: 1.4, delay: 0.35 + index * 0.12, ease: 'easeOut' }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {['Match', 'Verify', 'Place'].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-border bg-surface p-3 text-center">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-2 text-sm font-medium text-text">0{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#services" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted md:flex" aria-label="Scroll to services">
        <span>Scroll</span>
        <span className="block h-8 w-px overflow-hidden bg-border">
          <span className="block h-3 w-px animate-bounce bg-accent" />
        </span>
      </a>
    </RevealSection>
  );
}
