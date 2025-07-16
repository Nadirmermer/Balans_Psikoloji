import { supabase } from '../lib/supabase';
import { ApiService, ApiResponse } from './api';
import { Randevu } from '../lib/supabase';

class RandevuService extends ApiService {
  async create(randevu: Omit<Randevu, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Randevu>> {
    return this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .insert(randevu)
        .select()
        .single()
    );
  }

  async getAll(): Promise<ApiResponse<Randevu[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .select(`
          *,
          uzman:uzmanlar(ad, soyad, unvan),
          hizmet:hizmetler(ad, aciklama)
        `)
        .order('tarih', { ascending: false })
        .order('saat', { ascending: false })
    );
  }

  async getByExpert(uzmanId: string): Promise<ApiResponse<Randevu[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .select(`
          *,
          uzman:uzmanlar(ad, soyad, unvan),
          hizmet:hizmetler(ad, aciklama)
        `)
        .eq('uzman_id', uzmanId)
        .order('tarih', { ascending: false })
        .order('saat', { ascending: false })
    );
  }

  async getByDate(date: string): Promise<ApiResponse<Randevu[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .select(`
          *,
          uzman:uzmanlar(ad, soyad, unvan),
          hizmet:hizmetler(ad, aciklama)
        `)
        .eq('tarih', date)
        .order('saat', { ascending: true })
    );
  }

  async getByStatus(durum: string): Promise<ApiResponse<Randevu[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .select(`
          *,
          uzman:uzmanlar(ad, soyad, unvan),
          hizmet:hizmetler(ad, aciklama)
        `)
        .eq('durum', durum)
        .order('tarih', { ascending: false })
        .order('saat', { ascending: false })
    );
  }

  async update(id: string, updates: Partial<Randevu>): Promise<ApiResponse<Randevu>> {
    return this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()
    );
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .delete()
        .eq('id', id)
    );
  }

  async checkAvailability(uzmanId: string, tarih: string, saat: string): Promise<ApiResponse<boolean>> {
    const response = await this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .select('id')
        .eq('uzman_id', uzmanId)
        .eq('tarih', tarih)
        .eq('saat', saat)
        .not('durum', 'eq', 'iptal_edildi')
    );

    return {
      data: !response.data || response.data.length === 0,
      error: response.error,
    };
  }

  async getUpcoming(): Promise<ApiResponse<Randevu[]>> {
    const today = new Date().toISOString().split('T')[0];
    
    return this.wrapSupabaseCall(
      supabase
        .from('randevular')
        .select(`
          *,
          uzman:uzmanlar(ad, soyad, unvan),
          hizmet:hizmetler(ad, aciklama)
        `)
        .gte('tarih', today)
        .not('durum', 'eq', 'iptal_edildi')
        .order('tarih', { ascending: true })
        .order('saat', { ascending: true })
    );
  }
}

export const randevuService = new RandevuService();