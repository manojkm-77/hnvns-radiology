'use server';

import { SignJWT } from 'jose';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/ratelimit';

// 10 nonce requests per 15 minutes per IP
const NONCE_RATE_LIMIT = 10;
const NONCE_RATE_WINDOW_MS = 15 * 60 * 1000;

function getIp(): string {
  const h = headers();
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    h.get('x-real-ip') ??
    'unknown'
  );
}

/**
 * Issues a short-lived signed upload nonce (5-minute JWT) instead of exposing
 * the static UPLOAD_TOKEN. The `/api/upload` route verifies this JWT. Rate-
 * limited to prevent abuse.
 */
export async function getUploadTokenAction(): Promise<string | null> {
  const secret = process.env.UPLOAD_TOKEN ?? process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSCODE;
  if (!secret) return null;

  const ip = getIp();
  if (!checkRateLimit(`upload-nonce:${ip}`, NONCE_RATE_LIMIT, NONCE_RATE_WINDOW_MS)) {
    return null;
  }

  const nonce = await new SignJWT({ purpose: 'upload' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(new TextEncoder().encode(secret));

  return nonce;
}
