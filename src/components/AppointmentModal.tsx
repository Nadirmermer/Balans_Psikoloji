import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useUzmanlar } from '../hooks/useUzmanlar';
import { useHizmetler } from '../hooks/useHizmetler';
import { useRandevu } from '../hooks/useRandevu';
import { ServiceSelectionStep } from './appointment/ServiceSelectionStep';
import { ExpertSelectionStep } from './appointment/ExpertSelectionStep';
import { DateTimeSelectionStep } from './appointment/DateTimeSelectionStep';
import { PersonalInfoStep } from './appointment/PersonalInfoStep';
import { SuccessStep } from './appointment/SuccessStep';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedExpert?: string;
  preSelectedService?: string;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preSelectedExpert,
  preSelectedService
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: preSelectedService || '',
    expert: preSelectedExpert || '',
    date: '',
    time: '',
    type: 'yuz_yuze',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });



  const { uzmanlar } = useUzmanlar();
  const { hizmetler } = useHizmetler();
  const { createRandevu, loading: randevuLoading } = useRandevu();

  // Modal açıldığında adımı belirle
  useEffect(() => {
    if (isOpen) {
      if (preSelectedExpert) {
        setCurrentStep(2); // Uzman seçilmişse tarih seçiminden başla
        setFormData(prev => ({ ...prev, expert: preSelectedExpert }));
      } else {
        setCurrentStep(1); // Genel randevu alımında hizmet seçiminden başla
      }
    }
  }, [isOpen, preSelectedExpert]);



  // Seçilen uzmanı bul
  const selectedExpert = uzmanlar.find(uzman => uzman.slug === formData.expert);

  // Form gönderimi
  const handleSubmit = async () => {
    try {
      console.log('Form data:', formData);
      console.log('Available hizmetler:', hizmetler);
      console.log('Available uzmanlar:', uzmanlar);
      
      const selectedHizmet = hizmetler.find(h => h.slug === formData.service);
      const selectedUzman = uzmanlar.find(u => u.slug === formData.expert);
      
      console.log('Selected hizmet:', selectedHizmet);
      console.log('Selected uzman:', selectedUzman);
      
      if (!selectedHizmet || !selectedUzman) {
        const missingItems = [];
        if (!selectedHizmet) missingItems.push('hizmet');
        if (!selectedUzman) missingItems.push('uzman');
        throw new Error(`${missingItems.join(' ve ')} bulunamadı. Lütfen seçimlerinizi kontrol edin.`);
      }

      await createRandevu({
        uzman_id: selectedUzman.id,
        hizmet_id: selectedHizmet.id,
        ad: formData.firstName,
        soyad: formData.lastName,
        email: formData.email,
        telefon: formData.phone,
        tarih: formData.date,
        saat: formData.time,
        tur: formData.type,
        mesaj: formData.message
      });
      
      setCurrentStep(5); // Başarı sayfası
    } catch (error) {
      console.error('Randevu oluşturma hatası:', error);
      // Hata durumunda kullanıcıya bilgi ver
      alert(error instanceof Error ? error.message : 'Randevu oluşturulurken bir hata oluştu');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetModal = useCallback(() => {
    setCurrentStep(preSelectedExpert ? 2 : 1);
    setFormData({
      service: preSelectedService || '',
      expert: preSelectedExpert || '',
      date: '',
      time: '',
      type: 'yuz_yuze',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });

  }, [preSelectedExpert, preSelectedService]);

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (!isOpen) {
        resetModal();
      }
    };
  }, [isOpen, preSelectedExpert, preSelectedService, resetModal]);
  if (!isOpen) return null;

  // Mock available slots for demonstration
  const mockAvailableSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-600 to-ocean-600 text-white p-4 relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="pr-8">
            {preSelectedExpert && selectedExpert ? (
              <div>
                <h2 className="text-lg font-bold mb-1">
                  {selectedExpert.ad} {selectedExpert.soyad} için Randevu
                </h2>
                <p className="text-sage-100 text-sm">
                  {selectedExpert.unvan}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-lg font-bold mb-1">Randevu Al</h2>
                <p className="text-sage-100 text-sm">Size en uygun uzmanımızla randevu oluşturun</p>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mt-3 space-x-2">
            {[1, 2, 3, 4].map((step) => {
              const adjustedStep = preSelectedExpert ? step + 1 : step;
              const isActive = currentStep === adjustedStep;
              const isCompleted = currentStep > adjustedStep;
              
              if (preSelectedExpert && step === 1) return null;
              
              return (
                <div
                  key={step}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                    isActive
                      ? 'bg-white text-sage-600'
                      : isCompleted
                      ? 'bg-sage-300 text-sage-700'
                      : 'bg-sage-500 text-sage-200'
                  }`}
                >
                  {preSelectedExpert ? step + 1 : step}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-180px)]">
          
          {/* Step 1: Service Selection */}
          {currentStep === 1 && !preSelectedExpert && (
            <ServiceSelectionStep
              selectedService={formData.service}
              onServiceSelect={(service) => handleInputChange('service', service)}
              hizmetler={hizmetler}
              onNext={nextStep}
            />
          )}

          {/* Step 2: Expert Selection */}
          {currentStep === 2 && (
            <ExpertSelectionStep
              selectedExpert={formData.expert}
              onExpertSelect={(expert) => handleInputChange('expert', expert)}
              uzmanlar={uzmanlar}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {/* Step 3: Date & Time Selection */}
          {currentStep === 3 && (
            <DateTimeSelectionStep
              selectedDate={formData.date}
              selectedTime={formData.time}
              onDateSelect={(date) => handleInputChange('date', date)}
              onTimeSelect={(time) => handleInputChange('time', time)}
              onNext={nextStep}
              onBack={prevStep}
              availableSlots={mockAvailableSlots}
            />
          )}

          {/* Step 4: Personal Information */}
          {currentStep === 4 && (
            <PersonalInfoStep
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onBack={prevStep}
              loading={randevuLoading}
            />
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && selectedExpert && (
            <SuccessStep
              appointmentData={formData}
              selectedExpert={selectedExpert}
              selectedService={hizmetler.find(h => h.slug === formData.service) || { ad: '' }}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  E-posta Adresi *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="ornek@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefon Numarası *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="0555 123 45 67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notunuz (Opsiyonel)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={3}
                  className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                  placeholder="Durumunuz hakkında kısa bilgi..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Summary & Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                Randevu Özeti
              </h3>
              
              <div className="bg-cream-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-sage-600 mr-2 flex-shrink-0" />
                  <span className="font-medium">Uzman: </span>
                  <span className="ml-1">
                    {selectedExpert && `${selectedExpert.ad} ${selectedExpert.soyad}`}
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-sage-600 mr-2 flex-shrink-0" />
                  <span className="font-medium">Tarih: </span>
                  <span className="ml-1">
                    {new Date(formData.date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-sage-600 mr-2 flex-shrink-0" />
                  <span className="font-medium">Saat: </span>
                  <span className="ml-1">{formData.time}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <MessageCircle className="w-4 h-4 text-sage-600 mr-2 flex-shrink-0" />
                  <span className="font-medium">Tür: </span>
                  <span className="ml-1">
                    {formData.type === 'yuz_yuze' ? 'Yüz Yüze' : 'Online'}
                  </span>
                </div>
                
                <div className="flex items-start text-sm">
                  <Mail className="w-4 h-4 text-sage-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">İletişim: </span>
                    <span className="break-words">
                      {formData.firstName} {formData.lastName} • {formData.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                <p className="text-blue-800 dark:text-blue-200 text-xs">
                  <strong>Önemli:</strong> Randevu talebiniz onaylandıktan sonra size e-posta ile bilgilendirme yapılacaktır.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 5 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 dark:text-sage-100 mb-3">
                Teşekkürler!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                Randevu talebiniz başarıyla alınmıştır.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-xs">
                En kısa sürede size e-posta ile geri dönüş yapılacaktır.
              </p>
              <button
                onClick={handleClose}
                className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Tamam
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 5 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === (preSelectedExpert ? 2 : 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                currentStep === (preSelectedExpert ? 2 : 1)
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
              }`}
            >
              Önceki
            </button>
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Adım {currentStep} / 4
            </div>
            
            <button
              onClick={currentStep === 4 ? handleSubmit : nextStep}
              disabled={
                randevuLoading ||
                (currentStep === 1 && (!formData.service || !formData.expert)) ||
                (currentStep === 2 && (!formData.date || !formData.time)) ||
                (currentStep === 3 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
              }
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                randevuLoading ||
                (currentStep === 1 && (!formData.service || !formData.expert)) ||
                (currentStep === 2 && (!formData.date || !formData.time)) ||
                (currentStep === 3 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-sage-600 text-white hover:bg-sage-700'
              }`}
            >
              {randevuLoading ? 'Gönderiliyor...' : currentStep === 4 ? 'Onayla' : 'Sonraki'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;