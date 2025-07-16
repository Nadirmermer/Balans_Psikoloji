import React from 'react';
import { Target, Heart, Eye, Star } from 'lucide-react';

interface ValueCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const ValuesCarousel: React.FC = () => {
  const values: ValueCard[] = [
    {
      id: 'degerler',
      title: 'Değerlerimiz',
      subtitle: 'Değeri olmayanın ederi olmaz',
      description: 'Bizi biz yapan değerlerimizi koruyarak, her danışanımıza saygı, gizlilik ve profesyonellik çerçevesinde hizmet veriyoruz. İnsan onurunu merkeze alan, bilimsel temellere dayanan yaklaşımımızla güvenilir bir destek sunuyoruz.',
      icon: Heart,
      color: 'from-primary-500 to-primary-600'
    },
    {
      id: 'misyon',
      title: 'Misyonumuz',
      subtitle: 'Tamamlanmayan misyonlar checkpoint\'ten başlatır',
      description: 'Ruh sağlığı alanında kaliteli, erişilebilir ve sürdürülebilir hizmet sunarak, bireylerin yaşam kalitelerini artırmak ve toplumsal refaha katkıda bulunmak. Her danışanımızın benzersiz hikayesini anlayarak, kişiselleştirilmiş çözümler üretmek.',
      icon: Target,
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      id: 'vizyon',
      title: 'Vizyonumuz',
      subtitle: 'Hedefsiz vizyon boşa kovalanan seraptır',
      description: 'Ruh sağlığı hizmetlerinde öncü, yenilikçi ve güvenilir bir kurum olarak tanınmak. Bilimsel gelişmeleri takip eden, teknolojiyi etkin kullanan ve sürekli gelişim halinde olan bir ekiple, toplumun ruh sağlığı konusunda farkındalığını artırmak.',
      icon: Eye,
      color: 'from-accent-500 to-accent-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Neden Balans?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bizi farklı kılan değerler ve yaklaşımlarımız
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => {
            const IconComponent = value.icon;
            return (
              <div 
                key={value.id}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  
                  <p className="text-lg font-semibold text-primary-600 mb-4 italic">
                    "{value.subtitle}"
                  </p>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="w-16 h-16 bg-gradient-to-br from-warmth-500 to-warmth-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Profesyonellik ve Karakter
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Protokole uyacak, yapması gerekeni yapacak ama bir karakteri de olacak. 
              AI generated yazılardan ziyade bizi yansıtacak şeyler olsun ki uzun vadede sahtelik yapmak zorunda olmayalım. 
              Biz olalım, profesyonel olalım ama resmiyet yerine göre. Kasıntı durmasın yani.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesCarousel;