'use server';

import { randomInt, timingSafeEqual, createHash } from 'crypto';
import { prisma } from '@/lib/prisma';
import { hasRequiredEnv } from '@/lib/env';
import { resend } from '@/lib/resend';
import { escapeHtml } from '@/lib/html';
import { checkRateLimit } from '@/lib/ratelimit';
import { headers } from 'next/headers';
import { setDashboardSession, verifyDashboardSession } from '@/lib/auth';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// 5 OTP requests per 15 minutes per IP
const OTP_RATE_LIMIT = 5;
const OTP_RATE_WINDOW_MS = 15 * 60 * 1000;

function getIp(): string {
  const h = headers();
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  );
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** SHA-256 hash of an OTP code; we never store the plain code. */
function hashOtp(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}

export type OtpRequestResult =
  | { success: true; step: 'otp_sent' }
  | { success: false; error: string };

/**
 * Step 1 — request a one-time dashboard login code.
 * Generates a 6-digit code, stores its SHA-256 hash with a 10-minute expiry,
 * and emails the plain code to the user via Resend.
 */
export async function requestOtpAction(email: string): Promise<OtpRequestResult> {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    return { success: false, error: 'Enter a valid email address.' };
  }

  const ip = getIp();
  if (!checkRateLimit(`otp:${ip}`, OTP_RATE_LIMIT, OTP_RATE_WINDOW_MS)) {
    return { success: false, error: 'Too many requests. Please wait before trying again.' };
  }

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured.' };
  }

  // Cryptographically random 6-digit code
  const code = String(randomInt(100000, 999999));
  const codeHash = hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);

  try {
    await prisma.otpToken.create({
      data: { email: normalized, code: codeHash, expiresAt },
    });
  } catch (err) {
    console.error('Failed to store OTP token:', err);
    return { success: false, error: 'Could not generate a login code. Please try again.' };
  }

  // Email the plain code (falls back to a server log when Resend is absent)
  if (resend) {
    try {
      await resend.emails.send({
        from: 'HNVNS Dashboard <system@hnvns.example>',
        to: [normalized],
        subject: 'Your HNVNS Dashboard Code',
        html: `
          <h2 style="font-family:sans-serif">Your HNVNS Dashboard Code</h2>
          <p style="font-family:sans-serif">Use the code below to access your dashboard. It expires in 10 minutes.</p>
          <p style="font-family:sans-serif;font-size:32px;font-weight:bold;letter-spacing:8px">${escapeHtml(code)}</p>
          <p style="font-family:sans-serif;color:#888">If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    } catch (err) {
      console.error('Failed to send OTP email:', err);
      return { success: false, error: 'Could not send the login code. Please try again.' };
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV] Dashboard OTP for ${normalized}: ${code}`);
  }

  return { success: true, step: 'otp_sent' };
}

export type OtpVerifyResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Step 2 — verify the submitted code.
 * Hashes the submitted code and constant-time compares it against the most
 * recent unused, non-expired token for the email. On success marks the token
 * used and issues a signed httpOnly dashboard session cookie (2-hour expiry).
 */
export async function verifyOtpAction(email: string, code: string): Promise<OtpVerifyResult> {
  const normalized = normalizeEmail(email);
  const trimmedCode = code.trim();

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false, error: 'Database is not configured.' };
  }

  if (!trimmedCode) {
    return { success: false, error: 'Enter the code we sent to your email.' };
  }

  const submittedHash = hashOtp(trimmedCode);

  try {
    const tokens = await prisma.otpToken.findMany({
      where: {
        email: normalized,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    let matchedId: string | null = null;
    for (const t of tokens) {
      const a = Buffer.from(submittedHash);
      const b = Buffer.from(t.code);
      if (a.length === b.length && timingSafeEqual(a, b)) {
        matchedId = t.id;
        break;
      }
    }

    if (!matchedId) {
      return { success: false, error: 'Invalid or expired code.' };
    }

    await prisma.otpToken.update({
      where: { id: matchedId },
      data: { used: true },
    });

    await setDashboardSession(normalized);
    return { success: true };
  } catch (err) {
    console.error('OTP verification failed:', err);
    return { success: false, error: 'Verification failed. Please try again.' };
  }
}

export async function getCandidateApplicationsAction() {
  const email = await verifyDashboardSession();
  if (!email) {
    return { success: false as const, error: 'Session expired' };
  }

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false as const, error: 'Database is not configured.' };
  }

  try {
    const applications = await prisma.candidateApplication.findMany({
      where: { email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        specialization: true,
        jobId: true,
        createdAt: true,
        availability: true,
        resumeUrl: true,
      },
    });

    const jobIds = applications
      .map((a) => a.jobId)
      .filter((id): id is string => Boolean(id));

    const jobs =
      jobIds.length > 0
        ? await prisma.job.findMany({
            where: { id: { in: jobIds } },
            select: { id: true, title: true, hospital: true, location: true },
          })
        : [];

    const jobMap = new Map(jobs.map((j) => [j.id, j]));

    const enriched = applications.map((a) => ({
      ...a,
      registeredAt: a.createdAt,
      job: a.jobId ? (jobMap.get(a.jobId) ?? null) : null,
    }));

    return { success: true as const, data: enriched };
  } catch (error) {
    console.error('Failed to fetch candidate applications:', error);
    return { success: false as const, error: 'Failed to load your applications.' };
  }
}

export async function getHospitalVacanciesAction() {
  const email = await verifyDashboardSession();
  if (!email) {
    return { success: false as const, error: 'Session expired' };
  }

  if (!hasRequiredEnv('DATABASE_URL')) {
    return { success: false as const, error: 'Database is not configured.' };
  }

  try {
    const vacancies = await prisma.vacancyRequest.findMany({
      where: { contactEmail: email },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        hospitalName: true,
        role: true,
        department: true,
        urgency: true,
        createdAt: true,
      },
    });

    return { success: true as const, data: vacancies };
  } catch (error) {
    console.error('Failed to fetch hospital vacancies:', error);
    return { success: false as const, error: 'Failed to load your vacancy requests.' };
  }
}
