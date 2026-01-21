import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import * as api from '../api';
import { ConfirmModal } from './ConfirmModal';
import { BilingualEditor } from './BilingualEditor';

interface ArabicSlide {
  id: number;
  englishTag: string;
  arabicTag: string;
  englishTitle: string;
  arabicTitle: string;
  englishDescription: string;
  arabicDescription: string;
  englishButtonPrimaryText: string;
  arabicButtonPrimaryText: string;
  englishButtonSecondaryText: string;
  arabicButtonSecondaryText: string;
}

export function AdminArabicHeroSlides() {
  const [slides, setSlides] = useState<ArabicSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<ArabicSlide | null>(null);
  const [formData, setFormData] = useState<Partial<ArabicSlide>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('trq_token');
      const response = await fetch('http://localhost:3001/api/arabic/heroSlides', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (result.success) {
        setSlides(result.data || []);
      }
    } catch (error) {
      console.error('Error loading slides:', error);
    }
    setLoading(false);
  };

  const handleEdit = (slide: ArabicSlide) => {
    setFormData(slide);
    setEditingSlide(slide);
  };

  const handleSave = async () => {
    if (!editingSlide) return;

    try {
      const token = localStorage.getItem('trq_token');
      const response = await fetch(`http://localhost:3001/api/arabic/heroSlides/${editingSlide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          arabicTag: formData.arabicTag,
          arabicTitle: formData.arabicTitle,
          arabicDescription: formData.arabicDescription,
          arabicButtonPrimaryText: formData.arabicButtonPrimaryText,
          arabicButtonSecondaryText: formData.arabicButtonSecondaryText,
        }),
      });

      const result = await response.json();
      if (result.success) {
        loadSlides();
        setEditingSlide(null);
        setFormData({});
      }
    } catch (error) {
      console.error('Error saving slide:', error);
    }
  };

  const handleCancel = () => {
    setEditingSlide(null);
    setFormData({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (editingSlide) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-blue-700 font-medium">Editing: {editingSlide.englishTitle}</p>
        </div>

        <BilingualEditor
          label="Tag"
          englishValue={editingSlide.englishTag}
          arabicValue={formData.arabicTag || ''}
          onEnglishChange={() => {}}
          onArabicChange={(val) => setFormData({ ...formData, arabicTag: val })}
        />

        <BilingualEditor
          label="Title"
          englishValue={editingSlide.englishTitle}
          arabicValue={formData.arabicTitle || ''}
          onEnglishChange={() => {}}
          onArabicChange={(val) => setFormData({ ...formData, arabicTitle: val })}
        />

        <BilingualEditor
          label="Description"
          type="textarea"
          englishValue={editingSlide.englishDescription}
          arabicValue={formData.arabicDescription || ''}
          onEnglishChange={() => {}}
          onArabicChange={(val) => setFormData({ ...formData, arabicDescription: val })}
        />

        <BilingualEditor
          label="Primary Button Text"
          englishValue={editingSlide.englishButtonPrimaryText}
          arabicValue={formData.arabicButtonPrimaryText || ''}
          onEnglishChange={() => {}}
          onArabicChange={(val) => setFormData({ ...formData, arabicButtonPrimaryText: val })}
        />

        <BilingualEditor
          label="Secondary Button Text"
          englishValue={editingSlide.englishButtonSecondaryText}
          arabicValue={formData.arabicButtonSecondaryText || ''}
          onEnglishChange={() => {}}
          onArabicChange={(val) => setFormData({ ...formData, arabicButtonSecondaryText: val })}
        />

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-black/20 rounded hover:bg-black/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-black text-white rounded hover:bg-black/80 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hero Slides - Arabic</h2>
          <p className="text-black/60 mt-1">Manage homepage slider content in Arabic</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-black/10 overflow-hidden">
        <div className="space-y-3 p-6">
          {slides.length === 0 ? (
            <p className="text-black/60 text-center py-8">No slides found</p>
          ) : (
            slides.map((slide) => (
              <div
                key={slide.id}
                className="flex items-center justify-between p-4 border border-black/10 rounded hover:bg-black/2 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-black">{slide.englishTitle}</h3>
                  <p className="text-sm text-black/60 mt-1">{slide.arabicTitle}</p>
                </div>
                <button
                  onClick={() => handleEdit(slide)}
                  className="p-2 hover:bg-black/10 rounded transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
