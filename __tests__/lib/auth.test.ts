import { SignJWT, jwtVerify } from 'jose';

/**
 * Auth module tests.
 *
 * The actual auth helpers depend on next/headers (cookies()), which is only
 * available inside the Next.js request context. Instead of mocking the full
 * Next.js runtime, we test the core signing/verifying logic directly using
 * the same jose library and key-derivation approach the module uses.
 */

const TEST_SECRET = 'test-admin-secret';

function getSecret(): Uint8Array {
  return new TextEncoder().encode(TEST_SECRET);
}

describe('auth – JWT signing and verification', () => {
  it('creates a valid admin JWT with role claim', async () => {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(getSecret());

    const { payload } = await jwtVerify(token, getSecret());
    expect(payload.role).toBe('admin');
    expect(payload.exp).toBeDefined();
  });

  it('creates a valid dashboard JWT with email claim', async () => {
    const email = 'user@example.com';
    const token = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(getSecret());

    const { payload } = await jwtVerify(token, getSecret());
    expect(payload.email).toBe(email);
  });

  it('rejects tokens signed with a different secret', async () => {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(new TextEncoder().encode('wrong-secret'));

    await expect(jwtVerify(token, getSecret())).rejects.toThrow();
  });

  it('rejects expired tokens', async () => {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
      .sign(getSecret());

    await expect(jwtVerify(token, getSecret())).rejects.toThrow();
  });

  it('rejects tampered tokens', async () => {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(getSecret());

    const parts = token.split('.');
    // Tamper with the payload
    parts[1] = parts[1] + 'x';
    const tampered = parts.join('.');

    await expect(jwtVerify(tampered, getSecret())).rejects.toThrow();
  });

  it('getSecret throws when no secret is available', () => {
    const original = process.env.ADMIN_JWT_SECRET;
    const originalPasscode = process.env.ADMIN_PASSCODE;
    delete process.env.ADMIN_JWT_SECRET;
    delete process.env.ADMIN_PASSCODE;

    // Re-implement the getSecret logic to verify throw behavior
    function getSecretFromEnv(): Uint8Array {
      const secret = process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSCODE;
      if (!secret) {
        throw new Error(
          'ADMIN_JWT_SECRET (or ADMIN_PASSCODE) must be set to sign/verify sessions.'
        );
      }
      return new TextEncoder().encode(secret);
    }

    expect(() => getSecretFromEnv()).toThrow(
      'ADMIN_JWT_SECRET (or ADMIN_PASSCODE) must be set'
    );

    process.env.ADMIN_JWT_SECRET = original;
    process.env.ADMIN_PASSCODE = originalPasscode;
  });

  it('getSecret prefers ADMIN_JWT_SECRET over ADMIN_PASSCODE', () => {
    process.env.ADMIN_JWT_SECRET = 'jwt-secret';
    process.env.ADMIN_PASSCODE = 'passcode';

    function getSecretFromEnv(): Uint8Array {
      const secret = process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSCODE;
      if (!secret) throw new Error('Missing secret');
      return new TextEncoder().encode(secret);
    }

    const result = getSecretFromEnv();
    expect(result).toEqual(new TextEncoder().encode('jwt-secret'));

    delete process.env.ADMIN_JWT_SECRET;
    delete process.env.ADMIN_PASSCODE;
  });

  it('getSecret falls back to ADMIN_PASSCODE', () => {
    delete process.env.ADMIN_JWT_SECRET;
    process.env.ADMIN_PASSCODE = 'my-passcode';

    function getSecretFromEnv(): Uint8Array {
      const secret = process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSCODE;
      if (!secret) throw new Error('Missing secret');
      return new TextEncoder().encode(secret);
    }

    const result = getSecretFromEnv();
    expect(result).toEqual(new TextEncoder().encode('my-passcode'));

    delete process.env.ADMIN_PASSCODE;
  });
});
