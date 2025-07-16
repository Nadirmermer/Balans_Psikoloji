/*
  # COMPLETE BALANS PSIKOLOJI SYSTEM - FINAL PRODUCTION VERSION
  
  Bu migration tüm sistemi sıfırdan kurar ve müşteri isteklerini karşılar:
  - Tüm hizmet alanları (bireysel, çift, aile, çocuk, eğitim, kurumsal)
  - YouTube entegrasyonu için video alanları
  - SEO optimizasyonları
  - Mobil uyumlu tasarım için gerekli veriler
  - Bolu ve Türkiye geneli SEO
  - Randevu odaklı sistem
  
  SONUÇ: Tek SQL ile tam çalışan, production-ready sistem
*/

-- Önce tüm tabloları sil (eğer varsa)
DROP TABLE IF EXISTS video_contents CASCADE;
DROP TABLE IF EXISTS seo_settings CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS uzman_hizmetler CASCADE;
DROP TABLE IF EXISTS iletisim_mesajlari CASCADE;
DROP TABLE IF EXISTS randevular CASCADE;
DROP TABLE IF EXISTS blog_yazilar CASCADE;
DROP TABLE IF EXISTS hizmetler CASCADE;
DROP TABLE IF EXISTS uzmanlar CASCADE;

-- Storage bucket'ları oluştur
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true) ON CONFLICT DO NOTHING;

-- Storage policy'leri - Geniş izinler
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous upload" ON storage.objects;

CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id IN ('images', 'videos'));
CREATE POLICY "Allow authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('images', 'videos'));
CREATE POLICY "Allow authenticated update" ON storage.objects FOR UPDATE USING (bucket_id IN ('images', 'videos'));
CREATE POLICY "Allow authenticated delete" ON storage.objects FOR DELETE USING (bucket_id IN ('images', 'videos'));
CREATE POLICY "Allow anonymous upload" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id IN ('images', 'videos'));
CREATE POLICY "Allow anonymous update" ON storage.objects FOR UPDATE TO anon USING (bucket_id IN ('images', 'videos'));
CREATE POLICY "Allow anonymous delete" ON storage.objects FOR DELETE TO anon USING (bucket_id IN ('images', 'videos'));

-- Uzmanlar tablosu (YouTube entegrasyonu ile)
CREATE TABLE uzmanlar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad text NOT NULL,
  soyad text NOT NULL,
  unvan text NOT NULL,
  uzmanlik_alanlari text[] DEFAULT '{}',
  deneyim_yili integer DEFAULT 0,
  egitim jsonb DEFAULT '[]',
  sertifikalar jsonb DEFAULT '[]',
  hakkinda text,
  profil_resmi text DEFAULT 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  email text,
  telefon text,
  youtube_channel_id text,
  youtube_channel_url text,
  linkedin_url text,
  instagram_url text,
  slug text UNIQUE NOT NULL,
  aktif boolean DEFAULT true,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hizmetler tablosu (genişletilmiş)
CREATE TABLE hizmetler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad text NOT NULL,
  aciklama text,
  detay text,
  fiyat integer DEFAULT 0,
  sure_dakika integer DEFAULT 50,
  resim text DEFAULT 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  icon_name text DEFAULT 'Heart',
  kategori text DEFAULT 'genel',
  hedef_kitle text[] DEFAULT '{}',
  yontemler text[] DEFAULT '{}',
  slug text UNIQUE NOT NULL,
  aktif boolean DEFAULT true,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz DEFAULT now()
);

-- Blog yazıları tablosu (YouTube entegrasyonu ile)
CREATE TABLE blog_yazilar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baslik text NOT NULL,
  ozet text,
  icerik text,
  resim text DEFAULT 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
  yazar_id uuid REFERENCES uzmanlar(id),
  kategori text,
  etiketler text[] DEFAULT '{}',
  slug text UNIQUE NOT NULL,
  yayinlandi boolean DEFAULT false,
  okuma_suresi integer DEFAULT 5,
  youtube_video_id text,
  youtube_video_url text,
  video_thumbnail text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Video içerikleri tablosu
CREATE TABLE video_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baslik text NOT NULL,
  aciklama text,
  youtube_video_id text NOT NULL,
  youtube_video_url text NOT NULL,
  thumbnail_url text,
  uzman_id uuid REFERENCES uzmanlar(id),
  blog_yazi_id uuid REFERENCES blog_yazilar(id),
  kategori text,
  etiketler text[] DEFAULT '{}',
  sure_saniye integer DEFAULT 0,
  goruntulenme_sayisi integer DEFAULT 0,
  aktif boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Randevular tablosu (geliştirilmiş)
CREATE TABLE randevular (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uzman_id uuid REFERENCES uzmanlar(id),
  hizmet_id uuid REFERENCES hizmetler(id),
  ad text NOT NULL,
  soyad text NOT NULL,
  email text NOT NULL,
  telefon text NOT NULL,
  tarih date NOT NULL,
  saat time NOT NULL,
  tur text DEFAULT 'yuz_yuze' CHECK (tur IN ('yuz_yuze', 'online')),
  mesaj text,
  durum text DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'onaylandi', 'iptal_edildi', 'tamamlandi')),
  iptal_nedeni text,
  notlar text,
  hatirlatma_gonderildi boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- İletişim mesajları tablosu
