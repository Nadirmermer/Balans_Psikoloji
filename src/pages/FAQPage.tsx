import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Psikolojik danışmanlık nedir ve ne zaman gerekli?',
      answer: 'Psikolojik danışmanlık, ruh sağlığı uzmanları tarafından sunulan profesyonel bir destek hizmetidir. Günlük yaşamda karşılaştığımız stres, kaygı, depresyon, ilişki sorunları, travma sonrası stres bozukluğu gibi durumlarda yardımcı olur. Kendinizi sürekli mutsuz, kaygılı, umutsuz hissediyorsanız, günlük aktivitelerinizi etkileyen sorunlar yaşıyorsanız veya ilişkilerinizde zorluklar yaşıyorsanız psikolojik destek almayı düşünebilirsiniz.',
      category: 'genel'
    },
    {
      id: '2',
      question: 'İlk seans nasıl geçer ve ne beklemeliyim?',
      answer: 'İlk seansta genellikle tanışma ve değerlendirme yapılır. Psikoloğunuz size sorunlarınızı anlatmanız için güvenli bir ortam sağlar. Geçmişiniz, mevcut durumunuz ve hedefleriniz hakkında konuşursunuz. Bu seans, karşılıklı güven oluşturmak ve tedavi planını belirlemek için önemlidir. Rahat kıyafetler giyebilir, not alabilir ve merak ettiğiniz soruları sorabilirsiniz.',
      category: 'seanslar'
    },
    {
      id: '3',
      question: 'Terapi ne kadar sürer?',
      answer: 'Terapi süresi kişiden kişiye ve soruna göre değişir. Bazı sorunlar için 8-12 seans yeterli olabilirken, daha karmaşık durumlar için daha uzun süre gerekebilir. Kısa süreli terapi yaklaşımları 3-6 ay sürebilir. Önemli olan, kendinizi hazır hissettiğinizde ve hedeflerinize ulaştığınızda terapiyi sonlandırmaktır.',
      category: 'seanslar'
    },
    {
      id: '4',
      question: 'Online terapi etkili mi?',
      answer: 'Evet, online terapi yüz yüze terapi kadar etkili olabilir. Araştırmalar, online terapi seanslarının depresyon, kaygı bozuklukları ve travma sonrası stres bozukluğu gibi birçok ruh sağlığı sorunu için etkili olduğunu göstermektedir. Online terapi, ulaşım sorunu yaşayan, yoğun programı olan veya evden çıkmak istemeyen kişiler için ideal bir seçenektir.',
      category: 'online'
    },
    {
      id: '5',
      question: 'Gizlilik nasıl sağlanır?',
      answer: 'Gizlilik, psikolojik danışmanlığın temel ilkelerinden biridir. Tüm seanslarınız gizli tutulur ve sadece sizin açık izniniz olmadan başkalarıyla paylaşılmaz. Ancak, kendinize veya başkalarına zarar verme riski olduğunda, yasal zorunluluklar gerektiğinde bu gizlilik kırılabilir. Bu durumlar hakkında ilk seansta detaylı bilgi verilir.',
      category: 'genel'
    },
    {
      id: '6',
      question: 'Çift terapisi nasıl işler?',
      answer: 'Çift terapisi, ilişkide yaşanan sorunları çözmek ve ilişkiyi güçlendirmek için tasarlanmış bir terapi türüdür. Her iki partner de seanslara katılır ve birlikte çalışır. İletişim sorunları, güven problemleri, çatışma çözümü ve yakınlık konuları ele alınır. Terapist, tarafsız bir rehber olarak her iki tarafın da sesini duymasını sağlar.',
      category: 'cift'
    },
    {
      id: '7',
      question: 'Çocuk terapisi nasıl yapılır?',
      answer: 'Çocuk terapisi, çocukların yaş ve gelişim düzeyine uygun yöntemlerle yapılır. Oyun terapisi, sanat terapisi, bilişsel davranışçı terapi gibi yaklaşımlar kullanılır. Çocuklar genellikle oyun yoluyla kendilerini ifade eder. Terapist, çocuğun güvenini kazanır ve onun kendi hızında ilerlemesine izin verir. Ebeveynler de sürece dahil edilir.',
      category: 'cocuk'
    },
    {
      id: '8',
      question: 'İlaç kullanımı gerekli mi?',
      answer: 'İlaç kullanımı her zaman gerekli değildir. Birçok ruh sağlığı sorunu sadece terapi ile başarıyla tedavi edilebilir. Ancak bazı durumlarda, özellikle şiddetli depresyon, kaygı bozuklukları veya psikotik bozukluklar için ilaç tedavisi gerekebilir. Bu durumda, psikiyatrist ile işbirliği yapılır ve en uygun tedavi planı belirlenir.',
      category: 'tedavi'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'genel', name: 'Genel Sorular' },
    { id: 'seanslar', name: 'Seanslar' },
    { id: 'online', name: 'Online Terapi' },
    { id: 'cift', name: 'Çift Terapisi' },
    { id: 'cocuk', name: 'Çocuk Terapisi' },
    { id: 'tedavi', name: 'Tedavi' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sık Sorulan Sorular
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Terapi ve danışmanlık hizmetleri hakkında kafa karıştırıcı ya da merak edilen noktaları açıkladığımız sık sorulanlar bölümünü inceleyerek merakınızı ve çekincelerinizi giderebilirsiniz.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-primary-50 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-6 h-6 text-primary-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(item.id) && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Hala Sorularınız mı Var?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Burada bulamadığınız sorularınız için bizimle iletişime geçebilir veya randevu alarak uzmanlarımızla görüşebilirsiniz.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href="/iletisim"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  İletişime Geç
                </a>
                <a
                  href="/randevu"
                  className="bg-secondary-600 hover:bg-secondary-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
                >
                  Randevu Al
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;