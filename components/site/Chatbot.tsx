'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { contact, whatsappLink, phoneLink } from '@/lib/contact';

// Routes where the floating chatbot is hidden (app/admin/auth surfaces).
const HIDDEN_ROUTES = ['/admin', '/dashboard', '/onboarding', '/sign-in', '/sign-up', '/preview'];

type Message = {
  id: number;
  from: 'bot' | 'user';
  text: string;
  // Optional actions rendered below the message (links / handoff).
  actions?: { label: string; href?: string; external?: boolean; onReply?: string }[];
};

const GREETING: Message = {
  id: 0,
  from: 'bot',
  text: "Hi, I'm the HNVNS assistant 👋 How can I help you today?",
  actions: [
    { label: 'Our services', onReply: 'services' },
    { label: 'Browse open jobs', onReply: 'jobs' },
    { label: "I'm a candidate", onReply: 'candidate' },
    { label: 'Post a vacancy', onReply: 'vacancy' },
    { label: 'Pricing', onReply: 'pricing' },
    { label: 'Talk to a human', onReply: 'human' }
  ]
};

// Canned, on-brand responses keyed by quick-reply id.
const RESPONSES: Record<string, Message> = {
  services: {
    id: -1,
    from: 'bot',
    text: 'We connect hospitals and diagnostic teams with verified imaging & clinical talent — candidate matching, vacancy management, an HR dashboard, and credential verification.',
    actions: [{ label: 'Explore services →', href: '/services' }, { label: 'Back to topics', onReply: 'reset' }]
  },
  jobs: {
    id: -1,
    from: 'bot',
    text: 'You can browse all open radiology roles by specialization, location, and shift type. New vacancies are posted every week.',
    actions: [{ label: 'See open jobs →', href: '/jobs' }, { label: 'Back to topics', onReply: 'reset' }]
  },
  candidate: {
    id: -1,
    from: 'bot',
    text: 'Candidates get a verified profile, AI-matched role recommendations, and a personal dashboard to track applications. Registration is free.',
    actions: [{ label: 'Join as a candidate →', href: '/candidates' }, { label: 'Browse jobs →', href: '/jobs' }, { label: 'Back to topics', onReply: 'reset' }]
  },
  vacancy: {
    id: -1,
    from: 'bot',
    text: "Hospitals can post vacancies and get matched with credentialed technologists. Want to talk to our team about your staffing needs?",
    actions: [
      { label: 'Post a vacancy →', href: '/hospitals' },
      { label: 'Chat on WhatsApp →', href: whatsappLink("Hi HNVNS! I'd like to post a vacancy."), external: true },
      { label: 'Back to topics', onReply: 'reset' }
    ]
  },
  pricing: {
    id: -1,
    from: 'bot',
    text: 'Early hospital partners join with zero placement fee for 60 days. After that, pricing scales with placement volume. Our team can share a tailored quote.',
    actions: [
      { label: 'Request a quote →', href: '/contact' },
      { label: 'Chat on WhatsApp →', href: whatsappLink('Hi HNVNS! Can you share your pricing?'), external: true },
      { label: 'Back to topics', onReply: 'reset' }
    ]
  },
  human: {
    id: -1,
    from: 'bot',
    text: `Happy to connect you with a human. Reach us any time:\n• WhatsApp: ${contact.whatsappDisplay}\n• Phone: ${contact.phone}\n• Email: ${contact.email}`,
    actions: [
      { label: 'Chat on WhatsApp →', href: whatsappLink("Hi HNVNS! I'd like to speak with someone."), external: true },
      { label: 'Call us →', href: phoneLink() },
      { label: 'Email us →', href: `mailto:${contact.email}` },
      { label: 'Back to topics', onReply: 'reset' }
    ]
  },
  reset: GREETING
};

let messageCounter = 1;
const nextId = () => messageCounter++;

export function Chatbot() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Keep the newest message in view.
  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  }, [messages, open, reducedMotion]);

  const hidden = mounted && HIDDEN_ROUTES.some((route) => pathname.startsWith(route));

  const handleReply = (replyId: string, label: string) => {
    const userMsg: Message = { id: nextId(), from: 'user', text: label };
    setMessages((prev) => [...prev, userMsg]);

    const response = RESPONSES[replyId] ?? GREETING;
    // Small delay so the bot reply feels conversational (skipped with reduced motion).
    const append = () =>
      setMessages((prev) => [...prev, { ...response, id: nextId() }]);
    if (reducedMotion) {
      append();
    } else {
      window.setTimeout(append, 350);
    }
  };

  if (hidden) return null;

  return (
    <>
      {/* Launcher */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close HNVNS assistant' : 'Open HNVNS assistant'}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 right-24 z-40 grid h-14 w-14 place-items-center rounded-full border border-accent/30 bg-surface text-accent shadow-glow transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg
              key="close"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              aria-hidden="true"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              aria-hidden="true"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <path
                d="M4 5h16v11H8l-4 4V5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path d="M8.5 10.5h7M8.5 13.5h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-40 flex h-[28rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl"
            role="dialog"
            aria-label="HNVNS assistant"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border bg-bg/60 px-5 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M12 3.5 19.2 7.75v8.5L12 20.5l-7.2-4.25v-8.5L12 3.5Z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8.8 12.15h6.4M12 8.95v6.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <div className="leading-tight">
                <p className="text-sm font-medium text-text">HNVNS Assistant</p>
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" /> Online · typically replies instantly
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={cn(
                      'max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-6',
                      msg.from === 'bot'
                        ? 'rounded-tl-sm bg-bg/60 text-text'
                        : 'ml-auto rounded-tr-sm bg-accent text-black'
                    )}
                  >
                    {msg.text}
                  </div>

                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {msg.actions.map((action) => {
                        const baseCls =
                          'inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200';
                        const variantCls = action.href
                          ? 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20'
                          : 'border-border text-muted hover:border-white/30 hover:text-text';

                        if (action.href) {
                          const external = action.external;
                          return external ? (
                            <a
                              key={action.label}
                              href={action.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={cn(baseCls, variantCls)}
                            >
                              {action.label}
                            </a>
                          ) : (
                            <Link key={action.label} href={action.href} className={cn(baseCls, variantCls)} onClick={() => setOpen(false)}>
                              {action.label}
                            </Link>
                          );
                        }
                        return (
                          <button
                            key={action.label}
                            type="button"
                            onClick={() => action.onReply && handleReply(action.onReply, action.label)}
                            className={cn(baseCls, variantCls)}
                          >
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="border-t border-border bg-bg/60 px-5 py-3 text-center text-xs text-muted">
              Prefer a human?{' '}
              <a
                href={whatsappLink('Hi HNVNS! I have a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:text-accent/80"
              >
                Message us on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
