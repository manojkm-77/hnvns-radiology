import type { Metadata } from 'next';
import { JobsPageClient } from './JobsPageClient';

export const metadata: Metadata = {
  title: 'Jobs | HNVNS',
  description: 'Browse HNVNS healthcare staffing opportunities for imaging, diagnostics, and clinical operations teams.'
};

export default function JobsPage() {
  return <JobsPageClient />;
}
