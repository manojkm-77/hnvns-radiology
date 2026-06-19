import Link from 'next/link';
import { RevealSection } from '@/components/animations/RevealSection';
import { insights } from '@/lib/data';

export function BlogPreviewSection() {
  return (
    <RevealSection id="insights" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Insights</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-light tracking-[-0.04em] text-text md:text-5xl">
            Practical insights on staffing, credentialing, and AI matching for imaging teams.
          </h2>
        </div>
        <Link href="/insights" className="text-sm font-medium text-accent transition-colors hover:text-accent/80">
          View all insights →
        </Link>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {insights.map((post) => (
          <Link key={post.title} href="/insights" className="group rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.22em] text-accent">{post.category}</span>
              <span className="text-xs text-muted">{post.date}</span>
            </div>
            <h3 className="mt-8 text-xl font-light tracking-[-0.03em] text-text group-hover:text-accent">{post.title}</h3>
            <p className="mt-4 text-sm leading-7 text-muted">{post.excerpt}</p>
            <span className="mt-7 inline-flex text-sm text-accent transition-transform duration-300 group-hover:translate-x-1">Read article →</span>
          </Link>
        ))}
      </div>
    </RevealSection>
  );
}
