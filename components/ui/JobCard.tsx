import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type JobCardProps = {
  title: string;
  hospital: string;
  location: string;
  type: 'Full-Time' | 'Contract' | 'Locum';
  salary: string;
  postedAt: string;
  specialization: string;
  href: string;
  status?: 'featured' | 'urgent' | 'new' | 'open';
};

const statusLabels = {
  featured: 'Featured',
  urgent: 'Urgent',
  new: 'New',
  open: 'Open'
};

export function JobCard({ title, hospital, location, type, salary, postedAt, specialization, href, status = 'open' }: JobCardProps) {
  return (
    <article className="group rounded-3xl border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40">
      <div className="flex items-center justify-between gap-3">
        <Badge variant={status === 'open' ? 'teal' : status}>{statusLabels[status]}</Badge>
        <span className="text-xs text-muted">{postedAt}</span>
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
