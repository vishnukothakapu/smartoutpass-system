const { OAuth2Client } = require('google-auth-library');

const ALLOWED_DOMAIN = 'iiitm.ac.in';
const CURRENT_YEAR = new Date().getFullYear(); // e.g. 2026

/**
 * Parse student info from IIITM email prefix.
 * e.g. img_2023028@iiitm.ac.in → { program: 'IMG', batch: '2023', year: '3rd Year' }
 */
function parseStudentEmail(email) {
  const prefix = email.split('@')[0]; // 'img_2023028'
  const parts = prefix.split('_');   // ['img', '2023028']

  const program = parts[0]?.toUpperCase() || 'Unknown';
  const rawBatch = parts[1] || '';
  const batch = rawBatch.substring(0, 4); // '2023'

  const batchYear = parseInt(batch, 10);
  const yearsElapsed = CURRENT_YEAR - batchYear; // 2026 - 2023 = 3

  const ordinal = (n) => {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `${n}th`;
  };

  const year = yearsElapsed >= 1 && yearsElapsed <= 6
    ? `${ordinal(yearsElapsed)} Year`
    : 'Unknown Year';

  const rollSequence = rawBatch.substring(4) || '000';
  const rollNo = `${batch}${program}-${rollSequence}`;

  return { program, batch, year, rollNo };
}

/**
 * Verify Google ID token and return the payload.
 * Returns null on failure.
 */
async function verifyGoogleToken(credential, clientId) {
  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });
  return ticket.getPayload();
}

module.exports = { parseStudentEmail, verifyGoogleToken, ALLOWED_DOMAIN };
