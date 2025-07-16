import { useState } from 'react';
import { supabase, Randevu } from '../lib/supabase';

interface RandevuData {
  uzman_id: string;
  hizmet_id: string;
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  tarih: string;
  saat: string;
  tur: 'yuz_yuze' | 'online';
  mesaj?: string;
}

export const useRandevu = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRandevu = async (randevuData: RandevuData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!randevuData.uzman_id || !randevuData.hizmet_id) {
        throw new Error('Uzman ve hizmet seçimi zorunludur');
      }

      if (!randevuData.ad || !randevuData.soyad || !randevuData.email || !randevuData.telefon) {
        throw new Error('Tüm kişisel bilgiler zorunludur');
      }

      if (!randevuData.tarih || !randevuData.saat) {
        throw new Error('Tarih ve saat seçimi zorunludur');
      }

      // Prepare data for insertion
      const insertData = {
        uzman_id: randevuData.uzman_id,
        hizmet_id: randevuData.hizmet_id,
        ad: randevuData.ad.trim(),
        soyad: randevuData.soyad.trim(),
        email: randevuData.email.trim().toLowerCase(),
        telefon: randevuData.telefon.trim(),
        tarih: randevuData.tarih,
        saat: randevuData.saat,
        tur: randevuData.tur,
        mesaj: randevuData.mesaj?.trim() || null,
        durum: 'beklemede'
      };

      console.log('Inserting randevu data:', insertData);

      const { data, error } = await supabase
        .from('randevular')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Veritabanı hatası: ${error.message}`);
      }

      console.log('Randevu created successfully:', data);
      return data;
    } catch (err) {
      console.error('Create randevu error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Randevu oluşturulurken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createRandevu,
    loading,
    error
  };
};