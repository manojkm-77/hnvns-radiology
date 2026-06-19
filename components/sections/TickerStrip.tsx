import { tickerItems } from '@/lib/data';

export function TickerStrip() {
  return (
    <div className="overflow-hidden border-y border-border bg-surface/60 py-4">
      <div className="ticker-track flex w-max items-center gap-8 whitespace-nowrap text-sm font-medium uppercase tracking-[0.24em] text-muted">
        {[...tickerItems, ...tickerItems].map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8">
            <span>{item}</span>
            <span className="h-1 w-1 rounded-full bg-accent/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
