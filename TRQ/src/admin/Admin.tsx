import { useState } from 'react';
import { AdminProvider, useAdmin } from './AdminContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminProjects } from './AdminProjects';
import { AdminContacts } from './AdminContacts';
import { AdminPricing } from './AdminPricing';
import { AdminServices } from './AdminServices';
import { AdminSettings } from './AdminSettings';
import { AdminSlides } from './AdminSlides';
import { AdminBlog } from './AdminBlog';
import { AdminAccount } from './AdminAccount';
import { AdminNewsletter } from './AdminNewsletter';
import { AdminArabicSlides } from './AdminArabicSlides';
import { AdminArabicProjects } from './AdminArabicProjects';
import { AdminArabicServices } from './AdminArabicServices';
import { AdminArabicBlog } from './AdminArabicBlog';
import { AdminArabicSettings } from './AdminArabicSettings';
import { AdminSettingsArabic } from './AdminSettingsArabic';
import { AdminArabicPanel } from './AdminArabicPanel';

type AdminPage = 'dashboard' | 'projects' | 'contacts' | 'pricing' | 'services' | 'settings' | 'slides' | 'blog' | 'account' | 'newsletter' | 'slides-ar' | 'projects-ar' | 'services-ar' | 'blog-ar' | 'settings-ar' | 'arabic-panel';

function AdminContent() {
  const { user, loading } = useAdmin();
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');

  if (!user) {
    return <AdminLogin />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  // If Arabic Panel is active, show it directly
  if (currentPage === 'arabic-panel') {
    return <AdminArabicPanel onBack={() => setCurrentPage('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'projects':
        return <AdminProjects />;
      case 'contacts':
        return <AdminContacts />;
      case 'pricing':
        return <AdminPricing />;
      case 'services':
        return <AdminServices />;
      case 'slides':
        return <AdminSlides />;
      case 'blog':
        return <AdminBlog />;
      case 'newsletter':
        return <AdminNewsletter />;
      case 'settings':
        return <AdminSettings />;
      case 'account':
        return <AdminAccount />;
      // Arabic Pages
      case 'slides-ar':
        return <AdminArabicSlides />;
      case 'projects-ar':
        return <AdminArabicProjects />;
      case 'services-ar':
        return <AdminArabicServices />;
      case 'blog-ar':
        return <AdminArabicBlog />;
      case 'settings-ar':
        return <AdminSettingsArabic />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
}

export function Admin() {
  return (
    <AdminProvider>
      <AdminContent />
    </AdminProvider>
  );
}
