'use client';

import { cn } from '@/lib/utils';

type FormFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  colSpan?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, hint, error, colSpan, children, className }: FormFieldProps) {
  return (
    <label className={cn('grid gap-2', colSpan && 'md:col-span-2', className)}>
      <span className="text-sm text-muted">
        {label}
        {hint && <span className="text-muted/50"> {hint}</span>}
      </span>
      {children}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

const baseInputClass =
  'h-12 rounded-2xl border bg-bg px-4 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20';

const selectClass =
  'h-12 rounded-2xl border bg-bg px-4 text-sm text-muted outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20';

const textareaClass =
  'min-h-32 resize-none rounded-2xl border bg-bg px-4 py-3 text-sm text-text outline-none transition-colors focus:border-accent/80 focus:ring-2 focus:ring-accent/20';

export function inputClassName(hasError: boolean): string {
  return cn(baseInputClass, hasError ? 'border-red-400/60' : 'border-border');
}

export function selectClassName(hasError: boolean): string {
  return cn(selectClass, hasError ? 'border-red-400/60' : 'border-border');
}

export function textareaClassName(hasError: boolean): string {
  return cn(textareaClass, hasError ? 'border-red-400/60' : 'border-border');
}
