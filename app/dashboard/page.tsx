import type { Metadata } from 'next';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard | HNVNS',
  description: 'View your applications, vacancy requests, and account activity on HNVNS.',
};

export default function DashboardPage() {
  return (
    <div className="animate-page-fade min-h-screen bg-bg pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <DashboardClient email="" firstName={null} />
      </div>
    </div>
  );
}
