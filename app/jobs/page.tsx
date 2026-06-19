import type { Metadata } from 'next';
import { JobsPageClient } from './JobsPageClient';
import { prisma } from '@/lib/prisma';
import { jobs as staticJobs } from '@/lib/data';
import { hasRequiredEnv } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Jobs | HNVNS',
  description: 'Browse HNVNS healthcare staffing opportunities for imaging, diagnostics, and clinical operations teams.'
};

export const revalidate = 0;

function formatRelativeTime(dateInput: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - dateInput.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }
}

export default async function JobsPage() {
  let serializedJobs = staticJobs;

  if (hasRequiredEnv('DATABASE_URL')) {
    try {
      const dbJobs = await prisma.job.findMany({
        orderBy: { postedAt: 'desc' },
      });

      if (dbJobs.length > 0) {
        serializedJobs = dbJobs.map((job) => ({
          ...job,
          postedAt: formatRelativeTime(new Date(job.postedAt))
        }));
      }
    } catch (error) {
      console.warn('Database connection failed, falling back to static jobs:', error);
    }
  }

  return <JobsPageClient initialJobs={serializedJobs as any} />;
}
