import { useState, useEffect } from 'react';
import { hizmetService } from '../services/hizmetService';
import { Hizmet } from '../lib/supabase';

export const useHizmetler = () => {
  const [hizmetler, setHizmetler] = useState<Hizmet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHizmetler();
  }, []);

  const fetchHizmetler = async () => {
    try {
      setLoading(true);
      const response = await hizmetService.getAll();

      if (response.error) throw response.error;
      setHizmetler(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getHizmetBySlug = (slug: string) => {
    return hizmetler.find(hizmet => hizmet.slug === slug);
  };

  const getHizmetlerByCategory = (kategori: string) => {
    return hizmetler.filter(hizmet => hizmet.kategori === kategori);
  };

  return {
    hizmetler,
    loading,
    error,
    getHizmetBySlug,
    getHizmetlerByCategory,
    refetch: fetchHizmetler
  };
};