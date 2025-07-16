import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const Footer = () => {
  const { settings } = useSettings();

  const services = [
    { name: 'Bireysel Terapi', href: '/hizmet/bireysel-terapi' },
    { name: 'Çift Terapisi', href: '/hizmet/cift-terapisi' },
    { name: 'Aile Danışmanlığı', href: '/hizmet/aile-danismanligi' },
    { name: 'Çocuk Psikolojisi', href: '/hizmet/cocuk-psikolojisi' },
    { name: 'Online Terapi', href: '/hizmet/online-terapi' },
  ];

  const resources = [
    { name: 'Blog', href: '/blog' },
    { name: 'Uzmanlarımız', href: '/uzmanlar' },
    { name: 'Randevu Al', href: '/randevu' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  const legal = [
    { name: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
    { name: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
    { name: 'Çerez Politikası', href: '/cerez-politikasi' },
    { name: 'KVKK Metni', href: '/kvkk-metni' },
  ];

  return (
    <footer className="bg-sage-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-ocean-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-2xl font-bold">Balans Psikoloji</span>
            </div>
            <p className="text-sage-200 text-sm leading-relaxed">
              Ruh sağlığınız için güvenilir ve profesyonel destek. Bilimsel yaklaşımlarla desteklenen empati dolu hizmetimiz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-sage-300 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-sage-300 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-sage-300 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    to={service.href} 
                    className="text-sage-200 hover:text-white transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kaynaklar</h3>
            <ul className="space-y-2">
              {resources.map((resource) => (
                <li key={resource.name}>
                  <Link 
                    to={resource.href} 
                    className="text-sage-200 hover:text-white transition-colors text-sm"
                  >
                    {resource.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-sage-400 mt-0.5 flex-shrink-0" />
                <span className="text-sage-200 text-sm">
                  {settings.address}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-sage-400 flex-shrink-0" />
                <span className="text-sage-200 text-sm">{settings.contact_phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-sage-400 flex-shrink-0" />
                <span className="text-sage-200 text-sm">{settings.contact_email}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-4 h-4 text-sage-400 mt-0.5 flex-shrink-0" />
                <div className="text-sage-200 text-sm">
                  <p>{settings.working_hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-sage-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sage-400 text-sm">
              © 2025 {settings.site_name}. Tüm hakları saklıdır.
            </div>
            <div className="flex space-x-6">
              {legal.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.href} 
                  className="text-sage-400 hover:text-sage-200 transition-colors text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;