import { useState, useEffect } from 'react';
import { Uzman } from '../lib/supabase';
import { uzmanService } from '../services/uzmanService';

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
      setError(null);
      
      const response = await uzmanService.getAll();
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      setUzmanlar(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Uzmanlar yüklenirken hata oluştu');
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