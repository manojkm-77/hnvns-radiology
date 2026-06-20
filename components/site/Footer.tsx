import Link from 'next/link';
import { footerLinks, navLinks } from '@/lib/data';

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="HNVNS home">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M12 3.5 19.2 7.75v8.5L12 20.5l-7.2-4.25v-8.5L12 3.5Z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8.8 12.15h6.4M12 8.95v6.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <span className="text-sm font-medium tracking-[0.28em] text-text">HNVNS</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
              A premium healthcare staffing marketplace connecting hospitals with verified imaging and diagnostic technology professionals through smart, AI-driven recruitment.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text">Company</h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text">Services</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text">Resources</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text">Legal</h3>
            <ul className="mt-5 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted transition-colors hover:text-accent">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-border pt-6 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} HNVNS. All rights reserved.</p>
          <p>{"Bengaluru's radiology staffing network — launching 2026"}</p>
        </div>
      </div>
    </footer>
  );
}
