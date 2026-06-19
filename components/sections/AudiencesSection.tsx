import { RevealSection } from '@/components/animations/RevealSection';
import { audiences } from '@/lib/data';

export function AudiencesSection() {
  return (
    <RevealSection id="who-we-serve" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Who we serve</p>
          <h2 className="mt-4 max-w-xl text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
            A clinical operating layer for every imaging environment.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {audiences.map((audience) => (
            <article key={audience.title} className="rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                {audience.tag}
              </span>
              <h3 className="mt-8 text-2xl font-light tracking-[-0.04em] text-text">{audience.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{audience.description}</p>
            </article>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
