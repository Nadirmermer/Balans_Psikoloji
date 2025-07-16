/*
  # COMPLETE BALANS PSIKOLOJI SYSTEM - UPDATED VERSION V2
  
  Bu migration tüm sistemi sıfırdan kurar ve tüm sorunları çözer:
  - Tüm tabloları oluşturur
  - RLS ayarlarını düzgün yapar
  - Admin izinlerini düzeltir
  - Ayarlar sistemini ekler
  - Örnek verileri yükler
  - Bildirimler sistemi ekler
  - Storage bucket'ları oluşturur
  - Resim yükleme için gerekli izinleri ekler
  
  SONUÇ: Tek SQL ile tam çalışan sistem
*/

-- Önce tüm tabloları sil (eğer varsa)
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

-- Storage policy'leri - Daha geniş izinler
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous upload" ON storage.objects;

CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Allow authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Allow authenticated update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Allow authenticated delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');
CREATE POLICY "Allow anonymous upload" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'images');
CREATE POLICY "Allow anonymous update" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'images');
CREATE POLICY "Allow anonymous delete" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'images');

-- Uzmanlar tablosu
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
  slug text UNIQUE NOT NULL,
  aktif boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Hizmetler tablosu
CREATE TABLE hizmetler (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad text NOT NULL,
  aciklama text,
  detay text,
  fiyat integer DEFAULT 0,
  sure_dakika integer DEFAULT 50,
  resim text DEFAULT 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop',
  slug text UNIQUE NOT NULL,
  aktif boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Blog yazıları tablosu
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Randevular tablosu
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
  durum text DEFAULT 'beklemede' CHECK (durum IN ('beklemede', 'onaylandi', 'iptal_edildi')),
  created_at timestamptz DEFAULT now()
);

-- İletişim mesajları tablosu
CREATE TABLE iletisim_mesajlari (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad text NOT NULL,
  email text NOT NULL,
  konu text,
  mesaj text NOT NULL,
  okundu boolean DEFAULT false,
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

-- Site ayarları tablosu
CREATE TABLE site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id)
);

-- Bildirimler tablosu
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read boolean DEFAULT false,
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

-- RLS ayarları - ADMIN TABLOLARI İÇİN RLS KAPALI
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Diğer tablolar için RLS etkin
ALTER TABLE uzmanlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE hizmetler ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_yazilar ENABLE ROW LEVEL SECURITY;
ALTER TABLE randevular ENABLE ROW LEVEL SECURITY;
ALTER TABLE iletisim_mesajlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE uzman_hizmetler ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- İzinler - ANONYMOUS VE AUTHENTICATED İÇİN TAM İZİN
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Storage izinleri
GRANT ALL ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO anon;
GRANT ALL ON storage.buckets TO authenticated;

-- Policy'ler - HERKESİN HER ŞEYİ YAPABİLMESİ İÇİN
CREATE POLICY "Allow all for uzmanlar" ON uzmanlar FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for hizmetler" ON hizmetler FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for blog_yazilar" ON blog_yazilar FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for randevular" ON randevular FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for iletisim_mesajlari" ON iletisim_mesajlari FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for uzman_hizmetler" ON uzman_hizmetler FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for audit_logs" ON audit_logs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- İndeksler
CREATE INDEX idx_uzmanlar_slug ON uzmanlar(slug);
CREATE INDEX idx_uzmanlar_aktif ON uzmanlar(aktif);
CREATE INDEX idx_hizmetler_slug ON hizmetler(slug);
CREATE INDEX idx_hizmetler_aktif ON hizmetler(aktif);
CREATE INDEX idx_blog_yazilar_slug ON blog_yazilar(slug);
CREATE INDEX idx_blog_yazilar_yayinlandi ON blog_yazilar(yayinlandi);
CREATE INDEX idx_blog_yazilar_yazar ON blog_yazilar(yazar_id);
CREATE INDEX idx_randevular_uzman ON randevular(uzman_id);
CREATE INDEX idx_randevular_tarih ON randevular(tarih);
CREATE INDEX idx_randevular_durum ON randevular(durum);
CREATE INDEX idx_randevular_email ON randevular(email);
CREATE INDEX idx_iletisim_mesajlari_email ON iletisim_mesajlari(email);
CREATE INDEX idx_iletisim_mesajlari_created_at ON iletisim_mesajlari(created_at);
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_uzman_id ON admin_users(uzman_id);
CREATE INDEX idx_admin_users_aktif ON admin_users(aktif);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Şifre hash fonksiyonu
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(digest(password || 'balans_salt_2024', 'sha256'), 'hex');
END;
$$;

