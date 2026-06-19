import type { Metadata } from 'next';
import { JobsPageClient } from './JobsPageClient';

export const metadata: Metadata = {
  title: 'Jobs | HNVNS',
  description: 'Browse HNVNS radiology, imaging, AI diagnostics, and reporting career opportunities.'
};

export default function JobsPage() {
  return <JobsPageClient />;
}