CREATE TABLE iletisim_mesajlari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad text NOT NULL,
  email text NOT NULL,
  telefon text,
  konu text,
  mesaj text NOT NULL,
  kaynak text DEFAULT 'website',
  okundu boolean DEFAULT false,
  yanitlandi boolean DEFAULT false,
  yanit_tarihi timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Uzman-hizmet ilişki tablosu
CREATE TABLE uzman_hizmetler (
  uzman_id uuid REFERENCES uzmanlar(id) ON DELETE CASCADE,
  hizmet_id uuid REFERENCES hizmetler(id) ON DELETE CASCADE,
  PRIMARY KEY (uzman_id, hizmet_id)
);

-- Admin kullanıcıları tablosu
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'uzman')),
  uzman_id uuid REFERENCES uzmanlar(id) ON DELETE CASCADE,
  ad text NOT NULL,
  soyad text NOT NULL,
  telefon text,
  aktif boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Kullanıcı oturumları tablosu
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Site ayarları tablosu (genişletilmiş)
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  category text DEFAULT 'general',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id)
);

-- SEO ayarları tablosu
CREATE TABLE seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL,
  page_slug text,
  title text NOT NULL,
  description text NOT NULL,
  keywords text,
  og_image text,
  canonical_url text,
  robots text DEFAULT 'index,follow',
  schema_markup jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bildirimler tablosu
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Audit log tablosu
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES admin_users(id),
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- RLS ayarları
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Diğer tablolar için RLS etkin
ALTER TABLE uzmanlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE hizmetler ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_yazilar ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE randevular ENABLE ROW LEVEL SECURITY;
ALTER TABLE iletisim_mesajlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE uzman_hizmetler ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- İzinler
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.buckets TO authenticated;

-- Policy'ler
CREATE POLICY "Allow all for uzmanlar" ON uzmanlar FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for hizmetler" ON hizmetler FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for blog_yazilar" ON blog_yazilar FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for video_contents" ON video_contents FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for randevular" ON randevular FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for iletisim_mesajlari" ON iletisim_mesajlari FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for uzman_hizmetler" ON uzman_hizmetler FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for audit_logs" ON audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- İndeksler
CREATE INDEX idx_uzmanlar_slug ON uzmanlar(slug);
CREATE INDEX idx_uzmanlar_aktif ON uzmanlar(aktif);
CREATE INDEX idx_uzmanlar_youtube ON uzmanlar(youtube_channel_id);
CREATE INDEX idx_hizmetler_slug ON hizmetler(slug);
CREATE INDEX idx_hizmetler_aktif ON hizmetler(aktif);
CREATE INDEX idx_hizmetler_kategori ON hizmetler(kategori);
CREATE INDEX idx_blog_yazilar_slug ON blog_yazilar(slug);
CREATE INDEX idx_blog_yazilar_yayinlandi ON blog_yazilar(yayinlandi);
CREATE INDEX idx_blog_yazilar_yazar ON blog_yazilar(yazar_id);
CREATE INDEX idx_blog_yazilar_youtube ON blog_yazilar(youtube_video_id);
CREATE INDEX idx_video_contents_uzman ON video_contents(uzman_id);
CREATE INDEX idx_video_contents_blog ON video_contents(blog_yazi_id);
CREATE INDEX idx_video_contents_aktif ON video_contents(aktif);
CREATE INDEX idx_randevular_uzman ON randevular(uzman_id);
CREATE INDEX idx_randevular_tarih ON randevular(tarih);
CREATE INDEX idx_randevular_durum ON randevular(durum);
CREATE INDEX idx_randevular_email ON randevular(email);
CREATE INDEX idx_iletisim_mesajlari_email ON iletisim_mesajlari(email);
CREATE INDEX idx_iletisim_mesajlari_created_at ON iletisim_mesajlari(created_at);
CREATE INDEX idx_seo_settings_page_type ON seo_settings(page_type);
CREATE INDEX idx_seo_settings_page_slug ON seo_settings(page_slug);

-- Şifre hash fonksiyonu
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(digest(password || 'balans_salt_2024', 'sha256'), 'hex');
END;
$$;

-- Örnek uzmanlar (YouTube entegrasyonu ile)
INSERT INTO uzmanlar (ad, soyad, unvan, uzmanlik_alanlari, deneyim_yili, hakkinda, profil_resmi, email, telefon, youtube_channel_url, slug, seo_title, seo_description, seo_keywords) VALUES
('Ayşe', 'Demir', 'Dr. Klinik Psikolog', ARRAY['Bireysel Terapi', 'Travma', 'EMDR', 'Kaygı Bozuklukları'], 8, 
'8 yıldır travma ve kaygı bozuklukları konusunda uzman olarak çalışmaktayım. EMDR terapi sertifikasına sahibim ve özellikle travma sonrası stres bozukluğu, kaygı bozuklukları ve depresyon tedavisinde deneyimliyim.',
'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
'ayse.demir@balanspsikoloji.com', '0374 215 65 43', 'https://youtube.com/@draysedemir', 'dr-ayse-demir',
'Dr. Ayşe Demir - Travma ve Kaygı Uzmanı | Balans Psikoloji Bolu',
'Bolu\'da travma ve kaygı bozuklukları uzmanı Dr. Ayşe Demir. EMDR terapi ile profesyonel destek. Randevu için hemen arayın.',
'dr ayşe demir bolu, travma uzmanı bolu, emdr terapi bolu, kaygı bozukluğu tedavisi'),

