import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL ve Anon Key environment variables tanimlanmali');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Uzman {
  id: string;
  ad: string;
  soyad: string;
  unvan: string;
  uzmanlik_alanlari: string[];
  deneyim_yili: number;
  egitim: any[];
  sertifikalar: any[];
  hakkinda: string;
  profil_resmi: string;
  email: string;
  telefon: string;
  slug: string;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface Hizmet {
  id: string;
  ad: string;
  aciklama: string;
  detay: string;
  fiyat: number;
  sure_dakika: number;
  resim: string;
  slug: string;
  aktif: boolean;
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
  created_at: string;
  updated_at: string;
  yazar?: Uzman;
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
  durum: 'beklemede' | 'onaylandi' | 'iptal_edildi';
  created_at: string;
}

export interface IletisimMesaji {
  id: string;
  ad: string;
  email: string;
  konu?: string;
  mesaj: string;
  okundu: boolean;
  created_at: string;
}