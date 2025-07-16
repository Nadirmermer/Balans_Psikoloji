// Application Constants

export const APP_NAME = 'Balans Psikoloji';
export const APP_DESCRIPTION = 'Ruh sağlığınız için güvenilir destek';

// Contact Information
export const CONTACT = {
  EMAIL: 'info@balanspsikoloji.com',
  PHONE: '0374 215 65 43',
  ADDRESS: 'Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu',
  WORKING_HOURS: 'Pazartesi - Cuma: 09:00 - 18:00, Cumartesi: 09:00 - 15:00',
} as const;

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Appointment Types
export const APPOINTMENT_TYPES = {
  YUZ_YUZE: 'yuz_yuze',
  ONLINE: 'online',
} as const;

export const APPOINTMENT_TYPE_LABELS = {
  [APPOINTMENT_TYPES.YUZ_YUZE]: 'Yüz Yüze',
  [APPOINTMENT_TYPES.ONLINE]: 'Online',
} as const;

// Appointment Status
export const APPOINTMENT_STATUS = {
  BEKLEMEDE: 'beklemede',
  ONAYLANDI: 'onaylandi',
  IPTAL_EDILDI: 'iptal_edildi',
} as const;

export const APPOINTMENT_STATUS_LABELS = {
  [APPOINTMENT_STATUS.BEKLEMEDE]: 'Beklemede',
  [APPOINTMENT_STATUS.ONAYLANDI]: 'Onaylandı',
  [APPOINTMENT_STATUS.IPTAL_EDILDI]: 'İptal Edildi',
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  UZMAN: 'uzman',
} as const;

// Days of Week
export const DAYS_OF_WEEK = [
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
  'Pazar',
] as const;

// Session Duration
export const SESSION_DURATION_MINUTES = 50;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^(\+90|0)?[0-9]{10}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Storage Buckets
export const STORAGE_BUCKETS = {
  IMAGES: 'images',
  VIDEOS: 'videos',
} as const;

// Cache Keys
export const CACHE_KEYS = {
  UZMANLAR: 'uzmanlar',
  HIZMETLER: 'hizmetler',
  BLOG_YAZILAR: 'blog_yazilar',
  SITE_SETTINGS: 'site_settings',
} as const;

// Cache Durations (in milliseconds)
export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 1 hour
} as const;