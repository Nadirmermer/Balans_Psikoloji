# Balans Psikoloji - Web Uygulaması

## Proje Hakkında
Balans Psikoloji, modern ve güvenli bir psikoloji kliniği yönetim sistemidir. Online ve yüz yüze randevu, uzman ve blog yönetimi, iletişim ve kapsamlı bir yönetim paneli sunar. Sistem, veri güvenliği ve kullanıcı gizliliği ön planda tutularak geliştirilmiştir.

---

## 🚀 Temel Özellikler
- **Randevu Sistemi:** Online ve yüz yüze randevu alma, uygunluk kontrolü
- **Uzman Yönetimi:** Uzman profilleri, çalışma saatleri, SEO ve sosyal medya entegrasyonu
- **Blog Sistemi:** SEO uyumlu blog yazıları, zengin içerik editörü
- **İletişim:** Güvenli iletişim formu ve mesaj yönetimi
- **Yönetim Paneli:** Kolay kullanım, rol tabanlı erişim, raporlar ve istatistikler
- **Güvenlik:** Bcrypt ile şifreleme, XSS ve SQL injection koruması, Row Level Security (RLS)
- **Performans:** Hızlı yükleme, responsive tasarım, mobil uyumluluk

---

## 🛠️ Kurulum ve Çalıştırma
1. **Projeyi İndirin:**
   ```bash
   git clone https://github.com/yourusername/balans-psikoloji.git
   cd balans-psikoloji
   ```
2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```
3. **Ortam Değişkenlerini Ayarlayın:**
   `.env` dosyası oluşturun ve aşağıdaki gibi doldurun:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Veritabanı Kurulumu:**
   - Supabase Dashboard'da `supabase/migrations/20250716172949_complete_system.sql` dosyasını çalıştırın.
   - Bu işlem tüm tabloları, güvenlik politikalarını ve admin hesabını oluşturur.
5. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
6. **Production Build (Canlıya Alma):**
   ```bash
   npm run build
   npm run preview
   ```

---

## 👩‍💻 Yönetim Paneli Kullanımı
- **Giriş:**
  - Admin hesabı ile giriş yapın (ilk kurulumda: `admin@balanspsikoloji.com` / `admin123`)
- **Uzman/BLOG Ekleme:**
  - Yönetim panelinde ilgili sekmeden yeni uzman veya blog ekleyebilirsiniz.
  - Formlar, zorunlu alanlar ve validasyon ile güvenli veri girişi sağlar.
- **Randevu Yönetimi:**
  - Gelen randevu taleplerini onaylayabilir, iptal edebilir veya detaylarını görüntüleyebilirsiniz.
- **İletişim Mesajları:**
  - Kullanıcı mesajlarını okuyabilir, yanıtlayabilir ve durumunu değiştirebilirsiniz.
- **Ayarlar:**
  - Site ayarlarını, SEO başlıklarını ve diğer temel bilgileri güncelleyebilirsiniz.

---

## 🔒 Güvenlik ve Performans
- **Şifreleme:** Tüm kullanıcı şifreleri bcrypt ile güvenli şekilde saklanır.
- **XSS ve SQL Injection Koruması:** DOMPurify ile HTML içeriklerinde XSS engellenir, inputlar sanitize edilir.
- **Row Level Security (RLS):** Supabase veritabanında hassas veriler için satır bazlı erişim kontrolü uygulanır.
- **Rate Limiting & CSRF:** Saldırılara karşı ek koruma katmanları mevcuttur.
- **Performans:** Kod bölme (code splitting), lazy loading ve veritabanı indeksleri ile hızlı yanıt süreleri.

---

## 🧑‍🔧 Bakım ve Geliştirme Notları
- **Kod Kalitesi:**
  - TypeScript strict mode ve ESLint kuralları aktif.
  - Kodda magic string kullanılmaz, tüm sabitler `src/lib/constants.ts` dosyasında tutulur.
  - Büyük bileşenler küçük parçalara ayrılmıştır (ör. AppointmentModal).
- **Güncellemeler:**
  - Bağımlılıkları düzenli güncelleyin (`npm outdated` ile kontrol edebilirsiniz).
  - Supabase migration dosyalarını yedekleyin ve canlıya geçmeden önce test edin.
- **Destek Alacak Geliştiriciler İçin:**
  - API tipleri, veritabanı şeması ve servisler birbiriyle uyumludur.
  - Herhangi bir değişiklikte hem frontend hem backend tiplerini güncelleyin.
  - Güvenlik politikalarını değiştirmeden önce mutlaka test ortamında deneyin.

---

## 📈 Sıkça Sorulanlar
- **Sistem neden güvenli?**
  - Modern şifreleme, XSS/SQL injection koruması ve RLS ile veri güvenliği sağlanır.
- **Yönetim paneline yeni uzman/blog eklemek zor mu?**
  - Hayır, paneldeki formlar kullanıcı dostudur ve validasyon içerir.
- **Gelecekte başka bir yazılımcı projeyi devralabilir mi?**
  - Evet, kod ve dokümantasyon standartlara uygundur. Geliştirici notları ve tipler günceldir.

---

## 📞 İletişim
- Email: info@balanspsikoloji.com
- Telefon: 0374 215 65 43
- Adres: Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu

---

## 🏁 Son Not
Bu sistem, güvenlik ve sürdürülebilirlik öncelikli olarak, bütçe ve bakım kolaylığı gözetilerek hazırlanmıştır. Herhangi bir güncelleme veya destek ihtiyacında, bu README ve kod yapısı yeni geliştiriciler için yol gösterici olacaktır.