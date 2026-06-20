import type { Metadata } from 'next';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from '@/components/dashboard/DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard | HNVNS',
  description: 'View your applications, vacancy requests, and account activity on HNVNS.',
};

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/dashboard');
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '';
  const firstName = user?.firstName ?? null;

  return (
    <div className="animate-page-fade min-h-screen bg-bg pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <DashboardClient email={email} firstName={firstName} />
      </div>
    </div>
  );
}
