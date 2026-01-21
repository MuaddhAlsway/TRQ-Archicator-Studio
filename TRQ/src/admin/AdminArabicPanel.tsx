import { useState } from 'react';
import {
  LayoutDashboard, FolderOpen, Settings, Layers, BookOpen, Image,
  ChevronRight, LogOut, Menu, X, Globe
} from 'lucide-react';
import { useAdmin } from './AdminContext';
import { AdminLayout } from './AdminLayout';

// Arabic Components
import { AdminArabicProjects } from './AdminArabicProjects';
import { AdminArabicSlides } from './AdminArabicSlides';
import { AdminArabicServices } from './AdminArabicServices';
import { AdminSettingsArabic } from './AdminSettingsArabic';
import { AdminArabicBlog } from './AdminArabicBlog';

type ArabicAdminPage = 'dashboard' | 'projects-ar' | 'slides-ar' | 'services-ar' | 'settings-ar' | 'blog-ar';

interface ArabicAdminPanelProps {
  onBack: () => void;
}

export function AdminArabicPanel({ onBack }: ArabicAdminPanelProps) {
  const { user } = useAdmin();
  const [currentPage, setCurrentPage] = useState<ArabicAdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const arabicNavItems = [
    { id: 'dashboard' as ArabicAdminPage, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'slides-ar' as ArabicAdminPage, label: 'شرائح البطل', icon: Image },
    { id: 'projects-ar' as ArabicAdminPage, label: 'المشاريع', icon: FolderOpen },
    { id: 'services-ar' as ArabicAdminPage, label: 'الخدمات', icon: Layers },
    { id: 'blog-ar' as ArabicAdminPage, label: 'المدونة', icon: BookOpen },
    { id: 'settings-ar' as ArabicAdminPage, label: 'إعدادات الموقع', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'projects-ar':
        return <AdminArabicProjects />;
      case 'slides-ar':
        return <AdminArabicSlides />;
      case 'services-ar':
        return <AdminArabicServices />;
      case 'settings-ar':
        return <AdminSettingsArabic />;
      case 'blog-ar':
        return <AdminArabicBlog />;
      case 'dashboard':
      default:
        return (
          <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
            <div className="bg-white rounded-lg shadow-sm p-8 border border-black/5">
              <div className="flex items-center gap-4 mb-6">
                <Globe size={32} className="text-black" />
                <div>
                  <h1 className="text-3xl font-bold">🇸🇦 لوحة التحكم العربية</h1>
                  <p className="text-black/60 mt-1">إدارة محتوى الموقع باللغة العربية</p>
                </div>
              </div>
              <div className="border-t border-black/10 pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">مرحباً بك في لوحة التحكم العربية</h2>
                <p className="text-black/70 mb-4">
                  استخدم القائمة الجانبية للوصول إلى جميع أقسام إدارة المحتوى العربي:
                </p>
                <ul className="space-y-2 text-black/70">
                  <li>✓ إدارة شرائح البطل</li>
                  <li>✓ إدارة المشاريع</li>
                  <li>✓ إدارة الخدمات</li>
                  <li>✓ إدارة المدونة</li>
                  <li>✓ إعدادات الموقع العربية</li>
                </ul>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
      {/* Mobile Header */}
      <div className="lg:hidden bg-black text-white p-3 sm:p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg sm:text-xl tracking-[0.15em] flex items-center gap-2">
          <Globe size={20} />
          🇸🇦 ARABIC
        </h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-[280px] sm:w-64 bg-black text-white transform transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:sticky lg:top-0 lg:h-screen flex flex-col
        `}
        >
          <div className="p-6 border-b border-white/10 hidden lg:block flex-shrink-0">
            <div className="flex items-center gap-2">
              <Globe size={24} />
              <h1 className="text-xl tracking-[0.2em]">🇸🇦 ARABIC</h1>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
            {arabicNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded transition-colors ${
                    currentPage === item.id
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-50" />
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/60">{user?.username}</span>
            </div>
            <button
              onClick={onBack}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded transition-colors"
            >
              <LogOut size={20} />
              <span>العودة للإنجليزية</span>
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
