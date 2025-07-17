import React from 'react';
import { CheckCircle, Calendar, Clock, User, Mail } from 'lucide-react';

interface SuccessStepProps {
  appointmentData: {
    firstName: string;
    lastName: string;
    email: string;
    date: string;
    time: string;
    type: string;
  };
  selectedExpert: {
    ad: string;
    soyad: string;
    unvan: string;
  };
  selectedService: {
    ad: string;
  };
  onClose: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({
  appointmentData,
  selectedExpert,
  selectedService,
  onClose
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 text-center">
      <div className="mb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Randevunuz Başarıyla Oluşturuldu!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Randevu detayları e-posta adresinize gönderilecektir.
        </p>
      </div>

      {/* Randevu Detayları */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
          Randevu Detayları
        </h3>
        
        <div className="space-y-3 text-left">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Uzman:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {selectedExpert.ad} {selectedExpert.soyad} - {selectedExpert.unvan}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Hizmet:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {selectedService.ad}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Tarih:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {formatDate(appointmentData.date)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Saat:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {appointmentData.time}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-sage-600 dark:text-sage-400" />
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Tür:</span>
              <p className="font-medium text-gray-800 dark:text-white">
                {appointmentData.type === 'yuz_yuze' ? 'Yüz Yüze' : 'Online'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bilgilendirme */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Önemli Bilgiler
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
          <li>• Randevu onayı e-posta ile gönderilecektir</li>
          <li>• Randevudan 24 saat önce hatırlatma alacaksınız</li>
          <li>• Değişiklik için lütfen bizimle iletişime geçin</li>
          <li>• Online randevular için Zoom linki e-posta ile gönderilecektir</li>
        </ul>
      </div>

      <button
        onClick={onClose}
        className="w-full bg-sage-600 hover:bg-sage-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Tamam
      </button>
    </div>
  );
};