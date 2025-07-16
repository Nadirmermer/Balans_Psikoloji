import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen, Video, FileText, Users } from 'lucide-react';

interface EducationItem {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'video' | 'workshop' | 'digital';
  duration: string;
  participants: string;
  image: string;
  price: string;
}

const EducationSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const educationItems: EducationItem[] = [
    {
      id: '1',
      title: 'Stres Yönetimi Eğitimi',
      description: 'Günlük hayatın stresiyle başa çıkmanın etkili yöntemlerini öğrenin. Pratik teknikler ve uygulamalı egzersizlerle stresinizi kontrol altına alın.',
      type: 'course',
      duration: '8 Hafta',
      participants: '15-20 Kişi',
      image: '/images/education/stress-management.jpg',
      price: '₺1,200'
    },
    {
      id: '2',
      title: 'İletişim Becerileri Atölyesi',
      description: 'İş ve özel hayatınızda daha etkili iletişim kurmanın sırlarını keşfedin. Beden dili, aktif dinleme ve empati tekniklerini uygulayarak öğrenin.',
      type: 'workshop',
      duration: '2 Gün',
      participants: '10-12 Kişi',
      image: '/images/education/communication.jpg',
      price: '₺800'
    },
    {
      id: '3',
      title: 'Dijital Detoks Rehberi',
      description: 'Teknoloji bağımlılığından kurtulun ve dijital dengeyi sağlayın. Akıllı telefon kullanımı, sosyal medya ve ekran süresi yönetimi konularında uzman rehberliği.',
      type: 'digital',
      duration: '4 Hafta',
      participants: 'Sınırsız',
      image: '/images/education/digital-detox.jpg',
      price: '₺400'
    },
    {
      id: '4',
      title: 'Çift İletişimi Video Serisi',
      description: 'İlişkinizi güçlendirecek iletişim tekniklerini evinizin konforunda öğrenin. 10 bölümlük video serisi ile pratik uygulamalar.',
      type: 'video',
      duration: '10 Video',
      participants: 'Sınırsız',
      image: '/images/education/couple-communication.jpg',
      price: '₺300'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'video': return Video;
      case 'workshop': return Users;
      case 'digital': return FileText;
      default: return BookOpen;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'course': return 'Kurs';
      case 'video': return 'Video Serisi';
      case 'workshop': return 'Atölye';
      case 'digital': return 'Dijital Ürün';
      default: return 'Eğitim';
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + educationItems.length) % educationItems.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % educationItems.length);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Eğitimlerimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kişisel gelişim ve ruh sağlığı konularında uzman rehberliğinde eğitimler
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {educationItems.map((item) => {
                const IconComponent = getTypeIcon(item.type);
                return (
                  <div key={item.id} className="w-full flex-shrink-0">
                    <div className="bg-white p-8 md:p-12">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Content */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                                {getTypeText(item.type)}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-3xl font-bold text-gray-900">
                            {item.title}
                          </h3>

                          <p className="text-lg text-gray-600 leading-relaxed">
                            {item.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Süre</p>
                              <p className="font-semibold text-gray-900">{item.duration}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-500">Katılımcı</p>
                              <p className="font-semibold text-gray-900">{item.participants}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-primary-600">
                              {item.price}
                            </div>
                            <button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 inline-flex items-center space-x-2">
                              <span>Detayları Gör</span>
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Image */}
                        <div className="relative">
                          <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl overflow-hidden">
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <IconComponent className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                                <p className="text-primary-600 font-semibold">Eğitim Görseli</p>
                                <p className="text-sm text-gray-500">Yakında eklenecek</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
            {educationItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-primary-500 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Tüm eğitimlerimiz hakkında detaylı bilgi almak için bizimle iletişime geçin
          </p>
          <button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 inline-flex items-center space-x-2">
            <span>İletişime Geç</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;