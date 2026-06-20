'use client';

import { useState, useEffect, Suspense } from 'react';
import { FadeUp } from '@/components/animations/FadeUp';
import { CandidateRegistrationForm } from '@/components/forms/CandidateRegistrationForm';

export function CandidatesPageClient() {
  const [lang, setLang] = useState<'en' | 'kn'>('en');

  // Initialize lang state from localStorage on load
  useEffect(() => {
    const savedLang = localStorage.getItem('hnvns_candidate_lang');
    if (savedLang === 'kn' || savedLang === 'en') {
      setLang(savedLang);
    }
  }, []);

  const handleLangToggle = (newLang: 'en' | 'kn') => {
    localStorage.setItem('hnvns_candidate_lang', newLang);
    setLang(newLang);
  };

  return (
    <div className="animate-page-fade">
      {/* Hero Section */}
      <FadeUp as="section" className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              {lang === 'kn' ? 'ಅಭ್ಯರ್ಥಿಗಳು' : 'Candidates'}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">
              {lang === 'kn' ? 'HNVNS ಪ್ರತಿಭಾ ನೆಟ್ವರ್ಕ್ಗೆ ಸೇರಿ' : 'Join the HNVNS talent network.'}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
              {lang === 'kn'
                ? 'ಇಮೇಜಿಂಗ್, ಡಯಾಗ್ನೋಸ್ಟಿಕ್ಸ್ ಮತ್ತು ಕ್ಲಿನಿಕಲ್ ಆಪರೇಶನ್ಸ್ ಅವಕಾಶಗಳಿಗಾಗಿ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸಲ್ಲಿಸಿ.'
                : 'Submit your profile for imaging, diagnostics, PACS, nursing, and clinical operations opportunities.'}
            </p>
          </div>

          {/* Language Switcher Pill */}
          <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1 self-start shrink-0">
            <button
              onClick={() => handleLangToggle('en')}
              type="button"
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                lang === 'en'
                  ? 'bg-accent text-bg font-semibold'
                  : 'text-muted hover:text-text'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLangToggle('kn')}
              type="button"
              className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wider transition-all duration-300 ${
                lang === 'kn'
                  ? 'bg-accent text-bg font-semibold'
                  : 'text-muted hover:text-text'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>
        </div>
      </FadeUp>

      {/* Form Section */}
      <FadeUp as="section" delay={0.1} className="mx-auto max-w-4xl px-6 pb-24 md:px-8 md:pb-32">
        <Suspense fallback={<div className="rounded-[2rem] border border-border bg-surface p-8 animate-pulse h-64" />}>
          <CandidateRegistrationForm lang={lang} />
        </Suspense>
      </FadeUp>
    </div>
  );
}
