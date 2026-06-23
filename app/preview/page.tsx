import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preview | HNVNS',
  description: 'HNVNS preview page.',
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Preview</p>
        <h1 className="mt-3 text-3xl font-light tracking-[-0.04em] text-text md:text-4xl">
          HNVNS Preview
        </h1>
        <p className="mt-2 text-sm text-muted">This is a preview deployment of the HNVNS platform.</p>
      </div>
    </div>
  );
}
