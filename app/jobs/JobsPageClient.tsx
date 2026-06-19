'use client';

import { useEffect, useMemo, useState } from 'react';
import gsap from 'gsap';
import { FadeUp } from '@/components/animations/FadeUp';
import { Button } from '@/components/ui/Button';
import { JobCard } from '@/components/ui/JobCard';
import { motion, AnimatePresence } from 'framer-motion';

type JobType = {
  id: string;
  title: string;
  hospital: string;
  location: string;
  type: string;
  salary: string;
  postedAt: string;
  specialization: string;
  status: string;
};

type JobsPageClientProps = {
  initialJobs: JobType[];
};

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

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) return <>{text}</>;
  const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-accent/25 text-accent rounded px-0.5 font-medium">{part}</mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function JobsPageClient({ initialJobs }: JobsPageClientProps) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(emptyFilters);
  const [filterToken, setFilterToken] = useState(0);

  // Saved Jobs Bookmarking States
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hnvns_bookmarked_jobs');
    if (saved) {
      try {
        setBookmarkedIds(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse bookmarks:', e);
      }
    }
  }, []);

  const toggleBookmark = (jobId: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem('hnvns_bookmarked_jobs', JSON.stringify(next));
      return next;
    });
  };

  const bookmarkedJobs = useMemo(() => {
    return initialJobs.filter((job) => bookmarkedIds.includes(job.id));
  }, [bookmarkedIds, initialJobs]);

  const specializations = useMemo(() => ['All Specializations', ...Array.from(new Set(initialJobs.map((job) => job.specialization)))], [initialJobs]);
  const locations = useMemo(() => ['All Locations', ...Array.from(new Set(initialJobs.map((job) => job.location)))], [initialJobs]);
  const types = ['All Types', 'Full-Time', 'Contract', 'Locum'];

  const filteredJobs = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();

    return initialJobs.filter((job) => {
      const searchableText = `${job.title} ${job.hospital} ${job.location} ${job.specialization}`.toLowerCase();
      const matchesKeyword = !keyword || searchableText.includes(keyword);
      const matchesSpecialization = appliedFilters.specialization === 'All Specializations' || job.specialization === appliedFilters.specialization;
      const matchesLocation = appliedFilters.location === 'All Locations' || job.location === appliedFilters.location;
      const matchesType = appliedFilters.type === 'All Types' || job.type === appliedFilters.type;

      return matchesKeyword && matchesSpecialization && matchesLocation && matchesType;
    });
  }, [appliedFilters, initialJobs]);

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

  const activeFilterCount = [
    appliedFilters.keyword.trim() !== '',
    appliedFilters.specialization !== 'All Specializations',
    appliedFilters.location !== 'All Locations',
    appliedFilters.type !== 'All Types'
  ].filter(Boolean).length;

  return (
    <div className="animate-page-fade relative">
      <FadeUp as="section" className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-8 md:pt-40 md:pb-24">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Jobs</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-light tracking-[-0.06em] text-text md:text-6xl">
          Find your next imaging or diagnostics opportunity.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">
          Explore verified staffing roles across imaging, PACS, clinical operations, and hospital support functions.
        </p>
      </FadeUp>

      <div className="md:sticky md:top-0 z-40 border-y border-border bg-bg/90 backdrop-blur-xl">
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
              Showing {filteredJobs.length} of {initialJobs.length} jobs
              {activeFilterCount > 0 ? ` with ${activeFilterCount} active filters` : ''}.
            </p>
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <div key={job.id} data-job-card>
                <JobCard
                  title={<HighlightText text={job.title} highlight={appliedFilters.keyword} />}
                  hospital={<HighlightText text={job.hospital} highlight={appliedFilters.keyword} />}
                  location={<HighlightText text={job.location} highlight={appliedFilters.keyword} />}
                  type={job.type as 'Full-Time' | 'Contract' | 'Locum'}
                  salary={job.salary}
                  postedAt={job.postedAt}
                  specialization={job.specialization}
                  href={`/jobs/${job.id}`}
                  status={job.status as 'featured' | 'urgent' | 'new' | 'open'}
                  isBookmarked={bookmarkedIds.includes(job.id)}
                  onBookmarkToggle={() => toggleBookmark(job.id)}
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

      {/* --- FLOATING BOOKMARKS BADGE BUTTON --- */}
      {bookmarkedIds.length > 0 && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full bg-surface border border-accent/40 text-text px-5 py-3 hover:border-accent shadow-[0_0_20px_rgba(45,212,191,0.22)] flex items-center gap-2.5 transition-all hover:scale-105"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
          </svg>
          <span className="text-sm font-medium">Saved Jobs</span>
          <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent font-semibold">{bookmarkedIds.length}</span>
        </button>
      )}

      {/* --- SLIDING SAVED JOBS DRAWER --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md border-l border-border bg-surface/95 p-6 shadow-glow backdrop-blur-xl flex flex-col"
            >
              <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
                <h3 className="text-xl font-light tracking-tight text-text flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-accent">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                  </svg>
                  Saved Jobs ({bookmarkedJobs.length})
                </h3>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-muted hover:text-text text-lg p-1"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {bookmarkedJobs.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-border bg-bg p-4 space-y-3 relative group">
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className="absolute top-3 right-3 text-muted hover:text-red-400 transition-colors p-1"
                      aria-label="Remove bookmark"
                    >
                      ✕
                    </button>
                    <div>
                      <span className="inline-block rounded-full border border-accent/20 bg-accent/5 px-2 py-0.5 text-[10px] uppercase font-semibold text-accent mb-1.5">
                        {job.type}
                      </span>
                      <h4 className="font-medium text-text text-sm leading-tight pr-6">{job.title}</h4>
                      <p className="text-xs text-muted mt-1">{job.hospital} · {job.location}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <span className="text-[11px] text-muted">{job.salary}</span>
                      <a
                        href={`/jobs/${job.id}`}
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                ))}

                {bookmarkedJobs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted">You haven&apos;t bookmarked any vacancies yet.</p>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="mt-4 inline-flex h-9 items-center justify-center rounded-full bg-accent px-4 text-xs font-semibold text-bg"
                    >
                      Browse Open Roles
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

