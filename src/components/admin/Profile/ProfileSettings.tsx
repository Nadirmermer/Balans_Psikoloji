import React, { useState, useEffect } from 'react';
import { User, Key, Save } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import FormField from '../Common/FormField';
import LoadingSpinner from '../Common/LoadingSpinner';
import ImageUpload from '../Common/ImageUpload';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../lib/auth';

interface ExpertData {
  id: string;
  ad: string;
  soyad: string;
  unvan: string;
  uzmanlik_alanlari: string[];
  deneyim_yili: number;
  egitim: Array<{ degree?: string; derece?: string; school?: string; okul?: string; year?: string; yil?: string; details?: string; detay?: string }>;
  sertifikalar: Array<{ name?: string; ad?: string; organization?: string; kurum?: string; year?: string; yil?: string; level?: string; seviye?: string }>;
  hakkinda: string;
  profil_resmi: string;
  email: string;
  telefon: string;
}
const ProfileSettings: React.FC = () => {
  const [profileData, setProfileData] = useState({
    ad: '',
    soyad: '',
    email: '',
    telefon: ''
  });
  const [expertData, setExpertData] = useState<ExpertData | null>(null);
  const [expertFormData, setExpertFormData] = useState({
    unvan: '',
    uzmanlik_alanlari: [] as string[],
    deneyim_yili: 0,
    egitim: [] as Array<{ degree?: string; derece?: string; school?: string; okul?: string; year?: string; yil?: string; details?: string; detay?: string }>,
    sertifikalar: [] as Array<{ name?: string; ad?: string; organization?: string; kurum?: string; year?: string; yil?: string; level?: string; seviye?: string }>,
    hakkinda: '',
    profil_resmi: '',
    telefon: '',
    calisma_saatleri: {} as Record<string, { aktif: boolean; baslangic: string; bitis: string }>
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.hasRole('admin');

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        ad: currentUser.ad,
        soyad: currentUser.soyad,
        email: currentUser.email,
        telefon: currentUser.telefon || ''
      });
      
      // Eğer uzman ise, uzman bilgilerini de getir
      if (!isAdmin && currentUser.uzman_id) {
        fetchExpertData(currentUser.uzman_id);
      }
      setLoading(false);
    }
  }, [currentUser, isAdmin]);

  const fetchExpertData = async (uzmanId: string) => {
    try {
      const { data, error } = await supabase
        .from('uzmanlar')
        .select('*')
        .eq('id', uzmanId)
        .single();

      if (error) throw error;
      
      setExpertData(data);
      setExpertFormData({
        unvan: data.unvan || '',
        uzmanlik_alanlari: data.uzmanlik_alanlari || [],
        deneyim_yili: data.deneyim_yili || 0,
        egitim: data.egitim || [],
        sertifikalar: data.sertifikalar || [],
        hakkinda: data.hakkinda || '',
        profil_resmi: data.profil_resmi || '',
        telefon: data.telefon || ''
      });
    } catch (error) {
      console.error('Error fetching expert data:', error);
    }
  };
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleExpertChange = (field: string, value: string | number | boolean | string[] | Array<{ degree?: string; derece?: string; school?: string; okul?: string; year?: string; yil?: string; details?: string; detay?: string }> | Array<{ name?: string; ad?: string; organization?: string; kurum?: string; year?: string; yil?: string; level?: string; seviye?: string }> | Record<string, { aktif: boolean; baslangic: string; bitis: string }>) => {
    setExpertFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    if (!profileData.ad.trim()) errors.ad = 'Ad zorunludur';
    if (!profileData.soyad.trim()) errors.soyad = 'Soyad zorunludur';
    if (!profileData.email.trim()) errors.email = 'E-posta zorunludur';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleExpertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expertData || !currentUser) return;

    setSubmitting(true);
    setSuccessMessage('');
    
    try {
      const { error } = await supabase
        .from('uzmanlar')
        .update({
          ...expertFormData,
          updated_at: new Date().toISOString()
        })
        .eq('id', expertData.id);

      if (error) throw error;

      setSuccessMessage('Uzman bilgileri başarıyla güncellendi');
      
    } catch (error) {
      console.error('Error updating expert data:', error);
      setFormErrors({ submit: 'Uzman bilgileri güncellenirken bir hata oluştu' });
    } finally {
      setSubmitting(false);
    }
  };
  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword.trim()) errors.currentPassword = 'Mevcut şifre zorunludur';
    if (!passwordData.newPassword.trim()) errors.newPassword = 'Yeni şifre zorunludur';
    if (passwordData.newPassword.length < 6) errors.newPassword = 'Şifre en az 6 karakter olmalıdır';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'balans_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm() || !currentUser) return;

    setSubmitting(true);
    setSuccessMessage('');
    
    try {
      const { error } = await supabase
        .from('admin_users')
        .update({
          ad: profileData.ad,
          soyad: profileData.soyad,
          email: profileData.email,
          telefon: profileData.telefon,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      // Eğer uzman ise uzmanlar tablosunu da güncelle
      if (!isAdmin && currentUser.uzman_id) {
        const { error: expertError } = await supabase
          .from('uzmanlar')
          .update({
            ad: profileData.ad,
            soyad: profileData.soyad,
            email: profileData.email,
            telefon: profileData.telefon,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentUser.uzman_id);

        if (expertError) throw expertError;
      }
      setSuccessMessage('Profil bilgileri başarıyla güncellendi');
      
      // Auth service'teki kullanıcı bilgilerini güncelle
      // Bu gerçek uygulamada token'ı yeniden doğrulamak gerekebilir
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setFormErrors({ submit: 'Profil güncellenirken bir hata oluştu' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm() || !currentUser) return;

    setPasswordSubmitting(true);
    setSuccessMessage('');
    
    try {
      // Mevcut şifreyi doğrula
      const currentPasswordHash = await hashPassword(passwordData.currentPassword);
      const { data: user, error: verifyError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', currentUser.id)
        .eq('password_hash', currentPasswordHash)
        .single();

      if (verifyError || !user) {
        setFormErrors({ currentPassword: 'Mevcut şifre yanlış' });
        return;
      }

      // Yeni şifreyi güncelle
      const newPasswordHash = await hashPassword(passwordData.newPassword);
      const { error } = await supabase
        .from('admin_users')
        .update({ 
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      setSuccessMessage('Şifre başarıyla güncellendi');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      console.error('Error updating password:', error);
      setFormErrors({ submit: 'Şifre güncellenirken bir hata oluştu' });
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Profil bilgileri yükleniyor..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Profil Ayarları"
        description="Kişisel bilgilerinizi ve şifrenizi güncelleyin"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-sage-100 dark:bg-sage-900/30 rounded-full flex items-center justify-center mr-4">
              <User className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Profil Bilgileri
            </h2>
          </div>

          {successMessage && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
              <span className="text-green-700 dark:text-green-400 text-sm">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {formErrors.submit && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <span className="text-red-700 dark:text-red-400 text-sm">{formErrors.submit}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Ad" required error={formErrors.ad}>
                <input
                  type="text"
                  value={profileData.ad}
                  onChange={(e) => handleProfileChange('ad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Adınız"
                />
              </FormField>

              <FormField label="Soyad" required error={formErrors.soyad}>
                <input
                  type="text"
                  value={profileData.soyad}
                  onChange={(e) => handleProfileChange('soyad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Soyadınız"
                />
              </FormField>
            </div>

            <FormField label="E-posta" required error={formErrors.email}>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="ornek@balanspsikoloji.com"
              />
            </FormField>

            <FormField label="Telefon" error={formErrors.telefon}>
              <input
                type="tel"
                value={profileData.telefon}
                onChange={(e) => handleProfileChange('telefon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="0374 215 65 43"
              />
            </FormField>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {submitting && <LoadingSpinner size="sm" className="mr-2" />}
              <Save className="w-4 h-4 mr-2" />
              Profili Güncelle
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
              <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Şifre Değiştir
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <FormField label="Mevcut Şifre" required error={formErrors.currentPassword}>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Mevcut şifrenizi girin"
              />
            </FormField>

            <FormField label="Yeni Şifre" required error={formErrors.newPassword}>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Yeni şifrenizi girin"
              />
            </FormField>

            <FormField label="Şifre Tekrarı" required error={formErrors.confirmPassword}>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Yeni şifrenizi tekrar girin"
              />
            </FormField>

            <button
              type="submit"
              disabled={passwordSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {passwordSubmitting && <LoadingSpinner size="sm" className="mr-2" />}
              <Key className="w-4 h-4 mr-2" />
              Şifreyi Güncelle
            </button>
          </form>
        </div>
      </div>

      {/* Expert Information - Only for non-admin users */}
      {!isAdmin && expertData && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-warmth-100 dark:bg-warmth-900/30 rounded-full flex items-center justify-center mr-4">
              <User className="w-5 h-5 text-warmth-600 dark:text-warmth-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Uzman Bilgileri
            </h2>
          </div>

          <form onSubmit={handleExpertSubmit} className="space-y-6">
            {/* Profil Resmi */}
            <FormField label="Profil Resmi">
              <ImageUpload
                  value={expertFormData.profil_resmi}
                  onChange={(url) => handleExpertChange('profil_resmi', url)}
                  label="Profil Resmi"
                  maxSize={5}
                />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Unvan">
                <select
                  value={expertFormData.unvan}
                  onChange={(e) => handleExpertChange('unvan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Unvan seçin</option>
                  <option value="Dr. Klinik Psikolog">Dr. Klinik Psikolog</option>
                  <option value="Uzm. Psk.">Uzm. Psk.</option>
                  <option value="Psikolog">Psikolog</option>
                  <option value="Psk. Dan.">Psk. Dan.</option>
                </select>
              </FormField>

              <FormField label="Deneyim Yılı">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={expertFormData.deneyim_yili}
                  onChange={(e) => handleExpertChange('deneyim_yili', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0"
                />
              </FormField>
            </div>

            {/* Uzmanlık Alanları */}
            <FormField label="Uzmanlık Alanları">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
                {['Bireysel Terapi', 'Çift Terapisi', 'Aile Danışmanlığı', 'Çocuk Psikolojisi', 'Ergen Psikolojisi', 'Travma Terapisi', 'EMDR', 'Kaygı Bozuklukları', 'Depresyon', 'Obsesif Kompulsif Bozukluk', 'Yeme Bozuklukları', 'Uyku Bozuklukları', 'Bağımlılık', 'Mindfulness', 'Bilişsel Davranışçı Terapi'].map((alan) => (
                  <label key={alan} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={expertFormData.uzmanlik_alanlari.includes(alan)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleExpertChange('uzmanlik_alanlari', [...expertFormData.uzmanlik_alanlari, alan]);
                        } else {
                          handleExpertChange('uzmanlik_alanlari', expertFormData.uzmanlik_alanlari.filter(a => a !== alan));
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{alan}</span>
                  </label>
                ))}
              </div>
            </FormField>
            <FormField label="Hakkında">
              <textarea
                value={expertFormData.hakkinda}
                onChange={(e) => handleExpertChange('hakkinda', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Kendiniz hakkında bilgi"
              />
            </FormField>

            {/* Eğitim Bilgileri */}
            <FormField label="Eğitim Bilgileri">
              <div className="space-y-3">
                {expertFormData.egitim.map((edu, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={edu.derece || ''}
                        onChange={(e) => {
                          const newEgitim = [...expertFormData.egitim];
                          newEgitim[index] = { ...newEgitim[index], derece: e.target.value };
                          handleExpertChange('egitim', newEgitim);
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
                          const newEgitim = [...expertFormData.egitim];
                          newEgitim[index] = { ...newEgitim[index], okul: e.target.value };
                          handleExpertChange('egitim', newEgitim);
                        }}
                        placeholder="Okul"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newEgitim = expertFormData.egitim.filter((_, i) => i !== index);
                        handleExpertChange('egitim', newEgitim);
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
                    handleExpertChange('egitim', [...expertFormData.egitim, { derece: '', okul: '' }]);
                  }}
                  className="text-sage-600 hover:text-sage-700 text-sm"
                >
                  + Eğitim Ekle
                </button>
              </div>
            </FormField>

            {/* Sertifikalar */}
            <FormField label="Sertifikalar">
              <div className="space-y-3">
                {expertFormData.sertifikalar.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={cert.ad || ''}
                        onChange={(e) => {
                          const newSertifikalar = [...expertFormData.sertifikalar];
                          newSertifikalar[index] = { ...newSertifikalar[index], ad: e.target.value };
                          handleExpertChange('sertifikalar', newSertifikalar);
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
                          const newSertifikalar = [...expertFormData.sertifikalar];
                          newSertifikalar[index] = { ...newSertifikalar[index], kurum: e.target.value };
                          handleExpertChange('sertifikalar', newSertifikalar);
                        }}
                        placeholder="Kurum"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newSertifikalar = expertFormData.sertifikalar.filter((_, i) => i !== index);
                        handleExpertChange('sertifikalar', newSertifikalar);
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
                    handleExpertChange('sertifikalar', [...expertFormData.sertifikalar, { ad: '', kurum: '' }]);
                  }}
                  className="text-sage-600 hover:text-sage-700 text-sm"
                >
                  + Sertifika Ekle
                </button>
              </div>
            </FormField>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-warmth-600 hover:bg-warmth-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {submitting && <LoadingSpinner size="sm" className="mr-2" />}
              <Save className="w-4 h-4 mr-2" />
              Uzman Bilgilerini Güncelle
            </button>
          </form>
        </div>
      )}
      {/* User Info */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Hesap Bilgileri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Rol:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100 capitalize">
              {currentUser?.role}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Son Giriş:</span>
            <span className="ml-2 text-gray-900 dark:text-gray-100">
              {currentUser?.last_login 
                ? new Date(currentUser.last_login).toLocaleString('tr-TR')
                : 'Bilinmiyor'
              }
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Durum:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
              currentUser?.aktif 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}>
              {currentUser?.aktif ? 'Aktif' : 'Pasif'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;