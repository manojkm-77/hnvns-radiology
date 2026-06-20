import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Onboarding | HNVNS',
  description: 'Choose your account type to get started with HNVNS.',
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.06),transparent_45%)]" />
      
      <div className="w-full max-w-2xl rounded-[2rem] border border-border bg-surface/80 p-8 shadow-glow backdrop-blur-xl text-center">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Getting Started</p>
          <h1 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">
            Welcome to HNVNS.
          </h1>
          <p className="mt-2 text-sm text-muted">
            Select how you would like to use our healthcare staffing marketplace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Candidate Card */}
          <Link
            href="/candidates"
            className="group block rounded-2xl border border-border bg-bg p-6 text-left hover:border-accent/40 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] animate-[page-fade_0.35s_ease-out]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-bg transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-medium text-text">I am a Candidate</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              I am an imaging specialist, technologist, or clinical staff looking for verified roles and placements.
            </p>
            <div className="mt-4 text-xs font-medium text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Join Network <span>→</span>
            </div>
          </Link>

          {/* Hospital Card */}
          <Link
            href="/hospitals"
            className="group block rounded-2xl border border-border bg-bg p-6 text-left hover:border-accent/40 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] animate-[page-fade_0.45s_ease-out]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-bg transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12" />
              </svg>
            </div>
            <h3 className="mt-5 text-lg font-medium text-text">I am a Hospital / Facility</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              I am a hiring manager, hospital head, or recruiter looking to hire vetted clinical radiology talent.
            </p>
            <div className="mt-4 text-xs font-medium text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Request Staff <span>→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
