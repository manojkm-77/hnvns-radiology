'use server';

import { prisma } from '@/lib/prisma';
import { requireDatabase } from '@/lib/action-guards';
import { sendMail } from '@/lib/gmail';
import { appendRow } from '@/lib/sheets';
import { buildEmailTable } from '@/lib/email-template';

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
  const dbCheck = requireDatabase();
  if (dbCheck) return dbCheck;

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

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await sendMail({
      to: adminEmail,
      subject: `New Vacancy – ${values.hospitalName} – ${values.role} – ${values.urgency}`,
      html: buildEmailTable('New Vacancy Submission', [
        { label: 'Hospital', value: values.hospitalName },
        { label: 'Location', value: values.location },
        { label: 'Department', value: values.department },
        { label: 'Role Needed', value: values.role },
        { label: 'Positions', value: values.positions },
        { label: 'Urgency', value: values.urgency },
        { label: 'Contact Name', value: values.contactName },
        { label: 'Contact Phone', value: values.contactPhone },
        { label: 'Contact Email', value: values.contactEmail },
        { label: 'Notes', value: values.notes },
        { label: 'Onboarding Call', value: values.onboardingCall ? 'Yes' : 'No' },
        { label: 'Submitted', value: ts },
      ]),
    });
  }

  return {
    success: true,
    onboardingCall: values.onboardingCall,
    meetingLink: values.onboardingCall ? (process.env.MEETING_LINK ?? null) : null,
  };
}
