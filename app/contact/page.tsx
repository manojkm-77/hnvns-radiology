import type { Metadata } from 'next';
import { RevealSection } from '@/components/animations/RevealSection';
import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/forms/ContactForm';

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
          </div>
        </div>

        <ContactForm />
      </RevealSection>
    </div>
  );
}
