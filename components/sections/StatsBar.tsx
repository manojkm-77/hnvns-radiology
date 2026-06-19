import { CountUp } from '@/components/animations/CountUp';
import { RevealSection } from '@/components/animations/RevealSection';
import { stats } from '@/lib/data';

export function StatsBar() {
  return (
    <RevealSection className="border-y border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border px-6 py-12 md:grid-cols-4 md:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-bg px-4 py-6 text-center md:px-8">
            <p className="text-3xl font-light tracking-[-0.04em] text-accent md:text-5xl">
              <CountUp target={stat.value} decimals={stat.decimals} prefix={stat.prefix} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </RevealSection>
  );
}
