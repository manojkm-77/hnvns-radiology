import { google } from 'googleapis';

/**
 * Returns an authenticated Google Sheets client using a Service Account.
 * Returns null if GOOGLE_SERVICE_ACCOUNT_JSON is not set.
 */
function getSheetsClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;

  try {
    const credentials = JSON.parse(raw);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return google.sheets({ version: 'v4', auth });
  } catch (err) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', err);
    return null;
  }
}

/**
 * Appends a row of values to a Google Sheet.
 * Silently no-ops if Sheets is not configured — never throws.
 */
export async function appendRow(sheetId: string, values: (string | number | boolean | null)[]): Promise<void> {
  const sheets = getSheetsClient();
  if (!sheets) {
    console.warn('Google Sheets not configured — skipping append. Add GOOGLE_SERVICE_ACCOUNT_JSON.');
    return;
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [values],
      },
    });
  } catch (err) {
    // Non-fatal — log and continue.
    console.error('Google Sheets append failed:', err);
  }
}
