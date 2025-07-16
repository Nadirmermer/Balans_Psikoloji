import { supabase } from '../lib/supabase';
import { ApiService, ApiResponse } from './api';
import { BlogYazi } from '../lib/supabase';
import { CACHE_KEYS, CACHE_DURATIONS } from '../lib/constants';

class BlogService extends ApiService {
  private cache: Map<string, { data: BlogYazi[]; timestamp: number }> = new Map();

  async getAll(): Promise<ApiResponse<BlogYazi[]>> {
    // Check cache
    const cached = this.cache.get(CACHE_KEYS.BLOG_YAZILAR);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATIONS.MEDIUM) {
      return { data: cached.data, error: null };
    }

    const response = await this.wrapSupabaseCall(
      supabase
        .from('blog_yazilar')
        .select(`
          *,
          yazar:uzmanlar(ad, soyad, unvan, profil_resmi)
        `)
        .eq('yayinlandi', true)
        .order('created_at', { ascending: false })
    );

    if (response.data) {
      // Update cache
      this.cache.set(CACHE_KEYS.BLOG_YAZILAR, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response;
  }

  async getBySlug(slug: string): Promise<ApiResponse<BlogYazi>> {
    // Check cache first
    const cached = this.cache.get(CACHE_KEYS.BLOG_YAZILAR);
    if (cached) {
      const yazi = cached.data.find(b => b.slug === slug);
      if (yazi) {
        return { data: yazi, error: null };
      }
    }

    return this.wrapSupabaseCall(
      supabase
        .from('blog_yazilar')
        .select(`
          *,
          yazar:uzmanlar(ad, soyad, unvan, profil_resmi)
        `)
        .eq('slug', slug)
        .eq('yayinlandi', true)
        .single()
    );
  }

  async getByCategory(kategori: string): Promise<ApiResponse<BlogYazi[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('blog_yazilar')
        .select(`
          *,
          yazar:uzmanlar(ad, soyad, unvan, profil_resmi)
        `)
        .eq('yayinlandi', true)
        .eq('kategori', kategori)
        .order('created_at', { ascending: false })
    );
  }

  async getByAuthor(yazarId: string): Promise<ApiResponse<BlogYazi[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('blog_yazilar')
        .select(`
          *,
          yazar:uzmanlar(ad, soyad, unvan, profil_resmi)
        `)
        .eq('yayinlandi', true)
        .eq('yazar_id', yazarId)
        .order('created_at', { ascending: false })
    );
  }

  async create(yazi: Omit<BlogYazi, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<BlogYazi>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('blog_yazilar')
        .insert(yazi)
        .select()
        .single()
    );

    if (response.data) {
      // Invalidate cache
      this.cache.delete(CACHE_KEYS.BLOG_YAZILAR);
    }

    return response;
  }

  async update(id: string, updates: Partial<BlogYazi>): Promise<ApiResponse<BlogYazi>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('blog_yazilar')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
    );

    if (response.data) {
      // Invalidate cache
      this.cache.delete(CACHE_KEYS.BLOG_YAZILAR);
    }

    return response;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('blog_yazilar')
        .update({ yayinlandi: false })
        .eq('id', id)
    );

    if (!response.error) {
      // Invalidate cache
      this.cache.delete(CACHE_KEYS.BLOG_YAZILAR);
    }

    return { data: undefined, error: response.error };
  }

  async search(query: string): Promise<ApiResponse<BlogYazi[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('blog_yazilar')
        .select(`
          *,
          yazar:uzmanlar(ad, soyad, unvan, profil_resmi)
        `)
        .eq('yayinlandi', true)
        .or(`baslik.ilike.%${query}%,ozet.ilike.%${query}%,icerik.ilike.%${query}%`)
        .order('created_at', { ascending: false })
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const blogService = new BlogService();