import { supabase } from '../lib/supabase';
import { ApiService, ApiResponse } from './api';
import { Hizmet } from '../lib/supabase';
import { CACHE_KEYS, CACHE_DURATIONS } from '../lib/constants';

class HizmetService extends ApiService {
  private cache: Map<string, { data: Hizmet[]; timestamp: number }> = new Map();

  async getAll(): Promise<ApiResponse<Hizmet[]>> {
    // Check cache
    const cached = this.cache.get(CACHE_KEYS.HIZMETLER);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATIONS.MEDIUM) {
      return { data: cached.data, error: null };
    }

    const response = await this.wrapSupabaseCall(
      supabase
        .from('hizmetler')
        .select('*')
        .eq('aktif', true)
        .order('created_at', { ascending: false })
    );

    if (response.data) {
      // Update cache
      this.cache.set(CACHE_KEYS.HIZMETLER, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response;
  }

  async getBySlug(slug: string): Promise<ApiResponse<Hizmet>> {
    // Check cache first
    const cached = this.cache.get(CACHE_KEYS.HIZMETLER);
    if (cached) {
      const hizmet = cached.data.find(h => h.slug === slug);
      if (hizmet) {
        return { data: hizmet, error: null };
      }
    }

    return this.wrapSupabaseCall(
      supabase
        .from('hizmetler')
        .select('*')
        .eq('slug', slug)
        .eq('aktif', true)
        .single()
    );
  }

  async getByCategory(kategori: string): Promise<ApiResponse<Hizmet[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('hizmetler')
        .select('*')
        .eq('aktif', true)
        .eq('kategori', kategori)
        .order('created_at', { ascending: false })
    );
  }

  async create(hizmet: Omit<Hizmet, 'id' | 'created_at'>): Promise<ApiResponse<Hizmet>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('hizmetler')
        .insert(hizmet)
        .select()
        .single()
    );

    if (response.data) {
      // Invalidate cache
      this.cache.delete(CACHE_KEYS.HIZMETLER);
    }

    return response;
  }

  async update(id: string, updates: Partial<Hizmet>): Promise<ApiResponse<Hizmet>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('hizmetler')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    );

    if (response.data) {
      // Invalidate cache
      this.cache.delete(CACHE_KEYS.HIZMETLER);
    }

    return response;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('hizmetler')
        .update({ aktif: false })
        .eq('id', id)
    );

    if (!response.error) {
      // Invalidate cache
      this.cache.delete(CACHE_KEYS.HIZMETLER);
    }

    return { data: undefined, error: response.error };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const hizmetService = new HizmetService();