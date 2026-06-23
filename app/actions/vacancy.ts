'use server';

import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';
import { sendMail } from '@/lib/gmail';
import { appendRow } from '@/lib/sheets';
import { escapeHtml } from '@/lib/html';
import { checkRateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';

// 5 vacancy submissions per 15 minutes per IP
const VACANCY_RATE_LIMIT = 5;
const VACANCY_RATE_WINDOW_MS = 15 * 60 * 1000;

function getIp(): string {
  const h = headers();
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  );
}

export type VacancyInput = {
  hospitalName: string;
  location: string;
  department: string;
  role: string;
  positions: number;
  urgency: string;         // Routine | Urgent | Critical
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  notes?: string;
  onboardingCall: boolean;
};

export async function submitVacancyAction(values: VacancyInput): Promise<
  | { success: true; onboardingCall: boolean; meetingLink: string | null }
  | { success: false; error: string }
> {
  const ip = getIp();
  if (!checkRateLimit(`vacancy:${ip}`, VACANCY_RATE_LIMIT, VACANCY_RATE_WINDOW_MS)) {
    return { success: false, error: 'Too many submissions. Please wait before trying again.' };
  }

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured. Please add DATABASE_URL.' };
  }

  // 1. Save to DB
  try {
    await prisma.vacancyRequest.create({
      data: {
        hospitalName: values.hospitalName,
        location: values.location,
        department: values.department,
        role: values.role,
        positions: values.positions,
        urgency: values.urgency,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        contactEmail: values.contactEmail,
        notes: values.notes || null,
        onboardingCall: values.onboardingCall,
        status: 'new',
      },
    });
  } catch (dbErr) {
    console.error('VacancyRequest DB save failed:', dbErr);
    return { success: false, error: 'Database save failed. Please try again.' };
  }

  const ts = new Date().toISOString();

  // 2. Append to Google Sheet (fire-and-forget, non-fatal)
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (sheetId) {
    await appendRow(sheetId, [
      ts,
      values.hospitalName,
      values.location,
      values.department,
      values.role,
      values.positions,
      values.urgency,
      values.contactName,
      values.contactPhone,
      values.contactEmail,
      values.notes ?? '',
      values.onboardingCall ? 'Yes' : 'No',
    ]);
  }

  // 3. Gmail notification to admin — all user values HTML-escaped
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const e = escapeHtml;
    await sendMail({
      to: adminEmail,
      subject: `New Vacancy – ${values.hospitalName} – ${values.role} – ${values.urgency}`,
      html: `
        <h2 style="font-family:sans-serif">New Vacancy Submission</h2>
        <table style="font-family:sans-serif;border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Hospital</td><td style="padding:8px;border:1px solid #ddd">${e(values.hospitalName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Location</td><td style="padding:8px;border:1px solid #ddd">${e(values.location)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Department</td><td style="padding:8px;border:1px solid #ddd">${e(values.department)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Role Needed</td><td style="padding:8px;border:1px solid #ddd">${e(values.role)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Positions</td><td style="padding:8px;border:1px solid #ddd">${values.positions}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Urgency</td><td style="padding:8px;border:1px solid #ddd">${e(values.urgency)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Name</td><td style="padding:8px;border:1px solid #ddd">${e(values.contactName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Phone</td><td style="padding:8px;border:1px solid #ddd">${e(values.contactPhone)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Email</td><td style="padding:8px;border:1px solid #ddd">${e(values.contactEmail)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Notes</td><td style="padding:8px;border:1px solid #ddd">${e(values.notes) || '—'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Onboarding Call</td><td style="padding:8px;border:1px solid #ddd">${values.onboardingCall ? 'Yes' : 'No'}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Submitted</td><td style="padding:8px;border:1px solid #ddd">${ts}</td></tr>
        </table>
      `,
    });
  }

  return {
    success: true,
    onboardingCall: values.onboardingCall,
    meetingLink: values.onboardingCall ? (process.env.MEETING_LINK ?? null) : null,
  };
}
