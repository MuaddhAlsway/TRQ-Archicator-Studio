import { useState, useMemo } from 'react';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import * as api from '../api';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  categorySlug: string;
  tags: string[];
  status: string;
}

interface ArticleEditorProps {
  article: Article | null;
  onSave: () => void;
  onCancel: () => void;
}

const categories = [
  { id: 'design-tips', label: 'نصائح التصميم' },
  { id: 'trends', label: 'الاتجاهات' },
  { id: 'projects', label: 'المشاريع' },
  { id: 'insights', label: 'الرؤى' },
];

// Quill modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['blockquote'],
    ['link', 'image'],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'list', 'bullet',
  'align',
  'blockquote',
  'link', 'image'
];

export function ArticleEditorArabic({ article, onSave, onCancel }: ArticleEditorProps) {
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    image: article?.image || '',
    author: article?.author || '',
    date: article?.date || new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: article?.readTime || '5 دقائق',
    category: article?.category || 'نصائح التصميم',
    categorySlug: article?.categorySlug || 'design-tips',
    tags: article?.tags || [],
    status: article?.status || 'draft',
  });

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  };

  const handleCategoryChange = (categorySlug: string) => {
    const cat = categories.find(c => c.id === categorySlug);
    setFormData(prev => ({
      ...prev,
      categorySlug,
      category: cat?.label || 'نصائح التصميم',
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} دقائق`;
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
      readTime: calculateReadTime(content),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (article) {
        await api.updateArticle(article.id, formData);
      } else {
        await api.createArticle(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl tracking-wide">
          {article ? 'تعديل المقالة' : 'مقالة جديدة'}
        </h1>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
        >
          <span>العودة إلى المقالات</span>
          <ArrowLeft size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">العنوان *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none"
                placeholder="عنوان المقالة"
                required
              />
            </div>

            {/* Slug */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">رابط URL</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none"
                placeholder="article-url-slug"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">الملخص *</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none resize-none"
                rows={3}
                placeholder="ملخص موجز للمقالة"
                required
              />
            </div>

            {/* Content - Rich Text Editor */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">المحتوى *</label>
              <div className="border border-black/20 rounded overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="اكتب محتوى المقالة هنا..."
                  className="bg-white"
                  style={{ minHeight: '400px' }}
                />
              </div>
              <p className="text-xs text-black/60 mt-2">وقت القراءة المتوقع: {formData.readTime}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">الحالة</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none bg-white mb-4"
              >
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ المقالة'}</span>
              </button>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">رابط الصورة المميزة</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none"
                placeholder="https://..."
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="معاينة"
                  className="w-full h-40 object-cover rounded mt-4"
                />
              )}
            </div>

            {/* Category */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">الفئة</label>
              <select
                value={formData.categorySlug}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">الكاتب</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none"
                placeholder="اسم الكاتب"
              />
            </div>

            {/* Date */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">تاريخ النشر</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-black/20 rounded focus:border-black focus:outline-none"
                placeholder="1 يناير 2026"
              />
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <label className="block text-sm font-medium mb-2">الوسوم</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-2 border border-black/20 rounded focus:border-black focus:outline-none"
                  placeholder="إضافة وسم"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="p-2 bg-black text-white rounded hover:bg-black/80"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
