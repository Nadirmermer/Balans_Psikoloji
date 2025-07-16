import { useState, useEffect } from 'react';
import { supabase, Hizmet } from '../lib/supabase';

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
      const { data, error } = await supabase
        .from('hizmetler')
        .select('*')
        .eq('aktif', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setHizmetler(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu');
    } finally {
      setLoading(false);
    }
  };

  const getHizmetBySlug = (slug: string) => {
    return hizmetler.find(hizmet => hizmet.slug === slug);
  };

  return {
    hizmetler,
    loading,
    error,
    getHizmetBySlug,
    refetch: fetchHizmetler
  };
};