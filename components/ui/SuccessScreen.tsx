'use client';

type SuccessScreenProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
};

export function SuccessScreen({ title, description, children, className }: SuccessScreenProps) {
  return (
    <div className={`rounded-[2rem] border border-accent/30 bg-surface p-8 text-center ${className ?? ''}`}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-bg">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h3 className="mt-6 text-2xl font-light tracking-[-0.04em] text-text">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">{description}</p>
      {children}
    </div>
  );
}