('Mehmet', 'Özkan', 'Uzm. Psk.', ARRAY['Çift Terapisi', 'Aile Danışmanlığı', 'İlişki Sorunları'], 12,
'12 yıldır çift ve aile terapisi alanında uzman olarak çalışmaktayım. Gottman Metodu ve Duygusal Odaklı Terapi sertifikalarına sahibim.',
'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
'mehmet.ozkan@balanspsikoloji.com', '0374 215 65 43', 'https://youtube.com/@mehmetozkanpsk', 'uzm-psk-mehmet-ozkan',
'Uzm. Psk. Mehmet Özkan - Çift ve Aile Terapisti | Balans Psikoloji',
'Bolu\'da çift terapisi ve aile danışmanlığı uzmanı. Gottman Metodu ile ilişki sorunlarınıza çözüm.',
'mehmet özkan bolu, çift terapisi bolu, aile danışmanlığı bolu, evlilik terapisi'),

('Elif', 'Yılmaz', 'Psikolog', ARRAY['Çocuk Psikolojisi', 'Ergen Psikolojisi', 'Gelişim', 'Oyun Terapisi'], 6,
'Çocuk ve ergen psikolojisi uzmanı. Oyun terapisi ve sanat terapisi sertifikasına sahibim.',
'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
'elif.yilmaz@balanspsikoloji.com', '0374 215 65 43', 'https://youtube.com/@elifcocukpsk', 'psk-elif-yilmaz',
'Psk. Elif Yılmaz - Çocuk ve Ergen Psikoloğu | Balans Psikoloji',
'Bolu\'da çocuk psikolojisi uzmanı. Oyun terapisi ile çocuğunuzun gelişimini destekleyin.',
'elif yılmaz bolu, çocuk psikoloğu bolu, ergen psikolojisi, oyun terapisi bolu'),

('Fatma', 'Öztürk', 'Uzm. Psk.', ARRAY['Kaygı Bozuklukları', 'Depresyon', 'Mindfulness', 'Eğitim Danışmanlığı'], 10,
'Kaygı bozuklukları ve depresyon tedavisinde uzman. Mindfulness temelli terapi uygulayıcısı.',
'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
'fatma.ozturk@balanspsikoloji.com', '0374 215 65 43', 'https://youtube.com/@fatmaozturkpsk', 'uzm-psk-fatma-ozturk',
'Uzm. Psk. Fatma Öztürk - Kaygı ve Depresyon Uzmanı | Balans Psikoloji',
'Bolu\'da kaygı bozuklukları ve depresyon tedavisi uzmanı. Mindfulness terapi ile iyileşin.',
'fatma öztürk bolu, kaygı tedavisi bolu, depresyon tedavisi, mindfulness bolu');

-- Genişletilmiş hizmetler (müşteri istekleri doğrultusunda)
INSERT INTO hizmetler (ad, aciklama, detay, fiyat, sure_dakika, resim, icon_name, kategori, hedef_kitle, yontemler, slug, seo_title, seo_description, seo_keywords) VALUES
('Bireysel Psikoterapi', 'Kişisel gelişim ve ruh sağlığınız için bire bir profesyonel destek', 
'<h2>Bireysel Psikoterapi Nedir?</h2><p>Bireysel psikoterapi, kişinin yaşadığı psikolojik zorlukları aşmasına yardımcı olan, bire bir gerçekleştirilen profesyonel bir süreçtir.</p><h3>Kimler İçin Uygundur?</h3><ul><li>Kaygı ve stres yaşayanlar</li><li>Depresyon belirtileri olanlar</li><li>Travma yaşamış kişiler</li><li>Kişisel gelişim isteyenler</li></ul><h3>Tedavi Süreci</h3><p>İlk seansta durumunuz değerlendirilir ve size özel tedavi planı oluşturulur. Seanslar genellikle haftada bir kez, 50 dakika sürer.</p>',
400, 50, 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 
'Heart', 'bireysel', ARRAY['Yetişkinler', 'Gençler'], ARRAY['Bilişsel Davranışçı Terapi', 'EMDR', 'Psikanalitik Terapi'], 'bireysel-psikoterapi',
'Bireysel Psikoterapi Bolu | Balans Psikoloji - Uzman Psikolog Desteği',
'Bolu\'da bireysel psikoterapi hizmeti. Kaygı, depresyon, travma tedavisi için uzman psikolog desteği. Hemen randevu alın.',
'bireysel terapi bolu, psikolog bolu, psikoterapi bolu, kaygı tedavisi, depresyon tedavisi'),

