// Database type definitions

export interface Egitim {
  id: string;
  okul: string;
  bolum: string;
  derece: string;
  baslangic_yili: number;
  bitis_yili?: number;
  devam_ediyor: boolean;
}

export interface Sertifika {
  id: string;
  ad: string;
  kurum: string;
  tarih: string;
  gecerlilik_suresi?: string;
  sertifika_no?: string;
}

export interface CalismaGunu {
  aktif: boolean;
  baslangic: string;
  bitis: string;
}

export type CalismaGunleri = {
  [gun in 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma' | 'Cumartesi' | 'Pazar']: CalismaGunu;
};

export interface SiteSettingValue {
  key: string;
  value: string | boolean | number;
}