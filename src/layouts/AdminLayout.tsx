import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/admin/admin-sidebar';
import AdminHeader from '@/components/admin/admin-header';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
