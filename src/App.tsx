import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { useScrollToTop } from './hooks/useScrollToTop';
import { ErrorBoundary } from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import AppointmentModal from './components/AppointmentModal';
import { useAppointmentModal } from './hooks/useAppointmentModal';

// Public pages
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetail from './pages/ServiceDetail';
import ExpertsPage from './pages/ExpertsPage';
import ExpertProfile from './pages/ExpertProfile';
import BlogPage from './pages/BlogPage';
import BlogPost from './pages/BlogPost';
import AboutPage from './pages/AboutPage';
import AppointmentPage from './pages/AppointmentPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin components
import AdminLayout from './components/admin/Layout/AdminLayout';
import LoginPage from './components/admin/Auth/LoginPage';
import DashboardPage from './components/admin/Dashboard/DashboardPage';
import ExpertsManagement from './components/admin/Experts/ExpertsManagement';
import ServicesManagement from './components/admin/Services/ServicesManagement';
import BlogManagement from './components/admin/Blog/BlogManagement';
import AppointmentsManagement from './components/admin/Appointments/AppointmentsManagement';
import MessagesManagement from './components/admin/Messages/MessagesManagement';
import ProfileSettings from './components/admin/Profile/ProfileSettings';
import ReportsPage from './components/admin/Reports/ReportsPage';
import SettingsPage from './components/admin/Settings/SettingsPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

const PublicLayout = () => {
  const appointmentModal = useAppointmentModal();

  return (
    <>
      <Header onAppointmentClick={() => appointmentModal.openModal()} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage onAppointmentClick={appointmentModal.openModal} />} />
          <Route path="/hizmetler" element={<ServicesPage />} />
          <Route path="/hizmet/:slug" element={<ServiceDetail />} />
          <Route path="/uzmanlar" element={<ExpertsPage />} />
          <Route path="/uzman/:slug" element={<ExpertProfile onAppointmentClick={appointmentModal.openModal} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/hakkimizda" element={<AboutPage />} />
          <Route path="/randevu" element={<AppointmentPage />} />
          <Route path="/iletisim" element={<ContactPage />} />
          <Route path="/gizlilik-politikasi" element={<LegalPage />} />
          <Route path="/kvkk-metni" element={<LegalPage />} />
          <Route path="/kullanim-kosullari" element={<LegalPage />} />
          <Route path="/cerez-politikasi" element={<LegalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      
      <AppointmentModal
        isOpen={appointmentModal.isOpen}
        onClose={appointmentModal.closeModal}
        preSelectedExpert={appointmentModal.preSelectedExpert}
        preSelectedService={appointmentModal.preSelectedService}
      />
    </>
  );
};

const AppContent = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900 transition-colors duration-300">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="uzmanlar" element={<ExpertsManagement />} />
          <Route path="hizmetler" element={<ServicesManagement />} />
          <Route path="blog" element={<BlogManagement />} />
          <Route path="randevular" element={<AppointmentsManagement />} />
          <Route path="iletisim" element={<MessagesManagement />} />
          <Route path="profil" element={<ProfileSettings />} />
          <Route path="raporlar" element={<ReportsPage />} />
          <Route path="ayarlar" element={<SettingsPage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;