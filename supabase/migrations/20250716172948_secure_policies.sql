-- Secure Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE uzmanlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE hizmetler ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_yazilar ENABLE ROW LEVEL SECURITY;
ALTER TABLE randevular ENABLE ROW LEVEL SECURITY;
ALTER TABLE iletisim_mesajlari ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for public content
CREATE POLICY "Public can view active uzmanlar" ON uzmanlar
  FOR SELECT USING (aktif = true);

CREATE POLICY "Public can view active hizmetler" ON hizmetler
  FOR SELECT USING (aktif = true);

CREATE POLICY "Public can view published blog posts" ON blog_yazilar
  FOR SELECT USING (yayinlandi = true);

-- Randevu policies - users can only see their own appointments
CREATE POLICY "Users can create randevular" ON randevular
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own randevular" ON randevular
  FOR SELECT USING (email = current_setting('request.jwt.claims')::json->>'email');

-- Admin policies
CREATE POLICY "Admins can do everything on uzmanlar" ON uzmanlar
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'admin'
      AND aktif = true
    )
  );

CREATE POLICY "Admins can do everything on hizmetler" ON hizmetler
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'admin'
      AND aktif = true
    )
  );

CREATE POLICY "Admins can do everything on blog_yazilar" ON blog_yazilar
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND (role = 'admin' OR (role = 'uzman' AND yazar_id = uzman_id))
      AND aktif = true
    )
  );

CREATE POLICY "Admins can view all randevular" ON randevular
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND aktif = true
    )
  );

CREATE POLICY "Admins can update randevular" ON randevular
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND aktif = true
    )
  );

-- Contact messages - public can create, admins can view
CREATE POLICY "Public can create iletisim_mesajlari" ON iletisim_mesajlari
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view iletisim_mesajlari" ON iletisim_mesajlari
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND aktif = true
    )
  );

CREATE POLICY "Admins can update iletisim_mesajlari" ON iletisim_mesajlari
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND aktif = true
    )
  );

-- Admin users can only be managed by admins
CREATE POLICY "Only admins can manage admin_users" ON admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'admin'
      AND aktif = true
    )
  );

-- User sessions - users can only see their own
CREATE POLICY "Users can see their own sessions" ON user_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own sessions" ON user_sessions
  FOR DELETE USING (user_id = auth.uid());

-- Site settings - public read, admin write
CREATE POLICY "Public can read site_settings" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update site_settings" ON site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE id = auth.uid()
      AND role = 'admin'
      AND aktif = true
    )
  );

-- Update storage policies to be more secure
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;

-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    bucket_id IN ('images', 'videos')
  );

-- Only authenticated users can update their own uploads
CREATE POLICY "Users can update own uploads" ON storage.objects
  FOR UPDATE USING (
    auth.role() = 'authenticated' AND
    owner = auth.uid()
  );

-- Only authenticated users can delete their own uploads
CREATE POLICY "Users can delete own uploads" ON storage.objects
  FOR DELETE USING (
    auth.role() = 'authenticated' AND
    owner = auth.uid()
  );