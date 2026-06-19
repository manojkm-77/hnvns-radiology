import { RevealSection } from '@/components/animations/RevealSection';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { services } from '@/lib/data';

export function ServicesSection({ compact = false }: { compact?: boolean }) {
  return (
    <RevealSection id="services" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeader
        eyebrow="Services"
        title="Healthcare staffing services for imaging and diagnostic teams."
        description="Built for hiring managers who need fast, verifiable talent and transparent candidate operations."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.title}
            id={service.title.toLowerCase().replace(/\s+/g, '-')}
            className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 transition-colors duration-300 hover:border-accent/40"
          >
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.16),transparent_38%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="mb-10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{service.number}</span>
              <span className="h-px flex-1 bg-border transition-colors duration-300 group-hover:bg-accent/40" />
            </div>
            <h3 className="text-2xl font-light tracking-[-0.04em] text-text">{service.title}</h3>
            <p className="mt-4 text-sm leading-7 text-muted">{service.description}</p>
            <ul className="mt-7 space-y-3">
              {service.capabilities.map((capability) => (
                <li key={capability} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {!compact && (
        <div className="mt-10 text-center">
          <Button href="/contact" variant="outline">Explore staffing services</Button>
        </div>
      )}
    </RevealSection>
  );
}
