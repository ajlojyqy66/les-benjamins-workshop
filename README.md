# Les Benjamins Workshop — Kayıt Sitesi (Frontend)

15 Kasım Pazar, Nişantaşı mağazasındaki balon kumaşından sling bag workshop'u için tek sayfalık kayıt sitesi.
React 18 + Vite 5. Ek bağımlılık yok.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # statik çıktı: dist/
```

**Önizleme linki:** https://ajlojyqy66.github.io/les-benjamins-workshop/ (GitHub Pages, `gh-pages` dalı). Değişikliklerden sonra `npm run deploy` siteyi derleyip yeniden yayınlar. Önizleme sürümünde arama motorları için `noindex` etiketi var; canlıya alırken `index.html` içinden kaldırın.

`dist/` herhangi bir statik hosting'e (Netlify, Vercel, S3, Firebase Hosting, kendi sunucunuz) olduğu gibi yüklenebilir. `base: './'` olduğu için alt klasörde de çalışır.

## Backend bağlantısı (Google Sheets)

`.env.example` dosyasını `.env` olarak kopyalayıp URL'leri doldurun:

```
VITE_SUBMIT_URL=https://script.google.com/macros/s/XXXX/exec
VITE_AVAILABILITY_URL=https://script.google.com/macros/s/XXXX/exec?availability=1   # opsiyonel
```

URL boşsa site **önizleme (mock) modunda** çalışır: formun üstünde bir uyarı görünür, kayıtlar hiçbir yere gitmez.
Tüm entegrasyon tek dosyada: `src/api.js`.

### POST — başvuru gönderimi

- `Content-Type: text/plain;charset=utf-8` (Apps Script'te CORS preflight olmaması için bilerek böyle)
- Body (JSON):

| Alan | Tip | Örnek |
|---|---|---|
| `firstName` | string | `Deniz` |
| `lastName` | string | `Yılmaz` |
| `email` | string (küçük harf) | `deniz@ornek.com` |
| `phone` | string (E.164) | `+905321234567` |
| `instagram` | string, opsiyonel (`@` olmadan) | `denizyilmaz` |
| `sessionId` | `"1"` \| `"2"` | `"1"` |
| `session` | string | `1. Oturum (13.00 – 15.00)` |
| `canSew` | boolean (her zaman `true`; işaretlenmeden form gönderilemez) | `true` |
| `sewingExperience` | string (en az 10, en fazla 600 karakter) | `İki yıldır tote bag ve etek dikiyorum.` |
| `lang` | `"tr"` \| `"en"` (başvurunun yapıldığı dil) | `"tr"` |
| `selfOnly` | boolean (her zaman `true`) | `true` |
| `kvkkConsent` | boolean (her zaman `true`) | `true` |
| `marketingConsent` | boolean (Ticari Elektronik İleti onayı, opsiyonel) | `false` |
| `submittedAt` | ISO tarih | `2026-11-13T10:12:00.000Z` |

- Beklenen yanıt (JSON):
  - `{ "ok": true }`
  - `{ "ok": false, "error": "SESSION_FULL" }` — oturum dolu (kart "Doldu" olur, kullanıcıdan diğer oturumu seçmesi istenir)
  - `{ "ok": false, "error": "DUPLICATE" }` — aynı e-posta ile önceki başvuru
  - `{ "ok": false, "error": "CLOSED" }` — başvurular kapalı
  - `{ "ok": false, "error": "INVALID" }` — doğrulama hatası

  JSON dönmezse HTTP 2xx başarılı sayılır.

### GET — kalan kontenjan (opsiyonel)

```json
{ "1": 6, "2": 0, "closed": false }
```

- Sayılar kalan yer sayısıdır. `0` olan oturum "Doldu" olarak kilitlenir.
- İki oturum da `0` ise ya da `closed: true` ise form yerine "Başvurular kapandı / doldu" ekranı gösterilir.
- Endpoint verilmezse sayaçlar gösterilmez ve iki oturum da seçilebilir.

> Kontenjanın asıl kontrolü sunucuda yapılmalı (aynı anda gelen iki başvuru için). Frontend'deki sayaç yalnızca bilgi amaçlı.

## İçerik / düzenleme

- Tarih, oturumlar, adres, Instagram linki: `src/config.js`. `address` ve `mapsUrl` doldurulursa "Detaylar" bölümünde görünür.
- **Tüm metinler (TR + EN):** `src/i18n.jsx`. Site her açılışta Türkçe gelir; sağ üstteki TR / EN düğmesiyle İngilizceye geçilir. `?lang=en` ile doğrudan İngilizce link verilebilir.
- **KVKK aydınlatma metni (TR + EN):** `src/legal.js`. Veri sorumlusu bilgileri (LB Global Tekstil Tic. A.Ş., adres, sicil no, KEP, destek e-postası, saklama süresi) `src/config.js` → `LEGAL` içinde; Les Benjamins'in yayındaki Ticari Elektronik İleti Aydınlatma Metni ile aynı. Pazarlama izni kutusu doğrudan o sayfaya link veriyor. Yayından önce hukuk ekibince kontrol edilmeli.
- Logolar: `src/assets/logo/` (`lb-logo.png`, `scorpio-emblem.png`, siyah, şeffaf arka plan). Koyu zeminde CSS ile beyaza çevrilir. Aynı adlarla `.svg` konursa onlar kullanılır.
- Görseller: `src/assets/img/`. Hepsi "From Earth to Sky" Drive arşivinden alındı ve web için küçültüldü.

## Font

Font ailesi **Avenir Next**. macOS/iOS'ta sistemde yüklü olduğu için doğrudan görünür.
Windows/Android'de yüklü değildir; bu cihazlarda Nunito Sans / Segoe UI / sistem fontuna düşer.
Her cihazda Avenir Next görünmesi isteniyorsa lisanslı web font dosyaları (`.woff2`) eklenip `src/styles.css` içine `@font-face` tanımı yazılmalı.
