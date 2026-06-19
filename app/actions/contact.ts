'use server';

import { resend } from '@/lib/resend';

type ContactInput = {
  name: string;
  email: string;
  organization: string;
  staffingFocus: string;
  message: string;
};

export async function submitContactAction(values: ContactInput) {
  try {
    // Send email notification if Resend is configured
    if (resend) {
      const adminEmail = process.env.ADMIN_EMAIL ?? 'partnerships@hnvns.example';
      
      try {
        await resend.emails.send({
          from: 'HNVNS Contact Center <system@hnvns.example>',
          to: [adminEmail],
          subject: `✉️ [Contact Inquiry] ${values.name} - ${values.staffingFocus}`,
          html: `
            <h2>New Contact Inquiry Received</h2>
            <p><strong>Name:</strong> ${values.name}</p>
            <p><strong>Email:</strong> ${values.email}</p>
            <p><strong>Organization:</strong> ${values.organization}</p>
            <p><strong>Staffing Focus:</strong> ${values.staffingFocus}</p>
            <p><strong>Message:</strong></p>
            <blockquote style="background: #f0f0f0; padding: 10px; border-left: 4px solid #00f;">
              ${values.message.replace(/\n/g, '<br>')}
            </blockquote>
          `,
        });

        // Send auto-reply to the inquirer
        await resend.emails.send({
          from: 'HNVNS Support <partnerships@hnvns.example>',
          to: [values.email],
          subject: 'HNVNS Inquiry Received',
          html: `
            <h3>Hello ${values.name},</h3>
            <p>Thank you for contacting HNVNS Support.</p>
            <p>We have received your inquiry regarding <strong>${values.staffingFocus}</strong>. A staffing coordinator will review your request and get back to you shortly.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>HNVNS Operations Team</strong></p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send Resend emails:', emailError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Contact submit error:', error);
    return { success: false, error: 'Submission failed. Please try again.' };
  }
}
