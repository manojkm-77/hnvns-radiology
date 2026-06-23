'use server';

import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';
import { sendMail } from '@/lib/gmail';
import { appendRow } from '@/lib/sheets';
import { escapeHtml } from '@/lib/html';

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
  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured. Please add DATABASE_URL.' };
  }

  // 1. Save to DB
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

  // 2. Append to Google Sheet (fire-and-forget, non-fatal)
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

  // 3. Gmail notification to admin — all user values HTML-escaped
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const e = escapeHtml;
    const resumeCell = values.resumeUrl
      ? `<a href="${e(values.resumeUrl)}">Download Resume</a>`
      : '—';

    await sendMail({
      to: adminEmail,
      subject: `New Candidate – ${values.fullName} – ${values.specialization} – ${values.availability}`,
      html: `
        <h2 style="font-family:sans-serif">New Candidate Application</h2>
        <table style="font-family:sans-serif;border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${e(values.fullName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${e(values.email)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${e(values.phone)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Location</td><td style="padding:8px;border:1px solid #ddd">${e(values.location)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Experience</td><td style="padding:8px;border:1px solid #ddd">${values.experienceYears} year(s)</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Specialization</td><td style="padding:8px;border:1px solid #ddd">${e(values.specialization)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Current Employer</td><td style="padding:8px;border:1px solid #ddd">${e(values.currentEmployer) || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Expected Salary</td><td style="padding:8px;border:1px solid #ddd">${e(values.salaryRange)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Availability</td><td style="padding:8px;border:1px solid #ddd">${e(values.availability)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Resume</td><td style="padding:8px;border:1px solid #ddd">${resumeCell}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Job ID</td><td style="padding:8px;border:1px solid #ddd">${e(values.jobId) || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Cover Note</td><td style="padding:8px;border:1px solid #ddd">${e(values.coverNote) || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Submitted</td><td style="padding:8px;border:1px solid #ddd">${ts}</td></tr>
        </table>
      `,
    });
  }

  return { success: true };
}
