'use server';

import { prisma } from '@/lib/prisma';
import { resend } from '@/lib/resend';

type CandidateInput = {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  availability: string;
  resumeUrl?: string;
};

export async function registerCandidateAction(values: CandidateInput) {
  try {
    // 1. Save candidate to PostgreSQL database
    const candidate = await prisma.candidate.create({
      data: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        specialization: values.specialization,
        availability: values.availability,
        resumeUrl: values.resumeUrl || null,
      },
    });

    // 2. Send email notification if Resend is configured
    if (resend) {
      const adminEmail = process.env.ADMIN_EMAIL ?? 'partnerships@hnvns.example';
      
      try {
        await resend.emails.send({
          from: 'HNVNS Talent Network <system@hnvns.example>',
          to: [adminEmail],
          subject: `✨ [New Candidate] ${values.name} - ${values.specialization}`,
          html: `
            <h2>New Candidate Registered</h2>
            <p><strong>Name:</strong> ${values.name}</p>
            <p><strong>Email:</strong> ${values.email}</p>
            <p><strong>Phone:</strong> ${values.phone}</p>
            <p><strong>Specialization:</strong> ${values.specialization}</p>
            <p><strong>Availability:</strong> ${values.availability}</p>
            <p><strong>Resume/Credentials:</strong> ${values.resumeUrl ? `<a href="${values.resumeUrl}">View Resume File</a>` : 'Not uploaded'}</p>
          `,
        });

        // Also send confirmation to the candidate
        await resend.emails.send({
          from: 'HNVNS Talent Team <onboarding@hnvns.example>',
          to: [values.email],
          subject: 'Welcome to the HNVNS Talent Network!',
          html: `
            <h3>Hello ${values.name},</h3>
            <p>Thank you for submitting your profile to the HNVNS talent network as a <strong>${values.specialization}</strong> specialist.</p>
            <p>Our verification coordinators will review your credentials and availability. Your profile will remain private until we match you to a role and you explicitly approve applying.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>HNVNS Onboarding Team</strong></p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send Resend emails:', emailError);
      }
    }

    return { success: true, data: candidate };
  } catch (dbError) {
    console.error('Database save error:', dbError);
    return { success: false, error: 'Database save failed. Please try again.' };
  }
}
