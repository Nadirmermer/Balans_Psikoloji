import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Shield, Users, Brain, Star, Calendar, BookOpen, Building } from 'lucide-react';
import { useHizmetler } from '../hooks/useHizmetler';
import { useUzmanlar } from '../hooks/useUzmanlar';
import { useBlogYazilar } from '../hooks/useBlogYazilar';
import Carousel from '../components/Carousel';
import ValuesCarousel from '../components/ValuesCarousel';
import EducationSection from '../components/EducationSection';

interface HomePageProps {
  onAppointmentClick: (options?: { preSelectedExpert?: string; preSelectedService?: string }) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onAppointmentClick }) => {
  const { hizmetler, loading: hizmetlerLoading } = useHizmetler();
  const { uzmanlar, loading: uzmanlarLoading } = useUzmanlar();
  const { blogYazilar, loading: blogLoading } = useBlogYazilar();

  // SEO Meta Tags için Head component ekleyelim
  useEffect(() => {
    document.title = 'Balans Psikoloji - Bolu | Ruh Sağlığı ve Psikolojik Danışmanlık';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Bolu\'da ruh sağlığınız için güvenilir destek. Bireysel terapi, çift terapisi, aile danışmanlığı ve çocuk psikolojisi hizmetleri. Uzman psikologlarımızdan randevu alın.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Bolu\'da ruh sağlığınız için güvenilir destek. Bireysel terapi, çift terapisi, aile danışmanlığı ve çocuk psikolojisi hizmetleri. Uzman psikologlarımızdan randevu alın.';
      document.head.appendChild(meta);
    }

    // Keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = 'psikolog bolu, psikolojik danışmanlık bolu, terapi bolu, ruh sağlığı bolu, çift terapisi, aile danışmanlığı, çocuk psikolojisi';
      document.head.appendChild(meta);
    }
  }, []);
  const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    'bireysel-terapi': Heart,
    'cift-terapisi': Users,
    'aile-danismanligi': Shield,
    'cocuk-psikolojisi': Brain,
    'egitim-danismanligi': BookOpen,
    'kurumsal-danismanlik': Building
  };

  const testimonials = [
    {
      name: 'A.K.',
      text: 'Balans Psikoloji\'de aldığım terapi sayesinde yaşadığım kaygı bozukluğunun üstesinden gelebildim. Çok profesyonel ve empati dolu bir yaklaşım.',
      rating: 5
    },
    {
      name: 'M.S.',
      text: 'Evliliğimizde yaşadığımız sorunları çözmede bize büyük destek oldular. Şimdi ilişkimiz çok daha güçlü.',
      rating: 5
    },
    {
      name: 'E.T.',
      text: 'Çocuğumun okul fobisi ile başa çıkmamızda çok yardımcı oldular. Gerçekten güvenilir bir merkez.',
      rating: 5
    }
  ];

  if (hizmetlerLoading || uzmanlarLoading || blogLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* Main Carousel Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Hizmetlerimizi Keşfedin ve
              <span className="block text-primary-600">Randevu Alın</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Balans psikolojik danışmanlık ve psikoterapi süreçlerini daha iyi anlamak için yazılı ve görsel içeriklerimize göz gezdirin.
            </p>
          </div>
          
          <Carousel 
            items={[
              {
                id: 'hizmetler',
                title: 'Hizmetlerimiz',
                description: 'Bireysel terapi, çift terapisi, aile danışmanlığı ve daha fazlası',
                icon: Users,
                link: '/hizmetler',
                backgroundImage: '/images/carousel/services-bg.jpg',
                buttonText: 'Hizmetlerimiz'
              },
              {
                id: 'blog',
                title: 'Blog',
                description: 'Psikolojik danışmanlık ve psikoterapi süreçleri hakkında yazılı ve görsel içerikler',
                icon: BookOpen,
                link: '/blog',
                backgroundImage: '/images/carousel/blog-bg.jpg',
                buttonText: 'Blog\'a Git'
              },
              {
                id: 'faq',
                title: 'Sık Sorulanlar',
                description: 'Terapi ve danışmanlık hizmetleri hakkında merak edilen noktalar',
                icon: BookOpen,
                link: '/sik-sorulanlar',
                backgroundImage: '/images/carousel/faq-bg.jpg',
                buttonText: 'Sorular'
              }
            ]}
            onAppointmentClick={onAppointmentClick}
          />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Her bireyin benzersiz ihtiyaçlarına yönelik kapsamlı psikolojik destek hizmetleri
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hizmetler.slice(0, 4).map((hizmet) => {
              const IconComponent = serviceIcons[hizmet.slug] || Heart;
              return (
                <Link
                  key={hizmet.id}
                  to={`/hizmet/${hizmet.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{hizmet.ad}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">{hizmet.aciklama}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values, Mission, Vision Section */}
      <ValuesCarousel />

      {/* Experts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Uzmanlarımızla Tanışın
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Alanlarında uzman, deneyimli psikolog kadromuz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {uzmanlar.slice(0, 3).map((uzman) => (
              <Link
                key={uzman.id}
                to={`/uzman/${uzman.slug}`}
                className="bg-gray-50 hover:bg-primary-50 p-6 rounded-xl transition-all duration-300 group hover:shadow-lg transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <img
                      src={uzman.profil_resmi}
                      alt={`${uzman.ad} ${uzman.soyad}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{uzman.ad} {uzman.soyad}</h3>
                  <p className="text-secondary-600 font-medium mb-2">{uzman.unvan}</p>
                  <p className="text-gray-600 text-sm">{uzman.uzmanlik_alanlari.slice(0, 2).join(', ')}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button
              onClick={() => onAppointmentClick()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Tüm Uzmanlarımızı Görün</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Danışanlarımızın Yorumları
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hizmetlerimiz hakkında gerçek deneyimler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="text-gray-900 font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <EducationSection />

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Blog'dan Son Yazılar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ruh sağlığı konusunda bilgilendirici yazılar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogYazilar.slice(0, 3).map((yazi) => (
              <Link
                key={yazi.id}
                to={`/blog/${yazi.slug}`}
                className="bg-gray-50 hover:bg-primary-50 rounded-xl overflow-hidden transition-all duration-300 group hover:shadow-lg transform hover:scale-105"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={yazi.resim}
                    alt={yazi.baslik}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <p className="text-sm text-secondary-600 mb-2">
                    {new Date(yazi.created_at).toLocaleDateString('tr-TR')}
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{yazi.baslik}</h3>
                  <p className="text-gray-600 text-sm">{yazi.ozet}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            {/* Randevu Al butonu kaldırıldı */}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            İyileşme Yolculuğunuza İlk Adımı Atın
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Ruh sağlığınıza yatırım yapmak için hiç geç değil. Uzman kadromuz, size en uygun destek sürecini planlamak için burada.
          </p>
          <button
            onClick={() => onAppointmentClick()}
            className="bg-accent-500 hover:bg-accent-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-200 inline-flex items-center space-x-2 hover:shadow-lg transform hover:scale-105"
          >
            <Calendar className="w-6 h-6" />
            <span>Hemen Randevu Al</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;