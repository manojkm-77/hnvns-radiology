import { RevealSection } from '@/components/animations/RevealSection';
import { testimonials } from '@/lib/data';

export function TestimonialsSection() {
  return (
    <RevealSection className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Testimonials</p>
          <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
            Trusted by teams moving imaging faster.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-3xl border border-border bg-surface p-7">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="currentColor" aria-hidden="true">
                <path d="M8.6 7.2H5.8C4.8 7.2 4 8 4 9v4.2c0 3 2 5.4 5 5.4h.8v-2.8H9c-1.4 0-2.2-.8-2.2-2.1V12h1.8V7.2Zm10.6 0h-2.8c-1 0-1.8.8-1.8 1.8v4.2c0 3 2 5.4 5 5.4h.8v-2.8h-.8c-1.4 0-2.2-.8-2.2-2.1V12h1.8V7.2Z" />
              </svg>
              <p className="mt-8 text-sm leading-7 text-muted">{testimonial.quote}</p>
              <div className="mt-8 border-t border-border pt-5">
                <p className="font-medium text-text">{testimonial.name}</p>
                <p className="mt-1 text-xs text-muted">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
