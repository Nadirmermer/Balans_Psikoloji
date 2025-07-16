import React, { useState, useEffect } from 'react';
import { Settings, Save, Globe, Mail, Bell, Shield, Database } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import FormField from '../Common/FormField';
import LoadingSpinner from '../Common/LoadingSpinner';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../lib/auth';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  working_hours: string;
  email_notifications: boolean;
  sms_notifications: boolean;
  appointment_reminders: boolean;
  maintenance_mode: boolean;
  allow_registration: boolean;
  require_email_verification: boolean;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: 'Balans Psikoloji',
    site_description: 'Ruh sağlığınız için güvenilir destek',
    contact_email: 'info@balanspsikoloji.com',
    contact_phone: '0374 215 65 43',
    address: 'Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu',
    working_hours: 'Pazartesi - Cuma: 09:00 - 18:00, Cumartesi: 09:00 - 15:00',
    email_notifications: true,
    sms_notifications: false,
    appointment_reminders: true,
    maintenance_mode: false,
    allow_registration: true,
    require_email_verification: false
  });

  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.hasRole('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      if (data) {
        const settingsObj: Record<string, string | number | boolean> = {};
        data.forEach(setting => {
          try {
            settingsObj[setting.key] = JSON.parse(setting.value);
          } catch {
            settingsObj[setting.key] = setting.value;
          }
        });
        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'Genel Ayarlar', icon: Settings },
    { id: 'contact', name: 'İletişim Bilgileri', icon: Mail },
    { id: 'notifications', name: 'Bildirimler', icon: Bell },
    { id: 'security', name: 'Güvenlik', icon: Shield },
    { id: 'system', name: 'Sistem', icon: Database }
  ];

  const handleSettingChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!isAdmin) return;

    setSaving(true);
    try {
      // Her ayarı ayrı ayrı kaydet
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
        updated_by: currentUser?.id,
        updated_at: new Date().toISOString()
      }));

      // Önce mevcut ayarları sil
      await supabase.from('site_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Yeni ayarları ekle
      const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;

      alert('Ayarlar başarıyla kaydedildi');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Ayarlar yükleniyor..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Sistem Ayarları"
        description="Site ayarlarını yönetin ve güncelleyin"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center"
          >
            {saving ? <LoadingSpinner size="sm" className="mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sage-100 dark:bg-sage-900 text-sage-700 dark:text-sage-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-3" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Globe className="w-5 h-5 text-sage-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Genel Ayarlar
                  </h3>
                </div>
                
                <FormField label="Site Adı">
                  <input
                    type="text"
                    value={settings.site_name}
                    onChange={(e) => handleSettingChange('site_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Balans Psikoloji"
                  />
                </FormField>

                <FormField label="Site Açıklaması">
                  <textarea
                    value={settings.site_description}
                    onChange={(e) => handleSettingChange('site_description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Ruh sağlığınız için güvenilir destek"
                  />
                </FormField>

                <FormField label="Çalışma Saatleri">
                  <input
                    type="text"
                    value={settings.working_hours}
                    onChange={(e) => handleSettingChange('working_hours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Pazartesi - Cuma: 09:00 - 18:00"
                  />
                </FormField>
              </div>
            )}

            {/* Contact Settings */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Mail className="w-5 h-5 text-sage-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    İletişim Bilgileri
                  </h3>
                </div>
                
                <FormField label="E-posta Adresi">
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleSettingChange('contact_email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="info@balanspsikoloji.com"
                  />
                </FormField>

                <FormField label="Telefon Numarası">
                  <input
                    type="tel"
                    value={settings.contact_phone}
                    onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0374 215 65 43"
                  />
                </FormField>

                <FormField label="Adres">
                  <textarea
                    value={settings.address}
                    onChange={(e) => handleSettingChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu"
                  />
                </FormField>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Bell className="w-5 h-5 text-sage-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Bildirim Ayarları
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <FormField label="E-posta Bildirimleri">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.email_notifications}
                        onChange={(e) => handleSettingChange('email_notifications', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">E-posta bildirimlerini etkinleştir</span>
                    </label>
                  </FormField>

                  <FormField label="SMS Bildirimleri">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.sms_notifications}
                        onChange={(e) => handleSettingChange('sms_notifications', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">SMS bildirimlerini etkinleştir</span>
                    </label>
                  </FormField>

                  <FormField label="Randevu Hatırlatmaları">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.appointment_reminders}
                        onChange={(e) => handleSettingChange('appointment_reminders', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Randevu hatırlatmalarını etkinleştir</span>
                    </label>
                  </FormField>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Shield className="w-5 h-5 text-sage-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Güvenlik Ayarları
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <FormField label="Kayıt Olma">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.allow_registration}
                        onChange={(e) => handleSettingChange('allow_registration', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Yeni kullanıcı kaydına izin ver</span>
                    </label>
                  </FormField>

                  <FormField label="E-posta Doğrulama">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.require_email_verification}
                        onChange={(e) => handleSettingChange('require_email_verification', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">E-posta doğrulaması zorunlu</span>
                    </label>
                  </FormField>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
                    Güvenlik Önerileri
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                    <li>• Güçlü şifreler kullanın</li>
                    <li>• Düzenli olarak şifrelerinizi değiştirin</li>
                    <li>• İki faktörlü kimlik doğrulamayı etkinleştirin</li>
                    <li>• Sistem güncellemelerini takip edin</li>
                  </ul>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <Database className="w-5 h-5 text-sage-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Sistem Ayarları
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <FormField label="Bakım Modu">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.maintenance_mode}
                        onChange={(e) => handleSettingChange('maintenance_mode', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-sage-600 focus:ring-sage-500"
                      />
                      <span className="text-gray-700 dark:text-gray-300">Bakım modunu etkinleştir</span>
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Bakım modu etkinleştirildiğinde site ziyaretçilere kapalı olur
                    </p>
                  </FormField>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Sistem Bilgileri
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Versiyon:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">1.0.0</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Son Güncelleme:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">16 Ocak 2025</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Veritabanı:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">PostgreSQL</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Sunucu:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">Supabase</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Ayarlar Hakkında
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Bu sayfada yaptığınız değişiklikler tüm site genelinde etkili olur. 
                    Ayarları kaydettikten sonra değişikliklerin yansıması için sayfayı yenileyin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;