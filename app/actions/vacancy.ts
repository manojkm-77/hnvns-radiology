'use server';

import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';
import { sendMail } from '@/lib/gmail';
import { appendRow } from '@/lib/sheets';

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

  // 3. Gmail notification to admin
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendMail({
      to: adminEmail,
      subject: `New Vacancy – ${values.hospitalName} – ${values.role} – ${values.urgency}`,
      html: `
        <h2 style="font-family:sans-serif">New Vacancy Submission</h2>
        <table style="font-family:sans-serif;border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Hospital</td><td style="padding:8px;border:1px solid #ddd">${values.hospitalName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Location</td><td style="padding:8px;border:1px solid #ddd">${values.location}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Department</td><td style="padding:8px;border:1px solid #ddd">${values.department}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Role Needed</td><td style="padding:8px;border:1px solid #ddd">${values.role}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Positions</td><td style="padding:8px;border:1px solid #ddd">${values.positions}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Urgency</td><td style="padding:8px;border:1px solid #ddd">${values.urgency}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Name</td><td style="padding:8px;border:1px solid #ddd">${values.contactName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Phone</td><td style="padding:8px;border:1px solid #ddd">${values.contactPhone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Contact Email</td><td style="padding:8px;border:1px solid #ddd">${values.contactEmail}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Notes</td><td style="padding:8px;border:1px solid #ddd">${values.notes ?? '—'}</td></tr>
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
