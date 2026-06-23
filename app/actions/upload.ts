'use server';

/**
 * Returns the static upload token to authenticated callers so it can be sent
 * back as the `X-Upload-Token` header on `/api/upload`. Keeping the token
 * server-side (rather than NEXT_PUBLIC_) means it is never embedded in the
 * client JS bundle — a client must request it via this action first.
 */
export async function getUploadTokenAction(): Promise<string | null> {
  return process.env.UPLOAD_TOKEN ?? null;
}
