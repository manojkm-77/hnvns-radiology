'use client';

import Link from 'next/link';
import { RevealSection } from '@/components/animations/RevealSection';
import { StaggerChildren } from '@/components/animations/StaggerChildren';
import { SectionHeader } from '@/components/ui/SectionHeader';

type ZoneItem = {
  name: string;
  rolesCount: number;
  badge: 'High demand' | 'Active' | 'Filling';
};

const zones: ZoneItem[] = [
  { name: 'Whitefield / ITPL', rolesCount: 12, badge: 'High demand' },
  { name: 'Koramangala / HSR', rolesCount: 8, badge: 'Active' },
  { name: 'Hebbal / Yelahanka', rolesCount: 6, badge: 'Active' },
  { name: 'Jayanagar / JP Nagar', rolesCount: 9, badge: 'High demand' },
  { name: 'Electronic City', rolesCount: 5, badge: 'Filling' },
  { name: 'Indiranagar / UB City', rolesCount: 7, badge: 'Active' }
];

const badgeColors = {
  'High demand': 'border-red-400/30 bg-red-500/10 text-red-300',
  'Active': 'border-accent/30 bg-accent/10 text-accent',
  'Filling': 'border-amber-400/30 bg-amber-500/10 text-amber-300'
};

export function ZoneHeatmap() {
  return (
    <RevealSection id="heatmap" className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
      <SectionHeader
        eyebrow="Bengaluru Placements"
        title="Where we're placing talent in Bengaluru"
        description="Live staffing activity across imaging departments by zone"
      />

      <StaggerChildren className="mt-14 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" stagger={0.055}>
        {zones.map((zone) => (
          <Link
            key={zone.name}
            href="/jobs"
            className="group rounded-[2rem] border border-border bg-surface p-7 transition-colors duration-300 hover:border-accent/40 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs uppercase tracking-[0.24em] text-muted">Active Zone</span>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${badgeColors[zone.badge]}`}>
                  {zone.badge}
                </span>
              </div>
              <h3 className="mt-8 text-2xl font-light tracking-[-0.04em] text-text group-hover:text-accent transition-colors duration-300">
                {zone.name}
              </h3>
              <p className="mt-3 text-sm text-muted">
                {zone.rolesCount} active vacancies in this region
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-text">
                {zone.rolesCount} Open Roles
              </span>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-accent group-hover:translate-x-1 transition-transform duration-300">
                View roles →
              </span>
            </div>
          </Link>
        ))}
      </StaggerChildren>

      <div className="mt-8 text-center">
        <p className="text-xs text-muted/60 tracking-wide">
          * Role counts updated weekly. Figures reflect active vacancies with partner hospitals.
        </p>
      </div>
    </RevealSection>
  );
}
