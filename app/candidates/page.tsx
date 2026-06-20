import type { Metadata } from 'next';
import { CandidatesPageClient } from '@/components/candidates/CandidatesPageClient';

export const metadata: Metadata = {
  title: 'Candidates | HNVNS',
  description: 'Register your imaging, diagnostics, PACS, or clinical operations profile with HNVNS.',
};

export default function CandidatesPage() {
  return <CandidatesPageClient />;
}
