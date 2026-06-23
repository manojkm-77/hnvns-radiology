'use server';

import { timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';
import { checkRateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';
import {
  setAdminSession,
  verifyAdminSession,
  clearAdminSession,
} from '@/lib/auth';

// 10 attempts per 15 minutes per IP
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function getIp(): string {
  const h = headers();
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  );
}

/**
 * Constant-time passcode comparison to prevent timing-based discovery.
 * Compares equal-length buffers with `crypto.timingSafeEqual`; when lengths
 * differ we still perform a throwaway compare to keep the timing profile flat
 * before returning false.
 */
function verifyPasscode(passcode: string): boolean {
  const adminPasscode = process.env.ADMIN_PASSCODE;
  if (!adminPasscode) {
    throw new Error(
      'ADMIN_PASSCODE environment variable is not set. ' +
      'Please add it to your .env or Vercel project settings.'
    );
  }
  const a = Buffer.from(passcode);
  const b = Buffer.from(adminPasscode);
  if (a.length !== b.length) {
    timingSafeEqual(b, b);
    return false;
  }
  return timingSafeEqual(a, b);
}

/**
 * Verifies the passcode (timing-safe) and, on success, issues a signed
 * httpOnly admin session cookie. Subsequent admin actions are gated by
 * `verifyAdminSession` rather than re-sending the passcode.
 */
export async function adminLoginAction(passcode: string) {
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured. Please add DATABASE_URL.' };
  }

  const ip = getIp();
  if (!checkRateLimit(`admin:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return { success: false, error: 'Too many attempts. Please wait before trying again.' };
  }

  try {
    if (!verifyPasscode(passcode)) {
      return { success: false, error: 'Invalid passcode. Access denied.' };
    }
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  try {
    await setAdminSession();
  } catch (err) {
    console.error('Failed to create admin session:', err);
    return { success: false, error: 'Failed to create session. Please try again.' };
  }
  return { success: true };
}

/** Clears the admin session cookie. */
export async function adminLogoutAction() {
  clearAdminSession();
  return { success: true };
}

export async function getAdminDataAction() {
  if (!(await verifyAdminSession())) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured. Please add DATABASE_URL.' };
  }

  try {
    const jobs = await prisma.job.findMany({
      orderBy: { postedAt: 'desc' },
    });

    const candidates = await prisma.candidateApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const vacancyRequests = await prisma.vacancyRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: { jobs, candidates, vacancyRequests },
    };
  } catch (error) {
    console.error('Failed to retrieve admin dashboard data:', error);
    return { success: false, error: 'Failed to retrieve admin data from database.' };
  }
}

export async function createJobAction(jobData: {
  title: string;
  hospital: string;
  location: string;
  type: string;
  salary: string;
  specialization: string;
  status: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    const newJob = await prisma.job.create({
      data: {
        title: jobData.title,
        hospital: jobData.hospital,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        specialization: jobData.specialization,
        status: jobData.status,
        description: jobData.description || null,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements,
        benefits: jobData.benefits,
      },
    });
    return { success: true, data: newJob };
  } catch (error) {
    console.error('Failed to create job posting:', error);
    return { success: false, error: 'Failed to create job in database.' };
  }
}

export async function updateJobAction(jobId: string, jobData: {
  title: string;
  hospital: string;
  location: string;
  type: string;
  salary: string;
  specialization: string;
  status: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
}) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        title: jobData.title,
        hospital: jobData.hospital,
        location: jobData.location,
        type: jobData.type,
        salary: jobData.salary,
        specialization: jobData.specialization,
        status: jobData.status,
        description: jobData.description || null,
        responsibilities: jobData.responsibilities,
        requirements: jobData.requirements,
        benefits: jobData.benefits,
      },
    });
    return { success: true, data: updatedJob };
  } catch (error) {
    console.error('Failed to update job posting:', error);
    return { success: false, error: 'Failed to update job in database.' };
  }
}

export async function deleteJobAction(jobId: string) {
  if (!(await verifyAdminSession())) {
    return { success: false, error: 'Unauthorized' };
  }

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    await prisma.job.delete({ where: { id: jobId } });
    return { success: true };
  } catch (error) {
    console.error('Failed to delete job posting:', error);
    return { success: false, error: 'Failed to delete job from database.' };
  }
}
