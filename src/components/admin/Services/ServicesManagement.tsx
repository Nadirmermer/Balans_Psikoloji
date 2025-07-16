import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import DataTable, { Column } from '../Common/DataTable';
import Modal from '../Common/Modal';
import FormField from '../Common/FormField';
import LoadingSpinner from '../Common/LoadingSpinner';
import RichTextEditor from '../Common/RichTextEditor';
import ImageUpload from '../Common/ImageUpload';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../lib/auth';

interface Service {
  id: string;
  ad: string;
  aciklama: string;
  detay: string;
  fiyat: number;
  sure_dakika: number;
  resim: string;
  slug: string;
  aktif: boolean;
  created_at: string;
}

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    ad: '',
    aciklama: '',
    detay: '',
    fiyat: 0,
    sure_dakika: 50,
    resim: '',
    aktif: true
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = authService.hasRole('admin');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hizmetler')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
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

    if (!formData.ad.trim()) errors.ad = 'Hizmet adı zorunludur';
    if (!formData.aciklama.trim()) errors.aciklama = 'Açıklama zorunludur';
    if (formData.fiyat <= 0) errors.fiyat = 'Fiyat 0\'dan büyük olmalıdır';
    if (formData.sure_dakika <= 0) errors.sure_dakika = 'Süre 0\'dan büyük olmalıdır';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateSlug = (ad: string) => {
    return ad.toLowerCase()
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
      const slug = generateSlug(formData.ad);
      
      const serviceData = {
        ...formData,
        slug
      };

      if (editingService) {
        const { error } = await supabase
          .from('hizmetler')
          .update(serviceData)
          .eq('id', editingService.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hizmetler')
          .insert([serviceData]);

        if (error) throw error;
      }

      await fetchServices();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
      setFormErrors({ submit: 'Kaydetme sırasında bir hata oluştu' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      ad: service.ad,
      aciklama: service.aciklama,
      detay: service.detay || '',
      fiyat: service.fiyat,
      sure_dakika: service.sure_dakika,
      resim: service.resim || '',
      aktif: service.aktif
    });
    setShowModal(true);
  };

  const handleDelete = async (service: Service) => {
    if (!confirm(`${service.ad} hizmetini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('hizmetler')
        .delete()
        .eq('id', service.id);

      if (error) throw error;
      await fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Silme işlemi sırasında bir hata oluştu');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      ad: '',
      aciklama: '',
      detay: '',
      fiyat: 0,
      sure_dakika: 50,
      resim: '',
      aktif: true
    });
    setFormErrors({});
  };

  const columns: Column<Service>[] = [
    {
      key: 'ad',
      title: 'Hizmet Adı',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {record.ad}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {record.aciklama}
          </div>
        </div>
      )
    },
    {
      key: 'fiyat',
      title: 'Fiyat',
      render: (value) => (
        <span className="font-medium text-warmth-600 dark:text-warmth-400">
          {value} ₺
        </span>
      )
    },
    {
      key: 'sure_dakika',
      title: 'Süre',
      render: (value) => `${value} dk`
    },
    {
      key: 'aktif',
      title: 'Durum',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
        }`}>
          {value ? 'Aktif' : 'Pasif'}
        </span>
      )
    }
  ];

  const renderActions = (service: Service) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleEdit(service)}
        className="p-1 text-gray-400 hover:text-sage-600 dark:hover:text-sage-400"
        title="Düzenle"
      >
        <Edit className="w-4 h-4" />
      </button>
      {isAdmin && (
        <button
          onClick={() => handleDelete(service)}
          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Hizmet Yönetimi"
        description="Hizmetleri görüntüleyin, düzenleyin ve yönetin"
        actions={
          isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Hizmet
            </button>
          )
        }
      />

      <DataTable
        data={services}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Hizmet ara..."
        actions={renderActions}
        emptyText="Henüz hizmet bulunmuyor"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingService ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
        size="lg"
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
              {editingService ? 'Güncelle' : 'Kaydet'}
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

          <FormField label="Hizmet Adı" required error={formErrors.ad}>
            <input
              type="text"
              value={formData.ad}
              onChange={(e) => handleInputChange('ad', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Örn: Bireysel Terapi"
            />
          </FormField>

          <FormField label="Kısa Açıklama" required error={formErrors.aciklama}>
            <textarea
              value={formData.aciklama}
              onChange={(e) => handleInputChange('aciklama', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Hizmet hakkında kısa açıklama"
            />
          </FormField>

          <FormField label="Detaylı Açıklama" error={formErrors.detay}>
            <RichTextEditor
              value={formData.detay}
              onChange={(e) => handleInputChange('detay', e.target.value)}
              placeholder="Hizmet hakkında detaylı bilgi"
              height="250px"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Fiyat (₺)" required error={formErrors.fiyat}>
              <input
                type="number"
                min="0"
                value={formData.fiyat}
                onChange={(e) => handleInputChange('fiyat', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="400"
              />
            </FormField>

            <FormField label="Süre (Dakika)" required error={formErrors.sure_dakika}>
              <input
                type="number"
                min="0"
                value={formData.sure_dakika}
                onChange={(e) => handleInputChange('sure_dakika', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="50"
              />
            </FormField>
          </div>

          <ImageUpload
            value={formData.resim}
            onChange={(e) => handleInputChange('resim', e.target.value)}
            label="Hizmet Resmi"
            maxSize={8}
          />

          <FormField label="Durum">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.aktif}
                onChange={(e) => handleInputChange('aktif', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Aktif</span>
            </label>
          </FormField>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesManagement;