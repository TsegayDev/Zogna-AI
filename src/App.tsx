import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '@/layouts/AdminLayout';

// Pages
import Home from '@/pages/Home';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminUsers from '@/pages/admin/AdminUsers';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
