import { cn } from '@/lib/utils';

type SectionLabelProps = {
  as?: 'p' | 'span';
  children: React.ReactNode;
  className?: string;
};

export function SectionLabel({ as = 'p', children, className }: SectionLabelProps) {
  const Component = as;

  return (
    <Component className={cn('text-xs font-semibold uppercase tracking-[0.28em] text-accent', className)}>
      {children}
    </Component>
  );
}
