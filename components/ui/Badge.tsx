import { cn } from '@/lib/utils';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'teal' | 'urgent' | 'featured' | 'new';
  children: React.ReactNode;
};

const variants = {
  teal: 'border-accent/30 bg-accent/10 text-accent',
  urgent: 'border-red-400/30 bg-red-500/10 text-red-300',
  featured: 'border-blue-400/30 bg-blue-500/10 text-blue-300',
  new: 'border-violet-400/30 bg-violet-500/10 text-violet-300'
};

export function Badge({ className, variant = 'teal', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
