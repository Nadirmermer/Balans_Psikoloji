import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'editor-vendor': ['react-quill', 'quill'],
          'utils-vendor': ['bcryptjs', 'dompurify'],
          // Admin chunks
          'admin': [
            './src/components/admin/Layout/AdminLayout.tsx',
            './src/components/admin/Dashboard/DashboardPage.tsx',
            './src/components/admin/Experts/ExpertsManagement.tsx',
            './src/components/admin/Services/ServicesManagement.tsx',
            './src/components/admin/Blog/BlogManagement.tsx',
            './src/components/admin/Appointments/AppointmentsManagement.tsx',
            './src/components/admin/Messages/MessagesManagement.tsx',
            './src/components/admin/Profile/ProfileSettings.tsx',
            './src/components/admin/Reports/ReportsPage.tsx',
            './src/components/admin/Settings/SettingsPage.tsx',
          ],
          // Public chunks
          'public': [
            './src/pages/HomePage.tsx',
            './src/pages/ServicesPage.tsx',
            './src/pages/ExpertsPage.tsx',
            './src/pages/BlogPage.tsx',
            './src/pages/ContactPage.tsx',
            './src/pages/AppointmentPage.tsx',
          ]
        }
      }
    },
    chunkSizeWarningLimit: 500,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
