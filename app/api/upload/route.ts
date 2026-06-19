import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  try {
    // Read the file body stream and upload directly to Vercel Blob
    const blob = await put(filename, request.body as any, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
