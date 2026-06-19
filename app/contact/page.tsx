import type { Metadata } from 'next';
import { RevealSection } from '@/components/animations/RevealSection';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/sections/PageHero';

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

        <form className="rounded-[2rem] border border-border bg-surface p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm text-muted">Name</span>
              <input className="h-12 rounded-2xl border border-border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/60" placeholder="Dr. A. Sharma" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-muted">Email</span>
              <input className="h-12 rounded-2xl border border-border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/60" placeholder="name@hospital.org" type="email" />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm text-muted">Organization</span>
              <input className="h-12 rounded-2xl border border-border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/60" placeholder="Hospital, clinic, or research group" />
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm text-muted">Staffing focus</span>
              <select className="h-12 rounded-2xl border border-border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/60">
                <option>Staffing operations</option>
                <option>Credential verification</option>
                <option>Candidate sourcing</option>
                <option>Clinical coverage</option>
              </select>
            </label>
            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm text-muted">Message</span>
              <textarea className="min-h-40 resize-none rounded-2xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/60" placeholder="Tell us about your hiring volume, role gaps, and timeline." />
            </label>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="mailto:partnerships@hnvns.example">Send inquiry</Button>
            <Button href="/services" variant="outline">Review services</Button>
          </div>
        </form>
      </RevealSection>
    </div>
  );
}