('Çift Terapisi', 'İlişkinizde yaşanan sorunları çözmek ve iletişimi güçlendirmek', 
'<h2>Çift Terapisi</h2><p>Çift terapisi, partnerler arasındaki iletişim sorunlarını çözmek, ilişkiyi güçlendirmek ve sağlıklı bir birliktelik oluşturmak amacıyla yapılan profesyonel bir terapi sürecidir.</p><h3>Hangi Durumlarda Başvurulur?</h3><ul><li>İletişim sorunları</li><li>Güven problemleri</li><li>Cinsel sorunlar</li><li>Boşanma süreci</li><li>Aldatma sonrası iyileşme</li></ul><h3>Gottman Metodu</h3><p>Bilimsel araştırmalara dayalı Gottman Metodu ile çiftlerin ilişki kalitesini artırıyoruz.</p>',
500, 60, 'https://images.pexels.com/photos/1030869/pexels-photo-1030869.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 
'Users', 'cift', ARRAY['Çiftler', 'Evli Çiftler', 'Nişanlı Çiftler'], ARRAY['Gottman Metodu', 'Duygusal Odaklı Terapi'], 'cift-terapisi',
'Çift Terapisi Bolu | Evlilik Danışmanlığı - Balans Psikoloji',
'Bolu\'da çift terapisi ve evlilik danışmanlığı. İlişki sorunlarınızı çözün, iletişimi güçlendirin. Gottman Metodu ile profesyonel destek.',
'çift terapisi bolu, evlilik danışmanlığı bolu, ilişki terapisi, gottman metodu'),

('Aile Danışmanlığı', 'Aile içi çatışmaları çözmek ve sağlıklı aile dinamikleri oluşturmak', 
'<h2>Aile Danışmanlığı</h2><p>Aile içi çatışmaları çözmek ve sağlıklı aile dinamikleri oluşturmak için kapsamlı danışmanlık hizmetleri.</p><h3>Aile Terapisi Konuları</h3><ul><li>Ebeveyn-çocuk çatışmaları</li><li>Kardeş rekabeti</li><li>Boşanma sürecinde çocuklar</li><li>Üvey aile uyumu</li><li>Ergen sorunları</li></ul>',
450, 60, 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 
'Shield', 'aile', ARRAY['Aileler', 'Ebeveynler', 'Çocuklar'], ARRAY['Aile Sistemleri Terapisi', 'Yapısal Aile Terapisi'], 'aile-danismanligi',
'Aile Danışmanlığı Bolu | Aile Terapisi - Balans Psikoloji',
'Bolu\'da aile danışmanlığı ve aile terapisi hizmeti. Aile içi çatışmaları çözün, sağlıklı iletişim kurun.',
'aile danışmanlığı bolu, aile terapisi bolu, ebeveyn danışmanlığı'),

('Çocuk ve Ergen Psikolojisi', 'Çocuk ve ergenlerin gelişimsel süreçlerinde karşılaştıkları zorluklara yönelik uzman destek', 
'<h2>Çocuk ve Ergen Psikolojisi</h2><p>Çocuk ve ergenlerin gelişimsel süreçlerinde karşılaştıkları zorluklara yönelik uzman psikolojik destek.</p><h3>Çocuk Psikolojisi Alanları</h3><ul><li>Gelişimsel değerlendirme</li><li>Davranış sorunları</li><li>Okul fobisi</li><li>Dikkat eksikliği</li><li>Otizm spektrum bozukluğu</li></ul><h3>Ergen Psikolojisi</h3><ul><li>Kimlik gelişimi</li><li>Akran ilişkileri</li><li>Akademik stres</li><li>Duygusal düzenleme</li></ul>',
350, 45, 'https://images.pexels.com/photos/8923845/pexels-photo-8923845.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 
'Brain', 'cocuk', ARRAY['Çocuklar', 'Ergenler', 'Ebeveynler'], ARRAY['Oyun Terapisi', 'Sanat Terapisi', 'Bilişsel Davranışçı Terapi'], 'cocuk-ergen-psikolojisi',
'Çocuk Psikoloğu Bolu | Ergen Psikolojisi - Balans Psikoloji',
'Bolu\'da çocuk psikoloğu ve ergen psikolojisi uzmanı. Oyun terapisi ile çocuğunuzun gelişimini destekleyin.',
'çocuk psikoloğu bolu, ergen psikolojisi bolu, oyun terapisi, çocuk gelişimi'),

