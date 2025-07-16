import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Calendar, 
  MessageSquare,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { authService } from '../../../lib/auth';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen, 
  onClose, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const location = useLocation();
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.hasRole('admin');

  const adminMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Uzmanlar', path: '/admin/uzmanlar' },
    { icon: Briefcase, label: 'Hizmetler', path: '/admin/hizmetler' },
    { icon: FileText, label: 'Blog Yazıları', path: '/admin/blog' },
    { icon: Calendar, label: 'Randevular', path: '/admin/randevular' },
    { icon: MessageSquare, label: 'İletişim Mesajları', path: '/admin/iletisim' },
    { icon: BarChart3, label: 'Raporlar', path: '/admin/raporlar' },
    { icon: Settings, label: 'Ayarlar', path: '/admin/ayarlar' },
  ];

  const uzmanMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: FileText, label: 'Blog Yazılarım', path: '/admin/blog' },
    { icon: Calendar, label: 'Randevularım', path: '/admin/randevular' },
    { icon: User, label: 'Profil Ayarları', path: '/admin/profil' },
  ];

  const menuItems = isAdmin ? adminMenuItems : uzmanMenuItems;

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:dark:bg-gray-800 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 transition-all duration-300 z-30 ${
        isCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-sage-600 to-ocean-600 relative">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sage-600 font-bold text-lg">B</span>
                </div>
                <div className="text-white">
                  <div className="font-bold text-sm">Balans Psikoloji</div>
                  <div className="text-xs text-sage-100">Admin Panel</div>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mx-auto">
                <span className="text-sage-600 font-bold text-lg">B</span>
              </div>
            )}
            
            {/* Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* User Info */}
          {!isCollapsed && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser?.ad.charAt(0)}{currentUser?.soyad.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {currentUser?.ad} {currentUser?.soyad}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {currentUser?.role}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={'desktop-' + item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-sage-100 dark:bg-sage-900 text-sage-900 dark:text-sage-100'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon
                  className={`${isCollapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 ${
                    isActive(item.path)
                      ? 'text-sage-600 dark:text-sage-400'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {!isCollapsed && item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex">
          <div className="flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-sage-600 to-ocean-600">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-sage-600 font-bold text-lg">B</span>
                </div>
                <div className="text-white">
                  <div className="font-bold text-sm">Balans Psikoloji</div>
                  <div className="text-xs text-sage-100">Admin Panel</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {currentUser?.ad.charAt(0)}{currentUser?.soyad.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {currentUser?.ad} {currentUser?.soyad}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {currentUser?.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => (
                <Link
                  key={'mobile-' + item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-sage-100 dark:bg-sage-900 text-sage-900 dark:text-sage-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.path)
                        ? 'text-sage-600 dark:text-sage-400'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;