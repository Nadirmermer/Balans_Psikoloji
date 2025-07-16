import { useState } from 'react';
import { randevuService } from '../services/randevuService';
import { Randevu } from '../lib/supabase';

export const useRandevu = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRandevu = async (randevuData: Omit<Randevu, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await randevuService.create(randevuData);
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Randevu oluşturulurken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (uzmanId: string, tarih: string, saat: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await randevuService.checkAvailability(uzmanId, tarih, saat);
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Müsaitlik kontrolü sırasında hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAllRandevular = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await randevuService.getAll();
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Randevular yüklenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getRandevularByExpert = async (uzmanId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await randevuService.getByExpert(uzmanId);
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Uzman randevuları yüklenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateRandevu = async (id: string, updates: Partial<Randevu>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await randevuService.update(id, updates);
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Randevu güncellenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteRandevu = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await randevuService.delete(id);
      
      if (response.error) throw response.error;
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Randevu silinirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createRandevu,
    checkAvailability,
    getAllRandevular,
    getRandevularByExpert,
    updateRandevu,
    deleteRandevu,
    clearError: () => setError(null)
  };
};