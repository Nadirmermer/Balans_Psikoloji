import DOMPurify from 'dompurify';

// Configure DOMPurify to allow only safe HTML elements and attributes
const config = {
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'div', 'span',
    'ul', 'ol', 'li',
    'strong', 'em', 'b', 'i',
    'a', 'blockquote',
    'table', 'thead', 'tbody', 'tr', 'td', 'th'
  ],
  ALLOWED_ATTR: [
    'href', 'target', 'rel', 'class', 'id',
    'style', 'title', 'alt'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export const sanitizeHTML = (html: string): string => {
  if (!html) return '';
  
  try {
    return DOMPurify.sanitize(html, config);
  } catch (error) {
    console.error('HTML sanitization error:', error);
    // Return empty string if sanitization fails
    return '';
  }
};

/**
 * Sanitizes HTML content and returns it as a React dangerouslySetInnerHTML object
 * @param html - The HTML string to sanitize
 * @returns Object with __html property containing sanitized HTML
 */
export const createSanitizedHTML = (html: string): { __html: string } => {
  return { __html: sanitizeHTML(html) };
};