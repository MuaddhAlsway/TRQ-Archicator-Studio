import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { Project } from './types';``
import { ProjectEditorArabic } from './ProjectEditorArabic';
import { ConfirmModal } from './ConfirmModal';
import * as api from '../api';

interface Category {
  id: string;
  label: string;
}

export function AdminArabicProjects() {
  const { projects, deleteProject, updateProject } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', label: 'جميع الفئات' },
    { id: 'residential', label: 'سكني' },
    { id: 'commercial', label: 'تجاري' },
    { id: 'booths', label: 'أكشاك ومعارض' },
    { id: 'events', label: 'الأحداث' },
    { id: 'furniture', label: 'الأثاث' },
  ]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Fetch categories from settings
  useEffect(() => {
    api.getSettings().then((settings) => {
      if (settings.portfolioCategories_ar) {
        try {
          const parsed = JSON.parse(settings.portfolioCategories_ar);
          if (parsed.length > 0) {
            setCategories(parsed);
          }
        } catch (e) {
          console.error('Error parsing portfolio categories:', e);
        }
      }
    }).catch(console.error);
  }, []);

  const filteredProjects = projects.filter(project => {
    // Use Arabic fields for filtering
    const titleToSearch = project.title_ar || project.title;
    const descToSearch = project.description_ar || project.description;
    const matchesSearch = titleToSearch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      descToSearch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category_ar === filterCategory || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleStatus = (project: Project) => {
    updateProject(project.id, { status: project.status === 'published' ? 'draft' : 'published' });
  };

  const handleDelete = (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'حذف المشروع',
      message: 'هل أنت متأكد من رغبتك في حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.',
      onConfirm: () => {
        deleteProject(id);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  if (isCreating || editingProject) {
    return (
      <ProjectEditorArabic
        project={editingProject}
        onSave={() => {
          setEditingProject(null);
          setIsCreating(false);
        }}
        onCancel={() => {
          setEditingProject(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl tracking-wide">🇸🇦 المشاريع</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors"
        >
          <Plus size={20} />
          <span>إضافة مشروع</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40" />
          <input
            type="text"
            placeholder="ابحث عن المشاريع..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none bg-white"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Projects - Desktop Table / Mobile Cards */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-black/5">
              <tr>
                <th className="text-right px-6 py-4 text-sm tracking-wider text-black/60">المشروع</th>
                <th className="text-right px-6 py-4 text-sm tracking-wider text-black/60">الفئة</th>
                <th className="text-right px-6 py-4 text-sm tracking-wider text-black/60">السنة</th>
                <th className="text-right px-6 py-4 text-sm tracking-wider text-black/60">الحالة</th>
                <th className="text-left px-6 py-4 text-sm tracking-wider text-black/60">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-black/60">
                    لم يتم العثور على مشاريع
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={project.image}
                          alt={project.title_ar || project.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{project.title_ar || project.title}</p>
                          <p className="text-sm text-black/60">{project.subcategory_ar || project.subcategory}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{project.category_ar || project.category}</td>
                    <td className="px-6 py-4">{project.year}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          project.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {project.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-start gap-2">
                        <button
                          onClick={() => handleToggleStatus(project)}
                          className="p-2 hover:bg-neutral-100 rounded transition-colors"
                          title={project.status === 'published' ? 'إلغاء النشر' : 'نشر'}
                        >
                          {project.status === 'published' ? (
                            <EyeOff size={18} className="text-black/60" />
                          ) : (
                            <Eye size={18} className="text-black/60" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingProject(project)}
                          className="p-2 hover:bg-neutral-100 rounded transition-colors"
                          title="تعديل"
                        >
                          <Edit size={18} className="text-black/60" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="p-2 hover:bg-red-50 rounded transition-colors"
                          title="حذف"
                        >
                          <Trash2 size={18} className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-black/5">
          {filteredProjects.length === 0 ? (
            <p className="px-4 py-12 text-center text-black/60">لم يتم العثور على مشاريع</p>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="p-4">
                <div className="flex gap-3">
                  <img
                    src={project.image}
                    alt={project.title_ar || project.title}
                    className="w-20 h-16 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.title_ar || project.title}</p>
                    <p className="text-sm text-black/60">{project.subcategory_ar || project.subcategory}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-black/50 capitalize">{project.category_ar || project.category}</span>
                      <span className="text-xs text-black/30">•</span>
                      <span className="text-xs text-black/50">{project.year}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ml-auto ${
                          project.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {project.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-start gap-1 mt-3 pt-3 border-t border-black/5">
                  <button
                    onClick={() => handleToggleStatus(project)}
                    className="p-2 hover:bg-neutral-100 rounded transition-colors"
                  >
                    {project.status === 'published' ? (
                      <EyeOff size={18} className="text-black/60" />
                    ) : (
                      <Eye size={18} className="text-black/60" />
                    )}
                  </button>
                  <button
                    onClick={() => setEditingProject(project)}
                    className="p-2 hover:bg-neutral-100 rounded transition-colors"
                  >
                    <Edit size={18} className="text-black/60" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