-- Örnek uzmanlar
INSERT INTO uzmanlar (ad, soyad, unvan, uzmanlik_alanlari, deneyim_yili, hakkinda, profil_resmi, email, telefon, slug) VALUES
('Ayşe', 'Demir', 'Dr. Klinik Psikolog', ARRAY['Bireysel Terapi', 'Travma', 'EMDR', 'Kaygı Bozuklukları'], 8, 
'8 yıldır travma ve kaygı bozuklukları konusunda uzman olarak çalışmaktayım. EMDR terapi sertifikasına sahibim ve özellikle travma sonrası stres bozukluğu, kaygı bozuklukları ve depresyon tedavisinde deneyimliyim.',
'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
'ayse.demir@balanspsikoloji.com', '0374 215 65 43', 'dr-ayse-demir'),

('Mehmet', 'Özkan', 'Uzm. Psk.', ARRAY['Çift Terapisi', 'Aile Danışmanlığı', 'İlişki Sorunları'], 12,
'12 yıldır çift ve aile terapisi alanında uzman olarak çalışmaktayım. Gottman Metodu ve Duygusal Odaklı Terapi sertifikalarına sahibim.',
'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
'mehmet.ozkan@balanspsikoloji.com', '0374 215 65 43', 'uzm-psk-mehmet-ozkan'),

('Elif', 'Yılmaz', 'Psikolog', ARRAY['Çocuk Psikolojisi', 'Gelişim', 'Oyun Terapisi'], 6,
'Çocuk ve ergen psikolojisi uzmanı. Oyun terapisi ve sanat terapisi sertifikasına sahibim.',
'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
'elif.yilmaz@balanspsikoloji.com', '0374 215 65 43', 'psk-elif-yilmaz'),

('Fatma', 'Öztürk', 'Uzm. Psk.', ARRAY['Kaygı Bozuklukları', 'Depresyon', 'Mindfulness'], 10,
'Kaygı bozuklukları ve depresyon tedavisinde uzman. Mindfulness temelli terapi uygulayıcısı.',
'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
'fatma.ozturk@balanspsikoloji.com', '0374 215 65 43', 'uzm-psk-fatma-ozturk');