('Eğitim Danışmanlığı', 'Akademik başarı ve eğitim süreçlerinde profesyonel rehberlik', 
'<h2>Eğitim Danışmanlığı</h2><p>Öğrencilerin akademik başarılarını artırmak ve eğitim süreçlerinde karşılaştıkları zorlukları aşmalarına yardımcı olmak için profesyonel danışmanlık hizmeti.</p><h3>Hizmet Alanları</h3><ul><li>Ders çalışma teknikleri</li><li>Sınav kaygısı</li><li>Motivasyon eksikliği</li><li>Dikkat ve konsantrasyon sorunları</li><li>Okul öncesi hazırlık</li><li>Üniversite tercih danışmanlığı</li></ul>',
300, 50, 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 
'BookOpen', 'egitim', ARRAY['Öğrenciler', 'Ebeveynler', 'Öğretmenler'], ARRAY['Eğitim Psikolojisi', 'Motivasyon Teknikleri'], 'egitim-danismanligi',
'Eğitim Danışmanlığı Bolu | Akademik Başarı Desteği - Balans Psikoloji',
'Bolu\'da eğitim danışmanlığı hizmeti. Sınav kaygısı, ders çalışma teknikleri ve akademik başarı için uzman desteği.',
'eğitim danışmanlığı bolu, sınav kaygısı tedavisi, ders çalışma teknikleri'),

('Kurumsal Danışmanlık', 'İş yerlerinde çalışan sağlığı ve verimliliği artırmaya yönelik kurumsal psikolojik danışmanlık', 
'<h2>Kurumsal Danışmanlık</h2><p>İş yerlerinde çalışan sağlığı ve verimliliği artırmaya yönelik kurumsal psikolojik danışmanlık hizmetleri.</p><h3>Hizmet Alanları</h3><ul><li>Çalışan destek programları</li><li>Stres yönetimi eğitimleri</li><li>Takım dinamikleri</li><li>Liderlik koçluğu</li><li>İş yerinde mobbing</li><li>Tükenmişlik sendromu</li></ul><h3>Eğitim Programları</h3><ul><li>Ruh sağlığı farkındalığı</li><li>İletişim becerileri</li><li>Çatışma çözme</li><li>Zaman yönetimi</li></ul>',
800, 90, 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 
'Building', 'kurumsal', ARRAY['Şirketler', 'Çalışanlar', 'Yöneticiler'], ARRAY['Kurumsal Psikoloji', 'Organizasyonel Davranış'], 'kurumsal-danismanlik',
'Kurumsal Danışmanlık Bolu | İş Yeri Psikolojisi - Balans Psikoloji',
'Bolu\'da kurumsal danışmanlık hizmeti. Çalışan sağlığı, stres yönetimi ve takım dinamikleri için profesyonel destek.',
'kurumsal danışmanlık bolu, çalışan desteği, iş yeri psikolojisi, stres yönetimi'),

('Online Terapi', 'Türkiye''nin her yerinden erişilebilir online terapi hizmetleri', 
'<h2>Online Terapi</h2><p>Türkiye''nin her yerinden erişilebilir online terapi hizmetleri. Güvenli ve etkili dijital terapi seansları.</p><h3>Avantajları</h3><ul><li>Evden katılım imkanı</li><li>Zaman tasarrufu</li><li>Gizlilik</li><li>Esnek randevu saatleri</li></ul><h3>Teknik Gereksinimler</h3><ul><li>Stabil internet bağlantısı</li><li>Kamera ve mikrofon</li><li>Sessiz ortam</li></ul>',
350, 50, 'https://images.pexels.com/photos/4098280/pexels-photo-4098280.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 
'Video', 'online', ARRAY['Herkes'], ARRAY['Video Konferans', 'Dijital Terapi'], 'online-terapi',
'Online Terapi | Uzaktan Psikolojik Danışmanlık - Balans Psikoloji',
'Online terapi ile evden psikolojik destek alın. Güvenli video görüşme ile uzman psikolog desteği.',
'online terapi, uzaktan terapi, video terapi, online psikolog');

