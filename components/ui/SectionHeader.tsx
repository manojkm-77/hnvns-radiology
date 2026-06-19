import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

export function SectionHeader({ eyebrow, title, description, align = 'center' }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mx-auto max-w-3xl',
        align === 'center' ? 'text-center' : 'text-left'
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-7 text-muted md:text-lg">{description}</p>
      )}
    </div>
  );
}
