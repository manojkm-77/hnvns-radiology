import { escapeHtml, sanitize } from '@/lib/html';

describe('escapeHtml', () => {
  it('returns empty string for null', () => {
    expect(escapeHtml(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(escapeHtml(undefined)).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('passes through safe strings unchanged', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('A & B')).toBe('A &amp; B');
  });

  it('escapes less-than signs', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater-than signs', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#x27;s');
  });

  it('escapes a mixed XSS payload', () => {
    const input = '<img onerror="alert(\'xss\')" src=x>';
    const expected =
      '&lt;img onerror=&quot;alert(&#x27;xss&#x27;)&quot; src=x&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it('escapes multiple ampersands in a row', () => {
    expect(escapeHtml('&&')).toBe('&amp;&amp;');
  });
});

describe('sanitize', () => {
  it('strips script tags', () => {
    const result = sanitize('<script>alert("xss")</script>');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('alert');
  });

  it('preserves safe tags like <b> and <p>', () => {
    const input = '<p>Hello <b>world</b></p>';
    expect(sanitize(input)).toBe(input);
  });

  it('allows img tags with safe attributes', () => {
    const input = '<img src="https://example.com/img.png" alt="photo">';
    const result = sanitize(input);
    expect(result).toContain('<img');
    expect(result).toContain('src="https://example.com/img.png"');
    expect(result).toContain('alt="photo"');
  });

  it('strips event handler attributes', () => {
    const input = '<img src="x" onerror="alert(1)">';
    const result = sanitize(input);
    expect(result).not.toContain('onerror');
  });

  it('strips javascript: URLs from anchors', () => {
    const input = '<a href="javascript:alert(1)">click</a>';
    const result = sanitize(input);
    expect(result).not.toContain('javascript:');
  });

  it('forces safe link attributes on anchors', () => {
    const input = '<a href="https://example.com">link</a>';
    const result = sanitize(input);
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it('allows mailto: scheme in href', () => {
    const input = '<a href="mailto:test@example.com">email</a>';
    const result = sanitize(input);
    expect(result).toContain('mailto:test@example.com');
  });

  it('strips style tags', () => {
    const result = sanitize('<style>body{display:none}</style><p>Hi</p>');
    expect(result).not.toContain('<style');
    expect(result).toContain('<p>Hi</p>');
  });

  it('returns empty string for empty input', () => {
    expect(sanitize('')).toBe('');
  });
});
