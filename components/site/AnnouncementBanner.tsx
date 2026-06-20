'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('hnvns_banner_dismissed');
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hnvns_banner_dismissed', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="relative w-full bg-[#14b8a6] text-white overflow-hidden select-none"
        >
          <div className="mx-auto max-w-7xl px-6 py-2.5 pr-12 text-center text-xs sm:text-sm font-medium tracking-wide">
            <span>
              🎉 Early access: Zero placement commission for our first 50 hospital partners in Bengaluru.{' '}
            </span>
            <Link href="/hospitals" className="underline font-bold hover:text-white/90 transition-colors inline-flex items-center">
              Claim your spot →
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
