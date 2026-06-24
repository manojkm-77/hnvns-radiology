import Link from 'next/link';
import { footerLinks, navLinks } from '@/lib/data';
import { contact, whatsappLink, phoneLink } from '@/lib/contact';

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

            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a
                  href={whatsappLink("Hi HNVNS! I'd like to know more.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted transition-colors hover:text-accent"
                >
                  <svg viewBox="0 0 32 32" className="h-4 w-4 text-[#25D366]" fill="currentColor" aria-hidden="true">
                    <path d="M16.04 4C9.93 4 4.98 8.95 4.98 15.06c0 2.06.55 4.02 1.59 5.73L4.7 27.3l6.7-1.83a11.04 11.04 0 0 0 4.64 1.02h.01c6.1 0 11.06-4.95 11.06-11.06C27.1 8.95 22.14 4 16.04 4Zm4.99 13.47c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.84c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.32Z" />
                  </svg>
                  {contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a href={phoneLink()} className="inline-flex items-center gap-2 text-muted transition-colors hover:text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" aria-hidden="true">
                    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4.5 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-2 text-muted transition-colors hover:text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" aria-hidden="true">
                  <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <span>{contact.address}</span>
              </li>
              <li className="flex items-start gap-2 text-muted">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 8v4l2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span>{contact.hours}</span>
              </li>
            </ul>
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
