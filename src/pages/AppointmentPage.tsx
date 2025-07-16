import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, MessageCircle, CheckCircle } from 'lucide-react';

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

  const services = [
    { id: 'bireysel-terapi', name: 'Bireysel Terapi', price: '400 ₺' },
    { id: 'cift-terapisi', name: 'Çift Terapisi', price: '500 ₺' },
    { id: 'aile-danismanligi', name: 'Aile Danışmanlığı', price: '450 ₺' },
    { id: 'cocuk-psikolojisi', name: 'Çocuk Psikolojisi', price: '350 ₺' },
    { id: 'online-terapi', name: 'Online Terapi', price: '350 ₺' }
  ];

  const experts = [
    { id: 'dr-ayse-demir', name: 'Dr. Ayşe Demir', specialty: 'Bireysel Terapi, Travma' },
    { id: 'uzm-psk-mehmet-ozkan', name: 'Uzm. Psk. Mehmet Özkan', specialty: 'Çift Terapisi' },
    { id: 'psk-elif-yilmaz', name: 'Psk. Elif Yılmaz', specialty: 'Çocuk Psikolojisi' },
    { id: 'uzm-psk-fatma-ozturk', name: 'Uzm. Psk. Fatma Öztürk', specialty: 'Kaygı Bozuklukları' }
  ];

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

  if (currentStep === 5) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-sage-50 to-ocean-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-sage-900 mb-4">Randevu Talebiniz Alındı!</h2>
          <p className="text-gray-600 mb-6">
            Randevu talebiniz başarıyla gönderildi. Kısa süre içinde size dönüş yapacağız.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Randevu onayı için e-posta adresinizi kontrol edin.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-sage-600 hover:bg-sage-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-sage-50 to-ocean-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep ? 'bg-sage-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-sage-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-sage-900 mb-6">Hizmet Seçimi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleInputChange('service', service.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      formData.service === service.id
                        ? 'border-sage-600 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <h3 className="font-semibold text-sage-900">{service.name}</h3>
                    <p className="text-warmth-600 font-medium">{service.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Expert & Date Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-sage-900 mb-6">Uzman & Tarih Seçimi</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uzman Seçiniz
                </label>
                <select
                  value={formData.expert}
                  onChange={(e) => handleInputChange('expert', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="">Uzman seçin...</option>
                  {experts.map((expert) => (
                    <option key={expert.id} value={expert.id}>
                      {expert.name} - {expert.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih Seçiniz
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saat Seçiniz
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleInputChange('time', time)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.time === time
                          ? 'border-sage-600 bg-sage-50 text-sage-600'
                          : 'border-gray-200 hover:border-sage-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Görüşme Türü
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleInputChange('type', 'face-to-face')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.type === 'face-to-face'
                        ? 'border-sage-600 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <User className="w-6 h-6 mx-auto mb-2 text-sage-600" />
                    <span className="block text-sm font-medium">Yüz Yüze</span>
                  </button>
                  <button
                    onClick={() => handleInputChange('type', 'online')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.type === 'online'
                        ? 'border-sage-600 bg-sage-50'
                        : 'border-gray-200 hover:border-sage-300'
                    }`}
                  >
                    <MessageCircle className="w-6 h-6 mx-auto mb-2 text-sage-600" />
                    <span className="block text-sm font-medium">Online</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-sage-900 mb-6">Kişisel Bilgiler</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Adınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soyad
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Soyadınız"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="0555 123 45 67"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesajınız (Opsiyonel)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Durumunuz hakkında kısa bilgi verebilirsiniz..."
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-sage-900 mb-6">Randevu Onayı</h2>
              
              <div className="bg-cream-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-sage-900 mb-4">Randevu Detayları</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Hizmet:</strong> {services.find(s => s.id === formData.service)?.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Uzman:</strong> {experts.find(e => e.id === formData.expert)?.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-sage-600 mr-3" />
                    <span>
                      <strong>Tarih:</strong> {new Date(formData.date).toLocaleDateString('tr-TR')}
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

              <div className="bg-cream-50 rounded-lg p-6">
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
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Önceki
            </button>
            
            <button
              onClick={currentStep === 4 ? handleSubmit : nextStep}
              disabled={
                (currentStep === 1 && !formData.service) ||
                (currentStep === 2 && (!formData.expert || !formData.date || !formData.time)) ||
                (currentStep === 3 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
              }
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                (currentStep === 1 && !formData.service) ||
                (currentStep === 2 && (!formData.expert || !formData.date || !formData.time)) ||
                (currentStep === 3 && (!formData.firstName || !formData.lastName || !formData.email || !formData.phone))
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-sage-600 text-white hover:bg-sage-700'
              }`}
            >
              {currentStep === 4 ? 'Randevu Oluştur' : 'Sonraki'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;