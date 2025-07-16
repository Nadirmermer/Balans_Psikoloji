import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import { BlogYazi } from '../lib/supabase';

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
      const response = await blogService.getAll();

      if (response.error) throw response.error;
      setBlogYazilar(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getBlogYaziBySlug = (slug: string) => {
    return blogYazilar.find(yazi => yazi.slug === slug);
  };

  const getBlogYazilarByCategory = (kategori: string) => {
    return blogYazilar.filter(yazi => yazi.kategori === kategori);
  };

  const getBlogYazilarByAuthor = (yazarId: string) => {
    return blogYazilar.filter(yazi => yazi.yazar_id === yazarId);
  };

  const searchBlogYazilar = async (query: string) => {
    try {
      setLoading(true);
      const response = await blogService.search(query);

      if (response.error) throw response.error;
      setBlogYazilar(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Arama sırasında hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return {
    blogYazilar,
    loading,
    error,
    getBlogYaziBySlug,
    getBlogYazilarByCategory,
    getBlogYazilarByAuthor,
    searchBlogYazilar,
    refetch: fetchBlogYazilar
  };
};