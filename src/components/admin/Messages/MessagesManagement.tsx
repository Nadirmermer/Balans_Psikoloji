import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2, Reply, User, Calendar } from 'lucide-react';
import PageHeader from '../Common/PageHeader';
import DataTable, { Column } from '../Common/DataTable';
import Modal from '../Common/Modal';
import { supabase } from '../../../lib/supabase';
import { authService } from '../../../lib/auth';

interface ContactMessage {
  id: string;
  ad: string;
  email: string;
  konu?: string;
  mesaj: string;
  okundu: boolean;
  created_at: string;
}

const MessagesManagement: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [readFilter, setReadFilter] = useState<string>('all');

  const isAdmin = authService.hasRole('admin');

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('iletisim_mesajlari')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('iletisim_mesajlari')
        .update({ okundu: true })
        .eq('id', messageId);

      if (error) throw error;
      await fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('iletisim_mesajlari')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Silme işlemi sırasında bir hata oluştu');
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    if (!message.okundu) {
      await markAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter(message => {
    if (readFilter === 'all') return true;
    return readFilter === 'read' ? message.okundu : !message.okundu;
  });

  const columns: Column<ContactMessage>[] = [
    {
      key: 'okundu',
      title: '',
      width: '8',
      render: (value) => (
        <div className="flex justify-center">
          {value ? (
            <MailOpen className="w-4 h-4 text-gray-400" />
          ) : (
            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          )}
        </div>
      )
    },
    {
      key: 'ad',
      title: 'Gönderen',
      render: (_, record) => (
        <div>
          <div className={`font-medium ${
            record.okundu 
              ? 'text-gray-900 dark:text-gray-100' 
              : 'text-gray-900 dark:text-gray-100 font-semibold'
          }`}>
            {record.ad}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {record.email}
          </div>
        </div>
      )
    },
    {
      key: 'konu',
      title: 'Konu',
      render: (value, record) => (
        <span className={`${
          record.okundu 
            ? 'text-gray-700 dark:text-gray-300' 
            : 'text-gray-900 dark:text-gray-100 font-medium'
        }`}>
          {value || 'Konu belirtilmemiş'}
        </span>
      )
    },
    {
      key: 'mesaj',
      title: 'Mesaj',
      render: (value, record) => (
        <span className={`line-clamp-2 ${
          record.okundu 
            ? 'text-gray-600 dark:text-gray-400' 
            : 'text-gray-800 dark:text-gray-200'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'created_at',
      title: 'Tarih',
      render: (value) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(value).toLocaleDateString('tr-TR')}
        </span>
      )
    }
  ];

  const renderActions = (message: ContactMessage) => (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleViewMessage(message)}
        className="p-1 text-gray-400 hover:text-sage-600 dark:hover:text-sage-400"
        title="Mesajı Görüntüle"
      >
        <Mail className="w-4 h-4" />
      </button>
      <button
        onClick={() => window.open(`mailto:${message.email}?subject=Re: ${message.konu || 'İletişim'}`)}
        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        title="Yanıtla"
      >
        <Reply className="w-4 h-4" />
      </button>
      <button
        onClick={() => deleteMessage(message.id)}
        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        title="Sil"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  const messageCounts = {
    all: messages.length,
    unread: messages.filter(m => !m.okundu).length,
    read: messages.filter(m => m.okundu).length
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

  return (
    <div>
      <PageHeader
        title="İletişim Mesajları"
        description="Web sitesinden gelen iletişim mesajlarını görüntüleyin ve yönetin"
      />

      {/* Read Status Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setReadFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              readFilter === 'all'
                ? 'bg-sage-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sage-100 dark:hover:bg-sage-900/30'
            }`}
          >
            Tümü ({messageCounts.all})
          </button>
          <button
            onClick={() => setReadFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              readFilter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30'
            }`}
          >
            Okunmamış ({messageCounts.unread})
          </button>
          <button
            onClick={() => setReadFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              readFilter === 'read'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Okunmuş ({messageCounts.read})
          </button>
        </div>
      </div>

      <DataTable
        data={filteredMessages}
        columns={columns}
        loading={loading}
        searchable
        searchPlaceholder="Mesaj ara..."
        actions={renderActions}
        emptyText="Henüz mesaj bulunmuyor"
      />

      {/* Message Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Mesaj Detayları"
        size="lg"
        footer={
          selectedMessage && (
            <>
              <button
                onClick={() => deleteMessage(selectedMessage.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Sil
              </button>
              <button
                onClick={() => {
                  window.open(`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.konu || 'İletişim'}`);
                  setShowModal(false);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Reply className="w-4 h-4 mr-2" />
                Yanıtla
              </button>
            </>
          )
        }
      >
        {selectedMessage && (
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Gönderen Bilgileri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedMessage.ad}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedMessage.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {new Date(selectedMessage.created_at).toLocaleString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject */}
            {selectedMessage.konu && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Konu</h4>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  {selectedMessage.konu}
                </p>
              </div>
            )}

            {/* Message */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Mesaj</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.mesaj}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Durum: {selectedMessage.okundu ? 'Okundu' : 'Okunmadı'}
              </span>
              {!selectedMessage.okundu && (
                <button
                  onClick={() => {
                    markAsRead(selectedMessage.id);
                    setShowModal(false);
                  }}
                  className="text-sm text-sage-600 dark:text-sage-400 hover:text-sage-700 dark:hover:text-sage-300"
                >
                  Okundu olarak işaretle
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MessagesManagement;