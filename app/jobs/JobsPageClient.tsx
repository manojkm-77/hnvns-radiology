'use client';

import { useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { FadeUp } from '@/components/animations/FadeUp';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/ui/JobCard';
import { jobs } from '@/lib/data';

type FilterState = {
  keyword: string;
  specialization: string;
  location: string;
  type: string;
};

const emptyFilters: FilterState = {
  keyword: '',
  specialization: 'All Specializations',
  location: 'All Locations',
  type: 'All Types'
};

export function JobsPageClient() {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(emptyFilters);
  const [filterToken, setFilterToken] = useState(0);

  const specializations = useMemo(() => ['All Specializations', ...Array.from(new Set(jobs.map((job) => job.specialization)))], []);
  const locations = useMemo(() => ['All Locations', ...Array.from(new Set(jobs.map((job) => job.location)))], []);
  const types = ['All Types', 'Full-Time', 'Contract', 'Locum'];

  const filteredJobs = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();

    return jobs.filter((job) => {
      const searchableText = `${job.title} ${job.hospital} ${job.location} ${job.specialization}`.toLowerCase();
      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesSpecialization = appliedFilters.specialization === 'All Specializations' || job.specialization === appliedFilters.specialization;
      const matchesLocation = appliedFilters.location === 'All Locations' || job.location === appliedFilters.location;
      const matchesType = appliedFilters.type === 'All Types' || job.type === appliedFilters.type;

      return matchesKeyword && matchesSpecialization && matchesLocation && matchesType;
    });
  }, [appliedFilters]);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-job-card]'));
    if (!cards.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      gsap.set(cards, { autoAlpha: 1, y: 0 });
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out'
        }
      );
    });

    return () => context.revert();
  }, [filterToken, filteredJobs.length]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setFilterToken((current) => current + 1);
  };

  const resetFilters = () => {
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setFilterToken((current) => current + 1);
  };

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  return (
    <div className="animate-page-fade">
      <FadeUp as="section" className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Jobs</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">
          Find your next radiology role.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          Explore imaging, reporting, PACS, and clinical operations roles across HNVNS partner hospitals.
        </p>
      </FadeUp>

      <div className="sticky top-0 z-40 border-y border-border bg-bg/90 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-3 px-6 py-5 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:px-8">
          <input
            value={filters.keyword}
            onChange={(event) => updateFilter('keyword', event.target.value)}
            className="h-12 rounded-2xl border border-border bg-surface px-4 text-sm text-text outline-none transition-colors placeholder:text-muted focus:border-accent/60"
            placeholder="Search job, hospital, or location"
            aria-label="Keyword search"
          />
          <select
            value={filters.specialization}
            onChange={(event) => updateFilter('specialization', event.target.value)}
            className="h-12 rounded-2xl border border-border bg-surface px-4 text-sm text-muted outline-none transition-colors focus:border-accent/60"
            aria-label="Specialization"
          >
            {specializations.map((specialization) => (
              <option key={specialization} value={specialization}>
                {specialization}
              </option>
            ))}
          </select>
          <select
            value={filters.location}
            onChange={(event) => updateFilter('location', event.target.value)}
            className="h-12 rounded-2xl border border-border bg-surface px-4 text-sm text-muted outline-none transition-colors focus:border-accent/60"
            aria-label="Location"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <select
            value={filters.type}
            onChange={(event) => updateFilter('type', event.target.value)}
            className="h-12 rounded-2xl border border-border bg-surface px-4 text-sm text-muted outline-none transition-colors focus:border-accent/60"
            aria-label="Job type"
          >
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <div className="flex gap-3">
            <Button href="#job-list" onClick={applyFilters}>Filter jobs</Button>
            <Button href="#job-list" variant="ghost" onClick={resetFilters}>Reset</Button>
          </div>
        </div>
      </div>

      <FadeUp as="section" id="job-list" delay={0.12} className="mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-light tracking-[-0.04em] text-text">Open roles</h2>
            <p className="mt-2 text-sm text-muted">
              Showing {filteredJobs.length} of {jobs.length} jobs
              {activeFilterCount > 0 ? ` with ${activeFilterCount} active filters` : ''}.
            </p>
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <div key={job.id} data-job-card>
                <JobCard
                  title={job.title}
                  hospital={job.hospital}
                  location={job.location}
                  type={job.type as 'Full-Time' | 'Contract' | 'Locum'}
                  salary={job.salary}
                  postedAt={job.postedAt}
                  specialization={job.specialization}
                  href={`/jobs/${job.id}`}
                  status={job.status as 'featured' | 'urgent' | 'new' | 'open'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-surface p-10 text-center">
            <h3 className="text-2xl font-light tracking-[-0.04em] text-text">No jobs match those filters.</h3>
            <p className="mt-3 text-sm text-muted">Try a different keyword, specialization, location, or type.</p>
            <div className="mt-7">
              <Button href="#job-list" variant="outline" onClick={resetFilters}>Clear filters</Button>
            </div>
          </div>
        )}
      </FadeUp>
    </div>
  );
}
