# Balans Psikoloji - Web Uygulaması

Modern, güvenli ve ölçeklenebilir psikoloji kliniği yönetim sistemi.

## 🚀 Özellikler

- **Randevu Sistemi**: Online ve yüz yüze randevu alma
- **Uzman Yönetimi**: Uzman profilleri ve çalışma saatleri
- **Blog Sistemi**: SEO optimizasyonlu blog yazıları
- **Admin Paneli**: Kapsamlı yönetim araçları
- **Güvenlik**: Bcrypt şifreleme, RLS politikaları
- **Responsive Tasarım**: Mobil uyumlu arayüz
- **Dark Mode**: Göz yorgunluğunu azaltan tema desteği

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

1. **Repoyu klonlayın**
```bash
git clone https://github.com/yourusername/balans-psikoloji.git
cd balans-psikoloji
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment dosyasını oluşturun**
```bash
cp .env.example .env
```

4. **.env dosyasını düzenleyin**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

5. **Supabase migration'ları çalıştırın**
```bash
# Supabase Dashboard'dan SQL editor'ü kullanarak
# supabase/migrations/ klasöründeki SQL dosyalarını çalıştırın
```

6. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

## 📁 Proje Yapısı

```
src/
├── components/       # React componentleri
│   ├── admin/       # Admin panel componentleri
│   └── ...
├── contexts/        # React context providers
├── hooks/          # Custom React hooks
├── lib/            # Yardımcı fonksiyonlar ve sabitler
├── pages/          # Sayfa componentleri
├── services/       # API servisleri
├── types/          # TypeScript tip tanımlamaları
└── App.tsx         # Ana uygulama componenti
```

## 🔐 Güvenlik

- Environment variable'lar için type-safe config
- Bcrypt ile güvenli şifre hashleme
- Row Level Security (RLS) politikaları
- XSS koruması için DOMPurify
- HTTPS zorunluluğu

## 🚀 Deployment

### Netlify

1. Netlify'a bağlanın
2. Environment variable'ları ayarlayın
3. Build komutunu ayarlayın: `npm run build`
4. Publish dizinini ayarlayın: `dist`

## 📝 Geliştirme Notları

### Kod Standartları

- TypeScript strict mode aktif
- ESLint kurallarına uyum
- Component boyutu max 300 satır
- Anlamlı commit mesajları

### Test

```bash
# Unit testler (yakında eklenecek)
npm run test

# E2E testler (yakında eklenecek)
npm run test:e2e
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel lisanslıdır. Tüm hakları saklıdır.

## 📞 İletişim

- Email: info@balanspsikoloji.com
- Telefon: 0374 215 65 43
- Adres: Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu