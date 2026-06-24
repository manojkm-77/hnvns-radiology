'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { contact, whatsappLink } from '@/lib/contact';

// Routes where the floating action buttons are hidden (app/admin/auth surfaces).
const HIDDEN_ROUTES = ['/admin', '/dashboard', '/onboarding', '/sign-in', '/sign-up', '/preview'];

const PREFILL = "Hi HNVNS! I'd like to know more about your radiology staffing services.";

export function WhatsAppButton() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Avoid rendering until client mount so pathname is correct.
  useEffect(() => setMounted(true), []);

  const hidden = mounted && HIDDEN_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.a
          key="whatsapp-fab"
          href={whatsappLink(PREFILL)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with HNVNS on WhatsApp — ${contact.whatsappDisplay}`}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="group fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_40px_-8px_rgba(37,211,102,0.6)] transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {/* Ping pulse */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30 group-hover:opacity-0" aria-hidden="true" />

          {/* WhatsApp glyph */}
          <svg viewBox="0 0 32 32" className="relative h-7 w-7" fill="currentColor" aria-hidden="true">
            <path d="M16.04 4C9.93 4 4.98 8.95 4.98 15.06c0 2.06.55 4.02 1.59 5.73L4.7 27.3l6.7-1.83a11.04 11.04 0 0 0 4.64 1.02h.01c6.1 0 11.06-4.95 11.06-11.06C27.1 8.95 22.14 4 16.04 4Zm0 20.27h-.01c-1.48 0-2.94-.4-4.2-1.15l-.3-.18-3.98 1.09 1.06-3.88-.2-.31a9.07 9.07 0 0 1-1.39-4.78c0-5.02 4.09-9.1 9.11-9.1 2.43 0 4.72.95 6.44 2.67a9.05 9.05 0 0 1 2.67 6.44c0 5.02-4.09 9.1-9.11 9.1Zm4.99-6.8c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.84c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.32Z" />
          </svg>

          {/* Tooltip */}
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            Chat on WhatsApp
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
