# Balans Psikoloji - Web Uygulaması

Modern, güvenli ve ölçeklenebilir psikoloji kliniği yönetim sistemi. Bu uygulama, psikoloji kliniğinin tüm işlemlerini dijital ortamda yönetmek için tasarlanmıştır.

## 🚀 Özellikler

### Ana Modüller
- **Randevu Sistemi**: Online ve yüz yüze randevu alma
- **Uzman Yönetimi**: Uzman profilleri ve çalışma saatleri
- **Blog Sistemi**: SEO optimizasyonlu blog yazıları
- **Admin Paneli**: Kapsamlı yönetim araçları
- **İletişim Sistemi**: Mesaj yönetimi ve takibi

### Güvenlik Özellikleri
- **Bcrypt Şifreleme**: Güvenli şifre hashleme
- **Row Level Security (RLS)**: Veritabanı güvenlik politikaları
- **XSS Koruması**: DOMPurify ile HTML sanitization
- **Input Validation**: Kapsamlı girdi doğrulama
- **Rate Limiting**: API koruma mekanizmaları

### Teknik Özellikler
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Dark Mode**: Göz yorgunluğunu azaltan tema desteği
- **SEO Optimizasyonu**: Meta etiketleri ve structured data
- **Performance**: Code splitting ve lazy loading
- **TypeScript**: Tam tip güvenliği

## 🛠️ Teknoloji Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Auth**: Bcrypt.js, JWT
- **Build**: Vite
- **Deployment**: Netlify

## 📋 Gereksinimler

- Node.js 18+
- npm veya yarn
- Supabase hesabı

## 🔧 Kurulum

### 1. Repoyu Klonlayın
```bash
git clone https://github.com/yourusername/balans-psikoloji.git
cd balans-psikoloji
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Dosyasını Oluşturun
```bash
cp .env.example .env
```

### 4. Environment Değişkenlerini Düzenleyin
`.env` dosyasını düzenleyerek Supabase bilgilerinizi ekleyin:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=https://your-api-url.com
VITE_ENABLE_DEBUG=false
```

### 5. Veritabanını Kurun
Supabase Dashboard'da SQL Editor'ü açın ve şu dosyayı çalıştırın:
```sql
-- supabase/migrations/20250716172949_complete_system.sql
```

### 6. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

## 📁 Proje Yapısı

```
src/
├── components/           # React componentleri
│   ├── admin/           # Admin panel componentleri
│   ├── appointment/     # Randevu modal adımları
│   └── ...
├── contexts/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Yardımcı fonksiyonlar ve sabitler
│   ├── auth.ts         # Kimlik doğrulama servisi
│   ├── security.ts     # Güvenlik fonksiyonları
│   ├── sanitize.ts     # HTML sanitization
│   └── constants.ts    # Uygulama sabitleri
├── pages/              # Sayfa componentleri
├── services/           # API servisleri
├── types/              # TypeScript tip tanımlamaları
└── App.tsx             # Ana uygulama componenti
```

## 🔐 Güvenlik

### Veritabanı Güvenliği
- **Row Level Security (RLS)** aktif
- Güvenli policy'ler tanımlı
- SQL injection koruması
- XSS koruması

### Frontend Güvenliği
- Input sanitization
- CSRF token koruması
- Rate limiting
- Güvenli dosya yükleme
- E-posta ve telefon validasyonu

### Admin Panel Güvenliği
- Şifre hash'leme (bcrypt)
- Session yönetimi
- Role-based access control
- Audit logging

## 🎯 SEO Optimizasyonları

### Sayfa SEO'ları
- Ana sayfa: "Balans Psikoloji - Bolu | Ruh Sağlığı ve Psikolojik Danışmanlık"
- Hizmetler: "Psikoloji Hizmetleri Bolu | Balans Psikoloji"
- Uzmanlar: "Uzman Psikologlar Bolu | Balans Psikoloji"
- Blog: "Psikoloji Blog | Ruh Sağlığı Yazıları - Balans Psikoloji"
- İletişim: "İletişim | Balans Psikoloji Bolu"
- Randevu: "Randevu Al | Balans Psikoloji Bolu"

### Teknik SEO
- Meta description'lar
- Open Graph etiketleri
- Canonical URL'ler
- Robots.txt ayarları
- Schema markup desteği

## 📱 Mobil Uyumluluk

- Responsive tasarım
- Touch-friendly arayüz
- Mobil optimizasyonu
- PWA desteği hazır

## 🚀 Deployment

### Netlify Deployment

1. **Netlify'a Bağlanın**
   - GitHub reponuzu Netlify'a bağlayın
   - Otomatik deployment aktifleştirin

2. **Environment Variables Ayarlayın**
   - Netlify Dashboard'da environment variables ekleyin
   - Supabase URL ve anahtarlarını girin

3. **Build Ayarları**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Domain Ayarları**
   - Custom domain ekleyin
   - SSL sertifikasını aktifleştirin

### Production Checklist
- [ ] Environment variables ayarlandı
- [ ] SSL sertifikası aktif
- [ ] Domain ayarları yapıldı
- [ ] Backup sistemi kuruldu
- [ ] Monitoring aktif
- [ ] Security headers eklendi
- [ ] Performance testleri yapıldı
- [ ] SEO kontrolü tamamlandı

