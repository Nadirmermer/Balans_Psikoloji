import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

const defaultSettings: SiteSettings = {
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
};

export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;

      if (data && data.length > 0) {
        const settingsObj: any = { ...defaultSettings };
        data.forEach(setting => {
          try {
            settingsObj[setting.key] = JSON.parse(setting.value);
          } catch {
            settingsObj[setting.key] = setting.value;
          }
        });
        setSettings(settingsObj);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ayarlar yüklenirken hata oluştu');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key: keyof SiteSettings) => {
    return settings[key];
  };

  return {
    settings,
    loading,
    error,
    getSetting,
    refetch: fetchSettings
  };
};