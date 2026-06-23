'use server';

import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';
import { resend } from '@/lib/resend';
import { escapeHtml } from '@/lib/html';

type ContactInput = {
  name: string;
  email: string;
  organization: string;
  staffingFocus: string;
  message: string;
};

export async function submitContactAction(values: ContactInput): Promise<
  | { success: true }
  | { success: false; error: string }
> {
  let dbSaved = false;
  let emailSent = false;

  // 1. Persist to DB if available
  if (hasRequiredEnv('DATABASE_URL')) {
    try {
      await prisma.contactMessage.create({
        data: {
          name: values.name,
          email: values.email,
          organization: values.organization,
          staffingFocus: values.staffingFocus,
          message: values.message,
        },
      });
      dbSaved = true;
    } catch (dbError) {
      console.error('Failed to save contact message to DB:', dbError);
    }
  }

  // 2. Send email notification if Resend is configured — all values HTML-escaped
  if (resend) {
    const e = escapeHtml;
    const adminEmail = process.env.ADMIN_EMAIL ?? 'partnerships@hnvns.example';

    try {
      await resend.emails.send({
        from: 'HNVNS Contact Center <system@hnvns.example>',
        to: [adminEmail],
        subject: `✉️ [Contact Inquiry] ${values.name} - ${values.staffingFocus}`,
        html: `
          <h2>New Contact Inquiry Received</h2>
          <p><strong>Name:</strong> ${e(values.name)}</p>
          <p><strong>Email:</strong> ${e(values.email)}</p>
          <p><strong>Organization:</strong> ${e(values.organization)}</p>
          <p><strong>Staffing Focus:</strong> ${e(values.staffingFocus)}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f0f0f0; padding: 10px; border-left: 4px solid #00f;">
            ${e(values.message).replace(/\n/g, '<br>')}
          </blockquote>
        `,
      });

      await resend.emails.send({
        from: 'HNVNS Support <partnerships@hnvns.example>',
        to: [values.email],
        subject: 'HNVNS Inquiry Received',
        html: `
          <h3>Hello ${e(values.name)},</h3>
          <p>Thank you for contacting HNVNS Support.</p>
          <p>We have received your inquiry regarding <strong>${e(values.staffingFocus)}</strong>. A staffing coordinator will review your request and get back to you shortly.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>HNVNS Operations Team</strong></p>
        `,
      });
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send Resend emails:', emailError);
    }
  } else {
    // No email provider configured — DB save is the only delivery channel
    emailSent = dbSaved;
  }

  // If neither channel succeeded, report failure so the user knows to retry
  if (!dbSaved && !emailSent) {
    return { success: false, error: 'Submission failed. Please try again or email us directly.' };
  }

  return { success: true };
}
