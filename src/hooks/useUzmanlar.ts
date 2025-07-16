import { useState, useEffect } from 'react';
import { supabase, Uzman } from '../lib/supabase';

export const useUzmanlar = () => {
  const [uzmanlar, setUzmanlar] = useState<Uzman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUzmanlar();
  }, []);

  const fetchUzmanlar = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('uzmanlar')
        .select('*')
        .eq('aktif', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setUzmanlar(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu');
    } finally {
      setLoading(false);
    }
  };

  const getUzmanBySlug = (slug: string) => {
    return uzmanlar.find(uzman => uzman.slug === slug);
  };

  return {
    uzmanlar,
    loading,
    error,
    getUzmanBySlug,
    refetch: fetchUzmanlar
  };
};