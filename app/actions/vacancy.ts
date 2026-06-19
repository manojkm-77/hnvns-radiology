'use server';

import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

type VacancyInput = {
  hospitalName: string;
  contactPerson: string;
  email: string;
  phone: string;
  specialization: string;
  roleType: string;
  urgency: string;
  startDate: string;
  requirements?: string;
};

export async function submitVacancyAction(values: VacancyInput) {
  try {
    // 1. Save vacancy request to PostgreSQL database
    const request = await prisma.vacancyRequest.create({
      data: {
        hospitalName: values.hospitalName,
        contactPerson: values.contactPerson,
        email: values.email,
        phone: values.phone,
        specialization: values.specialization,
        roleType: values.roleType,
        urgency: values.urgency,
        startDate: new Date(values.startDate),
        requirements: values.requirements || null,
      },
    });

    // 2. Send email notification if Resend is configured
    if (resend) {
      const adminEmail = process.env.ADMIN_EMAIL ?? 'partnerships@hnvns.example';
      
      try {
        await resend.emails.send({
          from: 'HNVNS Staffing System <system@hnvns.example>',
          to: [adminEmail],
          subject: `🚨 [${values.urgency} Vacancy] ${values.hospitalName} - ${values.specialization}`,
          html: `
            <h2>New Staffing Vacancy Submitted</h2>
            <p><strong>Hospital:</strong> ${values.hospitalName}</p>
            <p><strong>Contact Person:</strong> ${values.contactPerson}</p>
            <p><strong>Email:</strong> ${values.email}</p>
            <p><strong>Phone:</strong> ${values.phone}</p>
            <p><strong>Specialization:</strong> ${values.specialization}</p>
            <p><strong>Role Type:</strong> ${values.roleType}</p>
            <p><strong>Urgency Tier:</strong> ${values.urgency}</p>
            <p><strong>Start Date:</strong> ${values.startDate}</p>
            <p><strong>Additional Requirements:</strong></p>
            <blockquote style="background: #f0f0f0; padding: 10px; border-left: 4px solid #00f;">
              ${values.requirements ? values.requirements.replace(/\n/g, '<br>') : 'None'}
            </blockquote>
          `,
        });

        // Also send confirmation to the submitter
        await resend.emails.send({
          from: 'HNVNS Staffing <partnerships@hnvns.example>',
          to: [values.email],
          subject: 'HNVNS Staffing Request Received',
          html: `
            <h3>Hello ${values.contactPerson},</h3>
            <p>We have received your staffing request for a <strong>${values.specialization} (${values.roleType})</strong> position at <strong>${values.hospitalName}</strong>.</p>
            <p>Our clinical operations team will review your requirements and follow up within 18 hours with a shortlist of pre-verified candidates.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>HNVNS Staffing Team</strong></p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send Resend emails:', emailError);
      }
    }

    return { success: true, data: request };
  } catch (dbError) {
    console.error('Database save error:', dbError);
    return { success: false, error: 'Database save failed. Please try again.' };
  }
}
