import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Eye } from 'lucide-react';

const LegalPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const legalPages: Record<string, any> = {
    'gizlilik-politikasi': {
      title: 'Gizlilik Politikası',
      icon: Shield,
      lastUpdated: '15 Mart 2024',
      content: `
        <h2>1. Giriş</h2>
        <p>Balans Psikoloji olarak, kişisel verilerinizin korunması konusunda hassasiyetle hareket etmekteyiz. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde ve hizmetlerimizden yararlandığınızda kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi vermektedir.</p>

        <h2>2. Toplanan Bilgiler</h2>
        <p>Web sitemizi kullanırken aşağıdaki bilgiler toplanabilir:</p>
        <ul>
          <li>Ad, soyad ve iletişim bilgileri</li>
          <li>E-posta adresi ve telefon numarası</li>
          <li>Randevu talepleri ve terapi süreçleri ile ilgili bilgiler</li>
          <li>Web sitesi kullanım verileri ve çerezler</li>
        </ul>

        <h2>3. Bilgilerin Kullanımı</h2>
        <p>Toplanan kişisel veriler aşağıdaki amaçlarla kullanılmaktadır:</p>
        <ul>
          <li>Psikolojik danışmanlık hizmetlerinin sunulması</li>
          <li>Randevu planlaması ve takibi</li>
          <li>İletişim ve bilgilendirme</li>
          <li>Hizmet kalitesinin artırılması</li>
        </ul>

        <h2>4. Bilgi Güvenliği</h2>
        <p>Kişisel verileriniz, yetkisiz erişim, kullanım veya ifşaya karşı uygun teknik ve idari önlemlerle korunmaktadır. Verileriniz güvenli sunucularda saklanmakta ve şifreleme teknolojileri kullanılmaktadır.</p>

        <h2>5. Üçüncü Taraflarla Paylaşım</h2>
        <p>Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmamaktadır. Psikolog-danışan mahremiyeti yasalarla korunmaktadır.</p>

        <h2>6. Haklarınız</h2>
        <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenen verileriniz hakkında bilgi talep etme</li>
          <li>Verilerin düzeltilmesini veya silinmesini isteme</li>
          <li>İşleme itiraz etme</li>
        </ul>

        <h2>7. İletişim</h2>
        <p>Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:</p>
        <p>E-posta: info@balanspsikoloji.com<br>
        Telefon: 0374 215 65 43</p>
      `
    },
    'kvkk-metni': {
      title: 'KVKK Aydınlatma Metni',
      icon: FileText,
      lastUpdated: '15 Mart 2024',
      content: `
        <h2>Veri Sorumlusu</h2>
        <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Balans Psikoloji veri sorumlusu sıfatıyla, kişisel verilerinizin işlenmesine ilişkin olarak sizi bilgilendirmektedir.</p>

        <h2>Kişisel Verilerin İşlenme Amacı</h2>
        <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
        <ul>
          <li>Psikolojik danışmanlık hizmetlerinin sunulması</li>
          <li>Randevu yönetimi ve takibi</li>
          <li>Müşteri memnuniyetinin sağlanması</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>İletişim faaliyetlerinin yürütülmesi</li>
        </ul>

        <h2>Kişisel Verilerin Toplanma Yöntemi</h2>
        <p>Kişisel verileriniz, web sitemiz üzerinden, telefon görüşmeleri sırasında, randevu formları aracılığıyla ve terapi seansları esnasında toplanmaktadır.</p>

        <h2>İşlenen Kişisel Veri Kategorileri</h2>
        <ul>
          <li>Kimlik bilgileri (ad, soyad)</li>
          <li>İletişim bilgileri (telefon, e-posta, adres)</li>
          <li>Sağlık verileri (terapi süreçleri ile ilgili)</li>
          <li>İşlem güvenliği bilgileri</li>
        </ul>

        <h2>Kişisel Verilerin Aktarılması</h2>
        <p>Kişisel verileriniz, hukuki yükümlülüklerimizi yerine getirmek amacıyla yetkili kamu kurum ve kuruluşlarına aktarılabilir.</p>

        <h2>Kişisel Veri Sahibinin Hakları</h2>
        <p>KVKK'nın 11. maddesi uyarınca sahip olduğunuz haklar:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
          <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
          <li>Kanunda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
          <li>İşleme itiraz etme</li>
          <li>Otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
          <li>Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
        </ul>

        <h2>Başvuru Yöntemi</h2>
        <p>Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki iletişim bilgileri üzerinden bizimle iletişime geçebilirsiniz:</p>
        <p>Adres: Cumhuriyet Mah. Atatürk Cad. No: 123/A, Merkez/Bolu<br>
        E-posta: kvkk@balanspsikoloji.com<br>
        Telefon: 0374 215 65 43</p>
      `
    },
    'kullanim-kosullari': {
      title: 'Kullanım Koşulları',
      icon: Eye,
      lastUpdated: '15 Mart 2024',
      content: `
        <h2>1. Genel Hükümler</h2>
        <p>Bu kullanım koşulları, Balans Psikoloji web sitesinin kullanımına ilişkin şartları düzenlemektedir. Web sitemizi kullanarak bu koşulları kabul etmiş sayılırsınız.</p>

        <h2>2. Hizmet Kapsamı</h2>
        <p>Web sitemiz aracılığıyla sunulan hizmetler:</p>
        <ul>
          <li>Psikolojik danışmanlık hizmetleri hakkında bilgilendirme</li>
          <li>Uzman psikolog profilleri ve uzmanlık alanları</li>
          <li>Randevu alma sistemi</li>
          <li>Blog yazıları ve eğitici içerikler</li>
          <li>İletişim ve bilgi alma imkanları</li>
        </ul>

        <h2>3. Kullanıcı Sorumlulukları</h2>
        <p>Web sitemizi kullanırken:</p>
        <ul>
          <li>Doğru ve güncel bilgiler vermelisiniz</li>
          <li>Başkalarının haklarına saygı göstermelisiniz</li>
          <li>Yasalara aykırı içerik paylaşmamalısınız</li>
          <li>Sistemi kötüye kullanmamalısınız</li>
        </ul>

        <h2>4. Randevu Koşulları</h2>
        <ul>
          <li>Randevu talepleri onay sürecinden geçer</li>
          <li>Randevu iptali için en az 24 saat önceden bildirim gereklidir</li>
          <li>Geç kalma durumunda seans süresi kısalabilir</li>
          <li>Ödeme koşulları randevu onayı sırasında bildirilir</li>
        </ul>

        <h2>5. Fikri Mülkiyet Hakları</h2>
        <p>Web sitesindeki tüm içerik, tasarım ve yazılım Balans Psikoloji'nin fikri mülkiyetidir. İzinsiz kullanım yasaktır.</p>

        <h2>6. Sorumluluk Sınırlaması</h2>
        <p>Web sitesinin kullanımından doğabilecek zararlardan Balans Psikoloji sorumlu değildir. Hizmetlerimiz tıbbi acil durumlar için uygun değildir.</p>

        <h2>7. Değişiklikler</h2>
        <p>Bu kullanım koşulları önceden haber verilmeksizin değiştirilebilir. Güncel koşullar web sitemizde yayınlanır.</p>

        <h2>8. Uygulanacak Hukuk</h2>
        <p>Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklar Bolu mahkemelerinde çözülür.</p>

        <h2>9. İletişim</h2>
        <p>Kullanım koşulları hakkında sorularınız için:</p>
        <p>E-posta: info@balanspsikoloji.com<br>
        Telefon: 0374 215 65 43</p>
      `
    },
    'cerez-politikasi': {
      title: 'Çerez Politikası',
      icon: Eye,
      lastUpdated: '15 Mart 2024',
      content: `
        <h2>Çerez Nedir?</h2>
        <p>Çerezler, web sitelerinin daha iyi çalışması ve kullanıcı deneyiminin iyileştirilmesi için bilgisayarınızda saklanan küçük metin dosyalarıdır.</p>

        <h2>Kullandığımız Çerez Türleri</h2>
        
        <h3>Zorunlu Çerezler</h3>
        <p>Web sitesinin temel işlevlerinin çalışması için gerekli çerezlerdir. Bu çerezler olmadan site düzgün çalışmaz.</p>

        <h3>Performans Çerezleri</h3>
        <p>Web sitesinin performansını ölçmek ve iyileştirmek için kullanılır. Hangi sayfaların ziyaret edildiği ve hata mesajları hakkında bilgi toplar.</p>

        <h3>İşlevsellik Çerezleri</h3>
        <p>Tercihlerinizi hatırlayarak daha kişiselleştirilmiş bir deneyim sunar. Dil seçimi, bölge ayarları gibi bilgileri saklar.</p>

        <h2>Çerez Yönetimi</h2>
        <p>Çerezleri tarayıcı ayarlarınızdan kontrol edebilirsiniz:</p>
        <ul>
          <li>Çerezleri tamamen engelleyebilirsiniz</li>
          <li>Çerez kabul etmeden önce uyarı alabilirsiniz</li>
          <li>Mevcut çerezleri silebilirsiniz</li>
        </ul>

        <h2>Üçüncü Taraf Çerezleri</h2>
        <p>Web sitemizde Google Analytics gibi üçüncü taraf hizmetlerin çerezleri kullanılabilir. Bu çerezler ilgili şirketlerin gizlilik politikalarına tabidir.</p>

        <h2>Çerez Politikası Güncellemeleri</h2>
        <p>Bu politika gerektiğinde güncellenebilir. Değişiklikler web sitemizde yayınlanır.</p>

        <h2>İletişim</h2>
        <p>Çerez politikamız hakkında sorularınız için:</p>
        <p>E-posta: info@balanspsikoloji.com<br>
        Telefon: 0374 215 65 43</p>
      `
    }
  };

  const currentPage = legalPages[slug || ''];

  if (!currentPage) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-sage-900 mb-4">Sayfa Bulunamadı</h1>
          <Link to="/" className="text-sage-600 hover:text-sage-700">
            Ana sayfaya dönün
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = currentPage.icon;

  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      {/* Back Button */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sage-600 hover:text-sage-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-600 to-ocean-600 text-white p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{currentPage.title}</h1>
                <p className="text-sage-100 mt-1">
                  Son güncelleme: {currentPage.lastUpdated}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div 
              className="prose prose-lg prose-sage max-w-none
                prose-headings:text-sage-900 prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                prose-ul:text-gray-700 prose-li:mb-2
                prose-a:text-sage-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-sage-700
                prose-strong:text-sage-800"
              dangerouslySetInnerHTML={{ __html: currentPage.content }}
            />
          </div>

          {/* Footer */}
          <div className="bg-cream-50 p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                Bu belge {currentPage.lastUpdated} tarihinde güncellenmiştir.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/iletisim"
                  className="text-sage-600 hover:text-sage-700 text-sm font-medium"
                >
                  Sorularınız için İletişim
                </Link>
                <Link
                  to="/"
                  className="text-sage-600 hover:text-sage-700 text-sm font-medium"
                >
                  Ana Sayfa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;