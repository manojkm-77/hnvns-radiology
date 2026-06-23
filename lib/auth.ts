import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

/**
 * Shared signed-cookie session helpers for admin and dashboard access.
 *
 * Sessions are signed JWTs stored in httpOnly cookies. They are validated
 * on every protected server action via `verifyAdminSession` /
 * `verifyDashboardSession`.
 */

const ADMIN_COOKIE = 'hnvns_admin';
const ADMIN_MAX_AGE_SEC = 4 * 60 * 60; // 4 hours

const DASHBOARD_COOKIE = 'hnvns_dashboard';
const DASHBOARD_MAX_AGE_SEC = 2 * 60 * 60; // 2 hours

/**
 * Resolves the HMAC signing secret. Prefers a dedicated ADMIN_JWT_SECRET,
 * but falls back to ADMIN_PASSCODE so existing deployments keep working
 * without an additional env var. Throws if neither is set (fail closed).
 */
function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSCODE;
  if (!secret) {
    throw new Error(
      'ADMIN_JWT_SECRET (or ADMIN_PASSCODE) must be set to sign/verify sessions.'
    );
  }
  return new TextEncoder().encode(secret);
}

function isProd(): boolean {
  return process.env.NODE_ENV === 'production';
}

/* ---------------------------------- Admin --------------------------------- */

/** Issues a signed httpOnly admin session cookie (4-hour expiry). */
export async function setAdminSession(): Promise<void> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_MAX_AGE_SEC}s`)
    .sign(getSecret());

  cookies().set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProd(),
    path: '/',
    maxAge: ADMIN_MAX_AGE_SEC,
  });
}

/** Clears the admin session cookie. */
export function clearAdminSession(): void {
  cookies().set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
}

/**
 * Verifies the admin session cookie.
 * Returns true only when a valid, unexpired token is present.
 */
export async function verifyAdminSession(): Promise<boolean> {
  try {
    const token = cookies().get(ADMIN_COOKIE)?.value;
    if (!token) return false;
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

/* -------------------------------- Dashboard ------------------------------- */

/** Issues a signed httpOnly dashboard session cookie for `email` (2-hour expiry). */
export async function setDashboardSession(email: string): Promise<void> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${DASHBOARD_MAX_AGE_SEC}s`)
    .sign(getSecret());

  cookies().set(DASHBOARD_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: isProd(),
    path: '/',
    maxAge: DASHBOARD_MAX_AGE_SEC,
  });
}

/** Clears the dashboard session cookie. */
export function clearDashboardSession(): void {
  cookies().set(DASHBOARD_COOKIE, '', { path: '/', maxAge: 0 });
}

/**
 * Verifies the dashboard session cookie and returns the bound email,
 * or null when the cookie is missing / invalid / expired.
 */
export async function verifyDashboardSession(): Promise<string | null> {
  try {
    const token = cookies().get(DASHBOARD_COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    const email = payload.email as string | undefined;
    return email ?? null;
  } catch {
    return null;
  }
}
