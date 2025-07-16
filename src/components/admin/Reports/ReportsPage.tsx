import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, FileText, MessageSquare, TrendingUp, Download } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import LoadingSpinner from '../Common/LoadingSpinner';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../lib/auth';

interface Stats {
  totalExperts: number;
  totalAppointments: number;
  totalBlogPosts: number;
  totalMessages: number;
  pendingAppointments: number;
  approvedAppointments: number;
  cancelledAppointments: number;
  publishedPosts: number;
  unreadMessages: number;
}

interface MonthlyData {
  month: string;
  appointments: number;
  messages: number;
  blogPosts: number;
}

const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalExperts: 0,
    totalAppointments: 0,
    totalBlogPosts: 0,
    totalMessages: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    cancelledAppointments: 0,
    publishedPosts: 0,
    unreadMessages: 0
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const isAdmin = authService.hasRole('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchMonthlyData();
    }
  }, [isAdmin, selectedPeriod]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Uzmanlar
      const { data: experts } = await supabase
        .from('uzmanlar')
        .select('id')
        .eq('aktif', true);

      // Randevular
      const { data: appointments } = await supabase
        .from('randevular')
        .select('durum');

      // Blog yazıları
      const { data: blogPosts } = await supabase
        .from('blog_yazilar')
        .select('yayinlandi');

      // İletişim mesajları
      const { data: messages } = await supabase
        .from('iletisim_mesajlari')
        .select('okundu');

      setStats({
        totalExperts: experts?.length || 0,
        totalAppointments: appointments?.length || 0,
        totalBlogPosts: blogPosts?.length || 0,
        totalMessages: messages?.length || 0,
        pendingAppointments: appointments?.filter(a => a.durum === 'beklemede').length || 0,
        approvedAppointments: appointments?.filter(a => a.durum === 'onaylandi').length || 0,
        cancelledAppointments: appointments?.filter(a => a.durum === 'iptal_edildi').length || 0,
        publishedPosts: blogPosts?.filter(p => p.yayinlandi).length || 0,
        unreadMessages: messages?.filter(m => !m.okundu).length || 0
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMonthlyData = async () => {
    try {
      const months = selectedPeriod === '6months' ? 6 : 12;
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      // Son 6 veya 12 ayın verilerini al
      const { data: appointments } = await supabase
        .from('randevular')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      const { data: messages } = await supabase
        .from('iletisim_mesajlari')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      const { data: blogPosts } = await supabase
        .from('blog_yazilar')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

      // Aylık verileri grupla
      const monthlyStats: { [key: string]: MonthlyData } = {};
      
      for (let i = 0; i < months; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        const monthName = date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
        
        monthlyStats[monthKey] = {
          month: monthName,
          appointments: 0,
          messages: 0,
          blogPosts: 0
        };
      }

      // Randevuları say
      appointments?.forEach(appointment => {
        const monthKey = appointment.created_at.slice(0, 7);
        if (monthlyStats[monthKey]) {
          monthlyStats[monthKey].appointments++;
        }
      });

      // Mesajları say
      messages?.forEach(message => {
        const monthKey = message.created_at.slice(0, 7);
        if (monthlyStats[monthKey]) {
          monthlyStats[monthKey].messages++;
        }
      });

      // Blog yazılarını say
      blogPosts?.forEach(post => {
        const monthKey = post.created_at.slice(0, 7);
        if (monthlyStats[monthKey]) {
          monthlyStats[monthKey].blogPosts++;
        }
      });

      setMonthlyData(Object.values(monthlyStats).reverse());

    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Ay', 'Randevular', 'Mesajlar', 'Blog Yazıları'],
      ...monthlyData.map(data => [
        data.month,
        data.appointments.toString(),
        data.messages.toString(),
        data.blogPosts.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `balans-psikoloji-rapor-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Raporlar yükleniyor..." />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Raporlar ve İstatistikler"
        description="Sistem performansı ve kullanım istatistikleri"
        actions={
          <button
            onClick={exportData}
            className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Raporu İndir
          </button>
        }
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="p-2 bg-ocean-100 dark:bg-ocean-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Randevu</p>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Blog Yazıları</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.totalBlogPosts}</p>
            </div>
          </div>
        </div>

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
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Appointment Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Randevu Durumları
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Beklemede</span>
              <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-sm font-medium">
                {stats.pendingAppointments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Onaylandı</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                {stats.approvedAppointments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">İptal Edildi</span>
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-medium">
                {stats.cancelledAppointments}
              </span>
            </div>
          </div>
        </div>

        {/* Blog Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Blog İstatistikleri
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Yayınlanan</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                {stats.publishedPosts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Taslak</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
                {stats.totalBlogPosts - stats.publishedPosts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Yayın Oranı</span>
              <span className="text-sage-600 dark:text-sage-400 font-medium">
                {stats.totalBlogPosts > 0 ? Math.round((stats.publishedPosts / stats.totalBlogPosts) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Message Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Mesaj İstatistikleri
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Okunmamış</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                {stats.unreadMessages}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Okunmuş</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
                {stats.totalMessages - stats.unreadMessages}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Yanıt Oranı</span>
              <span className="text-sage-600 dark:text-sage-400 font-medium">
                {stats.totalMessages > 0 ? Math.round(((stats.totalMessages - stats.unreadMessages) / stats.totalMessages) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Aylık Trendler
          </h3>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="6months">Son 6 Ay</option>
            <option value="12months">Son 12 Ay</option>
          </select>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-6">
          {monthlyData.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.month}</span>
                <div className="flex space-x-4 text-gray-600 dark:text-gray-400">
                  <span>R: {data.appointments}</span>
                  <span>M: {data.messages}</span>
                  <span>B: {data.blogPosts}</span>
                </div>
              </div>
              <div className="flex space-x-1 h-4">
                <div 
                  className="bg-ocean-500 rounded-sm"
                  style={{ width: `${Math.max((data.appointments / Math.max(...monthlyData.map(d => d.appointments))) * 100, 2)}%` }}
                  title={`${data.appointments} randevu`}
                />
                <div 
                  className="bg-purple-500 rounded-sm"
                  style={{ width: `${Math.max((data.messages / Math.max(...monthlyData.map(d => d.messages))) * 100, 2)}%` }}
                  title={`${data.messages} mesaj`}
                />
                <div 
                  className="bg-warmth-500 rounded-sm"
                  style={{ width: `${Math.max((data.blogPosts / Math.max(...monthlyData.map(d => d.blogPosts))) * 100, 2)}%` }}
                  title={`${data.blogPosts} blog yazısı`}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-ocean-500 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Randevular</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Mesajlar</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-warmth-500 rounded-sm mr-2"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Blog Yazıları</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;