'use server';

import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';

function verifyPasscode(passcode: string): boolean {
  const adminPasscode = process.env.ADMIN_PASSCODE;
  if (!adminPasscode) {
    throw new Error(
      'ADMIN_PASSCODE environment variable is not set. ' +
      'Please add it to your .env or Vercel project settings.'
    );
  }
  return passcode === adminPasscode;
}

export async function getAdminDataAction(passcode: string) {
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured. Please add DATABASE_URL.' };
  }

  try {
    if (!verifyPasscode(passcode)) {
      return { success: false, error: 'Invalid passcode. Access denied.' };
    }
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  try {
    const jobs = await prisma.job.findMany({
      orderBy: { postedAt: 'desc' },
    });

    const candidates = await prisma.candidate.findMany({
      orderBy: { registeredAt: 'desc' },
    });

    const vacancyRequests = await prisma.vacancyRequest.findMany({
      orderBy: { submittedAt: 'desc' },
    });

    return {
      success: true,
      data: {
        jobs,
        candidates,
        vacancyRequests,
      },
    };
  } catch (error) {
    console.error('Failed to retrieve admin dashboard data:', error);
    return { success: false, error: 'Failed to retrieve admin data from database.' };
  }
}

export async function createJobAction(passcode: string, jobData: {
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
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    if (!verifyPasscode(passcode)) {
      return { success: false, error: 'Invalid passcode. Access denied.' };
    }
  } catch (err) {
    return { success: false, error: (err as Error).message };
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

export async function updateJobAction(passcode: string, jobId: string, jobData: {
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
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    if (!verifyPasscode(passcode)) {
      return { success: false, error: 'Invalid passcode. Access denied.' };
    }
  } catch (err) {
    return { success: false, error: (err as Error).message };
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

export async function deleteJobAction(passcode: string, jobId: string) {
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    if (!verifyPasscode(passcode)) {
      return { success: false, error: 'Invalid passcode. Access denied.' };
    }
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }

  try {
    await prisma.job.delete({
      where: { id: jobId },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to delete job posting:', error);
    return { success: false, error: 'Failed to delete job from database.' };
  }
}
