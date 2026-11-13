// Etkinlik sabitleri. Arayüz metinleri src/i18n.jsx içinde.

export const EVENT = {
  location: 'Les Benjamins Nişantaşı',
  // Mağazanın açık adresi eklendiğinde "Detaylar" bölümünde gösterilir (boşsa gizlenir).
  address: '',
  mapsUrl: '',
  capacityPerSession: 10,
  instagramUrl: 'https://www.instagram.com/lesbenjamins/',
};

// KVKK aydınlatma metnindeki veri sorumlusu bilgileri.
// Kaynak: lesbenjamins.com/pages/ticari-elektronik-ileti-aydinlatma-metni
export const LEGAL = {
  company: 'LB GLOBAL TEKSTİL TİC. A.Ş.',
  address: 'Etiler Mahallesi Dilhayat Sokak No:24 Beşiktaş/İstanbul',
  addressEn: 'Etiler Mahallesi Dilhayat Sokak No:24, Beşiktaş, Istanbul, Türkiye',
  registry: '220846-5',
  kep: 'lbglobal@hs03.kep.tr',
  email: 'destek@lesbenjamins.com',
  marketingNoticeUrl: 'https://lesbenjamins.com/pages/ticari-elektronik-ileti-aydinlatma-metni',
  retentionTr: 'etkinlik tarihinden itibaren 6 ay',
  retentionEn: '6 months after the event date',
  updated: '13.11.2026',
};

// start/end: İstanbul saati (UTC+3). Takvim dosyası bu değerlerden üretilir.
export const SESSIONS = [
  { id: '1', time: { tr: '13.00 – 15.00', en: '13:00 – 15:00' }, start: '2026-11-15T13:00:00+03:00', end: '2026-11-15T15:00:00+03:00' },
  { id: '2', time: { tr: '15.00 – 17.00', en: '15:00 – 17:00' }, start: '2026-11-15T15:00:00+03:00', end: '2026-11-15T17:00:00+03:00' },
];

export const API = {
  submitUrl: import.meta.env.VITE_SUBMIT_URL || '',
  availabilityUrl: import.meta.env.VITE_AVAILABILITY_URL || '',
};
