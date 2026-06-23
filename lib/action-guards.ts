import { hasRequiredEnv } from '@/lib/env';
import { verifyAdminSession } from '@/lib/auth';

type ActionFailure = { success: false; error: string };

export function requireDatabase(): ActionFailure | null {
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured. Please add DATABASE_URL.' };
  }
  return null;
}

export async function requireAdmin(): Promise<ActionFailure | null> {
  if (!(await verifyAdminSession())) {
    return { success: false, error: 'Unauthorized' };
  }
  return null;
}

export async function requireAdminWithDb(): Promise<ActionFailure | null> {
  const adminCheck = await requireAdmin();
  if (adminCheck) return adminCheck;
  const dbCheck = requireDatabase();
  if (dbCheck) return dbCheck;
  return null;
}
