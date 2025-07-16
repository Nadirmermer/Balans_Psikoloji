import React from 'react';
import { useState, useEffect } from 'react';
import { Users, Calendar, FileText, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import { authService } from '../../../lib/auth';
import { supabase } from '../../../lib/supabase';

const DashboardPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const isAdmin = authService.hasRole('admin');
  const [stats, setStats] = useState({
    totalExperts: 0,
    totalAppointments: 0,
    totalBlogPosts: 0,
    totalMessages: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    publishedPosts: 0,
    unreadMessages: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Uzmanlar
      const { data: experts } = await supabase
        .from('uzmanlar')
        .select('id')
        .eq('aktif', true);

      // Randevular
      let appointmentsQuery = supabase.from('randevular').select('durum, tarih');
      if (!isAdmin && currentUser?.uzman_id) {
        appointmentsQuery = appointmentsQuery.eq('uzman_id', currentUser.uzman_id);
      }
      const { data: appointments } = await appointmentsQuery;

      // Blog yazıları
      let blogQuery = supabase.from('blog_yazilar').select('yayinlandi');
      if (!isAdmin && currentUser?.uzman_id) {
        blogQuery = blogQuery.eq('yazar_id', currentUser.uzman_id);
      }
      const { data: blogPosts } = await blogQuery;

      // İletişim mesajları (sadece admin için)
      let messages = [];
      if (isAdmin) {
        const { data } = await supabase
          .from('iletisim_mesajlari')
          .select('okundu');
        messages = data || [];
      }

      // Bugünün tarihi
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments?.filter(a => a.tarih === today) || [];

      setStats({
        totalExperts: experts?.length || 0,
        totalAppointments: appointments?.length || 0,
        totalBlogPosts: blogPosts?.length || 0,
        totalMessages: messages.length,
        pendingAppointments: appointments?.filter(a => a.durum === 'beklemede').length || 0,
        todayAppointments: todayAppointments.length,
        publishedPosts: blogPosts?.filter(p => p.yayinlandi).length || 0,
        unreadMessages: messages.filter(m => !m.okundu).length
      });

      // Son aktiviteler - gerçek verilerden oluştur
      const activities = [];
      
      // Son randevular
      const recentAppointments = appointments?.slice(0, 2) || [];
      recentAppointments.forEach(app => {
        activities.push({
          id: `app-${app.id}`,
          type: 'appointment',
          message: `${app.durum === 'beklemede' ? 'Yeni randevu talebi' : 'Randevu ' + (app.durum === 'onaylandi' ? 'onaylandı' : 'iptal edildi')}`,
          time: new Date(app.created_at).toLocaleString('tr-TR'),
          status: app.durum === 'beklemede' ? 'pending' : app.durum === 'onaylandi' ? 'success' : 'error'
        });
      });

      // Son blog yazıları
      const recentBlogs = blogPosts?.slice(0, 2) || [];
      recentBlogs.forEach(blog => {
        activities.push({
          id: `blog-${blog.id}`,
          type: 'blog',
          message: `Blog yazısı ${blog.yayinlandi ? 'yayınlandı' : 'taslak olarak kaydedildi'}`,
          time: new Date(blog.created_at).toLocaleString('tr-TR'),
          status: blog.yayinlandi ? 'success' : 'info'
        });
      });

      setRecentActivities(activities.slice(0, 4));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'appointment': return Calendar;
      case 'blog': return FileText;
      case 'message': return MessageSquare;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'info': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <div>
      <PageHeader
        title={`Hoş geldiniz, ${currentUser?.ad}!`}
        description={isAdmin ? 'Admin paneline genel bakış' : 'Uzman panelinize genel bakış'}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isAdmin && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-sage-100 dark:bg-sage-900/30 rounded-lg">
                <Users className="w-6 h-6 text-sage-600 dark:text-sage-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Uzman</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalExperts}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-ocean-100 dark:bg-ocean-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {isAdmin ? 'Toplam Randevu' : 'Randevularım'}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-warmth-100 dark:bg-warmth-900/30 rounded-lg">
              <FileText className="w-6 h-6 text-warmth-600 dark:text-warmth-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {isAdmin ? 'Blog Yazıları' : 'Yazılarım'}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalBlogPosts}</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">İletişim Mesajları</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalMessages}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-sage-500 to-sage-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sage-100">Bekleyen Randevular</p>
              <p className="text-3xl font-bold">{stats.pendingAppointments}</p>
            </div>
            <Clock className="w-8 h-8 text-sage-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-ocean-500 to-ocean-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-ocean-100">Bugünkü Randevular</p>
              <p className="text-3xl font-bold">{stats.todayAppointments}</p>
            </div>
            <Calendar className="w-8 h-8 text-ocean-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-warmth-500 to-warmth-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warmth-100">Yayınlanan Yazılar</p>
              <p className="text-3xl font-bold">{stats.publishedPosts}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-warmth-200" />
          </div>
        </div>

        {isAdmin && (
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Okunmamış Mesajlar</p>
                <p className="text-3xl font-bold">{stats.unreadMessages}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        )}
      </div>

      {/* Recent Activities */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Son Aktiviteler
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;