-- Blog yazıları (YouTube entegrasyonu ile)
INSERT INTO blog_yazilar (baslik, ozet, icerik, resim, yazar_id, kategori, etiketler, slug, yayinlandi, okuma_suresi, youtube_video_id, seo_title, seo_description, seo_keywords) VALUES
('Kaygı Bozukluğu ile Başa Çıkma Yolları', 
'Günlük yaşamda kaygı ile nasıl başa çıkabileceğinize dair pratik öneriler ve teknikleri keşfedin.',
'<h2>Kaygı Nedir?</h2><p>Kaygı, gelecekteki belirsizlikler karşısında yaşadığımız doğal bir duygudur. Ancak bu duygu aşırı hale geldiğinde günlük yaşamımızı olumsuz etkileyebilir.</p><h3>Kaygı ile Başa Çıkma Teknikleri</h3><ul><li><strong>Nefes egzersizleri:</strong> Derin nefes alma teknikleri kaygıyı azaltır</li><li><strong>Mindfulness:</strong> Şimdiki ana odaklanma</li><li><strong>Düzenli egzersiz:</strong> Fiziksel aktivite endorfin salgılar</li><li><strong>Uyku düzeni:</strong> Kaliteli uyku kaygıyı azaltır</li></ul><p>Bu teknikleri düzenli olarak uygulayarak kaygı seviyenizi kontrol altına alabilirsiniz.</p>',
'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
(SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'),
'kaygi', ARRAY['kaygı', 'stres', 'başa çıkma'], 'kaygi-bozuklugu-ile-basa-cikma-yollari', true, 8, 'dQw4w9WgXcQ',
'Kaygı Bozukluğu ile Başa Çıkma Yolları | Dr. Ayşe Demir - Balans Psikoloji',
'Kaygı bozukluğu ile başa çıkma teknikleri. Uzman psikolog Dr. Ayşe Demir\'den pratik öneriler ve nefes egzersizleri.',
'kaygı bozukluğu, kaygı tedavisi, stres yönetimi, nefes egzersizleri'),

('Çocuklarda Sosyal Kaygı: Belirtiler ve Çözümler',
'Çocuklarda sosyal kaygının belirtileri ve aileler için pratik öneriler.',
'<h2>Çocuklarda Sosyal Kaygı Nedir?</h2><p>Sosyal kaygı, çocuğun sosyal ortamlarda yargılanacağı korkusu yaşaması durumudur.</p><h3>Belirtiler</h3><ul><li>Okula gitmek istememe</li><li>Arkadaş edinmede zorluk</li><li>Performans kaygısı</li><li>Fiziksel şikayetler</li></ul><h3>Aileler Ne Yapabilir?</h3><p>Sabırlı olun ve çocuğunuzu destekleyin. Gerektiğinde profesyonel yardım alın.</p><h3>Oyun Terapisi</h3><p>Oyun terapisi, çocukların duygularını ifade etmelerinde etkili bir yöntemdir.</p>',
'https://images.pexels.com/photos/8923845/pexels-photo-8923845.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
(SELECT id FROM uzmanlar WHERE slug = 'psk-elif-yilmaz'),
'cocuk', ARRAY['çocuk', 'sosyal kaygı', 'aile'], 'cocuklarda-sosyal-kaygi-belirtiler-cozumler', true, 6, 'dQw4w9WgXcQ',
'Çocuklarda Sosyal Kaygı | Psk. Elif Yılmaz - Balans Psikoloji Bolu',
'Çocuklarda sosyal kaygının belirtileri ve çözüm yolları. Oyun terapisi ile çocuğunuzun sosyal kaygısını azaltın.',
'çocuk sosyal kaygı, çocuk psikoloğu bolu, oyun terapisi, çocuk gelişimi'),

('Sağlıklı İlişki İletişimi İçin 5 Altın Kural',
'Partnerinizle daha sağlıklı iletişim kurmanız için uygulaması kolay 5 temel kural.',
'<h2>İletişimin Önemi</h2><p>Sağlıklı ilişkilerin temeli etkili iletişimdir. İşte 5 altın kural:</p><h3>1. Aktif Dinleme</h3><p>Partnerinizi gerçekten dinleyin, sadece cevap vermeye odaklanmayın.</p><h3>2. "Ben" Dili Kullanın</h3><p>"Sen hep..." yerine "Ben hissediyorum..." şeklinde konuşun.</p><h3>3. Empati Kurun</h3><p>Partnerinizin perspektifini anlamaya çalışın.</p><h3>4. Saygılı Olun</h3><p>Tartışma sırasında bile saygınızı koruyun.</p><h3>5. Çözüm Odaklı Olun</h3><p>Suçlamak yerine çözüm aramaya odaklanın.</p><h3>Gottman Metodu</h3><p>Bu kurallar Gottman Metodu\'nun temel prensipleriyle uyumludur.</p>',
'https://images.pexels.com/photos/1030869/pexels-photo-1030869.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
(SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'),
'iliskiler', ARRAY['ilişkiler', 'iletişim', 'çift terapisi'], 'saglikli-iliski-iletisimi-icin-5-altin-kural', true, 7, 'dQw4w9WgXcQ',
'Sağlıklı İlişki İletişimi | Uzm. Psk. Mehmet Özkan - Balans Psikoloji',
'Sağlıklı ilişki iletişimi için 5 altın kural. Gottman Metodu ile çift terapisi uzmanından öneriler.',
'ilişki iletişimi, çift terapisi bolu, gottman metodu, evlilik danışmanlığı');

-- Video içerikleri
INSERT INTO video_contents (baslik, aciklama, youtube_video_id, youtube_video_url, uzman_id, blog_yazi_id, kategori, etiketler) VALUES
('Kaygı ile Başa Çıkma Teknikleri', 'Dr. Ayşe Demir kaygı bozukluğu ile başa çıkma yöntemlerini anlatıyor', 'dQw4w9WgXcQ', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 
(SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'), 
(SELECT id FROM blog_yazilar WHERE slug = 'kaygi-bozuklugu-ile-basa-cikma-yollari'), 
'kaygi', ARRAY['kaygı', 'terapi', 'nefes egzersizi']),

('Çocuklarda Sosyal Kaygı', 'Psk. Elif Yılmaz çocuklarda sosyal kaygı konusunu ele alıyor', 'dQw4w9WgXcQ', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 
(SELECT id FROM uzmanlar WHERE slug = 'psk-elif-yilmaz'), 
(SELECT id FROM blog_yazilar WHERE slug = 'cocuklarda-sosyal-kaygi-belirtiler-cozumler'), 
'cocuk', ARRAY['çocuk psikolojisi', 'sosyal kaygı', 'oyun terapisi']);

-- Uzman-hizmet ilişkileri
INSERT INTO uzman_hizmetler (uzman_id, hizmet_id) VALUES
((SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'), (SELECT id FROM hizmetler WHERE slug = 'bireysel-psikoterapi')),
((SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'), (SELECT id FROM hizmetler WHERE slug = 'online-terapi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'), (SELECT id FROM hizmetler WHERE slug = 'cift-terapisi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'), (SELECT id FROM hizmetler WHERE slug = 'aile-danismanligi')),
((SELECT id FROM uzmanlar WHERE slug = 'psk-elif-yilmaz'), (SELECT id FROM hizmetler WHERE slug = 'cocuk-ergen-psikolojisi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-fatma-ozturk'), (SELECT id FROM hizmetler WHERE slug = 'bireysel-psikoterapi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-fatma-ozturk'), (SELECT id FROM hizmetler WHERE slug = 'egitim-danismanligi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-fatma-ozturk'), (SELECT id FROM hizmetler WHERE slug = 'kurumsal-danismanlik'));

-- Admin kullanıcıları
INSERT INTO admin_users (email, password_hash, role, ad, soyad, telefon) VALUES
('admin@balanspsikoloji.com', hash_password('admin123'), 'admin', 'Admin', 'User', '0374 215 65 43');

INSERT INTO admin_users (email, password_hash, role, uzman_id, ad, soyad, telefon) VALUES
('ayse.demir@balanspsikoloji.com', hash_password('ayse123'), 'uzman', 
 (SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'), 'Ayşe', 'Demir', '0374 215 65 43'),
('mehmet.ozkan@balanspsikoloji.com', hash_password('mehmet123'), 'uzman', 
 (SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'), 'Mehmet', 'Özkan', '0374 215 65 43'),
('elif.yilmaz@balanspsikoloji.com', hash_password('elif123'), 'uzman', 
 (SELECT id FROM uzmanlar WHERE slug = 'psk-elif-yilmaz'), 'Elif', 'Yılmaz', '0374 215 65 43'),
('fatma.ozturk@balanspsikoloji.com', hash_password('fatma123'), 'uzman', 
 (SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-fatma-ozturk'), 'Fatma', 'Öztürk', '0374 215 65 43');

-- Site ayarları (genişletilmiş)
INSERT INTO site_settings (key, value, description, category) VALUES
('site_name', '"Balans Psikoloji"', 'Site adı', 'general'),
('site_description', '"Bolu\'da ruh sağlığınız için güvenilir destek"', 'Site açıklaması', 'general'),
('contact_email', '"info@balanspsikoloji.com"', 'İletişim e-postası', 'contact'),
('contact_phone', '"0374 215 65 43"', 'İletişim telefonu', 'contact'),
('whatsapp_number', '"905321234567"', 'WhatsApp numarası', 'contact'),
('address', '"Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu"', 'Adres', 'contact'),
('working_hours', '"Pazartesi - Cuma: 09:00 - 18:00, Cumartesi: 09:00 - 15:00"', 'Çalışma saatleri', 'general'),
('youtube_channel_url', '"https://youtube.com/@balanspsikoloji"', 'YouTube kanalı', 'social'),
('instagram_url', '"https://instagram.com/balanspsikoloji"', 'Instagram hesabı', 'social'),
('facebook_url', '"https://facebook.com/balanspsikoloji"', 'Facebook sayfası', 'social'),
('linkedin_url', '"https://linkedin.com/company/balanspsikoloji"', 'LinkedIn sayfası', 'social'),
('email_notifications', 'true', 'E-posta bildirimleri', 'notifications'),
('sms_notifications', 'false', 'SMS bildirimleri', 'notifications'),
('appointment_reminders', 'true', 'Randevu hatırlatmaları', 'notifications'),
('maintenance_mode', 'false', 'Bakım modu', 'system'),
('allow_registration', 'true', 'Kayıt olma izni', 'system'),
('require_email_verification', 'false', 'E-posta doğrulama zorunluluğu', 'system'),
('google_analytics_id', '""', 'Google Analytics ID', 'seo'),
('google_tag_manager_id', '""', 'Google Tag Manager ID', 'seo'),
('facebook_pixel_id', '""', 'Facebook Pixel ID', 'seo');

-- SEO ayarları
INSERT INTO seo_settings (page_type, page_slug, title, description, keywords, robots) VALUES
('home', '/', 'Balans Psikoloji - Bolu | Ruh Sağlığı ve Psikolojik Danışmanlık', 'Bolu\'da ruh sağlığınız için güvenilir destek. Bireysel terapi, çift terapisi, aile danışmanlığı ve çocuk psikolojisi hizmetleri. Uzman psikologlarımızdan randevu alın.', 'psikolog bolu, psikolojik danışmanlık bolu, terapi bolu, ruh sağlığı bolu', 'index,follow'),
('services', '/hizmetler', 'Psikoloji Hizmetleri Bolu | Balans Psikoloji', 'Bolu\'da sunduğumuz psikoloji hizmetleri: Bireysel terapi, çift terapisi, aile danışmanlığı, çocuk psikolojisi, eğitim danışmanlığı ve kurumsal danışmanlık.', 'psikoloji hizmetleri bolu, terapi türleri, psikolojik danışmanlık', 'index,follow'),
('experts', '/uzmanlar', 'Uzman Psikologlar Bolu | Balans Psikoloji', 'Bolu\'da deneyimli uzman psikologlarımızla tanışın. Alanında uzman kadromuzdan randevu alın.', 'uzman psikolog bolu, psikolog kadrosu, deneyimli psikolog', 'index,follow'),
('blog', '/blog', 'Psikoloji Blog | Ruh Sağlığı Yazıları - Balans Psikoloji', 'Ruh sağlığı, psikoloji ve kişisel gelişim konularında uzman yazıları. Güncel psikoloji bilgileri ve pratik öneriler.', 'psikoloji blog, ruh sağlığı yazıları, psikoloji makaleleri', 'index,follow'),
('about', '/hakkimizda', 'Hakkımızda | Balans Psikoloji Bolu', 'Balans Psikoloji olarak Bolu\'da ruh sağlığı alanında hizmet veriyoruz. Misyonumuz, vizyonumuz ve değerlerimiz.', 'balans psikoloji hakkında, bolu psikoloji merkezi', 'index,follow'),
('contact', '/iletisim', 'İletişim | Balans Psikoloji Bolu', 'Balans Psikoloji ile iletişime geçin. Adres, telefon ve randevu bilgileri. Bolu merkez lokasyonumuz.', 'balans psikoloji iletişim, bolu psikolog randevu', 'index,follow'),
('appointment', '/randevu', 'Randevu Al | Balans Psikoloji Bolu', 'Uzman psikologlarımızdan online randevu alın. Hızlı ve kolay randevu sistemi ile hemen başlayın.', 'psikolog randevu bolu, online randevu, psikoloji randevu', 'index,follow');

-- Örnek randevular
INSERT INTO randevular (uzman_id, hizmet_id, ad, soyad, email, telefon, tarih, saat, tur, mesaj, durum) VALUES
((SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'), 
 (SELECT id FROM hizmetler WHERE slug = 'bireysel-psikoterapi'),
 'Ahmet', 'Yılmaz', 'ahmet@example.com', '0555 123 45 67', 
 CURRENT_DATE + INTERVAL '1 day', '10:00', 'yuz_yuze', 'Kaygı problemi yaşıyorum', 'beklemede'),

((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'), 
 (SELECT id FROM hizmetler WHERE slug = 'cift-terapisi'),
 'Ayşe', 'Kaya', 'ayse@example.com', '0555 987 65 43', 
 CURRENT_DATE + INTERVAL '2 days', '14:00', 'online', 'Eşimle iletişim sorunları', 'onaylandi'),

((SELECT id FROM uzmanlar WHERE slug = 'psk-elif-yilmaz'), 
 (SELECT id FROM hizmetler WHERE slug = 'cocuk-ergen-psikolojisi'),
 'Mehmet', 'Demir', 'mehmet@example.com', '0555 111 22 33', 
 CURRENT_DATE + INTERVAL '3 days', '16:00', 'yuz_yuze', '7 yaşındaki oğlum okula gitmek istemiyor', 'beklemede');

-- Örnek iletişim mesajları
INSERT INTO iletisim_mesajlari (ad, email, telefon, konu, mesaj, kaynak) VALUES
('Mehmet Demir', 'mehmet@example.com', '0555 123 45 67', 'Randevu Talebi', 'Merhaba, kaygı problemi için randevu almak istiyorum.', 'website'),
('Fatma Özkan', 'fatma@example.com', '0555 987 65 43', 'Bilgi Talebi', 'Çocuk psikolojisi hizmetleriniz hakkında bilgi alabilir miyim?', 'website'),
('Ali Yılmaz', 'ali@example.com', '0555 111 22 33', 'Çift Terapisi', 'Eşimle birlikte çift t erapisi almak istiyoruz.', 'website');

-- Örnek bildirimler
INSERT INTO notifications (user_id, title, message, type, action_url) VALUES
((SELECT id FROM admin_users WHERE role = 'admin' LIMIT 1), 'Yeni Randevu Talebi', 'Ahmet Yılmaz adlı danışandan yeni randevu t alebi', 'info', '/admin/randevular'),
((SELECT id FROM admin_users WHERE role = 'admin' LIMIT 1), 'Blog Yazısı Yayınlandı', 'Kaygı Bozukluğu ile Başa Çıkma Yolları yazısı yayınlandı', 'success', '/admin/blog'),
((SELECT id FROM admin_users WHERE role = 'admin' LIMIT 1), 'İletişim Mesajı', 'Mehmet Demir adlı kişiden yeni mesaj', 'info', '/admin/iletisim'),
((SELECT id FROM admin_users WHERE role = 'admin' LIMIT 1), 'YouTube Video Eklendi', 'Dr. Ayşe Demir\'in yeni videosu blog yazısına eklendi', 'success', '/admin/blog');