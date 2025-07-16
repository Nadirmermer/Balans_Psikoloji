import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MessageCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUzmanlar } from '../hooks/useUzmanlar';
import { useHizmetler } from '../hooks/useHizmetler';
import { useRandevu } from '../hooks/useRandevu';

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

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

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

  // Seçilen hizmete göre uzmanları filtrele
  const getExpertsForService = (serviceId: string) => {
    return uzmanlar;
  };

  // Seçilen uzmanı bul
  const selectedExpert = uzmanlar.find(uzman => uzman.slug === formData.expert);

  // Seçilen tarih için uygun saatleri getir
  const getAvailableSlotsForDate = (dateString: string) => {
    if (!selectedExpert || !dateString) return [];
    
    const date = new Date(dateString);
    const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][date.getDay()];
    
    const workingHours = selectedExpert.calisma_saatleri?.[dayName];
    if (!workingHours || !workingHours.aktif) {
      return [];
    }
    
    const slots = [];
    const start = workingHours.baslangic || '09:00';
    const end = workingHours.bitis || '17:00';
    
    const startHour = parseInt(start.split(':')[0]);
    const startMinute = parseInt(start.split(':')[1]);
    const endHour = parseInt(end.split(':')[0]);
    const endMinute = parseInt(end.split(':')[1]);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      slots.push(timeString);
      
      // 50 dakika ekle (seans süresi)
      currentMinute += 50;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    return slots;
  };

  // Takvim oluşturma fonksiyonu
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const calendar = [];
    const current = new Date(startDate);

    for (let week = 0; week < 6; week++) {
      const weekDays = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
      calendar.push(weekDays);
    }

    return calendar;
  };

  // Tarih seçimi işlemi
  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return; // Geçmiş tarihleri seçilemez
    
    const dateString = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: dateString, time: '' }));
  };

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

  const resetModal = () => {
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
    setAvailableSlots([]);
    setSelectedMonth(new Date());
  };

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
  }, [isOpen]);
  if (!isOpen) return null;

  const calendar = generateCalendar(selectedMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
        <div className="p-4 overflow-y-auto max-h-[calc(95vh-180px)]">
          
          {/* Step 1: Service & Expert Selection */}
          {currentStep === 1 && !preSelectedExpert && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100 mb-3">
                  Hangi hizmet alanıyla ilgileniyorsunuz?
                </h3>
                <select
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Hizmet seçin...</option>
                  {hizmetler.map((hizmet) => (
                    <option key={hizmet.id} value={hizmet.slug}>
                      {hizmet.ad} - {hizmet.fiyat} ₺
                    </option>
                  ))}
                </select>
              </div>

              {formData.service && (
                <div>
                  <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100 mb-3">
                    Hangi uzmanımızla çalışmak istersiniz?
                  </h3>
                  <div className="space-y-3">
                    {getExpertsForService(formData.service).map((expert) => (
                      <button
                        key={expert.id}
                        onClick={() => handleInputChange('expert', expert.slug)}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          formData.expert === expert.slug
                            ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30'
                            : 'border-gray-200 dark:border-gray-600 hover:border-sage-300 hover:bg-sage-25 dark:hover:bg-sage-900/20'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={expert.profil_resmi}
                            alt={`${expert.ad} ${expert.soyad}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sage-900 dark:text-sage-100 text-sm">
                              {expert.ad} {expert.soyad}
                            </h4>
                            <p className="text-ocean-600 dark:text-ocean-400 text-xs">
                              {expert.unvan}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                Tarih ve Saat Seçimi
              </h3>
              
              {/* Calendar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {selectedMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                  </h4>
                  <button
                    onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
                    <div key={day} className="p-1 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {calendar.flat().map((date, index) => {
                    const isCurrentMonth = date.getMonth() === selectedMonth.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isPast = date < today;
                    const isSelected = formData.date === date.toISOString().split('T')[0];
                    const isWeekend = date.getDay() === 0;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => !isPast && !isWeekend && isCurrentMonth && handleDateSelect(date)}
                        disabled={isPast || isWeekend || !isCurrentMonth}
                        className={`p-1 text-xs rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'bg-sage-600 text-white'
                            : isToday
                            ? 'bg-ocean-100 dark:bg-ocean-900 text-ocean-700 dark:text-ocean-300 font-semibold'
                            : isPast || isWeekend || !isCurrentMonth
                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : 'hover:bg-sage-100 dark:hover:bg-sage-900 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Uygun Saatler
                </h4>
                {formData.date ? (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.length > 0 ? availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleInputChange('time', slot)}
                        className={`p-2 rounded-lg border-2 transition-all duration-200 text-sm ${
                          formData.time === slot
                            ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-sage-300 hover:bg-sage-25 dark:hover:bg-sage-900/20'
                        }`}
                      >
                        {slot}
                      </button>
                    )) : (
                      <div className="col-span-4 text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Seçilen tarihte uygun saat bulunmuyor
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4 text-sm">
                    Önce bir tarih seçin
                  </p>
                )}
              </div>

              {/* Meeting Type */}
              <div>
                <h4 className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100">
                  Görüşme Türü
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleInputChange('type', 'yuz_yuze')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.type === 'yuz_yuze'
                        ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-sage-300'
                    }`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1 text-sage-600" />
                    <span className="block text-sm font-medium">Yüz Yüze</span>
                  </button>
                  <button
                    onClick={() => handleInputChange('type', 'online')}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                      formData.type === 'online'
                        ? 'border-sage-500 bg-sage-50 dark:bg-sage-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-sage-300'
                    }`}
                  >
                    <MessageCircle className="w-5 h-5 mx-auto mb-1 text-sage-600" />
                    <span className="block text-sm font-medium">Online</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Personal Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-sage-900 dark:text-sage-100">
                Kişisel Bilgileriniz
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ad *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="Adınız"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full p-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-sage-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="Soyadınız"
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