import { useState } from 'react';
import { 
  LayoutDashboard, FolderOpen, MessageSquare, FileText, 
  Settings, LogOut, Menu, X, ChevronRight, Layers, Image, BookOpen, User, Mail, Globe
} from 'lucide-react';
import { useAdmin } from './AdminContext';

type AdminPage = 'dashboard' | 'projects' | 'contacts' | 'pricing' | 'services' | 'settings' | 'slides' | 'blog' | 'account' | 'newsletter' | 'slides-ar' | 'projects-ar' | 'services-ar' | 'blog-ar' | 'settings-ar';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: AdminPage;
  onPageChange: (page: AdminPage) => void;
}

export function AdminLayout({ children, currentPage, onPageChange }: AdminLayoutProps) {
  const { user, logout, contacts, pricingRequests } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const newContacts = contacts.filter(c => c.status === 'new').length;
  const newPricing = pricingRequests.filter(p => p.status === 'new').length;

  const navItems = [
    { id: 'dashboard' as AdminPage, label: 'Dashboard', icon: LayoutDashboard },
    
    // English Content Section
    { id: 'slides' as AdminPage, label: '🇬🇧 Hero Slides (EN)', icon: Image, section: 'English' },
    { id: 'projects' as AdminPage, label: '🇬🇧 Projects (EN)', icon: FolderOpen, section: 'English' },
    { id: 'services' as AdminPage, label: '🇬🇧 Services (EN)', icon: Layers, section: 'English' },
    { id: 'blog' as AdminPage, label: '🇬🇧 Blog Articles (EN)', icon: BookOpen, section: 'English' },
    { id: 'settings' as AdminPage, label: '🇬🇧 Site Settings (EN)', icon: Settings, section: 'English' },
    
    // Arabic Content Section
    { id: 'slides-ar' as AdminPage, label: '🇸🇦 Hero Slides (AR)', icon: Image, section: 'Arabic' },
    { id: 'projects-ar' as AdminPage, label: '🇸🇦 Projects (AR)', icon: FolderOpen, section: 'Arabic' },
    { id: 'services-ar' as AdminPage, label: '🇸🇦 Services (AR)', icon: Layers, section: 'Arabic' },
    { id: 'blog-ar' as AdminPage, label: '🇸🇦 Blog Articles (AR)', icon: BookOpen, section: 'Arabic' },
    { id: 'settings-ar' as AdminPage, label: '🇸🇦 Site Settings (AR)', icon: Settings, section: 'Arabic' },
    
    // Other
    { id: 'contacts' as AdminPage, label: 'Contact Messages', icon: MessageSquare, badge: newContacts },
    { id: 'pricing' as AdminPage, label: 'Pricing Requests', icon: FileText, badge: newPricing },
    { id: 'newsletter' as AdminPage, label: 'Newsletter', icon: Mail },
    { id: 'account' as AdminPage, label: 'Account', icon: User },
  ];

  return (
    <div className="min-h-screen bg-neutral-100" dir="ltr" style={{ direction: 'ltr', textAlign: 'left' }}>
      {/* Mobile Header */}
      <div className="lg:hidden bg-black text-white p-3 sm:p-4 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg sm:text-xl tracking-[0.15em] sm:tracking-[0.2em]">TRQ ADMIN</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-[280px] sm:w-64 bg-black text-white transform transition-transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:sticky lg:top-0 lg:h-screen flex flex-col
        `}>
          <div className="p-6 border-b border-white/10 hidden lg:block flex-shrink-0">
            <h1 className="text-xl tracking-[0.2em]">TRQ ADMIN</h1>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const showSectionHeader = index > 0 && navItems[index - 1].section !== item.section && item.section;
              
              return (
                <div key={item.id}>
                  {showSectionHeader && (
                    <div className="px-4 py-3 mt-2 text-xs font-bold text-white/40 uppercase tracking-wider">
                      {item.section}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      onPageChange(item.id);
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
                    {item.badge ? (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight size={16} className="opacity-50" />
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/60">{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
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
          {children}
        </main>
      </div>
    </div>
  );
}
