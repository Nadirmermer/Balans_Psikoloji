import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Star, Award, BookOpen, CheckCircle, Clock, ArrowLeft, Mail, Phone, MapPin, Users, Heart, Brain } from 'lucide-react';
import { useUzmanlar } from '../hooks/useUzmanlar';
import { useBlogYazilar } from '../hooks/useBlogYazilar';

interface ExpertProfileProps {
  onAppointmentClick: (options?: { preSelectedExpert?: string; preSelectedService?: string }) => void;
}

const ExpertProfile: React.FC<ExpertProfileProps> = ({ onAppointmentClick }) => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('about');
  
  const { uzmanlar, getUzmanBySlug, loading: uzmanLoading, error: uzmanError } = useUzmanlar();
  const { blogYazilar, getBlogYazilarByYazar, loading: blogLoading } = useBlogYazilar();

  if (uzmanLoading) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Uzman profili yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (uzmanError) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Hata: {uzmanError}</p>
          <Link to="/uzmanlar" className="text-sage-600 hover:text-sage-700">
            Uzmanlar sayfasına dönün
          </Link>
        </div>
      </div>
    );
  }

  const expert = getUzmanBySlug(slug || '');

  if (!expert) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-900 mb-4">Uzman Bulunamadı</h1>
          <Link to="/uzmanlar" className="text-sage-600 hover:text-sage-700">
            Uzmanlar sayfasına dönün
          </Link>
        </div>
      </div>
    );
  }

  // Bu uzmanın blog yazılarını getir
  const expertBlogPosts = getBlogYazilarByYazar(expert.id);

  const tabs = [
    { id: 'about', name: 'Hakkında', icon: Users },
    { id: 'education', name: 'Eğitim & Sertifikalar', icon: BookOpen },
    { id: 'blog', name: 'Blog Yazıları', icon: Heart }
  ];

  const weekDays = [
    { key: 'monday', name: 'Pazartesi', hours: '09:00 - 17:00' },
    { key: 'tuesday', name: 'Salı', hours: '09:00 - 17:00' },
    { key: 'wednesday', name: 'Çarşamba', hours: '09:00 - 17:00' },
    { key: 'thursday', name: 'Perşembe', hours: '09:00 - 17:00' },
    { key: 'friday', name: 'Cuma', hours: '09:00 - 17:00' },
    { key: 'saturday', name: 'Cumartesi', hours: '09:00 - 13:00' },
    { key: 'sunday', name: 'Pazar', hours: 'Kapalı' }
  ];

  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      {/* Geri Dön Butonu */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/uzmanlar" 
            className="inline-flex items-center text-sage-600 hover:text-sage-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Uzmanlar Sayfasına Dön
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sol Sütun - Özet ve Eylem Paneli (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm p-6">
                
                {/* Profil Fotoğrafı */}
                <div className="text-center mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-sage-100">
                    <img
                      src={expert.profil_resmi}
                      alt={`${expert.ad} ${expert.soyad}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* İsim ve Unvan */}
                  <h1 className="text-2xl font-bold text-sage-900 mb-1">{expert.ad} {expert.soyad}</h1>
                  <p className="text-ocean-600 font-medium text-lg mb-1">{expert.unvan}</p>
                  <p className="text-gray-600 text-sm">{expert.uzmanlik_alanlari.slice(0, 2).join(', ')}</p>
                </div>

                {/* Ana Randevu Butonu */}
                <button
                  onClick={() => onAppointmentClick({ preSelectedExpert: slug })}
                  className="w-full bg-warmth-500 hover:bg-warmth-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center mb-6 hover:shadow-lg transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Bu Uzmandan Randevu Al
                </button>

                {/* İletişim Bilgileri */}
                <div className="space-y-3 mb-6 text-sm">
                  {expert.email && (
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-3 text-sage-500" />
                      <span>{expert.email}</span>
                    </div>
                  )}
                  {expert.telefon && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="w-4 h-4 mr-3 text-sage-500" />
                      <span>{expert.telefon}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-3 text-sage-500" />
                    <span>Bolu Merkez</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-3 text-sage-500" />
                    <span>{expert.deneyim_yili} yıl deneyim</span>
                  </div>
                </div>

                {/* Uzmanlık Alanları */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-sage-900 mb-3">Uzmanlık Alanları</h3>
                  <div className="flex flex-wrap gap-1">
                    {expert.uzmanlik_alanlari.map((area: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* İstatistikler */}
                <div className="bg-cream-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-sage-900 mb-3">İstatistikler</h3>
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-sage-600">{expert.deneyim_yili}</div>
                      <div className="text-xs text-gray-600">Yıl Deneyim</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-ocean-600">4.9</div>
                      <div className="text-xs text-gray-600">Ortalama Puan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Sütun - Detaylı Bilgi Paneli */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              
              {/* Çalışma Saatleri */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-sage-900 mb-4">Çalışma Saatleri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {weekDays.map((day) => {
                    const workingHours = expert.calisma_saatleri?.[day.name];
                    const isWorking = workingHours?.aktif;
                    
                    return (
                      <div key={day.key} className={`flex items-center justify-between p-3 rounded-lg ${
                        isWorking ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700'
                      }`}>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {day.name}
                        </div>
                        <div className={`text-xs font-medium ${
                          isWorking ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {isWorking 
                            ? `${workingHours.baslangic} - ${workingHours.bitis}`
                            : 'Kapalı'
                          }
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sekme Navigasyonu */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center ${
                        activeTab === tab.id
                          ? 'border-sage-600 text-sage-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Sekme İçerikleri */}
              <div className="p-6">
                {activeTab === 'about' && (
                  <div>
                    <h3 className="text-2xl font-bold text-sage-900 mb-6">Hakkında</h3>
                    <div className="prose prose-lg max-w-none">
                      {expert.hakkinda ? (
                        expert.hakkinda.split('\n\n').map((paragraph: string, index: number) => (
                          <p key={index} className="text-gray-600 leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-600 leading-relaxed">
                          {expert.ad} {expert.soyad}, {expert.deneyim_yili} yıllık deneyimi ile {expert.uzmanlik_alanlari.join(', ')} 
                          alanlarında uzman hizmet vermektedir. Danışanlarına empati dolu ve profesyonel yaklaşımla destek sağlamaktadır.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'education' && (
                  <div>
                    <h3 className="text-2xl font-bold text-sage-900 mb-6">Eğitim & Sertifikalar</h3>
                    
                    {/* Eğitim */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-sage-800 mb-4">Eğitim</h4>
                      <div className="space-y-4">
                        {expert.egitim && Array.isArray(expert.egitim) && expert.egitim.length > 0 ? (
                          expert.egitim.map((edu: any, index: number) => (
                            <div key={index} className="flex items-start">
                              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                <BookOpen className="w-6 h-6 text-sage-600" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-sage-900">{edu.degree || edu.derece}</h5>
                                <p className="text-ocean-600 font-medium">{edu.school || edu.okul}</p>
                                <p className="text-sm text-gray-500">{edu.year || edu.yil}</p>
                                {(edu.details || edu.detay) && (
                                  <p className="text-sm text-gray-600 mt-1">{edu.details || edu.detay}</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-start">
                            <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                              <BookOpen className="w-6 h-6 text-sage-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sage-900">Psikoloji Lisans Derecesi</h5>
                              <p className="text-ocean-600 font-medium">Üniversite Eğitimi</p>
                              <p className="text-sm text-gray-600 mt-1">Psikoloji alanında lisans eğitimi tamamlanmıştır.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sertifikalar */}
                    <div>
                      <h4 className="text-lg font-semibold text-sage-800 mb-4">Sertifikalar</h4>
                      <div className="space-y-4">
                        {expert.sertifikalar && Array.isArray(expert.sertifikalar) && expert.sertifikalar.length > 0 ? (
                          expert.sertifikalar.map((cert: any, index: number) => (
                            <div key={index} className="flex items-start">
                              <div className="w-12 h-12 bg-warmth-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                <Award className="w-6 h-6 text-warmth-600" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-sage-900">{cert.name || cert.ad}</h5>
                                <p className="text-ocean-600 font-medium">{cert.organization || cert.kurum}</p>
                                <p className="text-sm text-gray-500">{cert.year || cert.yil}</p>
                                {(cert.level || cert.seviye) && (
                                  <p className="text-sm text-gray-600 mt-1">{cert.level || cert.seviye}</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-start">
                            <div className="w-12 h-12 bg-warmth-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                              <Award className="w-6 h-6 text-warmth-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-sage-900">Profesyonel Sertifikalar</h5>
                              <p className="text-ocean-600 font-medium">Uzmanlık Alanları</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {expert.uzmanlik_alanlari.join(', ')} konularında uzman sertifikalarına sahiptir.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'blog' && (
                  <div>
                    <h3 className="text-2xl font-bold text-sage-900 mb-6">Yazdığı Blog Yazıları</h3>
                    {blogLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Blog yazıları yükleniyor...</p>
                      </div>
                    ) : expertBlogPosts.length > 0 ? (
                      <div className="space-y-6">
                        {expertBlogPosts.map((post, index: number) => (
                          <Link
                            key={index}
                            to={`/blog/${post.slug}`}
                            className="block bg-cream-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={post.resim}
                                  alt={post.baslik}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sage-900 mb-2 hover:text-sage-700">
                                  {post.baslik}
                                </h4>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{post.ozet}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                                  <span className="mx-2">•</span>
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{post.okuma_suresi} dk</span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Henüz blog yazısı bulunmamaktadır.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt CTA Bölümü */}
      <section className="py-16 bg-gradient-to-br from-sage-600 to-ocean-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {expert.ad} {expert.soyad} ile Randevu Alın
          </h2>
          <p className="text-xl text-sage-100 mb-8">
            Uzman desteği almak ve iyileşme yolculuğunuza başlamak için randevu oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => onAppointmentClick({ preSelectedExpert: slug })}
              className="bg-warmth-500 hover:bg-warmth-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 inline-flex items-center hover:shadow-lg transform hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Randevu Al
            </button>
            <Link
              to="/uzmanlar"
              className="border-2 border-white text-white hover:bg-white hover:text-sage-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200"
            >
              Diğer Uzmanlar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpertProfile;