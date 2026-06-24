import { escapeHtml } from '@/lib/html';

type EmailRow = {
  label: string;
  value: string | number | boolean | null | undefined;
  html?: boolean;
};

const cellStyle = 'padding:8px;border:1px solid #ddd';
const labelStyle = `${cellStyle};font-weight:bold`;

export function buildEmailTable(title: string, rows: EmailRow[]): string {
  const tableRows = rows
    .map((r) => {
      const display = r.html
        ? (r.value ?? '—')
        : (escapeHtml(r.value != null ? String(r.value) : null) || '—');
      return `<tr><td style="${labelStyle}">${escapeHtml(r.label)}</td><td style="${cellStyle}">${display}</td></tr>`;
    })
    .join('\n          ');

  return `
        <h2 style="font-family:sans-serif">${escapeHtml(title)}</h2>
        <table style="font-family:sans-serif;border-collapse:collapse;width:100%">
          ${tableRows}
        </table>
      `;
}
