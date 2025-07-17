import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Brain, Video, Building, ArrowRight } from 'lucide-react';
import { useHizmetler } from '../hooks/useHizmetler';

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'bireysel-terapi': Heart,
  'cift-terapisi': Users,
  'aile-danismanligi': Shield,
  'cocuk-psikolojisi': Brain,
  'online-terapi': Video,
  'kurumsal-danismanlik': Building
};

const ServicesPage = () => {
  const { hizmetler, loading, error } = useHizmetler();

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Hizmetler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Hizmetler yüklenirken hata oluştu: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-ocean-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-sage-900 mb-6">
              Hizmetlerimiz
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Her bireyin benzersiz ihtiyaçlarına yönelik kapsamlı psikolojik destek hizmetleri sunuyoruz. Bilimsel yaklaşımlarımızla desteklenen, empati dolu hizmetlerimiz.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hizmetler.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-lg">Henüz hizmet eklenmemiş.</div>
            ) : (
              hizmetler.map((service) => {
                const IconComponent = serviceIcons[service.slug] || Heart;
                return (
                  <div key={service.id} className="bg-cream-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="p-8">
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-sage-900">{service.ad}</h3>
                      </div>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {service.aciklama}
                      </p>
                      <div className="mb-8">
                        <h4 className="text-lg font-semibold text-sage-800 mb-3">Hizmet Detayı:</h4>
                        <div className="text-sm text-gray-600">
                          {service.detay ? (
                            <span>{service.detay.slice(0, 100)}{service.detay.length > 100 ? '...' : ''}</span>
                          ) : (
                            <span>Detaylı bilgi için tıklayın.</span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/hizmet/${service.slug}`}
                        className="inline-flex items-center text-sage-600 hover:text-sage-700 font-semibold transition-colors group-hover:scale-105"
                      >
                        <span>Detayları Görün</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-sage-50 to-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-900 mb-4">
              Terapi Sürecimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Size en uygun destek sürecini oluşturmak için izlediğimiz adımlar
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-warmth-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-sage-900 mb-2">İlk Değerlendirme</h3>
              <p className="text-gray-600">Durumunuzu anlamamız ve ihtiyaçlarınızı belirlemek için detaylı görüşme</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-sage-900 mb-2">Plan Oluşturma</h3>
              <p className="text-gray-600">Size özel tedavi planı ve hedeflerinizi birlikte belirleme</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-ocean-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-sage-900 mb-2">Terapi Seansları</h3>
              <p className="text-gray-600">Düzenli seanslarla ilerleme sağlama ve destek alma</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-warmth-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-xl font-semibold text-sage-900 mb-2">Takip & Destek</h3>
              <p className="text-gray-600">Süreç sonrası takip ve gerektiğinde sürekli destek</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sage-600 to-ocean-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Hangi Hizmetimiz Size Uygun?
          </h2>
          <p className="text-xl text-sage-100 mb-8">
            Uzman kadromuz, size en uygun hizmet türünü belirlemek için ücretsiz ön görüşme yapabilir.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/randevu"
              className="bg-warmth-500 hover:bg-warmth-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 inline-flex items-center"
            >
              Randevu Al
            </Link>
            <Link
              to="/uzmanlar"
              className="border-2 border-white text-white hover:bg-white hover:text-sage-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
            >
              Uzmanlarımızla Tanışın
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;