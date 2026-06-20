'use server';

import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';

export async function getCandidateApplicationsAction(email: string) {
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false as const, error: 'Database is not configured.' };
  }

  try {
    const applications = await prisma.candidateApplication.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        specialization: true,
        jobId: true,
        createdAt: true,
        availability: true,
        resumeUrl: true,
      },
    });

    const jobIds = applications
      .map((a) => a.jobId)
      .filter((id): id is string => Boolean(id));

    const jobs =
      jobIds.length > 0
        ? await prisma.job.findMany({
            where: { id: { in: jobIds } },
            select: { id: true, title: true, hospital: true, location: true },
          })
        : [];

    const jobMap = new Map(jobs.map((j) => [j.id, j]));

    const enriched = applications.map((a) => ({
      ...a,
      registeredAt: a.createdAt,
      job: a.jobId ? (jobMap.get(a.jobId) ?? null) : null,
    }));

    return { success: true as const, data: enriched };
  } catch (error) {
    console.error('Failed to fetch candidate applications:', error);
    return { success: false as const, error: 'Failed to load your applications.' };
  }
}

export async function getHospitalVacanciesAction(email: string) {
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false as const, error: 'Database is not configured.' };
  }

  try {
    const vacancies = await prisma.vacancyRequest.findMany({
      where: { contactEmail: email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        hospitalName: true,
        role: true,
        department: true,
        urgency: true,
        createdAt: true,
      },
    });

    return { success: true as const, data: vacancies };
  } catch (error) {
    console.error('Failed to fetch hospital vacancies:', error);
    return { success: false as const, error: 'Failed to load your vacancy requests.' };
  }
}
