import React from 'react';
import { User, Mail, Phone, MessageCircle, Monitor, Users } from 'lucide-react';

interface PersonalInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
    type: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onBack,
  loading
}) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Kişisel Bilgileriniz
      </h2>

      <div className="space-y-4 mb-6">
        {/* Randevu Türü */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Randevu Türü
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onInputChange('type', 'yuz_yuze')}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                formData.type === 'yuz_yuze'
                  ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-sage-300'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Yüz Yüze</span>
            </button>
            <button
              type="button"
              onClick={() => onInputChange('type', 'online')}
              className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 ${
                formData.type === 'online'
                  ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-sage-300'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span>Online</span>
            </button>
          </div>
        </div>

        {/* Ad Soyad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => onInputChange('firstName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Adınız"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Soyad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => onInputChange('lastName', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Soyadınız"
                required
              />
            </div>
          </div>
        </div>

        {/* E-posta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            E-posta *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="ornek@email.com"
              required
            />
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefon *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="05XX XXX XX XX"
              required
            />
          </div>
        </div>

        {/* Mesaj */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mesaj (Opsiyonel)
          </label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              value={formData.message}
              onChange={(e) => onInputChange('message', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Randevu hakkında eklemek istediğiniz bilgiler..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Geri
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.phone}
          className="flex-1 bg-sage-600 hover:bg-sage-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {loading ? 'Gönderiliyor...' : 'Randevu Oluştur'}
        </button>
      </div>
    </div>
  );
};