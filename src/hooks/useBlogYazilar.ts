import { useState, useEffect } from 'react';
import { supabase, BlogYazi } from '../lib/supabase';

export const useBlogYazilar = () => {
  const [blogYazilar, setBlogYazilar] = useState<BlogYazi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogYazilar();
  }, []);

  const fetchBlogYazilar = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_yazilar')
        .select(`
          *,
          yazar:uzmanlar(*)
        `)
        .eq('yayinlandi', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogYazilar(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu');
    } finally {
      setLoading(false);
    }
  };

  const getBlogYaziBySlug = (slug: string) => {
    return blogYazilar.find(yazi => yazi.slug === slug);
  };

  const getBlogYazilarByKategori = (kategori: string) => {
    return blogYazilar.filter(yazi => yazi.kategori === kategori);
  };

  const getBlogYazilarByYazar = (yazarId: string) => {
    return blogYazilar.filter(yazi => yazi.yazar_id === yazarId);
  };

  return {
    blogYazilar,
    loading,
    error,
    getBlogYaziBySlug,
    getBlogYazilarByKategori,
    getBlogYazilarByYazar,
    refetch: fetchBlogYazilar
  };
};