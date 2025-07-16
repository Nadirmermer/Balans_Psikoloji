import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, MoreHorizontal, Upload, User, Key } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import DataTable, { Column } from '../Common/DataTable';
import Modal from '../Common/Modal';
import FormField from '../Common/FormField';
import LoadingSpinner from '../Common/LoadingSpinner';
import ImageUpload from '../Common/ImageUpload';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../lib/auth';

interface Expert {
  id: string;
  ad: string;
  soyad: string;
  unvan: string;
  uzmanlik_alanlari: string[];
  deneyim_yili: number;
  email: string;
  telefon: string;
  slug: string;
  aktif: boolean;
  has_admin_account: boolean;
  created_at: string;
}

const ExpertsManagement: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [userFormData, setUserFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    unvan: '',
    uzmanlik_alanlari: [] as string[],
    deneyim_yili: 0,
    egitim: [] as any[],
    sertifikalar: [] as any[],
    email: '',
    telefon: '',
    hakkinda: '',
    profil_resmi: '',
    aktif: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = authService.hasRole('admin');

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const { data: expertsData, error } = await supabase
        .from('uzmanlar')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Admin hesabı olan uzmanları kontrol et
      const { data: adminUsers } = await supabase
        .from('admin_users')
        .select('uzman_id')
        .eq('role', 'uzman');

      const adminUzmanIds = adminUsers?.map(u => u.uzman_id) || [];
      
      const expertsWithAdminInfo = (expertsData || []).map(expert => ({
        ...expert,
        has_admin_account: adminUzmanIds.includes(expert.id)
      }));

      setExperts(expertsWithAdminInfo);
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Dosya adını oluştur
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `experts/${fileName}`;

      // Supabase Storage'a yükle
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        // Hata durumunda varsayılan resim döndür
        return 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';
      }

      // Public URL'i al
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      // Hata durumunda varsayılan resim döndür
      return 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop';
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

    if (!formData.ad.trim()) errors.ad = 'Ad zorunludur';
    if (!formData.soyad.trim()) errors.soyad = 'Soyad zorunludur';
    if (!formData.unvan.trim()) errors.unvan = 'Unvan zorunludur';
    if (!formData.email.trim()) errors.email = 'E-posta zorunludur';
    if (formData.uzmanlik_alanlari.length === 0) errors.uzmanlik_alanlari = 'En az bir uzmanlık alanı seçmelisiniz';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const generateSlug = (ad: string, soyad: string, unvan: string) => {
    const cleanUnvan = unvan.toLowerCase()
      .replace('dr.', 'dr')
      .replace('uzm. psk.', 'uzm-psk')
      .replace('psk.', 'psk');
    
    return `${cleanUnvan}-${ad.toLowerCase()}-${soyad.toLowerCase()}`
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let profileImageUrl = formData.profil_resmi;
      
      // Eğer yeni resim yüklendiyse
      if (imageFile) {
        profileImageUrl = await uploadImage(imageFile);
      }

      const slug = generateSlug(formData.ad, formData.soyad, formData.unvan);
      
      const expertData = {
        ...formData,
        profil_resmi: profileImageUrl,
        slug,
        uzmanlik_alanlari: formData.uzmanlik_alanlari,
        updated_at: new Date().toISOString()
      };

      if (editingExpert) {
        const { error } = await supabase
          .from('uzmanlar')
          .update(expertData)
          .eq('id', editingExpert.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('uzmanlar')
          .insert([expertData]);

        if (error) throw error;
      }

      await fetchExperts();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving expert:', error);
      setFormErrors({ submit: 'Kaydetme sırasında bir hata oluştu' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateUser = async (expert: Expert) => {
    setSelectedExpert(expert);
    setUserFormData({
      email: expert.email || '',
      password: '',
      confirmPassword: ''
    });
    setShowUserModal(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExpert) return;
    
    if (!userFormData.email || !userFormData.password) {
      setFormErrors({ userSubmit: 'E-posta ve şifre zorunludur' });
      return;
    }
    
    if (userFormData.password !== userFormData.confirmPassword) {
      setFormErrors({ userSubmit: 'Şifreler eşleşmiyor' });
      return;
    }

    setSubmitting(true);
    try {
      const hashPassword = async (password: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'balans_salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      };

      const passwordHash = await hashPassword(userFormData.password);
      
      const { error } = await supabase
        .from('admin_users')
        .insert([{
          email: userFormData.email,
          password_hash: passwordHash,
          role: 'uzman',
          uzman_id: selectedExpert.id,
          ad: selectedExpert.ad,
          soyad: selectedExpert.soyad,
          aktif: true
        }]);

      if (error) throw error;

      await fetchExperts();
      setShowUserModal(false);
      setSelectedExpert(null);
      setUserFormData({ email: '', password: '', confirmPassword: '' });
      setFormErrors({});
    } catch (error) {
      console.error('Error creating user:', error);
      setFormErrors({ userSubmit: 'Kullanıcı oluşturulurken bir hata oluştu' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (expert: Expert) => {
    setEditingExpert(expert);
    setFormData({
      ad: expert.ad,
      soyad: expert.soyad,
      unvan: expert.unvan,
      uzmanlik_alanlari: expert.uzmanlik_alanlari,
      deneyim_yili: expert.deneyim_yili,
      egitim: expert.egitim || [],
      sertifikalar: expert.sertifikalar || [],
      email: expert.email,
      telefon: expert.telefon || '',
      hakkinda: expert.hakkinda || '',
      profil_resmi: expert.profil_resmi || '',
      aktif: expert.aktif
    });
    setImagePreview(expert.profil_resmi || '');
    setShowModal(true);
  };

  const handleDelete = async (expert: Expert) => {
    if (!confirm(`${expert.ad} ${expert.soyad} uzmanını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('uzmanlar')
        .delete()
        .eq('id', expert.id);

      if (error) throw error;
      await fetchExperts();
    } catch (error) {
      console.error('Error deleting expert:', error);
      alert('Silme işlemi sırasında bir hata oluştu');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpert(null);
    setFormData({
      ad: '',
      soyad: '',
      unvan: '',
      uzmanlik_alanlari: [],
      deneyim_yili: 0,
      egitim: [],
      sertifikalar: [],
      email: '',
      telefon: '',
      hakkinda: '',
      profil_resmi: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      aktif: true
    });
    setImageFile(null);
    setImagePreview('');
    setFormErrors({});
  };

  const columns: Column<Expert>[] = [
    {
      key: 'ad',
      title: 'Ad Soyad',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {record.ad} {record.soyad}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.unvan}
          </div>
        </div>
      )
    },
    {
      key: 'uzmanlik_alanlari',
      title: 'Uzmanlık Alanları',
      render: (value) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((alan: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300 rounded-full text-xs"
            >
              {alan}
            </span>
          ))}
          {value.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{value.length - 2} daha
            </span>
          )}
        </div>
      )
    },
    {
      key: 'deneyim_yili',
      title: 'Deneyim',
      render: (value) => `${value} yıl`
    },
    {
      key: 'email',
      title: 'E-posta',
      render: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>
      )
    },
    {
      key: 'aktif',
      title: 'Durum',
      render: (value) => (
        <div className="space-y-1">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}>
            {value ? 'Aktif' : 'Pasif'}
          </span>
        </div>
      )
    },
    {
      key: 'has_admin_account',
      title: 'Admin Hesabı',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
        }`}>
          {value ? 'Var' : 'Yok'}
        </span>
      )
    }
  ];

  const renderActions = (expert: Expert) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleEdit(expert)}
        className="p-1 text-gray-400 hover:text-sage-600 dark:hover:text-sage-400"
        title="Düzenle"
      >
        <Edit className="w-4 h-4" />
      </button>
      {isAdmin && !expert.has_admin_account && (
        <button
          onClick={() => handleCreateUser(expert)}
          className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          title="Admin Hesabı Oluştur"
        >
          <User className="w-4 h-4" />
        </button>
      )}
      {isAdmin && (
        <button
          onClick={() => handleDelete(expert)}
          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const uzmanlikAlanlari = [
    'Bireysel Terapi',
    'Çift Terapisi',
    'Aile Danışmanlığı',
    'Çocuk Psikolojisi',
    'Ergen Psikolojisi',
    'Travma Terapisi',
    'EMDR',
    'Kaygı Bozuklukları',
    'Depresyon',
    'Obsesif Kompulsif Bozukluk',
    'Yeme Bozuklukları',
    'Uyku Bozuklukları',
    'Bağımlılık',
    'Mindfulness',
    'Bilişsel Davranışçı Terapi'
  ];

  return (
    <div>
      <PageHeader
        title="Uzman Yönetimi"
        description="Uzmanları görüntüleyin, düzenleyin ve yönetin"
        actions={
          isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Uzman
            </button>
          )
        }
      />

      <DataTable
        data={experts}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Uzman ara..."
        actions={renderActions}
        emptyText="Henüz uzman bulunmuyor"
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingExpert ? 'Uzman Düzenle' : 'Yeni Uzman Ekle'}
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
              {editingExpert ? 'Güncelle' : 'Kaydet'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Ad" required error={formErrors.ad}>
              <input
                type="text"
                value={formData.ad}
                onChange={(e) => handleInputChange('ad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Uzman adı"
              />
            </FormField>

            <FormField label="Soyad" required error={formErrors.soyad}>
              <input
                type="text"
                value={formData.soyad}
                onChange={(e) => handleInputChange('soyad', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Uzman soyadı"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Unvan" required error={formErrors.unvan}>
              <select
                value={formData.unvan}
                onChange={(e) => handleInputChange('unvan', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Unvan seçin</option>
                <option value="Dr. Klinik Psikolog">Dr. Klinik Psikolog</option>
                <option value="Uzm. Psk.">Uzm. Psk.</option>
                <option value="Psikolog">Psikolog</option>
                <option value="Psk. Dan.">Psk. Dan.</option>
              </select>
            </FormField>

            <FormField label="Deneyim Yılı" error={formErrors.deneyim_yili}>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.deneyim_yili}
                onChange={(e) => handleInputChange('deneyim_yili', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="E-posta" required error={formErrors.email}>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="ornek@balanspsikoloji.com"
              />
            </FormField>

            <FormField label="Telefon" error={formErrors.telefon}>
              <input
                type="tel"
                value={formData.telefon}
                onChange={(e) => handleInputChange('telefon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0374 215 65 43"
              />
            </FormField>
          </div>

          <FormField label="Profil Resmi">
            <ImageUpload
                value={formData.profil_resmi}
                onChange={(e) => handleInputChange('profil_resmi', e.target.value)}
                label="Profil Resmi"
                maxSize={5}
              />
          </FormField>

          <FormField label="Hakkında">
            <textarea
              value={formData.hakkinda}
              onChange={(e) => handleInputChange('hakkinda', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Uzman hakkında bilgi"
            />
          </FormField>

          <FormField label="Eğitim Bilgileri">
            <div className="space-y-3">
              {formData.egitim.map((edu, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={edu.derece || ''}
                      onChange={(e) => {
                        const newEgitim = [...formData.egitim];
                        newEgitim[index] = { ...newEgitim[index], derece: e.target.value };
                        handleInputChange('egitim', newEgitim);
                      }}
                      placeholder="Derece (örn: Lisans)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={edu.okul || ''}
                      onChange={(e) => {
                        const newEgitim = [...formData.egitim];
                        newEgitim[index] = { ...newEgitim[index], okul: e.target.value };
                        handleInputChange('egitim', newEgitim);
                      }}
                      placeholder="Okul"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newEgitim = formData.egitim.filter((_, i) => i !== index);
                      handleInputChange('egitim', newEgitim);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  handleInputChange('egitim', [...formData.egitim, { derece: '', okul: '' }]);
                }}
                className="text-sage-600 hover:text-sage-700 text-sm"
              >
                + Eğitim Ekle
              </button>
            </div>
          </FormField>

          <FormField label="Sertifikalar">
            <div className="space-y-3">
              {formData.sertifikalar.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cert.ad || ''}
                      onChange={(e) => {
                        const newSertifikalar = [...formData.sertifikalar];
                        newSertifikalar[index] = { ...newSertifikalar[index], ad: e.target.value };
                        handleInputChange('sertifikalar', newSertifikalar);
                      }}
                      placeholder="Sertifika Adı"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cert.kurum || ''}
                      onChange={(e) => {
                        const newSertifikalar = [...formData.sertifikalar];
                        newSertifikalar[index] = { ...newSertifikalar[index], kurum: e.target.value };
                        handleInputChange('sertifikalar', newSertifikalar);
                      }}
                      placeholder="Kurum"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSertifikalar = formData.sertifikalar.filter((_, i) => i !== index);
                      handleInputChange('sertifikalar', newSertifikalar);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  handleInputChange('sertifikalar', [...formData.sertifikalar, { ad: '', kurum: '' }]);
                }}
                className="text-sage-600 hover:text-sage-700 text-sm"
              >
                + Sertifika Ekle
              </button>
            </div>
          </FormField>
          <FormField label="Eğitim Bilgileri">
            <div className="space-y-3">
              {formData.egitim.map((edu, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={edu.derece || ''}
                      onChange={(e) => {
                        const newEgitim = [...formData.egitim];
                        newEgitim[index] = { ...newEgitim[index], derece: e.target.value };
                        handleInputChange('egitim', newEgitim);
                      }}
                      placeholder="Derece (örn: Lisans)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={edu.okul || ''}
                      onChange={(e) => {
                        const newEgitim = [...formData.egitim];
                        newEgitim[index] = { ...newEgitim[index], okul: e.target.value };
                        handleInputChange('egitim', newEgitim);
                      }}
                      placeholder="Okul"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newEgitim = formData.egitim.filter((_, i) => i !== index);
                      handleInputChange('egitim', newEgitim);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  handleInputChange('egitim', [...formData.egitim, { derece: '', okul: '' }]);
                }}
                className="text-sage-600 hover:text-sage-700 text-sm"
              >
                + Eğitim Ekle
              </button>
            </div>
          </FormField>

          <FormField label="Sertifikalar">
            <div className="space-y-3">
              {formData.sertifikalar.map((cert, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cert.ad || ''}
                      onChange={(e) => {
                        const newSertifikalar = [...formData.sertifikalar];
                        newSertifikalar[index] = { ...newSertifikalar[index], ad: e.target.value };
                        handleInputChange('sertifikalar', newSertifikalar);
                      }}
                      placeholder="Sertifika Adı"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={cert.kurum || ''}
                      onChange={(e) => {
                        const newSertifikalar = [...formData.sertifikalar];
                        newSertifikalar[index] = { ...newSertifikalar[index], kurum: e.target.value };
                        handleInputChange('sertifikalar', newSertifikalar);
                      }}
                      placeholder="Kurum"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSertifikalar = formData.sertifikalar.filter((_, i) => i !== index);
                      handleInputChange('sertifikalar', newSertifikalar);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  handleInputChange('sertifikalar', [...formData.sertifikalar, { ad: '', kurum: '' }]);
                }}
                className="text-sage-600 hover:text-sage-700 text-sm"
              >
                + Sertifika Ekle
              </button>
            </div>
          </FormField>

          <FormField 
            label="Uzmanlık Alanları" 
            required 
            error={formErrors.uzmanlik_alanlari}
            description="Uzmanın çalıştığı alanları seçin"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
              {uzmanlikAlanlari.map((alan) => (
                <label key={alan} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.uzmanlik_alanlari.includes(alan)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('uzmanlik_alanlari', [...formData.uzmanlik_alanlari, alan]);
                      } else {
                        handleInputChange('uzmanlik_alanlari', formData.uzmanlik_alanlari.filter(a => a !== alan));
                      }
                    }}
                    className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">{alan}</span>
                </label>
              ))}
            </div>
          </FormField>

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

      {/* Create User Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Admin Hesabı Oluştur"
        size="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowUserModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-lg transition-colors"
            >
              İptal
            </button>
            <button
              onClick={handleUserSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              {submitting && <LoadingSpinner size="sm" className="mr-2" />}
              Hesap Oluştur
            </button>
          </>
        }
      >
        {selectedExpert && (
          <form onSubmit={handleUserSubmit} className="space-y-6">
            {formErrors.userSubmit && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <span className="text-red-700 dark:text-red-400 text-sm">{formErrors.userSubmit}</span>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>{selectedExpert.ad} {selectedExpert.soyad}</strong> için admin hesabı oluşturuyorsunuz.
              </p>
            </div>

            <FormField label="E-posta" required>
              <input
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="ornek@balanspsikoloji.com"
              />
            </FormField>

            <FormField label="Şifre" required>
              <input
                type="password"
                value={userFormData.password}
                onChange={(e) => setUserFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Güvenli bir şifre girin"
              />
            </FormField>

            <FormField label="Şifre Tekrarı" required>
              <input
                type="password"
                value={userFormData.confirmPassword}
                onChange={(e) => setUserFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Şifreyi tekrar girin"
              />
            </FormField>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ExpertsManagement;