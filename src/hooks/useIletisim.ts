import { useState } from 'react';
import { iletisimService } from '../services/iletisimService';
import { IletisimMesaji } from '../lib/supabase';

export const useIletisim = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (mesajData: Omit<IletisimMesaji, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iletisimService.create(mesajData);
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mesaj gönderilirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getAllMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iletisimService.getAll();
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mesajlar yüklenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getUnreadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iletisimService.getUnread();
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Okunmamış mesajlar yüklenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getMessagesByEmail = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iletisimService.getByEmail(email);
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'E-posta mesajları yüklenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iletisimService.markAsRead(id);
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mesaj okundu olarak işaretlenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iletisimService.markAsReplied(id);
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mesaj yanıtlandı olarak işaretlenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iletisimService.delete(id);
      
      if (response.error) throw response.error;
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Mesaj silinirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await iletisimService.getStats();
      
      if (response.error) throw response.error;
      
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'İstatistikler yüklenirken hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendMessage,
    getAllMessages,
    getUnreadMessages,
    getMessagesByEmail,
    markAsRead,
    markAsReplied,
    deleteMessage,
    getStats,
    clearError: () => setError(null)
  };
};