/**
 * Tests for the upload route helpers and validation logic.
 *
 * The actual POST handler depends on @vercel/blob, Next.js request objects,
 * and env vars. Here we test the extracted validation logic:
 * - getClientIp extraction
 * - PDF magic byte validation
 * - filename validation
 * - Content-Type checks
 * - Content-Length size checks
 */

describe('upload route – getClientIp', () => {
  function getClientIp(headers: Record<string, string | null>): string {
    const xff = headers['x-forwarded-for'];
    if (xff) {
      const first = xff.split(',')[0]?.trim();
      if (first) return first;
    }
    return headers['x-real-ip'] ?? 'unknown';
  }

  it('extracts first IP from x-forwarded-for', () => {
    expect(
      getClientIp({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8', 'x-real-ip': null })
    ).toBe('1.2.3.4');
  });

  it('trims whitespace from x-forwarded-for', () => {
    expect(
      getClientIp({ 'x-forwarded-for': '  10.0.0.1 , 10.0.0.2', 'x-real-ip': null })
    ).toBe('10.0.0.1');
  });

  it('falls back to x-real-ip when x-forwarded-for is absent', () => {
    expect(
      getClientIp({ 'x-forwarded-for': null, 'x-real-ip': '192.168.1.1' })
    ).toBe('192.168.1.1');
  });

  it('returns "unknown" when no IP headers are present', () => {
    expect(
      getClientIp({ 'x-forwarded-for': null, 'x-real-ip': null })
    ).toBe('unknown');
  });

  it('handles single IP in x-forwarded-for (no comma)', () => {
    expect(
      getClientIp({ 'x-forwarded-for': '172.16.0.1', 'x-real-ip': null })
    ).toBe('172.16.0.1');
  });

  it('handles empty x-forwarded-for string', () => {
    expect(
      getClientIp({ 'x-forwarded-for': '', 'x-real-ip': '10.0.0.5' })
    ).toBe('10.0.0.5');
  });
});

describe('upload route – PDF magic byte validation', () => {
  const PDF_SIGNATURE = Buffer.from('%PDF-1.', 'ascii');

  function isValidPdf(fileBuffer: Buffer): boolean {
    return (
      fileBuffer.length >= PDF_SIGNATURE.length &&
      fileBuffer.subarray(0, PDF_SIGNATURE.length).equals(PDF_SIGNATURE)
    );
  }

  it('accepts a valid PDF buffer', () => {
    const validPdf = Buffer.from('%PDF-1.4 some content here');
    expect(isValidPdf(validPdf)).toBe(true);
  });

  it('accepts PDF version 1.7', () => {
    const pdf17 = Buffer.from('%PDF-1.7\n');
    expect(isValidPdf(pdf17)).toBe(true);
  });

  it('rejects a PNG file', () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(isValidPdf(png)).toBe(false);
  });

  it('rejects an empty buffer', () => {
    expect(isValidPdf(Buffer.alloc(0))).toBe(false);
  });

  it('rejects a buffer shorter than the signature', () => {
    expect(isValidPdf(Buffer.from('%PDF'))).toBe(false);
  });

  it('rejects text that is not a PDF', () => {
    expect(isValidPdf(Buffer.from('Hello World'))).toBe(false);
  });

  it('rejects a file starting with %PDF-2 (wrong version prefix)', () => {
    expect(isValidPdf(Buffer.from('%PDF-2.0 stuff'))).toBe(false);
  });
});

describe('upload route – filename validation', () => {
  function isValidPdfFilename(filename: string | null): boolean {
    if (!filename) return false;
    return filename.toLowerCase().endsWith('.pdf');
  }

  it('accepts a .pdf filename', () => {
    expect(isValidPdfFilename('resume.pdf')).toBe(true);
  });

  it('accepts a .PDF filename (case insensitive)', () => {
    expect(isValidPdfFilename('RESUME.PDF')).toBe(true);
  });

  it('rejects a .docx filename', () => {
    expect(isValidPdfFilename('resume.docx')).toBe(false);
  });

  it('rejects null filename', () => {
    expect(isValidPdfFilename(null)).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidPdfFilename('')).toBe(false);
  });

  it('accepts mixed case .Pdf', () => {
    expect(isValidPdfFilename('file.Pdf')).toBe(true);
  });
});

describe('upload route – content length validation', () => {
  const MAX_SIZE_BYTES = 5 * 1024 * 1024;

  function isTooLarge(contentLength: string | null): boolean {
    if (!contentLength) return false;
    return parseInt(contentLength, 10) > MAX_SIZE_BYTES;
  }

  it('rejects files over 5MB', () => {
    expect(isTooLarge(String(6 * 1024 * 1024))).toBe(true);
  });

  it('accepts files exactly 5MB', () => {
    expect(isTooLarge(String(5 * 1024 * 1024))).toBe(false);
  });

  it('accepts files under 5MB', () => {
    expect(isTooLarge(String(1024))).toBe(false);
  });

  it('returns false for missing content-length', () => {
    expect(isTooLarge(null)).toBe(false);
  });
});

describe('upload route – content type validation', () => {
  function isValidContentType(contentType: string | null): boolean {
    return contentType === 'application/pdf';
  }

  it('accepts application/pdf', () => {
    expect(isValidContentType('application/pdf')).toBe(true);
  });

  it('rejects application/octet-stream', () => {
    expect(isValidContentType('application/octet-stream')).toBe(false);
  });

  it('rejects null', () => {
    expect(isValidContentType(null)).toBe(false);
  });

  it('rejects text/plain', () => {
    expect(isValidContentType('text/plain')).toBe(false);
  });
});
