import { supabase } from '../lib/supabase';
import { ApiService, ApiResponse } from './api';
import { IletisimMesaji } from '../lib/supabase';

class IletisimService extends ApiService {
  async create(mesaj: Omit<IletisimMesaji, 'id' | 'created_at'>): Promise<ApiResponse<IletisimMesaji>> {
    return this.wrapSupabaseCall(
      supabase
        .from('iletisim_mesajlari')
        .insert(mesaj)
        .select()
        .single()
    );
  }

  async getAll(): Promise<ApiResponse<IletisimMesaji[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('iletisim_mesajlari')
        .select('*')
        .order('created_at', { ascending: false })
    );
  }

  async getUnread(): Promise<ApiResponse<IletisimMesaji[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('iletisim_mesajlari')
        .select('*')
        .eq('okundu', false)
        .order('created_at', { ascending: false })
    );
  }

  async getByEmail(email: string): Promise<ApiResponse<IletisimMesaji[]>> {
    return this.wrapSupabaseCall(
      supabase
        .from('iletisim_mesajlari')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false })
    );
  }

  async markAsRead(id: string): Promise<ApiResponse<IletisimMesaji>> {
    return this.wrapSupabaseCall(
      supabase
        .from('iletisim_mesajlari')
        .update({ okundu: true })
        .eq('id', id)
        .select()
        .single()
    );
  }

  async markAsReplied(id: string): Promise<ApiResponse<IletisimMesaji>> {
    return this.wrapSupabaseCall(
      supabase
        .from('iletisim_mesajlari')
        .update({ 
          yanitlandi: true,
          yanit_tarihi: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
    );
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.wrapSupabaseCall(
      supabase
        .from('iletisim_mesajlari')
        .delete()
        .eq('id', id)
    );
  }

  async getStats(): Promise<ApiResponse<{
    total: number;
    unread: number;
    replied: number;
    today: number;
  }>> {
    const today = new Date().toISOString().split('T')[0];
    
    const [totalResponse, unreadResponse, repliedResponse, todayResponse] = await Promise.all([
      this.wrapSupabaseCall(supabase.from('iletisim_mesajlari').select('id', { count: 'exact' })),
      this.wrapSupabaseCall(supabase.from('iletisim_mesajlari').select('id', { count: 'exact' }).eq('okundu', false)),
      this.wrapSupabaseCall(supabase.from('iletisim_mesajlari').select('id', { count: 'exact' }).eq('yanitlandi', true)),
      this.wrapSupabaseCall(supabase.from('iletisim_mesajlari').select('id', { count: 'exact' }).gte('created_at', today))
    ]);

    return {
      data: {
        total: totalResponse.data?.length || 0,
        unread: unreadResponse.data?.length || 0,
        replied: repliedResponse.data?.length || 0,
        today: todayResponse.data?.length || 0,
      },
      error: totalResponse.error || unreadResponse.error || repliedResponse.error || todayResponse.error,
    };
  }
}

export const iletisimService = new IletisimService();