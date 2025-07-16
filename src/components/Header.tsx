import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useSettings } from '../hooks/useSettings';

interface HeaderProps {
  onAppointmentClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAppointmentClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      setIsMenuOpen(false);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Hizmetlerimiz', href: '/hizmetler' },
    { name: 'Uzmanlarımız', href: '/uzmanlar' },
    { name: 'Blog', href: '/blog' },
    { name: 'Hakkımızda', href: '/hakkimizda' },
    { name: 'İletişim', href: '/iletisim' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-0'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className={`bg-gradient-to-br from-sage-500 to-ocean-500 rounded-full flex items-center justify-center transition-all duration-300 ${
                isScrolled ? 'w-8 h-8' : 'w-10 h-10'
              }`}>
                <span className={`text-white font-bold transition-all duration-300 ${
                  isScrolled ? 'text-base' : 'text-lg'
                }`}>B</span>
              </div>
              <span className={`font-bold text-sage-800 transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              } dark:text-sage-200`}>{settings.site_name}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-sage-600 dark:text-sage-400 border-b-2 border-sage-600 dark:border-sage-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <button
              onClick={onAppointmentClick}
              className={`bg-warmth-500 hover:bg-warmth-600 text-white rounded-full font-medium transition-all duration-200 flex items-center space-x-2 hover:shadow-lg transform hover:scale-105 ${
                isScrolled ? 'px-4 py-2 text-sm' : 'px-6 py-2'
              }`}
            >
              <Calendar className={`transition-all duration-300 ${
                isScrolled ? 'w-3 h-3' : 'w-4 h-4'
              }`} />
              <span>Randevu Al</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-sage-600 dark:text-sage-400 bg-sage-50 dark:bg-sage-900/50'
                      : 'text-gray-700 dark:text-gray-300 hover:text-sage-600 dark:hover:text-sage-400 hover:bg-sage-50 dark:hover:bg-sage-900/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 space-y-2">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
                <button
                  onClick={() => {
                    onAppointmentClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-warmth-500 hover:bg-warmth-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Randevu Al</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;