import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { hasRequiredEnv } from '@/lib/env';
import { randomUUID } from 'crypto';
import { checkRateLimit } from '@/lib/ratelimit';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// 5 uploads per hour per IP
const UPLOAD_RATE_LIMIT = 5;
const UPLOAD_RATE_WINDOW_MS = 60 * 60 * 1000;

// Strict PDF signature: "%PDF-1." (7 bytes). We read the first 8 to be safe.
const PDF_SIGNATURE = Buffer.from('%PDF-1.', 'ascii');

function getClientIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: Request): Promise<NextResponse> {
  // --- Lightweight auth: require a static upload token ---
  const uploadToken = process.env.UPLOAD_TOKEN;
  if (!uploadToken) {
    return NextResponse.json(
      { error: 'Uploads are not configured. Set UPLOAD_TOKEN in the environment.' },
      { status: 500 }
    );
  }
  const providedToken = request.headers.get('x-upload-token');
  if (!providedToken || providedToken !== uploadToken) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  // --- IP rate limiting: 5 uploads / hour ---
  const ip = getClientIp(request);
  if (!checkRateLimit(`upload:${ip}`, UPLOAD_RATE_LIMIT, UPLOAD_RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: 'Too many uploads. Please wait and try again later.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const originalFilename = searchParams.get('filename');

  if (!originalFilename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  // Enforce PDF extension
  if (!originalFilename.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ error: 'Only PDF files are accepted.' }, { status: 400 });
  }

  if (!hasRequiredEnv('BLOB_READ_WRITE_TOKEN')) {
    return NextResponse.json(
      { error: 'Blob storage is not configured. Please add BLOB_READ_WRITE_TOKEN.' },
      { status: 500 }
    );
  }

  // --- Validate Content-Type is exactly application/pdf ---
  const contentType = request.headers.get('content-type');
  if (contentType !== 'application/pdf') {
    return NextResponse.json(
      { error: 'Content-Type must be application/pdf.' },
      { status: 400 }
    );
  }

  // Enforce 5 MB limit via Content-Length header (fast path)
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File must be under 5 MB.' }, { status: 413 });
  }

  // Buffer the body so we can (a) verify magic bytes and (b) enforce size while streaming
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    const reader = request.body!.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: 'File must be under 5 MB.' }, { status: 413 });
      }
      chunks.push(value);
    }
  } catch {
    return NextResponse.json({ error: 'Failed to read upload stream.' }, { status: 400 });
  }

  const fileBuffer = Buffer.concat(chunks);

  // --- Tightened magic byte check: must start with "%PDF-1." ---
  if (
    fileBuffer.length < PDF_SIGNATURE.length ||
    !fileBuffer.subarray(0, PDF_SIGNATURE.length).equals(PDF_SIGNATURE)
  ) {
    return NextResponse.json({ error: 'Invalid PDF' }, { status: 400 });
  }

  // Generate a unique storage filename to prevent path traversal / collisions.
  // The original filename is never used in the storage path.
  const safeFilename = `resumes/${randomUUID()}.pdf`;

  try {
    const blob = await put(safeFilename, fileBuffer, {
      access: 'public',
      contentType: 'application/pdf',
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
