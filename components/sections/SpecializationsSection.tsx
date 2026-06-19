import { RevealSection } from '@/components/animations/RevealSection';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { specializations } from '@/lib/data';

const badgeVariants = ['teal', 'urgent', 'featured', 'new'] as const;

type BadgeVariant = (typeof badgeVariants)[number];

function badgeVariant(index: number): BadgeVariant {
  return badgeVariants[index % badgeVariants.length];
}

export function SpecializationsSection() {
  return (
    <RevealSection id="specializations" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeader
        eyebrow="Specializations"
        title="Eight imaging lanes tuned for speed, specialty fit, and verified hiring."
        description="From urgent neuro reads to AI validation programs, every lane carries the same operating standard."
      />

      <StaggerChildren className="mt-14 grid gap-5 md:grid-cols-4" stagger={0.055}>
        {specializations.map((specialization, index) => (
          <article key={specialization.title} className="group rounded-3xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/40">
            <Badge variant={badgeVariant(index)}>{specialization.tag}</Badge>
            <h3 className="mt-8 text-xl font-light tracking-[-0.03em] text-text">{specialization.title}</h3>
            <p className="mt-4 text-sm leading-7 text-muted">{specialization.description}</p>
            <span className="mt-8 inline-flex text-xs font-medium uppercase tracking-[0.22em] text-accent">
              View roles →
            </span>
          </article>
        ))}
      </StaggerChildren>
    </RevealSection>
  );
}
