import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Users, Shield, Brain, Video, Building, Calendar, ArrowRight, CheckCircle, Award, ChevronDown, ChevronUp, BookOpen, User, ArrowLeft } from 'lucide-react';
import { useHizmetler } from '../hooks/useHizmetler';
import { useUzmanlar } from '../hooks/useUzmanlar';
import { useBlogYazilar } from '../hooks/useBlogYazilar';
import { createSanitizedHTML } from '../lib/sanitize';

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const { hizmetler, getHizmetBySlug, loading: hizmetLoading, error: hizmetError } = useHizmetler();
  const { uzmanlar, loading: uzmanLoading } = useUzmanlar();
  const { blogYazilar, loading: blogLoading } = useBlogYazilar();

  const allServices = [
    { id: 'bireysel-terapi', name: 'Bireysel Terapi', icon: Heart },
    { id: 'cift-terapisi', name: 'Çift Terapisi', icon: Users },
    { id: 'aile-danismanligi', name: 'Aile Danışmanlığı', icon: Shield },
    { id: 'cocuk-psikolojisi', name: 'Çocuk Psikolojisi', icon: Brain },
    { id: 'online-terapi', name: 'Online Terapi', icon: Video },
    { id: 'kurumsal-danismanlik', name: 'Kurumsal Danışmanlık', icon: Building }
  ];

  if (hizmetLoading || uzmanLoading) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-600 mx-auto mb-4"></div>
          <p className="text-sage-600">Hizmet detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (hizmetError) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Hata: {hizmetError}</p>
          <Link to="/hizmetler" className="text-sage-600 hover:text-sage-700">
            Hizmetler sayfasına dönün
          </Link>
        </div>
      </div>
    );
  }

  const currentService = getHizmetBySlug(slug || '');

  if (!currentService) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-900 mb-4">Hizmet Bulunamadı</h1>
          <Link to="/hizmetler" className="text-sage-600 hover:text-sage-700">
            Hizmetler sayfasına dönün
          </Link>
        </div>
      </div>
    );
  }

  // Bu hizmeti sunan uzmanları bul (şimdilik tüm uzmanları göster)
  const serviceExperts = uzmanlar.filter(uzman => 
    uzman.uzmanlik_alanlari.some(alan => 
      alan.toLowerCase().includes(currentService.ad.toLowerCase().split(' ')[0])
    )
  ).slice(0, 2);

  // İlgili blog yazılarını bul
  const relatedBlogPosts = blogYazilar.filter(yazi => 
    yazi.kategori?.toLowerCase().includes(currentService.ad.toLowerCase().split(' ')[0]) ||
    yazi.etiketler.some(etiket => 
      etiket.toLowerCase().includes(currentService.ad.toLowerCase().split(' ')[0])
    )
  ).slice(0, 4);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Genel SSS'ler (hizmet türüne göre özelleştirilebilir)
  const generalFAQs = [
    {
      question: `${currentService.ad} ne kadar sürer?`,
      answer: `${currentService.ad} seansları genellikle ${currentService.sure_dakika} dakika sürmektedir. Tedavi süresi, yaşadığınız sorunun türü ve karmaşıklığına göre değişir. İlk değerlendirme sonrasında size özel bir tedavi planı oluşturulur.`
    },
    {
      question: 'Seans ücretleri nedir?',
      answer: `${currentService.ad} seans ücretleri uzmanımıza göre değişiklik gösterebilir. Detaylı fiyat bilgisi için uzman profillerini inceleyebilir veya randevu alırken öğrenebilirsiniz. Bazı özel sağlık sigortaları psikolojik danışmanlık hizmetlerini kısmen karşılayabilir.`
    },
    {
      question: 'Online seanslar mevcut mu?',
      answer: 'Evet, güvenli video konferans platformları kullanılarak online seanslar yapılmaktadır. Online seanslar yüz yüze seanslar kadar etkilidir.'
    },
    {
      question: 'Gizlilik nasıl korunur?',
      answer: 'Tüm seanslar psikolog-danışan mahremiyeti kapsamında tam gizlilik içinde yürütülür. Paylaşılan bilgiler kesinlikle üçüncü kişilerle paylaşılmaz.'
    },
    {
      question: `${currentService.ad} kimler için uygundur?`,
      answer: `${currentService.ad} hizmeti, bu alanda destek almak isteyen herkes için uygundur. Uzmanlarımız ilk görüşmede durumunuzu değerlendirerek size en uygun yaklaşımı belirler.`
    },
    {
      question: 'Randevu nasıl alabilirim?',
      answer: 'Randevu almak için web sitemizden online randevu formunu doldurabilir, telefon ile arayabilir veya e-posta gönderebilirsiniz. Uzmanlarımızın müsaitlik durumuna göre size en uygun randevu saati önerilir.'
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      {/* Back Button */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/hizmetler" 
            className="inline-flex items-center text-sage-600 hover:text-sage-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Hizmetler Sayfasına Dön
          </Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sol Sütun - Hizmetler Menüsü (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-sage-900 mb-4">Tüm Hizmetlerimiz</h3>
                <nav className="space-y-2">
                  {allServices.map((service) => {
                    const serviceExists = hizmetler.some(h => h.slug === service.id);
                    if (!serviceExists) return null;
                    
                    return (
                      <Link
                        key={service.id}
                        to={`/hizmet/${service.id}`}
                        className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                          slug === service.id
                            ? 'bg-sage-100 text-sage-700 border-l-4 border-sage-600'
                            : 'text-gray-600 hover:bg-sage-50 hover:text-sage-600'
                        }`}
                      >
                        <service.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{service.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Sağ Sütun - Ana İçerik */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              
              {/* Başlık Alanı */}
              <div className="p-8 pb-0">
                <h1 className="text-4xl font-bold text-sage-900 mb-6">{currentService.ad}</h1>
              </div>

              {/* Görsel */}
              {currentService.resim && (
                <div className="px-8 mb-8">
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={currentService.resim}
                      alt={currentService.ad}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              )}

              {/* Açıklama */}
              <div className="px-8 mb-8">
                <p className="text-lg text-gray-600 leading-relaxed">{currentService.aciklama}</p>
                {currentService.detay && (
                  <div className="mt-6">
                    <div 
                      className="prose prose-lg max-w-none
                        prose-headings:text-sage-900 prose-headings:font-bold
                        prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-4
                        prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-3
                        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                        prose-ul:text-gray-700 prose-li:mb-2
                        prose-a:text-sage-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-sage-700
                        prose-strong:text-sage-800 prose-strong:font-semibold
                        dark:prose-headings:text-sage-100 dark:prose-p:text-gray-300 dark:prose-ul:text-gray-300 
                        dark:prose-a:text-sage-400 dark:hover:prose-a:text-sage-300
                        dark:prose-strong:text-sage-200"
                      dangerouslySetInnerHTML={createSanitizedHTML(currentService.detay)}
                    />
                  </div>
                )}
              </div>

              {/* Hizmet Bilgileri */}
              <div className="px-8 mb-8">
                <h2 className="text-2xl font-bold text-sage-900 mb-6">Hizmet Bilgileri</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-cream-50 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-sage-600 mb-2">{currentService.fiyat} ₺</div>
                    <div className="text-gray-600">Seans Ücreti</div>
                  </div>
                  <div className="bg-cream-50 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-ocean-600 mb-2">{currentService.sure_dakika} dk</div>
                    <div className="text-gray-600">Seans Süresi</div>
                  </div>
                  <div className="bg-cream-50 rounded-lg p-6 text-center">
                    <div className="text-2xl font-bold text-warmth-600 mb-2">Yüz Yüze & Online</div>
                    <div className="text-gray-600">Görüşme Türü</div>
                  </div>
                </div>
              </div>

              {/* Bu Alanda Uzmanlaşan Terapistlerimiz */}
              {serviceExperts.length > 0 && (
                <div className="px-8 mb-8">
                  <h2 className="text-2xl font-bold text-sage-900 mb-6">
                    Bu Alanda Uzmanlaşan Terapistlerimiz
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {serviceExperts.map((expert) => (
                      <div key={expert.id} className="bg-cream-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start mb-6">
                          <div className="w-20 h-20 rounded-full overflow-hidden mr-6 flex-shrink-0">
                            <img
                              src={expert.profil_resmi}
                              alt={`${expert.ad} ${expert.soyad}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-sage-900 mb-1">{expert.ad} {expert.soyad}</h3>
                            <p className="text-ocean-600 font-semibold mb-1">{expert.unvan}</p>
                            <p className="text-sm text-gray-500 mb-3">{expert.deneyim_yili} yıl deneyim</p>
                          </div>
                        </div>
                        
                        {/* Uzmanlık Alanları */}
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {expert.uzmanlik_alanlari.slice(0, 3).map((specialty: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-medium"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {/* Butonlar */}
                        <div className="space-y-3">
                          <Link
                            to={`/uzman/${expert.slug}`}
                            className="block w-full bg-sage-600 hover:bg-sage-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center"
                          >
                            Detaylı Profili İncele
                          </Link>
                          <Link
                            to={`/randevu?uzman=${expert.slug}&hizmet=${slug}`}
                            className="block w-full bg-warmth-500 hover:bg-warmth-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors text-center flex items-center justify-center"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Randevu Al
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* İlgili Blog Yazıları */}
              {relatedBlogPosts.length > 0 && (
                <div className="px-8 mb-8">
                  <h2 className="text-2xl font-bold text-sage-900 mb-6">
                    Bu Konu Hakkında Daha Fazla Bilgi Edinin
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedBlogPosts.map((post, index: number) => (
                      <Link
                        key={index}
                        to={`/blog/${post.slug}`}
                        className="bg-cream-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="h-40 overflow-hidden">
                          <img
                            src={post.resim}
                            alt={post.baslik}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-xs text-gray-500 mb-2">
                            {post.yazar && (
                              <>
                                <User className="w-3 h-3 mr-1" />
                                <span>{post.yazar.ad} {post.yazar.soyad}</span>
                                <span className="mx-2">•</span>
                              </>
                            )}
                            <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
                            <span className="mx-2">•</span>
                            <span>{post.okuma_suresi} dk</span>
                          </div>
                          <h3 className="text-lg font-semibold text-sage-900 mb-2 group-hover:text-sage-700 transition-colors">
                            {post.baslik}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">{post.ozet}</p>
                          <div className="flex items-center text-sage-600 text-sm font-medium mt-3">
                            <span>Devamını oku</span>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* SSS Bölümü */}
              <div className="px-8 mb-8">
                <h2 className="text-2xl font-bold text-sage-900 mb-6">
                  {currentService.ad} Hakkında Sıkça Sorulan Sorular
                </h2>
                <div className="space-y-4">
                  {generalFAQs.map((faq, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-4 text-left bg-cream-50 hover:bg-sage-50 transition-colors flex items-center justify-between"
                      >
                        <h3 className="text-lg font-semibold text-sage-900 pr-4">
                          {faq.question}
                        </h3>
                        {openFAQ === index ? (
                          <ChevronUp className="w-5 h-5 text-sage-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-sage-600 flex-shrink-0" />
                        )}
                      </button>
                      {openFAQ === index && (
                        <div className="px-6 py-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Bölümü */}
              <div className="bg-gradient-to-br from-sage-600 to-ocean-600 p-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  İyileşme Yolculuğunuza Başlayın
                </h2>
                <p className="text-xl text-sage-100 mb-6">
                  Uzman kadromuz ile ilk görüşmenizi planlayın ve iyileşme sürecinize başlayın.
                </p>
                <Link
                  to={`/randevu?hizmet=${slug}`}
                  className="bg-warmth-500 hover:bg-warmth-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 inline-flex items-center hover:shadow-lg transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {currentService.ad} İçin Randevu Al
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;