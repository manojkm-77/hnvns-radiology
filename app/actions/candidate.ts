'use server';

import { prisma } from '@/lib/prisma';
import { requireDatabase } from '@/lib/action-guards';
import { sendMail } from '@/lib/gmail';
import { appendRow } from '@/lib/sheets';
import { escapeHtml } from '@/lib/html';
import { buildEmailTable } from '@/lib/email-template';

export type CandidateInput = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experienceYears: number;
  specialization: string;
  currentEmployer?: string;
  salaryRange: string;
  availability: string;    // Immediate | 15 days | 30 days | 60 days
  resumeUrl?: string;
  jobId?: string;
  coverNote?: string;
};

export async function registerCandidateAction(values: CandidateInput): Promise<
  | { success: true }
  | { success: false; error: string }
> {
  const dbCheck = requireDatabase();
  if (dbCheck) return dbCheck;

  try {
    await prisma.candidateApplication.create({
      data: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        location: values.location,
        experienceYears: values.experienceYears,
        specialization: values.specialization,
        currentEmployer: values.currentEmployer || null,
        salaryRange: values.salaryRange,
        availability: values.availability,
        resumeUrl: values.resumeUrl || null,
        jobId: values.jobId || null,
        coverNote: values.coverNote || null,
        status: 'new',
      },
    });
  } catch (dbErr) {
    console.error('CandidateApplication DB save failed:', dbErr);
    return { success: false, error: 'Database save failed. Please try again.' };
  }

  const ts = new Date().toISOString();

  const sheetId = process.env.CANDIDATES_SHEET_ID;
  if (sheetId) {
    await appendRow(sheetId, [
      ts,
      values.fullName,
      values.email,
      values.phone,
      values.location,
      values.experienceYears,
      values.specialization,
      values.currentEmployer ?? '',
      values.salaryRange,
      values.availability,
      values.resumeUrl ?? '',
      values.jobId ?? '',
      values.coverNote ?? '',
    ]);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const resumeCell = values.resumeUrl
      ? `<a href="${escapeHtml(values.resumeUrl)}">Download Resume</a>`
      : '—';

    await sendMail({
      to: adminEmail,
      subject: `New Candidate – ${values.fullName} – ${values.specialization} – ${values.availability}`,
      html: buildEmailTable('New Candidate Application', [
        { label: 'Name', value: values.fullName },
        { label: 'Email', value: values.email },
        { label: 'Phone', value: values.phone },
        { label: 'Location', value: values.location },
        { label: 'Experience', value: `${values.experienceYears} year(s)` },
        { label: 'Specialization', value: values.specialization },
        { label: 'Current Employer', value: values.currentEmployer },
        { label: 'Expected Salary', value: values.salaryRange },
        { label: 'Availability', value: values.availability },
        { label: 'Resume', value: resumeCell, html: true },
        { label: 'Job ID', value: values.jobId },
        { label: 'Cover Note', value: values.coverNote },
        { label: 'Submitted', value: ts },
      ]),
    });
  }

  return { success: true };
}
