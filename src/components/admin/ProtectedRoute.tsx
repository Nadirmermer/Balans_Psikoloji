import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../lib/auth';
import LoadingSpinner from './Common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'uzman';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await authService.validateToken();
        setIsAuthenticated(isValid);
        
        // Eğer rol kontrolü gerekiyorsa
        if (isValid && requiredRole) {
          const hasRequiredRole = authService.hasRole(requiredRole);
          setIsAuthenticated(hasRequiredRole);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Yetkilendirme kontrol ediliyor..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Giriş sayfasına yönlendir ve mevcut sayfayı state olarak gönder
    return (
      <Navigate 
        to="/admin/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;