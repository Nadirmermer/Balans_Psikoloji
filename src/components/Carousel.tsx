import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, HelpCircle, BookOpen, Users } from 'lucide-react';

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string;
  backgroundImage: string;
  buttonText: string;
}

interface CarouselProps {
  items: CarouselItem[];
  onAppointmentClick: () => void;
}

const Carousel: React.FC<CarouselProps> = ({ items, onAppointmentClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // 10 saniye sonra otomatik oynatmayı tekrar başlat
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-2xl shadow-2xl">
      {/* Background Image */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{ 
          background: currentIndex === 0 
            ? 'linear-gradient(135deg, #3d9a3d 0%, #0ea5e9 100%)'
            : currentIndex === 1
            ? 'linear-gradient(135deg, #0ea5e9 0%, #f97316 100%)'
            : 'linear-gradient(135deg, #f97316 0%, #3d9a3d 100%)'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left Item */}
            <div className="text-center lg:text-left">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Hizmetlerimizi Keşfedin</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Bireysel terapi, çift terapisi, aile danışmanlığı ve daha fazlası. Size en uygun hizmeti bulun.
                </p>
                <Link
                  to="/hizmetler"
                  className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  <span>Hizmetlerimiz</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Center Item */}
            <div className="text-center">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Blog</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Balans psikolojik danışmanlık ve psikoterapi süreçlerini daha iyi anlamak için yazılı ve görsel içeriklerimize göz gezdirin.
                </p>
                <Link
                  to="/blog"
                  className="inline-flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  <span>Blog'a Git</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Item */}
            <div className="text-center lg:text-right">
              <div className="bg-white bg-opacity-95 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <HelpCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Sık Sorulanlar</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Terapi ve danışmanlık hizmetleri hakkında kafa karıştırıcı ya da merak edilen noktaları açıkladığımız sık sorulanlar bölümünü inceleyerek merakınızı ve çekincelerinizi giderebilirsiniz.
                </p>
                <Link
                  to="/sik-sorulanlar"
                  className="inline-flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  <span>Sorular</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Big Appointment Button */}
          <div className="text-center mt-12">
            <button
              onClick={onAppointmentClick}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-12 py-6 rounded-full font-bold text-xl transition-all duration-300 hover:shadow-2xl transform hover:scale-110 inline-flex items-center space-x-3"
            >
              <span>Randevu Al</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;