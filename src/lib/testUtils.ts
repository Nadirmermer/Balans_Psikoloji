// Test yardımcı fonksiyonları

// Mock data oluşturma
export const createMockUzman = (overrides = {}) => ({
  id: 'test-uzman-id',
  ad: 'Test',
  soyad: 'Uzman',
  unvan: 'Psikolog',
  uzmanlik_alanlari: ['Bireysel Terapi'],
  deneyim_yili: 5,
  egitim: [],
  sertifikalar: [],
  hakkinda: 'Test uzman hakkında',
  profil_resmi: 'https://example.com/image.jpg',
  email: 'test@example.com',
  telefon: '0374 215 65 43',
  slug: 'test-uzman',
  aktif: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockHizmet = (overrides = {}) => ({
  id: 'test-hizmet-id',
  ad: 'Test Hizmet',
  aciklama: 'Test hizmet açıklaması',
  detay: 'Test hizmet detayı',
  sure_dakika: 50,
  resim: 'https://example.com/image.jpg',
  icon_name: 'Heart',
  kategori: 'genel',
  hedef_kitle: ['Yetişkinler'],
  yontemler: ['Bilişsel Davranışçı Terapi'],
  sss: [],
  slug: 'test-hizmet',
  aktif: true,
  created_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockBlogYazi = (overrides = {}) => ({
  id: 'test-blog-id',
  baslik: 'Test Blog Yazısı',
  ozet: 'Test blog özeti',
  icerik: 'Test blog içeriği',
  resim: 'https://example.com/image.jpg',
  yazar_id: 'test-uzman-id',
  kategori: 'Genel',
  etiketler: ['test', 'psikoloji'],
  slug: 'test-blog-yazisi',
  yayinlandi: true,
  okuma_suresi: 5,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockRandevu = (overrides = {}) => ({
  id: 'test-randevu-id',
  uzman_id: 'test-uzman-id',
  hizmet_id: 'test-hizmet-id',
  ad: 'Test',
  soyad: 'Müşteri',
  email: 'test@example.com',
  telefon: '0374 215 65 43',
  tarih: '2024-01-15',
  saat: '10:00',
  tur: 'yuz_yuze' as const,
  mesaj: 'Test mesajı',
  durum: 'beklemede' as const,
  hatirlatma_gonderildi: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createMockIletisimMesaji = (overrides = {}) => ({
  id: 'test-mesaj-id',
  ad: 'Test',
  email: 'test@example.com',
  telefon: '0374 215 65 43',
  konu: 'Test Konu',
  mesaj: 'Test mesajı',
  kaynak: 'website',
  okundu: false,
  yanitlandi: false,
  created_at: '2024-01-01T00:00:00Z',
  ...overrides
});

// API response mock'ları
export const createMockApiResponse = <T>(data: T, error: string | null = null) => ({
  data,
  error
});

// Test environment setup
export const setupTestEnvironment = () => {
  // Mock localStorage
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });

  // Mock sessionStorage
  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  });

  // Mock fetch
  global.fetch = jest.fn();

  // Mock console methods
  const originalConsole = { ...console };
  beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterAll(() => {
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
  });
};

// Async test helper
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Form validation test helper
export const testFormValidation = async (
  formData: Record<string, string | number | boolean>,
  validationRules: Record<string, { required?: boolean; email?: boolean; phone?: boolean; minLength?: number }>,
  expectedErrors: string[]
) => {
  const errors: string[] = [];
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData[field];
    
    if (rules.required && !value) {
      errors.push(`${field} alanı zorunludur`);
    }
    
    if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.push(`${field} geçerli bir e-posta adresi olmalıdır`);
    }
    
    if (rules.phone && value && !/^(\+90|0)?[0-9]{10}$/.test(value)) {
      errors.push(`${field} geçerli bir telefon numarası olmalıdır`);
    }
    
    if (rules.minLength && value && value.length < rules.minLength) {
      errors.push(`${field} en az ${rules.minLength} karakter olmalıdır`);
    }
  }
  
  expect(errors).toEqual(expectedErrors);
};

// API error test helper
export const testApiError = async (
  apiCall: () => Promise<unknown>,
  expectedError: string
) => {
  try {
    await apiCall();
    fail('API call should have thrown an error');
  } catch (error) {
    expect(error.message).toContain(expectedError);
  }
};

// Component render test helper
export const renderWithProviders = (component: React.ReactElement) => {
  // Bu fonksiyon test ortamında provider'ları sarmalayarak component'i render eder
  return component;
};

// Database test helper
export const clearTestDatabase = async () => {
  // Test veritabanını temizlemek için kullanılır
  // Gerçek implementasyonda Supabase test veritabanı kullanılmalı
};

// Performance test helper
export const measurePerformance = async (fn: () => Promise<unknown>) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  return end - start;
};

// Security test helper
export const testSecurityVulnerabilities = async (
  input: string,
  expectedSanitized: string
) => {
  const { sanitizeInput } = await import('./security');
  const sanitized = sanitizeInput(input);
  expect(sanitized).toBe(expectedSanitized);
};

// SEO test helper
export const testSEOElements = (document: Document) => {
  const title = document.querySelector('title');
  const metaDescription = document.querySelector('meta[name="description"]');
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  
  return {
    title: title?.textContent,
    metaDescription: metaDescription?.getAttribute('content'),
    metaKeywords: metaKeywords?.getAttribute('content'),
    ogTitle: ogTitle?.getAttribute('content'),
    ogDescription: ogDescription?.getAttribute('content'),
  };
};