import sanitizeHtml from 'sanitize-html';

/**
 * Escapes a string for safe insertion into HTML content.
 * Prevents XSS when user-supplied values are embedded in email HTML bodies.
 */
export function escapeHtml(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitizes an HTML string for safe rendering, stripping dangerous markup
 * (scripts, event handlers, javascript: URLs) while preserving a safe subset
 * of tags and attributes. Use this instead of `escapeHtml` when you need to
 * keep basic formatting (bold, links, lists) from user-supplied HTML.
 */
export const sanitize = (input: string): string =>
  sanitizeHtml(input, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height'],
      a: ['href', 'name', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      // Force safe outbound links
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    },
  });

