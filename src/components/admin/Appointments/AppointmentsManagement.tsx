import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import DataTable, { Column } from '../Common/DataTable';
import Modal from '../Common/Modal';
import LoadingSpinner from '../Common/LoadingSpinner';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../lib/auth';

interface Appointment {
  id: string;
  uzman_id: string;
  hizmet_id: string;
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  tarih: string;
  saat: string;
  tur: 'yuz_yuze' | 'online';
  mesaj?: string;
  durum: 'beklemede' | 'onaylandi' | 'iptal_edildi';
  created_at: string;
  uzman?: {
    ad: string;
    soyad: string;
  };
  hizmet?: {
    ad: string;
  };
}

const AppointmentsManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isAdmin = authService.hasRole('admin');
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('randevular')
        .select(`
          *,
          uzman:uzmanlar(ad, soyad),
          hizmet:hizmetler(ad)
        `)
        .order('created_at', { ascending: false });

      // Uzmanlar sadece kendi randevularını görebilir
      if (!isAdmin && currentUser?.uzman_id) {
        query = query.eq('uzman_id', currentUser.uzman_id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: 'onaylandi' | 'iptal_edildi') => {
    try {
      const { error } = await supabase
        .from('randevular')
        .update({ durum: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Durum güncellenirken bir hata oluştu');
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (statusFilter === 'all') return true;
    return appointment.durum === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onaylandi':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'iptal_edildi':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'onaylandi': return 'Onaylandı';
      case 'iptal_edildi': return 'İptal Edildi';
      default: return 'Beklemede';
    }
  };

  const columns: Column<Appointment>[] = [
    {
      key: 'ad',
      title: 'Danışan',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {record.ad} {record.soyad}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.email}
          </div>
        </div>
      )
    },
    ...(isAdmin ? [{
      key: 'uzman',
      title: 'Uzman',
      render: (_, record: Appointment) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {record.uzman ? `${record.uzman.ad} ${record.uzman.soyad}` : 'Bilinmiyor'}
        </span>
      )
    }] : []),
    {
      key: 'hizmet',
      title: 'Hizmet',
      render: (_, record) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {record.hizmet?.ad || 'Bilinmiyor'}
        </span>
      )
    },
    {
      key: 'tarih',
      title: 'Tarih & Saat',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {new Date(record.tarih).toLocaleDateString('tr-TR')}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.saat}
          </div>
        </div>
      )
    },
    {
      key: 'tur',
      title: 'Tür',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'online' 
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
        }`}>
          {value === 'online' ? 'Online' : 'Yüz Yüze'}
        </span>
      )
    },
    {
      key: 'durum',
      title: 'Durum',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusText(value)}
        </span>
      )
    }
  ];

  const renderActions = (appointment: Appointment) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleViewDetails(appointment)}
        className="p-1 text-gray-400 hover:text-sage-600 dark:hover:text-sage-400"
        title="Detayları Görüntüle"
      >
        <User className="w-4 h-4" />
      </button>
      {appointment.durum === 'beklemede' && (
        <>
          <button
            onClick={() => updateAppointmentStatus(appointment.id, 'onaylandi')}
            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
            title="Onayla"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateAppointmentStatus(appointment.id, 'iptal_edildi')}
            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            title="İptal Et"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );

  const statusCounts = {
    all: appointments.length,
    beklemede: appointments.filter(a => a.durum === 'beklemede').length,
    onaylandi: appointments.filter(a => a.durum === 'onaylandi').length,
    iptal_edildi: appointments.filter(a => a.durum === 'iptal_edildi').length
  };

  return (
    <div>
      <PageHeader
        title="Randevu Yönetimi"
        description={isAdmin ? "Tüm randevuları görüntüleyin ve yönetin" : "Randevularınızı görüntüleyin ve yönetin"}
      />

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-sage-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sage-100 dark:hover:bg-sage-900/30'
            }`}
          >
            Tümü ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter('beklemede')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'beklemede'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
            }`}
          >
            Beklemede ({statusCounts.beklemede})
          </button>
          <button
            onClick={() => setStatusFilter('onaylandi')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'onaylandi'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
            }`}
          >
            Onaylandı ({statusCounts.onaylandi})
          </button>
          <button
            onClick={() => setStatusFilter('iptal_edildi')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'iptal_edildi'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
            }`}
          >
            İptal Edildi ({statusCounts.iptal_edildi})
          </button>
        </div>
      </div>

      <DataTable
        data={filteredAppointments}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Randevu ara..."
        actions={renderActions}
        emptyText="Henüz randevu bulunmuyor"
      />

      {/* Appointment Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Randevu Detayları"
        size="lg"
        footer={
          selectedAppointment?.durum === 'beklemede' && (
            <>
              <button
                onClick={() => {
                  updateAppointmentStatus(selectedAppointment.id, 'iptal_edildi');
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                İptal Et
              </button>
              <button
                onClick={() => {
                  updateAppointmentStatus(selectedAppointment.id, 'onaylandi');
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Onayla
              </button>
            </>
          )
        }
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Randevu Durumu
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedAppointment.durum)}`}>
                {getStatusText(selectedAppointment.durum)}
              </span>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Danışan Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedAppointment.ad} {selectedAppointment.soyad}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedAppointment.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedAppointment.telefon}
                  </span>
                </div>
              </div>
            </div>

            {/* Appointment Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Randevu Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isAdmin && selectedAppointment.uzman && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedAppointment.uzman.ad} {selectedAppointment.uzman.soyad}
                    </span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(selectedAppointment.tarih).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedAppointment.saat}
                  </span>
                </div>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedAppointment.tur === 'online' ? 'Online' : 'Yüz Yüze'}
                  </span>
                </div>
                {selectedAppointment.hizmet && (
                  <div className="flex items-center md:col-span-2">
                    <span className="text-gray-500 dark:text-gray-400 mr-2">Hizmet:</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedAppointment.hizmet.ad}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            {selectedAppointment.mesaj && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Danışan Mesajı</h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedAppointment.mesaj}
                </p>
              </div>
            )}

            {/* Created Date */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Oluşturulma: {new Date(selectedAppointment.created_at).toLocaleString('tr-TR')}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppointmentsManagement;