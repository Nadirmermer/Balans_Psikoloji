import DOMPurify from 'dompurify';

/**
 * HTML içeriğini güvenli hale getirir
 * @param html - Temizlenecek HTML string
 * @returns Güvenli HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'td', 'th'
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'target',
      'width', 'height', 'style'
    ],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur']
  });
};

/**
 * Plain text'i güvenli hale getirir
 * @param text - Temizlenecek text
 * @returns Güvenli text string
 */
export const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};

/**
 * URL'yi güvenli hale getirir
 * @param url - Temizlenecek URL
 * @returns Güvenli URL string
 */
export const sanitizeURL = (url: string): string => {
  if (!url) return '';
  
  // Sadece http ve https protokollerine izin ver
  const allowedProtocols = ['http:', 'https:'];
  const urlObj = new URL(url, window.location.origin);
  
  if (!allowedProtocols.includes(urlObj.protocol)) {
    return '';
  }
  
  return urlObj.toString();
};

/**
 * Form verilerini temizler
 * @param data - Temizlenecek form verisi
 * @returns Temizlenmiş form verisi
 */
export const sanitizeFormData = (data: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};