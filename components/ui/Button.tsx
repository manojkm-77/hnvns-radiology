import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: 'primary' | 'outline' | 'ghost';
};

const variants = {
  primary: 'border-accent bg-accent text-bg hover:bg-accent/90',
  outline: 'border-accent bg-transparent text-accent hover:bg-accent/10',
  ghost: 'border-transparent bg-transparent text-muted hover:border-border hover:text-text'
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <Link
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-medium transition-colors duration-300',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
