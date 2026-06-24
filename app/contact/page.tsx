import type { Metadata } from 'next';
import { RevealSection } from '@/components/animations/RevealSection';
import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/forms/ContactForm';
import { contact, whatsappLink, phoneLink } from '@/lib/contact';

export const metadata: Metadata = {
  title: 'Contact | HNVNS',
  description: 'Contact HNVNS to discuss staffing, talent matching, and credential verification for imaging and diagnostic teams.'
};

const contactCards = [
  {
    title: 'Partnerships',
    description: 'Explore staffing partnerships, hospital collaborations, and talent pipeline support for healthcare teams.',
    value: 'partnerships@hnvns.example'
  },
  {
    title: 'Clinical operations',
    description: 'Discuss staffing coordination, coverage planning, and onboarding requirements.',
    value: 'operations@hnvns.example'
  },
  {
    title: 'Credential review',
    description: 'Request compliance documentation and candidate verification details for your credentialing team.',
    value: 'security@hnvns.example'
  }
];

export default function ContactPage() {
  return (
    <div className="animate-page-fade">
      <PageHero
        eyebrow="Contact"
        title="Tell us where your staffing needs are most urgent."
        description="Share a few details about your hiring volume, role gaps, and compliance priorities. Our team will respond with a focused staffing review."
      />
      <RevealSection className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="rounded-[2rem] border border-border bg-surface p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Contact options</p>
          <div className="mt-8 space-y-5">
            {contactCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-border bg-bg/40 p-5">
                <h2 className="text-xl font-light tracking-[-0.03em] text-text">{card.title}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{card.description}</p>
                <a href={`mailto:${card.value}`} className="mt-5 inline-flex text-sm font-medium text-accent hover:text-accent/80">
                  {card.value}
                </a>
              </article>
            ))}

            {/* Instant channels: WhatsApp + Call */}
            <div className="grid gap-4 sm:grid-cols-2">
              <a
                href={whatsappLink("Hi HNVNS! I'd like to know more about your services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-5 transition-colors hover:border-[#25D366]/50 hover:bg-[#25D366]/10"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
                  <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                    <path d="M16.04 4C9.93 4 4.98 8.95 4.98 15.06c0 2.06.55 4.02 1.59 5.73L4.7 27.3l6.7-1.83a11.04 11.04 0 0 0 4.64 1.02h.01c6.1 0 11.06-4.95 11.06-11.06C27.1 8.95 22.14 4 16.04 4Zm4.99 13.47c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.61-1.51-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47l-.53-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.84c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.66.21 1.26.18 1.73.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.18.16-1.3-.07-.11-.25-.18-.52-.32Z" />
                  </svg>
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-medium text-text">WhatsApp</span>
                  <span className="block text-sm text-muted group-hover:text-accent">{contact.whatsappDisplay}</span>
                </span>
              </a>

              <a
                href={phoneLink()}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-bg/40 p-5 transition-colors hover:border-accent/40 hover:bg-bg/60"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 4.5 6a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-medium text-text">Call us</span>
                  <span className="block text-sm text-muted group-hover:text-accent">{contact.phone}</span>
                </span>
              </a>
            </div>

            {/* Address & hours */}
            <div className="grid gap-4 rounded-2xl border border-border bg-bg/40 p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Office</p>
                <p className="mt-2 text-sm leading-7 text-text">{contact.address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Working hours</p>
                <p className="mt-2 text-sm leading-7 text-text">{contact.hours}</p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </RevealSection>
    </div>
  );
}
