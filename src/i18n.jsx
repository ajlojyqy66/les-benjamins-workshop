import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/*
 * Tüm site metinleri. Yeni bir metin eklerken iki dile de eklemeyi unutmayın.
 * Değeri fonksiyon olan anahtarlar parametre alır: t('key', arg)
 */
const STRINGS = {
  tr: {
    skip: 'Başvuru formuna geç',
    navApply: 'Başvur',
    langLabel: 'Dil',

    heroKicker: 'Workshop — 15.11.2026 — Nişantaşı',
    heroTitle: ['Balondan', 'çantaya.'],
    heroLede: 'Kapadokya’da uçurduğumuz balonların artan kumaşından kendi sling bag’ini tasarla ve dik.',
    heroCta: 'Yerini ayır',
    heroMeta: [
      ['Tarih', '15 Kasım, Pazar'],
      ['Oturumlar', '13.00 / 15.00'],
      ['Kontenjan', 'Oturum başına 10'],
    ],
    heroImgAlt: 'Aşağıdan bakış: Kapadokya gökyüzünde dikenli neon yeşil balon',

    introLabel: 'Workshop',
    intro:
      'Balonlar indi, kumaşları kaldı. 15 Kasım Pazar günü Nişantaşı mağazamızda bu kumaşları yeniden değerlendiriyor, kendi sling bag’ini tasarlayıp dikiyorsun. Üretim sürecinin içindesin.',

    storyLabel: 'Gökten atölyeye',
    steps: [
      { title: 'Gökyüzünde', text: '“From Earth to Sky” için tasarlanan balonlar Kapadokya vadilerinde havalandı.' },
      { title: 'Geriye kalan', text: 'Üretimden artan kumaşları atmadık; hepsini Nişantaşı’na taşıdık.' },
      { title: 'Senin çantan', text: 'O kumaşlardan kendi sling bag’ini tasarlıyor, ekibimizle birlikte dikiyorsun.' },
    ],
    stepAlts: [
      'Alacakaranlıkta peribacaları üzerinde süzülen dikenli yeşil balon',
      'Neon yeşil balon kumaşının yakın çekimi',
      'Pembe balonun önünde pembe kıyafetli model',
    ],

    stripCaption: 'From Earth to Sky — Kapadokya, 2026',

    detailsLabel: 'Detaylar',
    factDate: 'Tarih',
    factDateValue: '15 Kasım 2026, Pazar',
    factPlace: 'Yer',
    factSessions: 'Oturumlar',
    factCapacity: 'Kontenjan',
    factCapacityValue: (n) => `Her oturum en fazla ${n} kişi`,
    mapLink: 'Haritada aç',
    reqLabel: 'Ön koşul',
    reqTitle: 'Dikiş makinesi kullanmayı biliyor olman gerekiyor.',
    reqText:
      'Ekibimiz üretim boyunca yanında; makineyi ise sen kullanacaksın. Katılım kişiye özel: başvurunu yalnızca kendi adına, tek bir oturum seçerek yap.',

    formTitle: 'Başvuru',
    formIntro: 'Kontenjan sınırlı. Başvurunu yalnızca kendi adına, katılmak istediğin oturumu seçerek tamamla.',
    mock: 'Önizleme modu — form şu an hiçbir yere gönderilmiyor.',
    sessionLegend: 'Oturum seç',
    sessionLabel: (n) => `${n}. Oturum`,
    sessionFull: 'Doldu',
    sessionLeft: (left, total) => `${left} / ${total} yer`,
    sessionCap: (total) => `${total} kişilik`,
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta',
    emailHint: 'Onay ve hatırlatma e-postaları bu adrese gelecek.',
    phone: 'Telefon',
    instagram: 'Instagram',
    optional: 'opsiyonel',
    detailsGroup: 'Bilgilerin',
    consentGroup: 'Onaylar',
    sewGroup: 'Dikiş deneyimi',
    canSew: 'Dikiş makinesi kullanmayı biliyorum.',
    sewExp: 'Daha önce dikiş makinesiyle neler yaptın?',
    sewExpHint: 'Kısaca anlat: diktiğin parçalar, kullandığın makineler, ne kadar süredir diktiğin…',
    sewExpPlaceholder: 'Örn. İki yıldır kendi kıyafetlerimi dikiyorum; tote bag, etek ve fermuarlı kese yaptım.',
    sewBlocked: 'Bu workshop dikiş makinesi kullanabilenler için. Kutuyu işaretlemeden başvuru yapılamıyor.',
    selfOnly: 'Bu başvuruyu yalnızca kendi adıma yapıyorum.',
    kvkkLink: 'KVKK Aydınlatma Metni',
    kvkkRest: '’ni okudum; kişisel verilerimin başvurum kapsamında işlenmesini kabul ediyorum.',
    marketingLink: 'Ticari Elektronik İleti Aydınlatma Metni',
    marketingRest: '’ni okudum; Les Benjamins’ten kampanya, etkinlik ve duyurular hakkında arama, SMS ve e-posta yoluyla ticari elektronik ileti almayı kabul ediyorum.',
    submit: 'Başvuruyu gönder',
    submitting: 'Gönderiliyor',
    close: 'Kapat',
    kvkkTitle: 'KVKK Aydınlatma Metni',

    errors: {
      session: 'Katılmak istediğin oturumu seç.',
      firstName: 'Adını yaz.',
      lastName: 'Soyadını yaz.',
      email: 'Geçerli bir e-posta adresi yaz.',
      phone: 'Telefonunu 5XX XXX XX XX biçiminde yaz.',
      canSew: 'Workshop’a katılmak için dikiş makinesi kullanabiliyor olman gerekiyor.',
      sewingExperience: 'Dikiş deneyimini birkaç cümleyle anlat.',
      selfOnly: 'Başvurunun yalnızca kendi adına olduğunu onayla.',
      kvkk: 'Devam etmek için aydınlatma metnini onayla.',
    },
    server: {
      SESSION_FULL: 'Seçtiğin oturum az önce doldu. Diğer oturumu seçip tekrar dene.',
      DUPLICATE: 'Bu e-posta adresiyle zaten bir başvuru var.',
      CLOSED: 'Başvurular kapandı.',
      INVALID: 'Bazı bilgiler eksik ya da hatalı görünüyor. Kontrol edip tekrar dener misin?',
      NETWORK: 'Bağlantı kurulamadı. İnternet bağlantını kontrol edip tekrar dene.',
      SERVER: 'Bir şeyler ters gitti. Birazdan tekrar dener misin?',
    },

    successKicker: 'Başvuru alındı',
    successTitle: (name) => (name ? `Teşekkürler, ${name}.` : 'Teşekkürler.'),
    successText: (email) => `Başvurun ekibimize ulaştı. Katılımın kesinleştiğinde ${email} adresine bilgi göndereceğiz.`,
    successDate: 'Tarih',
    successSession: 'Oturum',
    successPlace: 'Yer',
    addCal: 'Takvime ekle',
    calDesc: 'Balon kumaşından sling bag workshop’u.',

    closedTitle: 'Başvurular kapandı.',
    fullTitle: 'Tüm oturumlar doldu.',
    closedText: 'Gösterdiğin ilgi için teşekkürler. Sonraki etkinlikler için bizi Instagram’dan takip et.',

    footerCity: 'İstanbul',
  },

  en: {
    skip: 'Skip to application form',
    navApply: 'Apply',
    langLabel: 'Language',

    heroKicker: 'Workshop — 15.11.2026 — Nişantaşı',
    heroTitle: ['From balloon', 'to bag.'],
    heroLede: 'Design and sew your own sling bag from the excess fabric of the balloons we flew over Cappadocia.',
    heroCta: 'Save your spot',
    heroMeta: [
      ['Date', 'Sunday, 15 November'],
      ['Sessions', '13:00 / 15:00'],
      ['Capacity', '10 per session'],
    ],
    heroImgAlt: 'Looking up at a spiky neon green hot-air balloon in the Cappadocia sky',

    introLabel: 'Workshop',
    intro:
      'The balloons have landed; their fabric remains. On Sunday 15 November, at our Nişantaşı store, you’ll give that fabric a second life, designing and sewing your own sling bag, right inside the production process.',

    storyLabel: 'From sky to studio',
    steps: [
      { title: 'In the sky', text: 'The balloons designed for “From Earth to Sky” took off over the valleys of Cappadocia.' },
      { title: 'What remained', text: 'We didn’t throw away the excess fabric. We brought all of it to Nişantaşı.' },
      { title: 'Your bag', text: 'You design your own sling bag from that fabric and sew it together with our team.' },
    ],
    stepAlts: [
      'A spiky green balloon drifting over fairy chimneys at dusk',
      'Close-up of neon green balloon fabric',
      'Model in pink in front of a pink balloon',
    ],

    stripCaption: 'From Earth to Sky — Cappadocia, 2026',

    detailsLabel: 'Details',
    factDate: 'Date',
    factDateValue: 'Sunday, 15 November 2026',
    factPlace: 'Venue',
    factSessions: 'Sessions',
    factCapacity: 'Capacity',
    factCapacityValue: (n) => `Up to ${n} people per session`,
    mapLink: 'Open in Maps',
    reqLabel: 'Requirement',
    reqTitle: 'You need to know how to use a sewing machine.',
    reqText:
      'Our team will support you throughout, but you’ll be operating the machine yourself. Places are personal: apply only for yourself, choosing a single session.',

    formTitle: 'Apply',
    formIntro: 'Places are limited. Apply only for yourself and choose the session you’d like to join.',
    mock: 'Preview mode — the form isn’t sending anywhere yet.',
    sessionLegend: 'Choose a session',
    sessionLabel: (n) => `Session ${n}`,
    sessionFull: 'Full',
    sessionLeft: (left, total) => `${left} / ${total} left`,
    sessionCap: (total) => `${total} places`,
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    emailHint: 'We’ll send confirmations and reminders here.',
    phone: 'Phone',
    instagram: 'Instagram',
    optional: 'optional',
    detailsGroup: 'Your details',
    consentGroup: 'Consents',
    sewGroup: 'Sewing experience',
    canSew: 'I know how to use a sewing machine.',
    sewExp: 'What have you made on a sewing machine before?',
    sewExpHint: 'A few lines is enough: pieces you’ve made, machines you’ve used, how long you’ve been sewing…',
    sewExpPlaceholder: 'e.g. I’ve been making my own clothes for two years — tote bags, a skirt, a zip pouch.',
    sewBlocked: 'This workshop is for people who can use a sewing machine. You can’t apply without ticking this box.',
    selfOnly: 'I’m applying for myself only.',
    kvkkLink: 'Privacy Notice (KVKK)',
    kvkkRest: ' — I’ve read it and consent to my personal data being processed for this application.',
    marketingLink: 'Commercial Electronic Message Notice',
    marketingRest: ' (in Turkish) — I’ve read it and agree to receive commercial electronic messages from Les Benjamins about campaigns, events and announcements by phone, SMS and email.',
    submit: 'Submit application',
    submitting: 'Sending',
    close: 'Close',
    kvkkTitle: 'Privacy Notice (KVKK)',

    errors: {
      session: 'Choose the session you’d like to join.',
      firstName: 'Enter your first name.',
      lastName: 'Enter your last name.',
      email: 'Enter a valid email address.',
      phone: 'Enter your phone as 5XX XXX XX XX.',
      canSew: 'You need to be able to use a sewing machine to join this workshop.',
      sewingExperience: 'Tell us about your sewing experience in a few sentences.',
      selfOnly: 'Confirm that you’re applying for yourself only.',
      kvkk: 'Please accept the privacy notice to continue.',
    },
    server: {
      SESSION_FULL: 'That session just filled up. Choose the other session and try again.',
      DUPLICATE: 'There’s already an application with this email address.',
      CLOSED: 'Applications are closed.',
      INVALID: 'Some details look missing or incorrect. Could you check and try again?',
      NETWORK: 'Couldn’t connect. Check your connection and try again.',
      SERVER: 'Something went wrong. Please try again in a moment.',
    },

    successKicker: 'Application received',
    successTitle: (name) => (name ? `Thank you, ${name}.` : 'Thank you.'),
    successText: (email) => `Your application has reached our team. We’ll email ${email} once your place is confirmed.`,
    successDate: 'Date',
    successSession: 'Session',
    successPlace: 'Venue',
    addCal: 'Add to calendar',
    calDesc: 'Sling bag workshop with balloon fabric.',

    closedTitle: 'Applications are closed.',
    fullTitle: 'All sessions are full.',
    closedText: 'Thank you for your interest. Follow us on Instagram for upcoming events.',

    footerCity: 'Istanbul',
  },
};

export const LANGS = ['tr', 'en'];

const I18nContext = createContext(null);

// Varsayılan her zaman Türkçe. İngilizce yalnızca TR/EN düğmesiyle ya da ?lang=en linkiyle açılır.
function initialLang() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
  } catch {
    /* yoksay */
  }
  return 'tr';
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'tr' ? 'Les Benjamins Workshop — Balondan Çantaya' : 'Les Benjamins Workshop — From Balloon to Bag';
  }, [lang]);

  const value = useMemo(() => {
    const dict = STRINGS[lang];
    const t = (key, ...args) => {
      const v = dict[key];
      return typeof v === 'function' ? v(...args) : v;
    };
    return { lang, setLang, t, dict };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
