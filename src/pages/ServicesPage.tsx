import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Shield, Brain, Video, Building, ArrowRight } from 'lucide-react';


const ServicesPage = () => {
  const services = [
    {
      icon: Heart,
      title: 'Bireysel Terapi',
      description: 'Kişisel gelişim ve ruh sağlığınız için bire bir profesyonel destek. Depresyon, kaygı, travma ve yaşam zorluklarıyla başa çıkma konularında uzman rehberlik.',
      features: ['Depresyon Tedavisi', 'Kaygı Bozuklukları', 'Travma Terapisi', 'Kişisel Gelişim'],
      slug: 'bireysel-terapi',
      color: 'from-sage-500 to-sage-600'
    },
    {
      icon: Users,
      title: 'Çift Terapisi',
      description: 'İlişkinizde yaşanan sorunları çözmek ve iletişimi güçlendirmek için profesyonel çift terapisi. Sağlıklı ilişki dinamikleri oluşturma.',
      features: ['İletişim Sorunları', 'Güven Problemleri', 'Cinsel Terapi', 'Boşanma Danışmanlığı'],
      slug: 'cift-terapisi',
      color: 'from-ocean-500 to-ocean-600'
    },
    {
      icon: Shield,
      title: 'Aile Danışmanlığı',
      description: 'Aile içi çatışmaları çözmek ve sağlıklı aile dinamikleri oluşturmak için kapsamlı danışmanlık hizmetleri.',
      features: ['Aile İçi İletişim', 'Ergen Sorunları', 'Aile Çatışmaları', 'Rol Dağılımı'],
      slug: 'aile-danismanligi',
      color: 'from-warmth-500 to-warmth-600'
    },
    {
      icon: Brain,
      title: 'Çocuk Psikolojisi',
      description: 'Çocuk ve ergenlerin gelişimsel süreçlerinde karşılaştıkları zorluklara yönelik uzman psikolojik destek.',
      features: ['Gelişim Değerlendirmesi', 'Davranış Sorunları', 'Okul Fobisi', 'Dikkat Eksikliği'],
      slug: 'cocuk-psikolojisi',
      color: 'from-sage-400 to-ocean-500'
    },
    {
      icon: Video,
      title: 'Online Terapi',
      description: 'Türkiye\'nin her yerinden erişilebilir online terapi hizmetleri. Güvenli ve etkili dijital terapi seansları.',
      features: ['Video Görüşme', 'Mesaj Desteği', 'Esnek Saatler', 'Güvenli Platform'],
      slug: 'online-terapi',
      color: 'from-ocean-400 to-sage-500'
    },
    {
      icon: Building,
      title: 'Kurumsal Danışmanlık',
      description: 'İş yerlerinde çalışan sağlığı ve verimliliği artırmaya yönelik kurumsal psikolojik danışmanlık hizmetleri.',
      features: ['Çalışan Desteği', 'Stres Yönetimi', 'Takım Dinamikleri', 'Liderlik Koçluğu'],
      slug: 'kurumsal-danismanlik',
      color: 'from-warmth-400 to-sage-600'
    }
  ];

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
            {services.map((service) => (
              <div key={service.slug} className="bg-cream-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-sage-900">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-sage-800 mb-3">Hizmet Alanları:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-sage-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
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
            ))}
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