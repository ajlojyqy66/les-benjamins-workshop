import { LEGAL as L } from './config.js';

/*
 * KVKK Aydınlatma Metni (6698 sayılı Kanun md. 10 ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde
 * Uyulacak Usul ve Esaslar Hakkında Tebliğ kapsamında hazırlanmış taslak).
 *
 * Veri sorumlusu bilgileri ve başvuru kanalları, Les Benjamins'in yayındaki Ticari Elektronik İleti
 * Aydınlatma Metni ile aynıdır (config.js → LEGAL). Yayından önce hukuk ekibince kontrol edilmelidir.
 *
 * Yapı: [{ h: başlık, p?: paragraf, ul?: [madde, ...] }]
 */

export function kvkkSections(lang) {
  return lang === 'en' ? EN() : TR();
}

const TR = () => [
  {
    p: `${L.company} (“Şirket” veya “Les Benjamins”) olarak, işbu Aydınlatma Metni ile Les Benjamins Workshop başvuru formu aracılığıyla paylaştığın kişisel verilerin 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında nasıl işlendiği konusunda aydınlatma yükümlülüğümüzü yerine getirmeyi amaçlıyoruz.`,
  },
  {
    h: '1. Veri sorumlusu',
    p: `Veri sorumlusu; ${L.address} adresinde mukim, İstanbul Ticaret Sicili Müdürlüğü’ne ${L.registry} sicil numarası ile kayıtlı ${L.company}’dir.`,
  },
  {
    h: '2. İşlenen kişisel veriler',
    ul: [
      'Kimlik: ad, soyad',
      'İletişim: e-posta adresi, telefon numarası',
      'Sosyal medya: Instagram kullanıcı adı (opsiyonel)',
      'Başvuru bilgileri: seçilen oturum, dikiş makinesi kullanımına ve dikiş deneyimine ilişkin beyanın',
      'Onay ve işlem kayıtları: verdiğin onaylar, başvuru tarihi ve saati, başvuru dili',
    ],
  },
  {
    h: '3. İşleme amaçları',
    ul: [
      'Workshop başvurunun alınması, değerlendirilmesi ve katılımcıların belirlenmesi',
      'Oturum kontenjanlarının yönetilmesi ve kişiye özel katılımın kontrolü',
      'Katılım onayı, hatırlatma ve etkinlikteki değişikliklerle ilgili seninle iletişime geçilmesi',
      'Etkinliğin planlanması, yürütülmesi ve güvenliğinin sağlanması',
      'Ayrıca onay vermen hâlinde: kampanya, etkinlik ve duyurular hakkında ticari elektronik ileti gönderilmesi',
    ],
  },
  {
    h: '4. Hukuki sebepler ve toplama yöntemi',
    p: `Kişisel verilerin, bu internet sitesindeki başvuru formu aracılığıyla elektronik ortamda toplanır. Başvuru ve katılım süreci için veriler KVKK md. 5/2(c) “bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması” ve md. 5/2(f) “veri sorumlusunun meşru menfaati” hukuki sebeplerine dayanılarak işlenir. Ticari elektronik ileti gönderimi ise yalnızca açık rızana ve 6563 sayılı Kanun kapsamında vereceğin onaya dayanır; bu onay isteğe bağlıdır ve başvurunu etkilemez. Ticari elektronik iletilere ilişkin ayrıntılar Les Benjamins Ticari Elektronik İleti Aydınlatma Metni’nde yer alır.`,
  },
  {
    h: '5. Aktarım',
    p: `Kişisel verilerin, yukarıdaki amaçlarla sınırlı olarak; internet sitesinin barındırılması ve form kayıtlarının saklanması için hizmet aldığımız bilişim ve bulut hizmeti sağlayıcılarına (Google LLC dâhil) ve talep hâlinde yetkili kamu kurum ve kuruluşlarına aktarılabilir. Bu hizmet sağlayıcıların sunucularının yurt dışında bulunması nedeniyle yapılan aktarımlar, KVKK md. 9 ve Kişisel Verilerin Yurt Dışına Aktarılmasına İlişkin Usul ve Esaslar Hakkında Yönetmelik’e uygun şekilde gerçekleştirilir. Verilerin üçüncü kişilere satılmaz veya pazarlama amacıyla paylaşılmaz.`,
  },
  {
    h: '6. Saklama süresi',
    p: `Başvuru verilerin ${L.retentionTr} süreyle saklanır ve sürenin sonunda silinir, yok edilir veya anonim hâle getirilir. Ticari elektronik ileti onayına ilişkin veriler, onayını geri alana kadar ve ilgili mevzuatta öngörülen süre boyunca saklanır.`,
  },
  {
    h: '7. Hakların (KVKK md. 11)',
    ul: [
      'Kişisel verilerinin işlenip işlenmediğini öğrenme ve işlenmişse bilgi talep etme',
      'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
      'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme',
      'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
      'KVKK md. 7’deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme',
      'Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme',
      'Münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhine bir sonuç ortaya çıkmasına itiraz etme',
      'Kanuna aykırı işlenmesi sebebiyle zarara uğraman hâlinde zararın giderilmesini talep etme',
    ],
  },
  {
    h: '8. Başvuru',
    p: `Bu haklarını yazılı olarak (${L.address}) veya kayıtlı elektronik posta (KEP: ${L.kep}), güvenli elektronik imza, mobil imza ya da Şirket’e daha önce bildirilen ve sistemimizde kayıtlı e-posta adresini kullanarak ${L.email} adresi üzerinden Şirket’e iletebilirsin. Talebin, Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ uyarınca en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
  },
  { p: `Son güncelleme: ${L.updated}`, small: true },
];

const EN = () => [
  {
    p: `This notice explains how the personal data you share through the Les Benjamins Workshop application form is processed under the Turkish Personal Data Protection Law No. 6698 (“KVKK”). In case of any discrepancy, the Turkish version prevails.`,
  },
  {
    h: '1. Data controller',
    p: `The data controller is ${L.company} (“Les Benjamins”), located at ${L.addressEn} and registered with the Istanbul Trade Registry under number ${L.registry}.`,
  },
  {
    h: '2. Personal data processed',
    ul: [
      'Identity: first name, last name',
      'Contact: email address, phone number',
      'Social media: Instagram handle (optional)',
      'Application details: chosen session, your statement on sewing machine use and sewing experience',
      'Consent and transaction records: consents given, date and time of application, application language',
    ],
  },
  {
    h: '3. Purposes',
    ul: [
      'Receiving and assessing your workshop application and selecting participants',
      'Managing session capacity and ensuring places are personal',
      'Contacting you about confirmation, reminders and any changes to the event',
      'Planning, running and securing the event',
      'Only if you opt in: sending commercial electronic messages about campaigns, events and announcements',
    ],
  },
  {
    h: '4. Legal grounds and collection method',
    p: `Your data is collected electronically through the application form on this website. For the application and participation process it is processed on the grounds of KVKK Art. 5/2(c) (necessary for establishing or performing a contract) and Art. 5/2(f) (legitimate interest of the data controller). Commercial electronic messages are sent only on the basis of your explicit consent and your approval under Law No. 6563; this consent is optional and does not affect your application. Details are set out in the Les Benjamins Commercial Electronic Message Notice.`,
  },
  {
    h: '5. Transfers',
    p: `Limited to the purposes above, your data may be transferred to the IT and cloud service providers we use to host this website and store form submissions (including Google LLC), and to authorised public authorities upon request. Because these providers’ servers may be located abroad, such transfers are carried out in line with KVKK Art. 9 and the Regulation on the Procedures and Principles for the Transfer of Personal Data Abroad. Your data is never sold or shared with third parties for their marketing.`,
  },
  {
    h: '6. Retention',
    p: `Application data is kept for ${L.retentionEn}, after which it is deleted, destroyed or anonymised. Data relating to marketing consent is kept until you withdraw it and for the period required by law.`,
  },
  {
    h: '7. Your rights (KVKK Art. 11)',
    ul: [
      'Learn whether your personal data is processed and request information about it',
      'Learn the purpose of processing and whether it is used accordingly',
      'Know the third parties in Türkiye or abroad to whom it is transferred',
      'Request correction if it is incomplete or inaccurate',
      'Request deletion or destruction under the conditions of KVKK Art. 7',
      'Request that corrections, deletions or destructions be notified to third parties it was transferred to',
      'Object to a result against you arising solely from automated analysis',
      'Claim compensation for damage caused by unlawful processing',
    ],
  },
  {
    h: '8. Contact',
    p: `You can submit requests regarding your rights in writing (${L.addressEn}), via registered electronic mail (KEP: ${L.kep}), secure electronic signature or mobile signature, or by email to ${L.email} from the email address previously registered with us. Requests are resolved free of charge within 30 days at the latest, in accordance with the Communiqué on the Procedures and Principles of Application to the Data Controller.`,
  },
  { p: `Last updated: ${L.updated}`, small: true },
];
