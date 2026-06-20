import nodemailer from 'nodemailer';

/**
 * Creates a Nodemailer transporter using Gmail OAuth2.
 * Returns null if any required env var is missing so callers can degrade gracefully.
 */
function createTransporter() {
  const { GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, ADMIN_EMAIL } = process.env;

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !ADMIN_EMAIL) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: ADMIN_EMAIL,
      clientId: GMAIL_CLIENT_ID,
      clientSecret: GMAIL_CLIENT_SECRET,
      refreshToken: GMAIL_REFRESH_TOKEN,
    },
  });
}

type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Sends an email via Gmail OAuth2.
 * Silently no-ops if Gmail is not configured — never throws.
 */
export async function sendMail({ to, subject, html }: MailOptions): Promise<void> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn('Gmail not configured — skipping email send. Add GMAIL_* env vars.');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"HNVNS" <${process.env.ADMIN_EMAIL}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    // Non-fatal — log and continue. DB write already succeeded.
    console.error('Gmail send failed:', err);
  }
}
