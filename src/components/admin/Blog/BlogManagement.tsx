import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import DataTable, { Column } from '../Common/DataTable';
import Modal from '../Common/Modal';
import FormField from '../Common/FormField';
import LoadingSpinner from '../Common/LoadingSpinner';
import RichTextEditor from '../Common/RichTextEditor';
import ImageUpload from '../Common/ImageUpload';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../lib/auth';

interface BlogPost {
  id: string;
  baslik: string;
  ozet: string;
  icerik: string;
  resim: string;
  yazar_id: string;
  kategori: string;
  etiketler: string[];
  slug: string;
  yayinlandi: boolean;
  okuma_suresi: number;
  created_at: string;
  yazar?: {
    ad: string;
    soyad: string;
  };
}

interface Expert {
  id: string;
  ad: string;
  soyad: string;
}

const BlogManagement: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    baslik: '',
    ozet: '',
    icerik: '',
    resim: '',
    yazar_id: '',
    kategori: '',
    etiketler: [] as string[],
    yayinlandi: false,
    okuma_suresi: 5
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  const isAdmin = authService.hasRole('admin');
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchBlogPosts();
    fetchExperts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('blog_yazilar')
        .select(`
          *,
          yazar:uzmanlar(ad, soyad)
        `)
        .order('created_at', { ascending: false });

      // Uzmanlar sadece kendi yazılarını görebilir
      if (!isAdmin && currentUser?.uzman_id) {
        query = query.eq('yazar_id', currentUser.uzman_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBlogPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('uzmanlar')
        .select('id, ad, soyad')
        .eq('aktif', true)
        .order('ad');

      if (error) throw error;
      setExperts(data || []);
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.baslik.trim()) errors.baslik = 'Başlık zorunludur';
    if (!formData.ozet.trim()) errors.ozet = 'Özet zorunludur';
    if (!formData.icerik.trim()) errors.icerik = 'İçerik zorunludur';
    if (!formData.yazar_id) errors.yazar_id = 'Yazar seçimi zorunludur';
    if (!formData.kategori.trim()) errors.kategori = 'Kategori zorunludur';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateSlug = (baslik: string) => {
    return baslik.toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const slug = generateSlug(formData.baslik);
      
      const postData = {
        ...formData,
        slug,
        updated_at: new Date().toISOString()
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_yazilar')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_yazilar')
          .insert([postData]);

        if (error) throw error;
      }

      await fetchBlogPosts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving blog post:', error);
      setFormErrors({ submit: 'Kaydetme sırasında bir hata oluştu' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      baslik: post.baslik,
      ozet: post.ozet,
      icerik: post.icerik,
      resim: post.resim || '',
      yazar_id: post.yazar_id,
      kategori: post.kategori || '',
      etiketler: post.etiketler || [],
      yayinlandi: post.yayinlandi,
      okuma_suresi: post.okuma_suresi
    });
    setShowModal(true);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`"${post.baslik}" yazısını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_yazilar')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      await fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
      alert('Silme işlemi sırasında bir hata oluştu');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setFormData({
      baslik: '',
      ozet: '',
      icerik: '',
      resim: '',
      yazar_id: isAdmin ? '' : (currentUser?.uzman_id || ''),
      kategori: '',
      etiketler: [],
      yayinlandi: false,
      okuma_suresi: 5
    });
    setFormErrors({});
    setNewTag('');
  };

  const addTag = () => {
    if (newTag.trim() && !formData.etiketler.includes(newTag.trim())) {
      handleInputChange('etiketler', [...formData.etiketler, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('etiketler', formData.etiketler.filter(tag => tag !== tagToRemove));
  };

  const columns: Column<BlogPost>[] = [
    {
      key: 'baslik',
      title: 'Başlık',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {record.baslik}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {record.ozet}
          </div>
        </div>
      )
    },
    {
      key: 'yazar',
      title: 'Yazar',
      render: (_, record) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {record.yazar ? `${record.yazar.ad} ${record.yazar.soyad}` : 'Bilinmiyor'}
        </span>
      )
    },
    {
      key: 'kategori',
      title: 'Kategori',
      render: (value) => value ? (
        <span className="px-2 py-1 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-300 rounded-full text-xs">
          {value}
        </span>
      ) : '-'
    },
    {
      key: 'yayinlandi',
      title: 'Durum',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
        }`}>
          {value ? 'Yayınlandı' : 'Taslak'}
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'Tarih',
      render: (value) => new Date(value).toLocaleDateString('tr-TR')
    }
  ];

  const renderActions = (post: BlogPost) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleEdit(post)}
        className="p-1 text-gray-400 hover:text-sage-600 dark:hover:text-sage-400"
        title="Düzenle"
      >
        <Edit className="w-4 h-4" />
      </button>
      {(isAdmin || post.yazar_id === currentUser?.uzman_id) && (
        <button
          onClick={() => handleDelete(post)}
          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const categories = ['kaygi', 'depresyon', 'iliskiler', 'cocuk', 'ergen', 'travma', 'stres', 'genel'];

  return (
    <div>
      <PageHeader
        title="Blog Yönetimi"
        description={isAdmin ? "Tüm blog yazılarını yönetin" : "Blog yazılarınızı yönetin"}
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Yazı
          </button>
        }
      />

      <DataTable
        data={blogPosts}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Blog yazısı ara..."
        actions={renderActions}
        emptyText="Henüz blog yazısı bulunmuyor"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingPost ? 'Blog Yazısı Düzenle' : 'Yeni Blog Yazısı'}
        size="xl"
        footer={
          <>
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {submitting && <LoadingSpinner size="sm" className="mr-2" />}
              {editingPost ? 'Güncelle' : 'Kaydet'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {formErrors.submit && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <span className="text-red-700 dark:text-red-400 text-sm">{formErrors.submit}</span>
            </div>
          )}

          <FormField label="Başlık" required error={formErrors.baslik}>
            <input
              type="text"
              value={formData.baslik}
              onChange={(e) => handleInputChange('baslik', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Blog yazısının başlığı"
            />
          </FormField>

          <FormField label="Özet" required error={formErrors.ozet}>
            <textarea
              value={formData.ozet}
              onChange={(e) => handleInputChange('ozet', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Yazının kısa özeti"
            />
          </FormField>

          <FormField label="İçerik" required error={formErrors.icerik}>
            <RichTextEditor
              value={formData.icerik}
              onChange={(e) => handleInputChange('icerik', e.target.value)}
              placeholder="Yazının tam içeriği"
              height="400px"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Yazar" required error={formErrors.yazar_id}>
              <select
                value={formData.yazar_id}
                onChange={(e) => handleInputChange('yazar_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                disabled={!isAdmin}
              >
                {isAdmin ? (
                  <>
                    <option value="">Yazar seçin</option>
                    {experts.map((expert) => (
                      <option key={expert.id} value={expert.id}>
                        {expert.ad} {expert.soyad}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value={currentUser?.uzman_id || ''}>
                    {currentUser?.ad} {currentUser?.soyad}
                  </option>
                )}
              </select>
            </FormField>

            <FormField label="Kategori" required error={formErrors.kategori}>
              <select
                value={formData.kategori}
                onChange={(e) => handleInputChange('kategori', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Kategori seçin</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <ImageUpload
                value={formData.resim}
                onChange={(url) => handleInputChange('resim', url)}
                label="Blog Resmi"
                maxSize={10}
              />
            </div>

            <FormField label="Okuma Süresi (Dakika)" error={formErrors.okuma_suresi}>
              <input
                type="number"
                min="1"
                value={formData.okuma_suresi}
                onChange={(e) => handleInputChange('okuma_suresi', parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="5"
              />
            </FormField>
          </div>

          <FormField label="Etiketler">
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Etiket ekle"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-sage-600 text-white rounded-lg hover:bg-sage-700 transition-colors"
                >
                  Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.etiketler.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-sage-500 hover:text-sage-700 dark:hover:text-sage-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </FormField>

          <FormField label="Durum">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.yayinlandi}
                onChange={(e) => handleInputChange('yayinlandi', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Yayınla</span>
            </label>
          </FormField>
        </form>
      </Modal>
    </div>
  );
};

export default BlogManagement;