## 🔧 Yönetim Paneli Kullanımı

### Admin Girişi
- **URL**: `/admin`
- **Email**: `admin@balanspsikoloji.com`
- **Şifre**: `admin123`

### Temel İşlemler

#### Uzman Ekleme
1. Admin panelinde "Uzmanlar" sekmesine gidin
2. "Yeni Uzman Ekle" butonuna tıklayın
3. Gerekli bilgileri doldurun:
   - Ad, soyad, unvan
   - Uzmanlık alanları
   - Eğitim ve sertifikalar
   - Çalışma saatleri
   - Profil resmi
4. "Kaydet" butonuna tıklayın

#### Blog Yazısı Ekleme
1. "Blog" sekmesine gidin
2. "Yeni Yazı" butonuna tıklayın
3. Başlık, özet ve içerik ekleyin
4. Kategori ve etiketler seçin
5. SEO ayarlarını yapın
6. "Yayınla" butonuna tıklayın

#### Hizmet Ekleme
1. "Hizmetler" sekmesine gidin
2. "Yeni Hizmet" butonuna tıklayın
3. Hizmet adı ve açıklaması ekleyin
4. Süre ve fiyat bilgilerini girin
5. Kategori ve hedef kitle seçin
6. "Kaydet" butonuna tıklayın

#### Randevu Yönetimi
1. "Randevular" sekmesine gidin
2. Bekleyen randevuları görüntüleyin
3. Durumları güncelleyin (onaylandı, iptal edildi, tamamlandı)
4. Notlar ekleyin

## 📊 Performans Optimizasyonları

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Caching stratejileri
- Bundle optimization

### Backend
- Database indeksleri
- Query optimizasyonu
- Connection pooling
- Caching layer

## 🔄 Bakım ve Güncelleme

### Düzenli Kontroller
1. **Güvenlik güncellemeleri**
2. **Performans izleme**
3. **Backup kontrolü**
4. **Log analizi**

### Yedekleme
- Otomatik veritabanı yedekleme
- Dosya yedekleme
- Konfigürasyon yedekleme

## 📞 Destek

### Teknik Destek
- Sistem logları
- Error tracking
- Performance monitoring
- Security alerts

### Kullanıcı Destek
- Admin panel eğitimi
- Kullanım kılavuzu
- Video tutorial'lar
- Canlı destek

## 🎨 Özelleştirme

### Tema Değişiklikleri
- Renk paleti: `tailwind.config.js` dosyasında
- Font değişiklikleri: CSS değişkenlerinde
- Logo güncelleme: `public/` klasöründe
- Layout modifikasyonları: Component'lerde

### İçerik Yönetimi
- Dinamik içerik: Admin panelinden
- Çoklu dil desteği: Hazır altyapı
- İçerik şablonları: Mevcut
- Medya yönetimi: Supabase Storage

## 📈 Analitik ve Raporlama

### Google Analytics
- Sayfa görüntüleme
- Kullanıcı davranışı
- Conversion tracking
- SEO performansı

### Sistem Raporları
- Randevu istatistikleri
- İletişim mesajları
- Uzman performansı
- Hizmet popülerliği

## 🛡️ Güvenlik Kontrol Listesi

- [ ] SQL injection koruması
- [ ] XSS koruması
- [ ] CSRF koruması
- [ ] Input validation
- [ ] Rate limiting
- [ ] File upload güvenliği
- [ ] Authentication güvenliği
- [ ] Authorization kontrolü
- [ ] Audit logging
- [ ] Error handling

## 📋 Test Senaryoları

### Fonksiyonel Testler
- [ ] Randevu alma süreci
- [ ] İletişim formu
- [ ] Admin panel girişi
- [ ] İçerik yönetimi
- [ ] Arama fonksiyonu

### Güvenlik Testleri
- [ ] XSS payload testleri
- [ ] SQL injection testleri
- [ ] Authentication bypass testleri
- [ ] Authorization testleri

## 🔧 Geliştirici Notları

### Kod Standartları
- TypeScript strict mode aktif
- ESLint kurallarına uyum
- Component boyutu max 300 satır
- Anlamlı commit mesajları

### Yeni Özellik Ekleme
1. Feature branch oluşturun
2. Component'leri `src/components/` altında organize edin
3. API servislerini `src/services/` altında ekleyin
4. Type tanımlarını `src/types/` altında güncelleyin
5. Test yazın
6. Pull request açın

### Dışarıdan Destek Alırken
- Environment variables'ları paylaşmayın
- Admin şifrelerini değiştirin
- Backup alın
- Test ortamında çalıştırın
- Güvenlik audit'i yapın

## 📄 Lisans

Bu proje özel lisanslıdır. Tüm hakları saklıdır.

## 📞 İletişim

- **Email**: info@balanspsikoloji.com
- **Telefon**: 0374 215 65 43
- **Adres**: Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu
- **Website**: https://balanspsikoloji.com

---

**Not**: Bu sistem production-ready durumda olup, güvenlik ve performans optimizasyonları tamamlanmıştır. Düzenli bakım ve güncellemeler önerilir.