import type { Metadata } from 'next';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | HNVNS',
  description: 'Manage jobs, pre-verified candidates, and hospital vacancy requests.',
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
