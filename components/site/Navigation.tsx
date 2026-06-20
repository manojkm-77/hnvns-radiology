'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { navLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent transition-all duration-300',
        scrolled && 'border-b border-[#222] bg-[#111111] backdrop-blur-md'
      )}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-8" aria-label="Primary navigation">
        <Link href="/" className="group flex items-center gap-3" aria-label="HNVNS home">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent transition-colors group-hover:bg-accent/15">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M12 3.5 19.2 7.75v8.5L12 20.5l-7.2-4.25v-8.5L12 3.5Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8.8 12.15h6.4M12 8.95v6.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-sm font-medium tracking-[0.28em] text-text">HNVNS</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-transparent px-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-full px-4 py-2 text-sm text-muted transition-colors duration-300 hover:text-text',
                pathname === link.href && 'bg-accent/10 text-accent'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-muted hover:text-text transition-colors duration-300"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className={cn(
                'rounded-full px-4 py-2 text-sm text-muted transition-colors duration-300 hover:text-text',
                pathname === '/dashboard' && 'bg-accent/10 text-accent'
              )}
            >
              Dashboard
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'h-9 w-9 rounded-full border border-accent/30',
                },
                variables: {
                  colorPrimary: '#15a684',
                  colorBackground: '#111111',
                  colorText: '#ffffff',
                }
              }}
            />
          </SignedIn>

          <Button
            href="/contact"
            className="hidden md:inline-flex hero-cta-button bg-gradient-to-r from-[#5df3c3] to-[#15a684] text-black shadow-[0_20px_80px_-30px_rgba(45,212,191,0.85)] hover:scale-[1.02] hover:shadow-[0_24px_90px_-35px_rgba(45,212,191,0.95)] transition-all duration-300"
          >
            Post a Vacancy
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
              <path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="border-b border-border bg-bg/95 px-6 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto grid max-w-7xl gap-2 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-2xl border border-transparent px-4 py-3 text-sm text-muted transition-colors hover:border-border hover:text-text',
                    pathname === link.href && 'border-accent/20 bg-accent/10 text-accent'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="rounded-2xl border border-transparent px-4 py-3 text-sm text-muted transition-colors hover:border-border hover:text-text"
                >
                  Sign In
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className={cn(
                    'rounded-2xl border border-transparent px-4 py-3 text-sm text-muted transition-colors hover:border-border hover:text-text',
                    pathname === '/dashboard' && 'border-accent/20 bg-accent/10 text-accent'
                  )}
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3 px-4 py-3">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'h-9 w-9 rounded-full border border-accent/30',
                      },
                      variables: {
                        colorPrimary: '#15a684',
                        colorBackground: '#111111',
                        colorText: '#ffffff',
                      }
                    }}
                  />
                  <span className="text-sm text-muted">Account Profile</span>
                </div>
              </SignedIn>
              <Button href="/contact" className="mt-2">
                Post a Vacancy
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
