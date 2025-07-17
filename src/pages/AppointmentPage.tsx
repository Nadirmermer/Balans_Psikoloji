import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageCircle, CheckCircle } from 'lucide-react';
import { useHizmetler } from '../hooks/useHizmetler';
import { useUzmanlar } from '../hooks/useUzmanlar';

const AppointmentPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    expert: '',
    date: '',
    time: '',
    type: 'face-to-face',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const { hizmetler, loading: hizmetlerLoading, error: hizmetlerError } = useHizmetler();
  const { uzmanlar, loading: uzmanlarLoading, error: uzmanlarError } = useUzmanlar();

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
    setCurrentStep(5); // Success step
  };

  if (hizmetlerLoading || uzmanlarLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (hizmetlerError || uzmanlarError) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Veriler yüklenirken hata oluştu: {hizmetlerError || uzmanlarError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-sage-900 mb-6">Hizmet Seçimi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hizmetler.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleInputChange('service', service.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.service === service.id
                        ? 'border-sage-600 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <h3 className="font-semibold text-sage-900">{service.ad}</h3>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Expert & Date Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-sage-900 mb-6">Uzman ve Tarih Seçimi</h2>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sage-900">Uzman Seçin</label>
                <select
                  value={formData.expert}
                  onChange={(e) => handleInputChange('expert', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:outline-none bg-white text-gray-900"
                >
                  <option value="">Uzman seçin...</option>
                  {uzmanlar.map((expert) => (
                    <option key={expert.id} value={expert.id}>
                      {expert.ad} {expert.soyad} - {expert.unvan}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sage-900">Tarih Seçin</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sage-900">Saat Seçin</label>
                <select
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:outline-none bg-white text-gray-900"
                >
                  <option value="">Saat seçin...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Geri
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-sage-600 text-white rounded-lg font-semibold hover:bg-sage-700"
                >
                  Devam
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Kişisel Bilgiler */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-sage-900 mb-6">Kişisel Bilgiler</h2>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sage-900">Adınız</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sage-900">Soyadınız</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sage-900">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sage-900">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-sage-900">Ek Mesaj</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-sage-500 focus:outline-none bg-white text-gray-900"
                  rows={3}
                />
              </div>
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Geri
                </button>
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-sage-600 text-white rounded-lg font-semibold hover:bg-sage-700"
                >
                  Devam
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Onay */}
          {currentStep === 4 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-sage-900 mb-6">Onayla ve Gönder</h2>
              <div className="bg-cream-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold text-sage-900 mb-4">Randevu Detayları</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Hizmet:</strong> {hizmetler.find(h => h.id === formData.service)?.ad}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Uzman:</strong> {uzmanlar.find(u => u.id === formData.expert) ? `${uzmanlar.find(u => u.id === formData.expert)?.ad} ${uzmanlar.find(u => u.id === formData.expert)?.soyad}` : ''}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Tarih:</strong> {formData.date ? new Date(formData.date).toLocaleDateString('tr-TR') : ''}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Saat:</strong> {formData.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Tür:</strong> {formData.type === 'face-to-face' ? 'Yüz Yüze' : 'Online'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-cream-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold text-sage-900 mb-4">Kişisel Bilgiler</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Ad Soyad:</strong> {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>E-posta:</strong> {formData.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Telefon:</strong> {formData.phone}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-sage-600 text-white rounded-lg font-semibold hover:bg-sage-700"
              >
                Randevuyu Tamamla
              </button>
              <div className="mt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Geri
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Başarı */}
          {currentStep === 5 && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-green-700 mb-4">Randevunuz Alındı!</h2>
              <p className="text-gray-700 mb-6">Randevu talebiniz başarıyla iletildi. En kısa sürede sizinle iletişime geçeceğiz.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;