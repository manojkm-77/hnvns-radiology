import { Button } from '@/components/ui/Button';
import { RevealSection } from '@/components/animations/RevealSection';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function PageHero({ eyebrow, title, description, ctaHref, ctaLabel }: PageHeroProps) {
  return (
    <RevealSection className="mx-auto max-w-7xl px-6 pt-32 pb-20 md:px-8 md:pt-40 md:pb-28">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
      <h1 className="mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">{description}</p>
      {ctaHref && ctaLabel && (
        <div className="mt-9">
          <Button href={ctaHref}>{ctaLabel}</Button>
        </div>
      )}
    </RevealSection>
  );
}
