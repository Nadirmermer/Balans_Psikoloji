import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, Calendar, Star, Award, BookOpen } from 'lucide-react';
import { useUzmanlar } from '../hooks/useUzmanlar';

const ExpertsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { uzmanlar, loading, error } = useUzmanlar();

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Uzmanlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Hata: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-sage-600 text-white px-4 py-2 rounded-lg"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  // Kategori filtreleme için uzmanları analiz et
  const getUzmanCategory = (uzmanlikAlanlari: string[]) => {
    if (uzmanlikAlanlari.some(alan => alan.toLowerCase().includes('bireysel'))) return 'bireysel';
    if (uzmanlikAlanlari.some(alan => alan.toLowerCase().includes('cift'))) return 'cift-aile';
    if (uzmanlikAlanlari.some(alan => alan.toLowerCase().includes('cocuk'))) return 'cocuk';
    if (uzmanlikAlanlari.some(alan => alan.toLowerCase().includes('kurumsal'))) return 'kurumsal';
    return 'bireysel';
  };

  const filters = [
    { id: 'all', name: 'Tüm Uzmanlar', count: uzmanlar.length },
    { id: 'bireysel', name: 'Bireysel Terapi', count: uzmanlar.filter(u => getUzmanCategory(u.uzmanlik_alanlari) === 'bireysel').length },
    { id: 'cift-aile', name: 'Çift & Aile', count: uzmanlar.filter(u => getUzmanCategory(u.uzmanlik_alanlari) === 'cift-aile').length },
    { id: 'cocuk', name: 'Çocuk Psikolojisi', count: uzmanlar.filter(u => getUzmanCategory(u.uzmanlik_alanlari) === 'cocuk').length }
  ];

  const filteredUzmanlar = selectedFilter === 'all' 
    ? uzmanlar 
    : uzmanlar.filter(uzman => getUzmanCategory(uzman.uzmanlik_alanlari) === selectedFilter);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-ocean-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-sage-900 mb-6">
              Uzman Kadromuz
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Alanlarında deneyimli, sürekli gelişim halindeki profesyonel psikolog kadromuzla tanışın. Her birinin kendine özgü uzmanlık alanları ve yaklaşımları bulunmaktadır.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Filter className="w-5 h-5 text-sage-600 mr-2" />
            <h2 className="text-lg font-semibold text-sage-900">Uzmanlık Alanına Göre Filtrele</h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? 'bg-sage-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-sage-100'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Experts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUzmanlar.map((uzman) => (
              <div key={uzman.id} className="bg-cream-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="p-6">
                  {/* Expert Image */}
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                    <img
                      src={uzman.profil_resmi}
                      alt={`${uzman.ad} ${uzman.soyad}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Expert Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-semibold text-sage-900 mb-1">{uzman.ad} {uzman.soyad}</h3>
                    <p className="text-ocean-600 font-medium mb-2">{uzman.unvan}</p>
                    
                    {/* Experience */}
                    <div className="flex items-center justify-center mb-3">
                      <Award className="w-4 h-4 text-sage-500 mr-1" />
                      <span className="text-sm text-gray-600">{uzman.deneyim_yili} yıl deneyim</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{uzman.hakkinda}</p>
                  </div>
                  
                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-sage-800 mb-2">Uzmanlık Alanları:</h4>
                    <div className="flex flex-wrap gap-1">
                      {uzman.uzmanlik_alanlari.map((alan, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs"
                        >
                          {alan}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      to={`/uzman/${uzman.slug}`}
                      className="block w-full bg-sage-600 hover:bg-sage-700 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center"
                    >
                      Detaylı Profil
                    </Link>
                    <Link
                      to={`/randevu?uzman=${uzman.slug}`}
                      className="block w-full bg-warmth-500 hover:bg-warmth-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-center inline-flex items-center justify-center"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Randevu Al
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-sage-50 to-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-900 mb-4">
              Rakamlarla Uzman Kadromuz
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-sage-600 mb-2">{uzmanlar.length}</div>
              <div className="text-gray-600">Uzman Psikolog</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-ocean-600 mb-2">
                {uzmanlar.reduce((total, uzman) => total + uzman.deneyim_yili, 0)}
              </div>
              <div className="text-gray-600">Yıllık Deneyim</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-warmth-600 mb-2">500+</div>
              <div className="text-gray-600">Mutlu Danışan</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sage-600 mb-2">4.8</div>
              <div className="text-gray-600">Ortalama Puan</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sage-600 to-ocean-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Size En Uygun Uzmanı Bulun
          </h2>
          <p className="text-xl text-sage-100 mb-8">
            Hangi uzmanımızın size en uygun olduğunu belirlemek için ücretsiz ön görüşme yapabilirsiniz.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/randevu"
              className="bg-warmth-500 hover:bg-warmth-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 inline-flex items-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Randevu Al
            </Link>
            <Link
              to="/iletisim"
              className="border-2 border-white text-white hover:bg-white hover:text-sage-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
            >
              Bize Ulaşın
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertsPage;