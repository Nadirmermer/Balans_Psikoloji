import { createClient } from '@supabase/supabase-js';
import { config } from './config';

export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

import { Egitim, Sertifika, CalismaGunleri } from '../types/database';

// Database types
export interface Uzman {
  id: string;
  ad: string;
  soyad: string;
  unvan: string;
  uzmanlik_alanlari: string[];
  deneyim_yili: number;
  egitim: Egitim[];
  sertifikalar: Sertifika[];
  hakkinda: string;
  profil_resmi: string;
  email: string;
  telefon: string;
  youtube_channel_id?: string;
  youtube_channel_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  calisma_saatleri?: CalismaGunleri;
  slug: string;
  aktif: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at: string;
  updated_at: string;
}

export interface Hizmet {
  id: string;
  ad: string;
  aciklama: string;
  detay: string;
  sure_dakika: number;
  resim: string;
  icon_name: string;
  kategori: string;
  hedef_kitle: string[];
  yontemler: string[];
  sss: any[];
  slug: string;
  aktif: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at: string;
}

export interface BlogYazi {
  id: string;
  baslik: string;
  ozet: string;
  icerik: string;
  resim: string;
  yazar_id: string;
  kategori: string;
  etiketler: string[];
  slug: string;
  yayinlandi: boolean;
  okuma_suresi: number;
  youtube_video_id?: string;
  youtube_video_url?: string;
  video_thumbnail?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at: string;
  updated_at: string;
  yazar?: Uzman;
}

export interface VideoContent {
  id: string;
  baslik: string;
  aciklama: string;
  youtube_video_id: string;
  youtube_video_url: string;
  thumbnail_url?: string;
  uzman_id?: string;
  blog_yazi_id?: string;
  kategori?: string;
  etiketler: string[];
  sure_saniye: number;
  goruntulenme_sayisi: number;
  aktif: boolean;
  created_at: string;
}

export interface Randevu {
  id: string;
  uzman_id: string;
  hizmet_id: string;
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  tarih: string;
  saat: string;
  tur: 'yuz_yuze' | 'online';
  mesaj?: string;
  durum: 'beklemede' | 'onaylandi' | 'iptal_edildi' | 'tamamlandi';
  iptal_nedeni?: string;
  notlar?: string;
  hatirlatma_gonderildi: boolean;
  created_at: string;
  updated_at: string;
  uzman?: Uzman;
  hizmet?: Hizmet;
}

export interface IletisimMesaji {
  id: string;
  ad: string;
  email: string;
  telefon?: string;
  konu?: string;
  mesaj: string;
  kaynak: string;
  okundu: boolean;
  yanitlandi: boolean;
  yanit_tarihi?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'uzman';
  uzman_id?: string;
  ad: string;
  soyad: string;
  telefon?: string;
  aktif: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  updated_at: string;
  updated_by?: string;
}

export interface SeoSetting {
  id: string;
  page_type: string;
  page_slug?: string;
  title: string;
  description: string;
  keywords?: string;
  og_image?: string;
  canonical_url?: string;
  robots: string;
  schema_markup?: any;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}