import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { Project } from './types';
import * as api from '../api';

interface ProjectEditorProps {
  project: Project | null;
  onSave: () => void;
  onCancel: () => void;
}

interface Category {
  id: string;
  label: string;
}

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  category: 'residential',
  subcategory: '',
  description: '',
  image: '',
  year: new Date().getFullYear().toString(),
  location: '',
  client: '',
  size: '',
  duration: '',
  detailedDescription: '',
  challenge: '',
  solution: '',
  features: [''],
  materials: [''],
  awards: [''],
  team: [''],
  gallery: [''],
  clientQuote: '',
  clientName: '',
  status: 'draft',
};

export function ProjectEditorArabic({ project, onSave, onCancel }: ProjectEditorProps) {
  const { addProject, updateProject } = useAdmin();
  
  // Parse project data - convert JSON strings to arrays and use Arabic fields
  const parseProjectData = (proj: Project | null) => {
    if (!proj) return emptyProject;
    
    return {
      ...proj,
      // Use Arabic fields if available, fallback to English
      title: proj.title_ar || proj.title || '',
      category: proj.category_ar || proj.category || 'residential',
      subcategory: proj.subcategory_ar || proj.subcategory || '',
      description: proj.description_ar || proj.description || '',
      location: proj.location_ar || proj.location || '',
      client: proj.client_ar || proj.client || '',
      size: proj.size_ar || proj.size || '',
      duration: proj.duration_ar || proj.duration || '',
      detailedDescription: proj.detailedDescription_ar || proj.detailedDescription || '',
      challenge: proj.challenge_ar || proj.challenge || '',
      solution: proj.solution_ar || proj.solution || '',
      clientQuote: proj.clientQuote_ar || proj.clientQuote || '',
      clientName: proj.clientName_ar || proj.clientName || '',
      features: typeof (proj.features_ar || proj.features) === 'string' ? JSON.parse((proj.features_ar || proj.features) || '[]') : ((proj.features_ar || proj.features) || []),
      materials: typeof (proj.materials_ar || proj.materials) === 'string' ? JSON.parse((proj.materials_ar || proj.materials) || '[]') : ((proj.materials_ar || proj.materials) || []),
      awards: typeof (proj.awards_ar || proj.awards) === 'string' ? JSON.parse((proj.awards_ar || proj.awards) || '[]') : ((proj.awards_ar || proj.awards) || []),
      team: typeof (proj.team_ar || proj.team) === 'string' ? JSON.parse((proj.team_ar || proj.team) || '[]') : ((proj.team_ar || proj.team) || []),
      gallery: typeof proj.gallery === 'string' ? JSON.parse(proj.gallery || '[]') : (proj.gallery || []),
    };
  };
  
  const [formData, setFormData] = useState<Omit<Project, 'id'>>(parseProjectData(project));
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'content' | 'gallery' | 'team'>('basic');
  const [categories, setCategories] = useState<Category[]>([
    { id: 'residential', label: 'سكني' },
    { id: 'commercial', label: 'تجاري' },
    { id: 'booths', label: 'أكشاك ومعارض' },
    { id: 'events', label: 'الأحداث' },
    { id: 'furniture', label: 'الأثاث' },
  ]);

  // Update formData when project changes
  useEffect(() => {
    setFormData(parseProjectData(project));
  }, [project]);

  // Fetch categories from settings
  useEffect(() => {
    api.getSettings().then((settings) => {
      if (settings.portfolioCategories_ar) {
        try {
          const parsed = JSON.parse(settings.portfolioCategories_ar);
          // Filter out 'all' category as it's not a real category for projects
          const filtered = parsed.filter((cat: Category) => cat.id !== 'all');
          if (filtered.length > 0) {
            setCategories(filtered);
          }
        } catch (e) {
          console.error('Error parsing portfolio categories:', e);
        }
      }
    }).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty array items
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim()),
      materials: formData.materials.filter(m => m.trim()),
      awards: formData.awards.filter(a => a.trim()),
      team: formData.team.filter(t => t.trim()),
      gallery: formData.gallery.filter(g => g.trim()),
    };

    // ONLY save Arabic fields with _ar suffix
    // Do NOT update English fields
    const arabicOnlyData = {
      title_ar: cleanedData.title,
      category_ar: cleanedData.category,
      subcategory_ar: cleanedData.subcategory,
      description_ar: cleanedData.description,
      location_ar: cleanedData.location,
      client_ar: cleanedData.client,
      size_ar: cleanedData.size,
      duration_ar: cleanedData.duration,
      detailedDescription_ar: cleanedData.detailedDescription,
      challenge_ar: cleanedData.challenge,
      solution_ar: cleanedData.solution,
      features_ar: JSON.stringify(cleanedData.features),
      materials_ar: JSON.stringify(cleanedData.materials),
      awards_ar: JSON.stringify(cleanedData.awards),
      team_ar: JSON.stringify(cleanedData.team),
      clientQuote_ar: cleanedData.clientQuote,
      clientName_ar: cleanedData.clientName,
    };

    if (project) {
      console.log('Updating existing Arabic project:', project.id);
      updateProject(project.id, arabicOnlyData);
    } else {
      console.log('Creating new Arabic project');
      // For new projects in Arabic Admin Panel
      // Set ONLY Arabic fields, leave English empty
      const newProjectData = {
        title: '', // Leave English empty
        category: 'residential',
        subcategory: '',
        description: '',
        image: cleanedData.image,
        year: cleanedData.year,
        status: cleanedData.status,
        features: JSON.stringify([]),
        materials: JSON.stringify([]),
        awards: JSON.stringify([]),
        team: JSON.stringify([]),
        gallery: JSON.stringify(cleanedData.gallery),
        clientQuote: '',
        clientName: '',
        location: '',
        client: '',
        size: '',
        duration: '',
        detailedDescription: '',
        challenge: '',
        solution: '',
        // Set Arabic fields with actual content
        ...arabicOnlyData,
      };
      addProject(newProjectData);
    }
    onSave();
  };

  const handleArrayChange = (field: 'features' | 'materials' | 'awards' | 'team' | 'gallery', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleArrayAdd = (field: 'features' | 'materials' | 'awards' | 'team' | 'gallery') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const handleArrayRemove = (field: 'features' | 'materials' | 'awards' | 'team' | 'gallery', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
  };

  const tabs = [
    { id: 'basic', label: 'المعلومات الأساسية' },
    { id: 'details', label: 'تفاصيل المشروع' },
    { id: 'content', label: 'المحتوى' },
    { id: 'gallery', label: 'المعرض' },
    { id: 'team', label: 'الفريق والجوائز' },
  ];

  return (
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
      <button
        onClick={onCancel}
        className="flex items-center gap-2 text-black/60 hover:text-black mb-6"
      >
        <ArrowLeft size={20} />
        <span>العودة إلى المشاريع</span>
      </button>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-black/5">
          <h1 className="text-2xl tracking-wide">
            {project ? 'تعديل المشروع' : 'مشروع جديد'}
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-black/5 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 text-sm tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-black/60 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">العنوان *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">الفئة الفرعية *</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="مثال: فيلا فاخرة، تصميم مكتب"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">الفئة *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Project['category'] })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">السنة *</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none bg-white"
                  >
                    <option value="draft">مسودة</option>
                    <option value="published">منشور</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">الوصف المختصر *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">رابط الصورة الرئيسية *</label>
                <div className="flex gap-4">
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="https://..."
                    required
                  />
                  {formData.image && (
                    <img src={formData.image} alt="معاينة" className="w-20 h-14 object-cover rounded" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Project Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">الموقع</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="الرياض، المملكة العربية السعودية"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">العميل</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="عميل خاص"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm tracking-wider">الحجم</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="500 متر مربع"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">المدة</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="6 أشهر"
                  />
                </div>
              </div>

              {/* Key Features */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">المميزات الرئيسية</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="وصف المميزة"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('features', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('features')}
                  className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                  <Plus size={16} /> إضافة مميزة
                </button>
              </div>

              {/* Materials */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">المواد والتشطيبات</label>
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={material}
                      onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="اسم المادة"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('materials', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('materials')}
                  className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                  <Plus size={16} /> إضافة مادة
                </button>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-sm tracking-wider">نظرة عامة على المشروع</label>
                <textarea
                  value={formData.detailedDescription}
                  onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={5}
                  placeholder="وصف تفصيلي للمشروع..."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">التحدي</label>
                <textarea
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={4}
                  placeholder="ما التحديات التي قدمها هذا المشروع؟"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm tracking-wider">الحل</label>
                <textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                  rows={4}
                  placeholder="كيف حللت هذه التحديات؟"
                />
              </div>

              <div className="border-t border-black/10 pt-6">
                <h3 className="text-lg mb-4">تقييم العميل</h3>
                <div>
                  <label className="block mb-2 text-sm tracking-wider">نص التقييم</label>
                  <textarea
                    value={formData.clientQuote}
                    onChange={(e) => setFormData({ ...formData, clientQuote: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none resize-none"
                    rows={3}
                    placeholder="شهادة العميل..."
                  />
                </div>
                <div className="mt-4">
                  <label className="block mb-2 text-sm tracking-wider">اسم العميل</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
                    placeholder="— عميل المشروع"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <p className="text-black/60">أضف روابط الصور لمعرض المشروع.</p>
              
              {formData.gallery.map((url, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleArrayChange('gallery', index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                        placeholder="https://..."
                      />
                      <button
                        type="button"
                        onClick={() => handleArrayRemove('gallery', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  {url && (
                    <img src={url} alt={`معرض ${index + 1}`} className="w-24 h-16 object-cover rounded" />
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => handleArrayAdd('gallery')}
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-black/20 hover:border-black text-black/60 hover:text-black w-full justify-center"
              >
                <ImageIcon size={20} /> إضافة صورة للمعرض
              </button>
            </div>
          )}

          {/* Team & Awards Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Team */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">فريق المشروع</label>
                {formData.team.map((member, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => handleArrayChange('team', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="الدور: الاسم"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('team', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('team')}
                  className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                  <Plus size={16} /> إضافة عضو فريق
                </button>
              </div>

              {/* Awards */}
              <div>
                <label className="block mb-2 text-sm tracking-wider">الجوائز والتكريمات</label>
                {formData.awards.map((award, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={award}
                      onChange={(e) => handleArrayChange('awards', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-black/20 focus:border-black focus:outline-none"
                      placeholder="اسم الجائزة"
                    />
                    <button
                      type="button"
                      onClick={() => handleArrayRemove('awards', index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleArrayAdd('awards')}
                  className="flex items-center gap-2 text-sm text-black/60 hover:text-black"
                >
                  <Plus size={16} /> إضافة جائزة
                </button>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-black/10">
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white hover:bg-black/80 transition-colors"
            >
              {project ? 'تحديث المشروع' : 'إنشاء المشروع'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 border border-black/20 hover:border-black transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
