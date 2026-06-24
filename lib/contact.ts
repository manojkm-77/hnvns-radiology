/**
 * Central contact configuration — the single source of truth for all
 * contact channels across the site (footer, contact page, chatbot, WhatsApp FAB).
 *
 * 👉 Replace the placeholder values below with your real details.
 */

export const contact = {
  // WhatsApp — digits only, including country code, no '+', spaces, or dashes.
  // Used to build the wa.me deep link.
  whatsappNumber: '916363785364',

  // Human-readable WhatsApp number shown to visitors.
  whatsappDisplay: '+91 63637 85364',

  // Phone number for tel: links (digits with optional '+' prefix).
  phone: '+919740222899',

  // Primary inbox (also used for mailto: links).
  email: 'hello@hnvns.example',

  // Office / mailing address.
  address: 'Bengaluru, Karnataka, India',

  // Support / working hours.
  hours: 'Mon–Sat, 9:00 AM – 7:00 PM IST'
} as const;

/** wa.me deep link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${contact.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** tel: link for the phone number. */
export function phoneLink(): string {
  return `tel:${contact.phone.replace(/[^\d+]/g, '')}`;
}
