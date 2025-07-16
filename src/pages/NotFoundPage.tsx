import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Heart, MessageCircle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-ocean-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-sage-500 to-ocean-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-2xl font-bold text-sage-900">Balans Psikoloji</h1>
        </div>

        {/* 404 Message */}
        <div className="mb-12">
          <div className="text-8xl font-bold text-sage-200 mb-4">404</div>
          <h2 className="text-3xl md:text-4xl font-bold text-sage-900 mb-6">
            Sayfa Bulunamadı
          </h2>
          <p className="text-xl text-gray-600 mb-4">
            Aradığınız sayfayı bulamadık, belki de dengeyi başka bir yerde arıyordur?
          </p>
          <p className="text-gray-500">
            Endişelenmeyin, size yardımcı olacak birçok seçenek var.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link
            to="/"
            className="bg-white hover:bg-sage-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sage-200 transition-colors">
              <Home className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="font-semibold text-sage-900 mb-2">Ana Sayfa</h3>
            <p className="text-sm text-gray-600">Başlangıç noktasına dönün</p>
          </Link>

          <Link
            to="/hizmetler"
            className="bg-white hover:bg-ocean-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-ocean-200 transition-colors">
              <Heart className="w-6 h-6 text-ocean-600" />
            </div>
            <h3 className="font-semibold text-sage-900 mb-2">Hizmetlerimiz</h3>
            <p className="text-sm text-gray-600">Size uygun desteği bulun</p>
          </Link>

          <Link
            to="/blog"
            className="bg-white hover:bg-warmth-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-warmth-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warmth-200 transition-colors">
              <BookOpen className="w-6 h-6 text-warmth-600" />
            </div>
            <h3 className="font-semibold text-sage-900 mb-2">Blog Yazıları</h3>
            <p className="text-sm text-gray-600">Bilgilendirici içerikleri okuyun</p>
          </Link>

          <Link
            to="/iletisim"
            className="bg-white hover:bg-sage-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-sage-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="font-semibold text-sage-900 mb-2">İletişim</h3>
            <p className="text-sm text-gray-600">Bize ulaşın</p>
          </Link>
        </div>

        {/* Search Suggestions */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h3 className="text-lg font-semibold text-sage-900 mb-4">
            Belki bunları arıyordunuz?
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/hizmet/bireysel-terapi" className="bg-sage-100 hover:bg-sage-200 text-sage-700 px-4 py-2 rounded-full text-sm transition-colors">
              Bireysel Terapi
            </Link>
            <Link to="/hizmet/cift-terapisi" className="bg-ocean-100 hover:bg-ocean-200 text-ocean-700 px-4 py-2 rounded-full text-sm transition-colors">
              Çift Terapisi
            </Link>
            <Link to="/uzmanlar" className="bg-warmth-100 hover:bg-warmth-200 text-warmth-700 px-4 py-2 rounded-full text-sm transition-colors">
              Uzmanlarımız
            </Link>
            <Link to="/randevu" className="bg-sage-100 hover:bg-sage-200 text-sage-700 px-4 py-2 rounded-full text-sm transition-colors">
              Randevu Al
            </Link>
            <Link to="/hakkimizda" className="bg-ocean-100 hover:bg-ocean-200 text-ocean-700 px-4 py-2 rounded-full text-sm transition-colors">
              Hakkımızda
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Hala aradığınızı bulamadınız mı?
          </p>
          <Link
            to="/iletisim"
            className="inline-flex items-center bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Bize Ulaşın
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;