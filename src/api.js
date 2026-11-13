import { API } from './config.js';

/*
 * Backend sözleşmesi (Google Sheets / Apps Script tarafı backend ekibinde)
 *
 * POST VITE_SUBMIT_URL
 *   Content-Type: text/plain;charset=utf-8   (Apps Script'te CORS preflight'ı önlemek için)
 *   Body: JSON — buildPayload() çıktısı
 *   Beklenen yanıt (JSON):
 *     { "ok": true }
 *     { "ok": false, "error": "SESSION_FULL" | "DUPLICATE" | "CLOSED" | "INVALID" }
 *
 * GET VITE_AVAILABILITY_URL (opsiyonel)
 *   Beklenen yanıt: { "1": <kalan yer>, "2": <kalan yer>, "closed": false }
 *
 * URL'ler boşsa site mock modunda çalışır: gönderimler hiçbir yere gitmez.
 */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export const isMock = !API.submitUrl;

export async function getAvailability() {
  if (!API.availabilityUrl) {
    if (isMock) {
      await wait(300);
      return { 1: 6, 2: 2, closed: false };
    }
    return null; // sayaç gösterilmez
  }
  try {
    const res = await fetch(API.availabilityUrl, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function submitRegistration(payload) {
  if (isMock) {
    await wait(900);
    // eslint-disable-next-line no-console
    console.info('[mock] Gönderilecek kayıt:', payload);
    return { ok: true };
  }

  let res;
  try {
    res = await fetch(API.submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: 'NETWORK' };
  }

  try {
    const data = await res.json();
    if (typeof data?.ok === 'boolean') return data;
  } catch {
    /* JSON dönmeyen endpoint */
  }
  return res.ok ? { ok: true } : { ok: false, error: 'SERVER' };
}

export function buildPayload(values, session, lang) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim().toLowerCase(),
    phone: normalizePhone(values.phone),
    instagram: values.instagram.trim().replace(/^@/, ''),
    sessionId: session.id,
    session: `${session.id}. Oturum (${session.time.tr})`,
    canSew: values.canSew,
    sewingExperience: values.sewingExperience.trim(),
    lang,
    selfOnly: values.selfOnly,
    kvkkConsent: values.kvkk,
    marketingConsent: values.marketing,
    submittedAt: new Date().toISOString(),
  };
}

// "0532 123 45 67", "+90 532..." → "+905321234567"
export function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');
  return digits ? `+90${digits}` : '';
}
