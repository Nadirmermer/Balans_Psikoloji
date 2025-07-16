import DOMPurify from 'dompurify';

// XSS koruması için input sanitization
export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
};

// HTML içeriği için güvenli sanitization
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
  });
};

// E-posta validasyonu
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Telefon numarası validasyonu
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
  return phoneRegex.test(phone);
};

// Şifre güvenliği kontrolü
export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Şifre en az 8 karakter olmalıdır');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Şifre en az bir büyük harf içermelidir');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Şifre en az bir küçük harf içermelidir');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Şifre en az bir rakam içermelidir');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Rate limiting için basit bir cache
class RateLimitCache {
  private cache = new Map<string, { count: number; resetTime: number }>();
  
  isAllowed(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.cache.get(key);
    
    if (!entry || now > entry.resetTime) {
      this.cache.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (entry.count >= limit) {
      return false;
    }
    
    entry.count++;
    return true;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const rateLimitCache = new RateLimitCache();

// CSRF token oluşturma
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Güvenli dosya yükleme kontrolü
export const validateFileUpload = (file: File, allowedTypes: string[], maxSize: number): {
  isValid: boolean;
  error?: string;
} => {
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Desteklenmeyen dosya türü'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Dosya boyutu ${Math.round(maxSize / 1024 / 1024)}MB'dan büyük olamaz`
    };
  }
  
  return { isValid: true };
};

// SQL injection koruması için basit kontrol
export const containsSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
    /(--|\/\*|\*\/|;)/,
    /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC)\b)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

// Güvenli URL kontrolü
export const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Güvenli slug oluşturma
export const createSafeSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Güvenli dosya adı oluşturma
export const createSafeFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop();
  const name = fileName.replace(/\.[^/.]+$/, '');
  
  return createSafeSlug(name) + '.' + extension;
};