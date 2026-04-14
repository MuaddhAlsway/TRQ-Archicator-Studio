import { useState, useEffect } from 'react';
import { Save, Plus, X, AlertCircle, Edit2 } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { BilingualEditor } from './BilingualEditor';
import * as api from '../api';

interface ArabicSlide {
  id: number;
  tag: string;
  title: string;
  description: string;
  tag_ar: string;
  title_ar: string;
  description_ar: string;
  video_ar?: string;
  video_2_ar?: string;
  video_3_ar?: string;
  video_text_ar?: string;
  video_2_text_ar?: string;
  video_3_text_ar?: string;
  buttonPrimaryText_ar?: string;
  buttonSecondaryText_ar?: string;
}

export function AdminArabicSlides() {
  const { slides, loadSlides } = useAdmin();
  const [items, setItems] = useState<ArabicSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ArabicSlide>>({});

  useEffect(() => {
    loadItems();
  }, [slides]);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!slides || slides.length === 0) {
        await loadSlides();
      }
      
      // Map slides to Arabic format
      const arabicSlides: ArabicSlide[] = (slides || []).map((slide: any) => ({
        id: slide.id,
        tag: slide.tag || '',
        title: slide.title || '',
        description: slide.description || '',
        tag_ar: slide.tag_ar || '',
        title_ar: slide.title_ar || '',
        description_ar: slide.description_ar || '',
        video_ar: slide.video_ar || '',
        video_2_ar: slide.video_2_ar || '',
        video_3_ar: slide.video_3_ar || '',
        video_text_ar: slide.video_text_ar || '',
        video_2_text_ar: slide.video_2_text_ar || '',
        video_3_text_ar: slide.video_3_text_ar || '',
        buttonPrimaryText_ar: slide.buttonPrimaryText_ar || '',
        buttonSecondaryText_ar: slide.buttonSecondaryText_ar || '',
      }));
      
      setItems(arabicSlides);
    } catch (err) {
      setError('Error loading slides');
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ArabicSlide) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const handleSave = async () => {
    if (!editData.id) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Update slide with Arabic fields
      const updateData = {
        tag_ar: editData.tag_ar,
        title_ar: editData.title_ar,
        description_ar: editData.description_ar,
        video_ar: editData.video_ar,
        video_2_ar: editData.video_2_ar,
        video_3_ar: editData.video_3_ar,
        video_text_ar: editData.video_text_ar,
        video_2_text_ar: editData.video_2_text_ar,
        video_3_text_ar: editData.video_3_text_ar,
        buttonPrimaryText_ar: editData.buttonPrimaryText_ar,
        buttonSecondaryText_ar: editData.buttonSecondaryText_ar,
      };

      const result = await api.updateSlide(editData.id, updateData);

      if (result) {
        setSuccessMessage('Slide Arabic content saved successfully!');
        setEditingId(null);
        setEditData({});
        await loadSlides();
        await loadItems();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to save content');
      }
    } catch (err) {
      setError('Error saving content: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-black/10">
        <h1 className="text-3xl font-bold mb-2">🇸🇦 Hero Slides (Arabic)</h1>
        <p className="text-black/60">Customize hero slider content in Arabic</p>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-black/10 p-6">
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded p-4 text-red-700 mb-6">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded p-4 text-green-700 mb-6">
            <AlertCircle size={20} />
            <p>{successMessage}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : editingId ? (
          // Edit Mode
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-700 font-medium">Editing: {editData.title}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tag (Arabic)</label>
              <input
                type="text"
                value={editData.tag_ar || ''}
                onChange={(e) => setEditData({ ...editData, tag_ar: e.target.value })}
                className="w-full border p-2 text-right"
                dir="rtl"
                placeholder="العلامة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title (Arabic)</label>
              <input
                type="text"
                value={editData.title_ar || ''}
                onChange={(e) => setEditData({ ...editData, title_ar: e.target.value })}
                className="w-full border p-2 text-right"
                dir="rtl"
                placeholder="العنوان"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (Arabic)</label>
              <textarea
                value={editData.description_ar || ''}
                onChange={(e) => setEditData({ ...editData, description_ar: e.target.value })}
                className="w-full border p-2 h-24 resize-none text-right"
                dir="rtl"
                placeholder="الوصف"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Videos (Arabic)</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((num) => {
                  const videoKey = num === 1 ? 'video_ar' : `video_${num}_ar`;
                  const textKey = num === 1 ? 'video_text_ar' : `video_${num}_text_ar`;
                  return (
                    <div key={num} className="p-3 bg-slate-50 rounded">
                      <label className="block text-xs font-medium mb-1">Video {num} URL (Arabic)</label>
                      <input
                        type="text"
                        value={(editData as any)[videoKey] || ''}
                        onChange={(e) => setEditData({ ...editData, [videoKey]: e.target.value })}
                        className="w-full border p-2 text-sm mb-2"
                        placeholder="https://..."
                      />
                      <label className="block text-xs font-medium mb-1">Video {num} Text (Arabic)</label>
                      <input
                        type="text"
                        value={(editData as any)[textKey] || ''}
                        onChange={(e) => setEditData({ ...editData, [textKey]: e.target.value })}
                        className="w-full border p-2 text-sm text-right"
                        dir="rtl"
                        placeholder="نص الفيديو"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Buttons (Arabic)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Primary Button (Arabic)</label>
                  <input
                    type="text"
                    value={editData.buttonPrimaryText_ar || ''}
                    onChange={(e) => setEditData({ ...editData, buttonPrimaryText_ar: e.target.value })}
                    className="w-full border p-2 text-sm text-right"
                    dir="rtl"
                    placeholder="الزر الأساسي"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Secondary Button (Arabic)</label>
                  <input
                    type="text"
                    value={editData.buttonSecondaryText_ar || ''}
                    onChange={(e) => setEditData({ ...editData, buttonSecondaryText_ar: e.target.value })}
                    className="w-full border p-2 text-sm text-right"
                    dir="rtl"
                    placeholder="الزر الثانوي"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-black/20 rounded hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-black text-white rounded hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-black/60 mb-4">No slides found</p>
          </div>
        ) : (
          // List Mode
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-black/10 rounded hover:bg-black/2 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-black">{item.title}</h3>
                  <p className="text-sm text-black/60 mt-1 text-right" dir="rtl">{item.title_ar || 'لم يتم الترجمة'}</p>
                </div>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 hover:bg-black/10 rounded transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
