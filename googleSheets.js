const { google } = require('googleapis');
const sheets = google.sheets('v4');
let key;
if (process.env.GOOGLE_SERVICE_ACCOUNT) {
  key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
} else {
  key = require('./service-account.json');
}

const auth = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const SHEET_ID = process.env.SHEET_ID;
const RANGE = 'Inventory!A2:C'; // Kopfzeile in Zeile 1

async function addToSheet(sheet_id, part_name, quantity, image_url = '') {
  await auth.authorize();
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheet_id,
    range: 'Inventory!A2:C',
    valueInputOption: 'RAW',
    resource: { values: [[part_name, quantity, image_url]] },
    auth
  });
}

module.exports = { addToSheet };
