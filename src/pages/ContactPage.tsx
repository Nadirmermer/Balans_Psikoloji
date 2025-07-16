import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import { useIletisim } from '../hooks/useIletisim';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { sendMessage, loading, error } = useIletisim();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Sending contact message:', formData);
      
      await sendMessage({
        ad: formData.name,
        email: formData.email,
        konu: formData.subject,
        mesaj: formData.message
      });
      
      // Başarılı gönderim sonrası formu temizle
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.');
    } catch (err) {
      console.error('Contact form error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.';
      alert(errorMessage);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sage-50 to-ocean-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-sage-900 mb-6">
              Bize Ulaşın
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sorularınız, önerileriniz veya randevu talepleriniz için bizimle iletişime geçin. Size en kısa sürede yanıt vereceğiz.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-sage-900 mb-8">
                İletişim Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-900 mb-2">Adres</h3>
                    <p className="text-gray-600">
                      Cumhuriyet Mah. Atatürk Cad. No: 123/A<br />
                      Merkez/Bolu 14000<br />
                      Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-ocean-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-900 mb-2">Telefon</h3>
                    <p className="text-gray-600">
                      <a href="tel:+903742156543" className="hover:text-sage-600">
                        0374 215 65 43
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <a href="tel:+905321234567" className="hover:text-sage-600">
                        0532 123 45 67 (Acil)
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-warmth-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-warmth-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-900 mb-2">E-posta</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@balanspsikoloji.com" className="hover:text-sage-600">
                        info@balanspsikoloji.com
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <a href="mailto:randevu@balanspsikoloji.com" className="hover:text-sage-600">
                        randevu@balanspsikoloji.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-sage-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-sage-900 mb-2">Çalışma Saatleri</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                      <p>Cumartesi: 09:00 - 15:00</p>
                      <p>Pazar: Kapalı</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-cream-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-sage-900 mb-4">Hızlı İşlemler</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="/randevu"
                    className="bg-warmth-500 hover:bg-warmth-600 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Randevu Al
                  </a>
                  <a
                    href="tel:+903742156543"
                    className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center"
                  >
                    Hemen Ara
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-sage-900 mb-8">
                Mesaj Gönderin
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Konu
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="">Konu seçin</option>
                    <option value="randevu">Randevu Talebi</option>
                    <option value="bilgi">Genel Bilgi</option>
                    <option value="sikayet">Şikayet</option>
                    <option value="oneri">Öneri</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </button>
                
                {error && (
                  <p className="text-red-600 text-sm mt-2">{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Harita */}
            <div>
              <h2 className="text-3xl font-bold text-sage-900 mb-6">
                Lokasyonumuz
              </h2>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden h-96">
                <div className="bg-gradient-to-br from-sage-100 to-ocean-100 h-full flex items-center justify-center relative">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-sage-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-sage-900 mb-2">Balans Psikoloji</h3>
                    <p className="text-gray-600 mb-4">
                      Cumhuriyet Mah. Atatürk Cad. No: 123/A<br />
                      Merkez/Bolu 14000
                    </p>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 inline-block">
                      <p className="text-sm text-gray-600">
                        🚗 Ücretsiz park alanı mevcuttur<br />
                        🚌 Şehir merkezine 5 dakika yürüme mesafesi<br />
                        ♿ Engelli erişimi uygun
                      </p>
                    </div>
                  </div>
                  
                  {/* Dekoratif elementler */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-sage-300 rounded-full opacity-60"></div>
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-ocean-300 rounded-full opacity-40"></div>
                  <div className="absolute top-1/3 right-8 w-6 h-6 bg-warmth-300 rounded-full opacity-50"></div>
                </div>
              </div>
            </div>

            {/* İletişim Bilgileri ve Çalışma Saatleri */}
            <div>
              <h2 className="text-3xl font-bold text-sage-900 mb-6">
                İletişim Bilgileri
              </h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-sage-900 mb-2">Adresimiz</h3>
                      <p className="text-gray-600">
                        Cumhuriyet Mah. Atatürk Cad. No: 123/A<br />
                        Merkez/Bolu 14000<br />
                        Türkiye
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-ocean-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-ocean-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-sage-900 mb-2">Telefon</h3>
                      <p className="text-gray-600">
                        <a href="tel:+903742156543" className="hover:text-sage-600 transition-colors">
                          0374 215 65 43
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <a href="tel:+905321234567" className="hover:text-sage-600 transition-colors">
                          0532 123 45 67 (Acil)
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-warmth-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-warmth-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-sage-900 mb-2">E-posta</h3>
                      <p className="text-gray-600">
                        <a href="mailto:info@balanspsikoloji.com" className="hover:text-sage-600 transition-colors">
                          info@balanspsikoloji.com
                        </a>
                      </p>
                      <p className="text-gray-600">
                        <a href="mailto:randevu@balanspsikoloji.com" className="hover:text-sage-600 transition-colors">
                          randevu@balanspsikoloji.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-sage-900 mb-3">Çalışma Saatleri</h3>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex justify-between">
                          <span>Pazartesi - Cuma:</span>
                          <span className="font-medium">09:00 - 18:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cumartesi:</span>
                          <span className="font-medium">09:00 - 15:00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pazar:</span>
                          <span className="font-medium text-red-600">Kapalı</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-900 mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-600">
              En çok merak edilen sorular ve cevapları
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-cream-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-sage-900 mb-3">
                Randevu nasıl alabilirim?
              </h3>
              <p className="text-gray-600">
                Randevu almak için online formumuzu kullanabilir, telefon ile arayabilir veya e-posta gönderebilirsiniz. Online randevu sistemi 7/24 aktiftir.
              </p>
            </div>

            <div className="bg-cream-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-sage-900 mb-3">
                İlk seansta ne olur?
              </h3>
              <p className="text-gray-600">
                İlk seansta uzmanımız sizinle detaylı bir görüşme yaparak durumunuzu değerlendirir ve size en uygun tedavi planını oluşturur.
              </p>
            </div>

            <div className="bg-cream-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-sage-900 mb-3">
                Online terapi nasıl çalışır?
              </h3>
              <p className="text-gray-600">
                Online terapi, güvenli video görüşme platformu üzerinden yürütülür. Yüz yüze terapi ile aynı etkiye sahiptir ve evden katılabilirsiniz.
              </p>
            </div>

            <div className="bg-cream-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-sage-900 mb-3">
                Gizlilik nasıl korunur?
              </h3>
              <p className="text-gray-600">
                Tüm görüşmeler tam gizlilik içinde yürütülür. Psikolog-danışan mahremiyeti yasalarla korunmaktadır ve bilgileriniz kesinlikle üçüncü kişilerle paylaşılmaz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-gradient-to-br from-sage-600 to-ocean-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Acil Durum Desteği
            </h2>
            <p className="text-xl text-sage-100 mb-8">
              Acil psikolojik destek gerektiğinde 7/24 ulaşabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="tel:+905321234567"
                className="bg-warmth-500 hover:bg-warmth-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 inline-flex items-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Acil Hat: 0532 123 45 67
              </a>
              <a
                href="mailto:acil@balanspsikoloji.com"
                className="border-2 border-white text-white hover:bg-white hover:text-sage-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 inline-flex items-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Acil E-posta
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;