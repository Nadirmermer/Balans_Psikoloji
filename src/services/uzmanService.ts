import { supabase } from '../lib/supabase';
import { ApiService, ApiResponse } from './api';
import { Uzman } from '../lib/supabase';
import { CACHE_KEYS, CACHE_DURATIONS } from '../lib/constants';

class UzmanService extends ApiService {
  private cache: Map<string, { data: Uzman[]; timestamp: number }> = new Map();

  async getAll(): Promise<ApiResponse<Uzman[]>> {
    // Check cache
    const cached = this.cache.get(CACHE_KEYS.UZMANLAR);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATIONS.MEDIUM) {
      return { data: cached.data, error: null };
    }

    const response = await this.wrapSupabaseCall(
      supabase
        .from('uzmanlar')
        .select('*')
        .eq('aktif', true)
        .order('created_at', { ascending: false })
    );

    if (response.data) {
      // Update cache
      this.cache.set(CACHE_KEYS.UZMANLAR, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response;
  }

  async getBySlug(slug: string): Promise<ApiResponse<Uzman>> {
    // Check cache first
    const cached = this.cache.get(CACHE_KEYS.UZMANLAR);
    if (cached) {
      const uzman = cached.data.find(u => u.slug === slug);
      if (uzman) {
        return { data: uzman, error: null };
      }
    }

    return this.wrapSupabaseCall(
      supabase
        .from('uzmanlar')
        .select('*')
        .eq('slug', slug)
        .eq('aktif', true)
        .single()
    );
  }

  async create(uzman: Omit<Uzman, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Uzman>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('uzmanlar')
        .insert(uzman)
        .select()
        .single()
    );

    if (response.data) {
      // Invalidate cache
      this.cache.delete(CACHE_KEYS.UZMANLAR);
    }

    return response;
  }

  async update(id: string, updates: Partial<Uzman>): Promise<ApiResponse<Uzman>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('uzmanlar')
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
      this.cache.delete(CACHE_KEYS.UZMANLAR);
    }

    return response;
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('uzmanlar')
        .update({ aktif: false })
        .eq('id', id)
    );

    if (!response.error) {
      // Invalidate cache
      this.cache.delete(CACHE_KEYS.UZMANLAR);
    }

    return { data: undefined, error: response.error };
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const uzmanService = new UzmanService();