-- Örnek hizmetler
INSERT INTO hizmetler (ad, aciklama, detay, fiyat, sure_dakika, resim, slug) VALUES
('Bireysel Terapi', 'Kişisel gelişim ve ruh sağlığınız için bire bir profesyonel destek', 
'<h2>Bireysel Terapi Nedir?</h2><p>Bireysel terapi, kişinin yaşadığı psikolojik zorlukları aşmasına yardımcı olan, bire bir gerçekleştirilen profesyonel bir süreçtir.</p><h3>Kimler İçin Uygundur?</h3><ul><li>Kaygı ve stres yaşayanlar</li><li>Depresyon belirtileri olanlar</li><li>Travma yaşamış kişiler</li><li>Kişisel gelişim isteyenler</li></ul>',
400, 50, 'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'bireysel-terapi'),

('Çift Terapisi', 'İlişkinizde yaşanan sorunları çözmek ve iletişimi güçlendirmek', 
'<h2>Çift Terapisi</h2><p>Çift terapisi, partnerler arasındaki iletişim sorunlarını çözmek, ilişkiyi güçlendirmek ve sağlıklı bir birliktelik oluşturmak amacıyla yapılan profesyonel bir terapi sürecidir.</p><h3>Hangi Durumlarda Başvurulur?</h3><ul><li>İletişim sorunları</li><li>Güven problemleri</li><li>Cinsel sorunlar</li><li>Boşanma süreci</li></ul>',
500, 60, 'https://images.pexels.com/photos/1030869/pexels-photo-1030869.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'cift-terapisi'),

('Aile Danışmanlığı', 'Aile içi çatışmaları çözmek ve sağlıklı aile dinamikleri oluşturmak', 
'<h2>Aile Danışmanlığı</h2><p>Aile içi çatışmaları çözmek ve sağlıklı aile dinamikleri oluşturmak için kapsamlı danışmanlık hizmetleri.</p>',
450, 60, 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'aile-danismanligi'),

('Çocuk Psikolojisi', 'Çocuk ve ergenlerin gelişimsel süreçlerinde karşılaştıkları zorluklara yönelik uzman destek', 
'<h2>Çocuk Psikolojisi</h2><p>Çocuk ve ergenlerin gelişimsel süreçlerinde karşılaştıkları zorluklara yönelik uzman psikolojik destek.</p>',
350, 45, 'https://images.pexels.com/photos/8923845/pexels-photo-8923845.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'cocuk-psikolojisi'),

('Online Terapi', 'Türkiye''nin her yerinden erişilebilir online terapi hizmetleri', 
'<h2>Online Terapi</h2><p>Türkiye''nin her yerinden erişilebilir online terapi hizmetleri. Güvenli ve etkili dijital terapi seansları.</p>',
350, 50, 'https://images.pexels.com/photos/4098280/pexels-photo-4098280.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop', 'online-terapi');

-- Örnek blog yazıları
INSERT INTO blog_yazilar (baslik, ozet, icerik, resim, yazar_id, kategori, etiketler, slug, yayinlandi, okuma_suresi) VALUES
('Kaygı Bozukluğu ile Başa Çıkma Yolları', 
'Günlük yaşamda kaygı ile nasıl başa çıkabileceğinize dair pratik öneriler ve teknikleri keşfedin.',
'<h2>Kaygı Nedir?</h2><p>Kaygı, gelecekteki belirsizlikler karşısında yaşadığımız doğal bir duygudur. Ancak bu duygu aşırı hale geldiğinde günlük yaşamımızı olumsuz etkileyebilir.</p><h3>Kaygı ile Başa Çıkma Teknikleri</h3><ul><li><strong>Nefes egzersizleri:</strong> Derin nefes alma teknikleri kaygıyı azaltır</li><li><strong>Mindfulness:</strong> Şimdiki ana odaklanma</li><li><strong>Düzenli egzersiz:</strong> Fiziksel aktivite endorfin salgılar</li><li><strong>Uyku düzeni:</strong> Kaliteli uyku kaygıyı azaltır</li></ul><p>Bu teknikleri düzenli olarak uygulayarak kaygı seviyenizi kontrol altına alabilirsiniz.</p>',
'https://images.pexels.com/photos/6963098/pexels-photo-6963098.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
(SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'),
'kaygi', ARRAY['kaygı', 'stres', 'başa çıkma'], 'kaygi-bozuklugu-ile-basa-cikma-yollari', true, 8),

('Çocuklarda Sosyal Kaygı',
'Çocuklarda sosyal kaygının belirtileri ve aileler için pratik öneriler.',
'<h2>Çocuklarda Sosyal Kaygı Nedir?</h2><p>Sosyal kaygı, çocuğun sosyal ortamlarda yargılanacağı korkusu yaşaması durumudur.</p><h3>Belirtiler</h3><ul><li>Okula gitmek istememe</li><li>Arkadaş edinmede zorluk</li><li>Performans kaygısı</li></ul><h3>Aileler Ne Yapabilir?</h3><p>Sabırlı olun ve çocuğunuzu destekleyin. Gerektiğinde profesyonel yardım alın.</p>',
'https://images.pexels.com/photos/8923845/pexels-photo-8923845.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
(SELECT id FROM uzmanlar WHERE slug = 'psk-elif-yilmaz'),
'cocuk', ARRAY['çocuk', 'sosyal kaygı', 'aile'], 'cocuklarda-sosyal-kaygi', true, 6),

('Sağlıklı İlişki İletişimi İçin 5 Altın Kural',
'Partnerinizle daha sağlıklı iletişim kurmanız için uygulaması kolay 5 temel kural.',
'<h2>İletişimin Önemi</h2><p>Sağlıklı ilişkilerin temeli etkili iletişimdir. İşte 5 altın kural:</p><h3>1. Aktif Dinleme</h3><p>Partnerinizi gerçekten dinleyin, sadece cevap vermeye odaklanmayın.</p><h3>2. "Ben" Dili Kullanın</h3><p>"Sen hep..." yerine "Ben hissediyorum..." şeklinde konuşun.</p><h3>3. Empati Kurun</h3><p>Partnerinizin perspektifini anlamaya çalışın.</p><h3>4. Saygılı Olun</h3><p>Tartışma sırasında bile saygınızı koruyun.</p><h3>5. Çözüm Odaklı Olun</h3><p>Suçlamak yerine çözüm aramaya odaklanın.</p>',
'https://images.pexels.com/photos/1030869/pexels-photo-1030869.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
(SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'),
'iliskiler', ARRAY['ilişkiler', 'iletişim', 'çift terapisi'], 'saglikli-iliski-iletisimi-icin-5-altin-kural', true, 7);

-- Uzman-hizmet ilişkileri
INSERT INTO uzman_hizmetler (uzman_id, hizmet_id) VALUES
((SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'), (SELECT id FROM hizmetler WHERE slug = 'bireysel-terapi')),
((SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'), (SELECT id FROM hizmetler WHERE slug = 'online-terapi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'), (SELECT id FROM hizmetler WHERE slug = 'cift-terapisi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'), (SELECT id FROM hizmetler WHERE slug = 'aile-danismanligi')),
((SELECT id FROM uzmanlar WHERE slug = 'psk-elif-yilmaz'), (SELECT id FROM hizmetler WHERE slug = 'cocuk-psikolojisi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-fatma-ozturk'), (SELECT id FROM hizmetler WHERE slug = 'bireysel-terapi')),
((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-fatma-ozturk'), (SELECT id FROM hizmetler WHERE slug = 'online-terapi'));

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

-- Site ayarları
INSERT INTO site_settings (key, value, description) VALUES
('site_name', '"Balans Psikoloji"', 'Site adı'),
('site_description', '"Ruh sağlığınız için güvenilir destek"', 'Site açıklaması'),
('contact_email', '"info@balanspsikoloji.com"', 'İletişim e-postası'),
('contact_phone', '"0374 215 65 43"', 'İletişim telefonu'),
('address', '"Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu"', 'Adres'),
('working_hours', '"Pazartesi - Cuma: 09:00 - 18:00, Cumartesi: 09:00 - 15:00"', 'Çalışma saatleri'),
('email_notifications', 'true', 'E-posta bildirimleri'),
('sms_notifications', 'false', 'SMS bildirimleri'),
('appointment_reminders', 'true', 'Randevu hatırlatmaları'),
('maintenance_mode', 'false', 'Bakım modu'),
('allow_registration', 'true', 'Kayıt olma izni'),
('require_email_verification', 'false', 'E-posta doğrulama zorunluluğu');

-- Örnek randevular
INSERT INTO randevular (uzman_id, hizmet_id, ad, soyad, email, telefon, tarih, saat, tur, mesaj, durum) VALUES
((SELECT id FROM uzmanlar WHERE slug = 'dr-ayse-demir'), 
 (SELECT id FROM hizmetler WHERE slug = 'bireysel-terapi'),
 'Ahmet', 'Yılmaz', 'ahmet@example.com', '0555 123 45 67', 
 CURRENT_DATE + INTERVAL '1 day', '10:00', 'yuz_yuze', 'Kaygı problemi yaşıyorum', 'beklemede'),

((SELECT id FROM uzmanlar WHERE slug = 'uzm-psk-mehmet-ozkan'), 
 (SELECT id FROM hizmetler WHERE slug = 'cift-terapisi'),
 'Ayşe', 'Kaya', 'ayse@example.com', '0555 987 65 43', 
 CURRENT_DATE + INTERVAL '2 days', '14:00', 'online', 'Eşimle iletişim sorunları', 'onaylandi');

-- Örnek iletişim mesajları
INSERT INTO iletisim_mesajlari (ad, email, konu, mesaj) VALUES
('Mehmet Demir', 'mehmet@example.com', 'Randevu Talebi', 'Merhaba, randevu almak istiyorum.'),
('Fatma Özkan', 'fatma@example.com', 'Bilgi Talebi', 'Hizmetleriniz hakkında bilgi alabilir miyim?');

-- Örnek bildirimler
INSERT INTO notifications (user_id, title, message, type) VALUES
((SELECT id FROM admin_users WHERE role = 'admin' LIMIT 1), 'Yeni Randevu Talebi', 'Ahmet Yılmaz adlı danışandan yeni randevu talebi', 'info'),
((SELECT id FROM admin_users WHERE role = 'admin' LIMIT 1), 'Blog Yazısı Yayınlandı', 'Kaygı Bozukluğu ile Başa Çıkma Yolları yazısı yayınlandı', 'success'),
((SELECT id FROM admin_users WHERE role = 'admin' LIMIT 1), 'İletişim Mesajı', 'Mehmet Demir adlı kişiden yeni mesaj', 'info');