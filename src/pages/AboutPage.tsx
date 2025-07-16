import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, Award, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { useUzmanlar } from '../hooks/useUzmanlar';

const AboutPage = () => {
  const { uzmanlar, loading, error } = useUzmanlar();

  const supportStaff = [
    {
      name: 'Zehra Kaya',
      title: 'Hasta Koordinatörü',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    },
    {
      name: 'Ahmet Yılmaz',
      title: 'Randevu Koordinatörü',
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Empati ve Anlayış',
      description: 'Her danışanımızın benzersiz hikayesini dinler, yargılamadan anlayış gösteririz.'
    },
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description: 'Etik kurallara bağlı, bilimsel temellere dayanan güvenilir hizmet sunarız.'
    },
    {
      icon: Users,
      title: 'Bütüncül Yaklaşım',
      description: 'Sadece semptomları değil, kişinin tamamını göz önünde bulundururuz.'
    },
    {
      icon: Award,
      title: 'Sürekli Gelişim',
      description: 'Kendimizi sürekli geliştirerek en güncel tedavi yöntemlerini uygularız.'
    }
  ];

  const milestones = [
    {
      year: '2018',
      title: 'Kuruluş',
      description: 'Balans Psikoloji, Bolu\'da ruh sağlığı hizmetleri sunmak amacıyla kuruldu.'
    },
    {
      year: '2019',
      title: 'Ekip Genişlemesi',
      description: 'Çocuk psikolojisi ve aile danışmanlığı alanlarında uzman kadromuzu genişlettik.'
    },
    {
      year: '2020',
      title: 'Online Hizmetler',
      description: 'Pandemi sürecinde online terapi hizmetlerini başlattık.'
    },
    {
      year: '2022',
      title: 'Yeni Merkez',
      description: 'Daha geniş ve konforlu yeni merkezimize taşındık.'
    },
    {
      year: '2024',
      title: 'Bugün',
      description: '500+ mutlu danışan, uzman psikolog kadromuzla hizmet vermeye devam ediyoruz.'
    }
  ];

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Sayfa yükleniyor...</p>
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
              Biz Kimiz ve Neye İnanıyoruz?
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Balans Psikoloji olarak, her bireyin kendi içindeki gücü keşfetmesine ve yaşamında denge bulmasına yardımcı olmak için buradayız. Ruh sağlığının bir lüks değil, temel bir hak olduğuna inanıyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-sage-900 mb-6">Misyonumuz</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Bolu ve çevresindeki bireylere, çiftlere ve ailelere en kaliteli psikolojik destek hizmetlerini sunmak. Bilimsel temellere dayanan, empati dolu yaklaşımımızla danışanlarımızın yaşam kalitesini artırmak ve ruh sağlığı konusunda farkındalık yaratmak.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Her danışanımızın benzersiz bir hikayesi olduğuna inanır, onlara güvenli bir alan sunarak kendi potansiyellerini keşfetmelerine yardımcı oluruz.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Terapi seansı"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage-900/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-900 mb-6">
              Balans Psikoloji'nin Kuruluş Hikayesi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              2018 yılında, Bolu'da kaliteli ruh sağlığı hizmetlerine duyulan ihtiyacı fark ederek yola çıktık.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Kurucumuz Dr. Ayşe Demir, İstanbul'da aldığı eğitim ve deneyimlerinin ardından memleketine dönerek, Bolu'da yaşayan insanlara kaliteli psikolojik destek sunma hayaliyle Balans Psikoloji'yi kurdu.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                İlk günden itibaren amacımız, sadece tedavi etmek değil, aynı zamanda toplumda ruh sağlığı konusunda farkındalık yaratmak ve bu alanın tabularını kırmak oldu. Her geçen yıl büyüyen ekibimizle, binlerce kişiye ulaştık.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Bugün, {uzmanlar.length} uzman psikolog ve destek ekibimizle, Bolu'nun en güvenilir ruh sağlığı merkezi olma yolunda kararlılıkla ilerliyoruz.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Merkez görünümü"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-sage-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-sage-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-sage-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-sage-600 rounded-full border-4 border-white shadow-md"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-900 mb-6">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Çalışmalarımızı yönlendiren temel değerler ve ilkelerimiz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sage-500 to-ocean-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-sage-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Space */}
      <section className="py-20 bg-gradient-to-br from-sage-50 to-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-900 mb-6">
              Merkezimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Huzur ve güven veren, modern ve konforlu alanımızda sizleri ağırlıyoruz
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative group">
              <img
                src="https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                alt="Bekleme alanı"
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold">Bekleme Alanı</h3>
                <p className="text-sm">Rahat ve huzurlu bekleme ortamı</p>
              </div>
            </div>
            
            <div className="relative group">
              <img
                src="https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                alt="Terapi odası"
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold">Terapi Odaları</h3>
                <p className="text-sm">Özel ve güvenli görüşme alanları</p>
              </div>
            </div>
            
            <div className="relative group">
              <img
                src="https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                alt="Çocuk oyun alanı"
                className="w-full h-64 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold">Çocuk Alanı</h3>
                <p className="text-sm">Çocuklar için özel tasarlanmış alan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-900 mb-6">
              Ekibimizle Tanışın
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Alanlarında uzman, deneyimli ve sürekli gelişim halindeki ekibimiz
            </p>
          </div>
          
          {/* Psychologists */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-sage-900 mb-8 text-center">Uzman Psikologlarımız</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Uzmanlar yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">Uzman bilgileri yüklenirken hata oluştu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {uzmanlar.map((member) => (
                  <Link
                    key={member.id}
                    to={`/uzman/${member.slug}`}
                    className="bg-cream-50 hover:bg-sage-50 p-6 rounded-xl transition-all duration-300 group hover:shadow-lg transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <img
                          src={member.profil_resmi}
                          alt={`${member.ad} ${member.soyad}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-lg font-semibold text-sage-900 mb-1">{member.ad} {member.soyad}</h4>
                      <p className="text-ocean-600 font-medium mb-2">{member.unvan}</p>
                      <p className="text-sm text-gray-500 mb-3">{member.deneyim_yili} yıl deneyim</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {member.uzmanlik_alanlari.slice(0, 2).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Support Staff */}
          <div>
            <h3 className="text-2xl font-bold text-sage-900 mb-8 text-center">Destek Ekibimiz</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {supportStaff.map((staff, index) => (
                <div key={index} className="bg-cream-50 p-6 rounded-xl text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4">
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-sage-900 mb-1">{staff.name}</h4>
                  <p className="text-ocean-600 font-medium">{staff.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gradient-to-br from-sage-600 to-ocean-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bizimle İletişime Geçin
          </h2>
          <p className="text-xl text-sage-100 mb-8">
            Sorularınız için bize ulaşın veya randevu oluşturun
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Adres</h3>
              <p className="text-sage-100 text-sm">
                Cumhuriyet Mah. Atatürk Cad.<br />
                No: 123/A, Merkez/Bolu
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Telefon</h3>
              <p className="text-sage-100 text-sm">0374 215 65 43</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">E-posta</h3>
              <p className="text-sage-100 text-sm">info@balanspsikoloji.com</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/randevu"
              className="bg-warmth-500 hover:bg-warmth-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 inline-flex items-center hover:shadow-lg transform hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Randevu Al
            </Link>
            <Link
              to="/iletisim"
              className="border-2 border-white text-white hover:bg-white hover:text-sage-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
            >
              İletişim Sayfası
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;