import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { hasRequiredEnv } from '@/lib/env';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  // Enforce PDF only
  if (!filename.toLowerCase().endsWith('.pdf')) {
    return NextResponse.json({ error: 'Only PDF files are accepted.' }, { status: 400 });
  }

  if (!hasRequiredEnv('BLOB_READ_WRITE_TOKEN')) {
    return NextResponse.json(
      { error: 'Blob storage is not configured. Please add BLOB_READ_WRITE_TOKEN.' },
      { status: 500 }
    );
  }

  // Enforce 5 MB size limit
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File must be under 5 MB.' }, { status: 413 });
  }

  try {
    const blob = await put(filename, request.body as ReadableStream, {
      access: 'public',
      contentType: 'application/pdf',
    });
    return NextResponse.json(blob);
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
