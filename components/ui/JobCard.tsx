import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type JobCardProps = {
  title: React.ReactNode;
  hospital: React.ReactNode;
  location: React.ReactNode;
  type: 'Full-Time' | 'Contract' | 'Locum';
  salary: string;
  postedAt: string;
  specialization: string;
  href: string;
  status?: 'featured' | 'urgent' | 'new' | 'open';
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
};

const statusLabels = {
  featured: 'Featured',
  urgent: 'Urgent',
  new: 'New',
  open: 'Open'
};

export function JobCard({
  title,
  hospital,
  location,
  type,
  salary,
  postedAt,
  specialization,
  href,
  status = 'open',
  isBookmarked = false,
  onBookmarkToggle
}: JobCardProps) {
  return (
    <article className="group rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40 relative">
      <div className="flex items-center justify-between gap-3">
        <Badge variant={status === 'open' ? 'teal' : status}>{statusLabels[status]}</Badge>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">{postedAt}</span>
          {onBookmarkToggle && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onBookmarkToggle();
              }}
              className="text-muted hover:text-accent transition-colors p-1"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark job"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted">{hospital} · {location}</p>
      <h3 className="mt-3 text-2xl font-light tracking-[-0.04em] text-text">{title}</h3>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {type}
        </span>
        <span className="text-sm text-muted">{salary}</span>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <span className="text-sm text-muted">{specialization}</span>
        <Button href={href} variant="outline" aria-label={`View ${title}`}>
          View Job <span aria-hidden="true">→</span>
        </Button>
      </div>
    </article>
  );
}

