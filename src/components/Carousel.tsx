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
    <div className="relative w-full h-[480px] sm:h-[540px] md:h-[600px] overflow-hidden rounded-2xl shadow-2xl bg-white dark:bg-gray-900 transition-colors duration-500">
      {/* Content - Mobilde yatay scroll, masaüstünde grid */}
      <div className="relative z-10 h-full flex flex-col lg:block">
        <div
          className="flex lg:grid lg:grid-cols-3 gap-4 lg:gap-8 items-center h-full overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth px-2 sm:px-4 lg:px-8"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Mobilde yatay scroll için her kartı min-w ve snap ile ayarla */}
          <div className="min-w-[90vw] max-w-[95vw] sm:min-w-[80vw] sm:max-w-[90vw] lg:min-w-0 lg:max-w-none snap-center flex-shrink-0 lg:col-span-1 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl w-full h-[340px] sm:h-[380px] md:h-[420px] flex flex-col justify-between items-center p-5 sm:p-8">
              <div className="flex flex-col items-center w-full flex-1 justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-center">Hizmetlerimizi Keşfedin</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-0 sm:mb-2 leading-relaxed text-sm sm:text-base text-center">
                  Bireysel terapi, çift terapisi, aile danışmanlığı ve daha fazlası. Size en uygun hizmeti bulun.
                </p>
              </div>
              <Link
                to="/hizmetler"
                className="inline-flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 text-sm sm:text-base mt-4"
              >
                <span>Hizmetlerimiz</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="min-w-[90vw] max-w-[95vw] sm:min-w-[80vw] sm:max-w-[90vw] lg:min-w-0 lg:max-w-none snap-center flex-shrink-0 lg:col-span-1 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl w-full h-[340px] sm:h-[380px] md:h-[420px] flex flex-col justify-between items-center p-5 sm:p-8">
              <div className="flex flex-col items-center w-full flex-1 justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-center">Blog</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-0 sm:mb-2 leading-relaxed text-sm sm:text-base text-center">
                  Balans psikolojik danışmanlık ve psikoterapi süreçlerini daha iyi anlamak için yazılı ve görsel içeriklerimize göz gezdirin.
                </p>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center space-x-2 bg-secondary-500 hover:bg-secondary-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 text-sm sm:text-base mt-4"
              >
                <span>Blog'a Git</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div className="min-w-[90vw] max-w-[95vw] sm:min-w-[80vw] sm:max-w-[90vw] lg:min-w-0 lg:max-w-none snap-center flex-shrink-0 lg:col-span-1 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl w-full h-[340px] sm:h-[380px] md:h-[420px] flex flex-col justify-between items-center p-5 sm:p-8">
              <div className="flex flex-col items-center w-full flex-1 justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-center">Sık Sorulanlar</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-0 sm:mb-2 leading-relaxed text-sm sm:text-base text-center">
                  Terapi ve danışmanlık hizmetleri hakkında kafa karıştırıcı ya da merak edilen noktaları açıkladığımız sık sorulanlar bölümünü inceleyerek merakınızı ve çekincelerinizi giderebilirsiniz.
                </p>
              </div>
              <Link
                to="/sik-sorulanlar"
                className="inline-flex items-center space-x-2 bg-accent-500 hover:bg-accent-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105 text-sm sm:text-base mt-4"
              >
                <span>Sorular</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        
      </div>

      {/* Navigation Arrows - Sadece masaüstünde göster */}
      <button
        onClick={goToPrevious}
        className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      
      <button
        onClick={goToNext}
        className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Dots Indicator - Mobilde kaldırıldı, sadece masaüstünde göster */}
      <div className="hidden lg:flex absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;