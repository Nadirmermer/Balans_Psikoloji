import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface IletisimData {
  ad: string;
  email: string;
  konu?: string;
  mesaj: string;
}

export const useIletisim = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messageData: IletisimData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!messageData.ad || !messageData.email || !messageData.mesaj) {
        throw new Error('Ad, e-posta ve mesaj alanları zorunludur');
      }

      // Prepare data for insertion
      const insertData = {
        ad: messageData.ad.trim(),
        email: messageData.email.trim().toLowerCase(),
        konu: messageData.konu?.trim() || null,
        mesaj: messageData.mesaj.trim(),
        okundu: false
      };

      console.log('Inserting contact message:', insertData);

      const { data, error } = await supabase
        .from('iletisim_mesajlari')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Veritabanı hatası: ${error.message}`);
      }

      console.log('Message sent successfully:', data);
      return data;
    } catch (err) {
      console.error('Send message error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Mesaj gönderilirken bir hata oluştu';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading,
    error
  };
};