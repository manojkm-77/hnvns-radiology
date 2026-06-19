import { FadeUp } from '@/components/animations/FadeUp';
import { RevealSection } from '@/components/animations/RevealSection';
import { Badge } from '@/components/ui/Badge';
import { valueProps } from '@/lib/data';

export function ValuePropSection() {
  return (
    <RevealSection id="value" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Value proposition</p>
          <h2 className="mt-4 text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
            Built for hospitals that need throughput and candidates who need clarity.
          </h2>
          <p className="mt-6 text-base leading-8 text-muted md:text-lg">
            HNVNS connects imaging operations, AI support, and radiologist expertise so every stakeholder knows what happens next.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {valueProps.map((prop, index) => (
            <FadeUp
              key={prop.audience}
              as="article"
              delay={index * 0.1}
              className="rounded-[2rem] border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40"
            >
              <Badge variant={index === 0 ? 'teal' : 'featured'}>{prop.audience}</Badge>
              <h3 className="mt-8 text-2xl font-light tracking-[-0.04em] text-text">{prop.title}</h3>
              <p className="mt-4 text-sm leading-7 text-muted">{prop.description}</p>
              <ul className="mt-7 space-y-3">
                {prop.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
