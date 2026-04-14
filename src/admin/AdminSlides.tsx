import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image, Save, X } from 'lucide-react';
import * as api from '../api';
import { getImageUrl } from '../api';
import { ConfirmModal } from './ConfirmModal';
import { FileUploadField } from './FileUploadField';

interface Slide {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  image_2?: string;
  image_3?: string;
  video?: string;
  video_2?: string;
  video_3?: string;
  video_text?: string;
  video_2_text?: string;
  video_3_text?: string;
  buttonPrimaryText: string;
  buttonPrimaryLink: string;
  buttonSecondaryText: string;
  buttonSecondaryLink: string;
  sortOrder: number;
  isActive: number;
  tag_ar?: string;
  title_ar?: string;
  description_ar?: string;
  video_ar?: string;
  video_2_ar?: string;
  video_3_ar?: string;
  video_text_ar?: string;
  video_2_text_ar?: string;
  video_3_text_ar?: string;
  buttonPrimaryText_ar?: string;
  buttonSecondaryText_ar?: string;
}

interface SlideVideo {
  id: string;
  url: string;
  title: string;
  description: string;
  tag: string;
  title_ar?: string;
  description_ar?: string;
  tag_ar?: string;
}

const linkOptions = [
  { value: 'home', label: 'Home' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'workflow', label: 'Workflow' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'contact', label: 'Contact' },
  { value: 'pricing', label: 'Pricing' },
];

export function AdminSlides() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const emptySlide: Omit<Slide, 'id'> = {
    tag: '',
    title: '',
    description: '',
    image: '',
    image_2: '',
    image_3: '',
    buttonPrimaryText: 'VIEW PORTFOLIO',
    buttonPrimaryLink: 'portfolio',
    buttonSecondaryText: 'GET IN TOUCH',
    buttonSecondaryLink: 'contact',
    sortOrder: 0,
    isActive: 1,
    video: '',
    video_2: '',
    video_3: '',
    video_text: '',
    video_2_text: '',
    video_3_text: '',
  };

  const [formData, setFormData] = useState<Omit<Slide, 'id'>>(emptySlide);
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
      const data = await api.getSlides();
      console.log('Loaded slides:', data);
      if (Array.isArray(data)) {
        setSlides(data);
      } else {
        console.error('Slides data is not an array:', data);
        setSlides([]);
      }
    } catch (error) {
      console.error('Error loading slides:', error);
      setSlides([]);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setFormData({ ...emptySlide, sortOrder: slides.length + 1 });
    setIsCreating(true);
    setEditingSlide(null);
  };

  const handleEdit = (slide: Slide) => {
    setFormData({
      tag: slide.tag,
      title: slide.title,
      description: slide.description,
      image: slide.image,
      image_2: slide.image_2 || '',
      image_3: slide.image_3 || '',
      video: slide.video || '',
      video_2: slide.video_2 || '',
      video_3: slide.video_3 || '',
      video_text: slide.video_text || '',
      video_2_text: slide.video_2_text || '',
      video_3_text: slide.video_3_text || '',
      buttonPrimaryText: slide.buttonPrimaryText,
      buttonPrimaryLink: slide.buttonPrimaryLink,
      buttonSecondaryText: slide.buttonSecondaryText,
      buttonSecondaryLink: slide.buttonSecondaryLink,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
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
    });
    setEditingSlide(slide);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingSlide(null);
    setIsCreating(false);
    setFormData(emptySlide);
  };

  const handleSave = async () => {
    try {
      console.log('Saving slide with data:', formData);
      
      if (isCreating) {
        console.log('Creating new slide...');
        await api.createSlide(formData);
      } else if (editingSlide) {
        console.log('Updating slide:', editingSlide.id);
        await api.updateSlide(editingSlide.id, formData);
      }
      
      console.log('Save successful, reloading slides...');
      await loadSlides();
      handleCancel();
      alert('Slide saved successfully!');
    } catch (error) {
      console.error('Error saving slide:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Error saving slide: ' + errorMessage + '\n\nPlease check:\n1. Backend is running\n2. You are logged in\n3. All required fields are filled');
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Slide',
      message: 'Are you sure you want to delete this slide? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.deleteSlide(id);
          await loadSlides();
        } catch (error) {
          console.error('Error deleting slide:', error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleToggleActive = async (slide: Slide) => {
    try {
      await api.updateSlide(slide.id, { ...slide, isActive: slide.isActive ? 0 : 1 });
      await loadSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">Hero Slides</h1>
          <p className="text-black/60 mt-1">Manage homepage slider content</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-black/80 transition-colors"
        >
          <Plus size={20} />
          Add Slide
        </button>
      </div>

      {/* Editor Modal */}
      {(isCreating || editingSlide) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-light">
                {isCreating ? 'Create New Slide' : 'Edit Slide'}
              </h2>
              <button onClick={handleCancel} className="p-2 hover:bg-black/5 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                {formData.image ? (
                  <img
                    src={getImageUrl(formData.image)}
                    alt="Slide preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-black/40">
                    <Image size={48} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-white text-center max-w-2xl px-8">
                    <span className="text-sm tracking-widest opacity-80">{formData.tag || 'TAG'}</span>
                    <h3 className="text-3xl font-light mt-2">{formData.title || 'Title'}</h3>
                    <p className="mt-2 opacity-80">{formData.description || 'Description'}</p>
                    <div className="flex gap-4 justify-center mt-4">
                      <span className="bg-white text-black px-4 py-2 text-sm">
                        {formData.buttonPrimaryText}
                      </span>
                      <span className="border border-white px-4 py-2 text-sm">
                        {formData.buttonSecondaryText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tag</label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full border p-2"
                    placeholder="e.g., TRQ Design Studio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full border p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border p-2"
                  placeholder="e.g., Elevating Spaces, Defining Luxury"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2 h-24 resize-none"
                  placeholder="Slide description..."
                />
              </div>

              <FileUploadField
                label="Image URL"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                accept="image"
                placeholder="https://... or upload from computer"
              />

              {/* Videos Section - 2 Videos */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">📹 Videos (2 Videos) — Upload from your computer or paste URL</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((videoNum) => {
                    const videoKey = videoNum === 1 ? 'video' : `video_${videoNum}`;
                    const videoTextKey = videoNum === 1 ? 'video_text' : `video_${videoNum}_text`;
                    const videoValue = (formData as any)[videoKey] || '';
                    const videoTextValue = (formData as any)[videoTextKey] || '';
                    return (
                      <div key={videoNum} className="p-4 bg-blue-50 border border-blue-200 rounded space-y-3">
                        <h4 className="text-sm font-medium text-blue-900">Video {videoNum}</h4>
                        <FileUploadField
                          label="Video File"
                          value={videoValue}
                          onChange={(url) => setFormData({ ...formData, [videoKey]: url })}
                          accept="video"
                          placeholder="/uploads/video.mp4 or https://..."
                        />
                        <div>
                          <label className="block text-xs font-medium mb-1 text-blue-900">Video Label</label>
                          <input
                            type="text"
                            value={videoTextValue}
                            onChange={(e) => setFormData({ ...formData, [videoTextKey]: e.target.value })}
                            className="w-full border border-blue-300 p-2 text-sm rounded focus:outline-none"
                            placeholder="e.g., POV Perspective 1"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Images Section - 3 Images */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">🖼️ Images (3 Images)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((imgNum) => {
                    const imgKey = imgNum === 1 ? 'image' : `image_${imgNum}`;
                    const imgValue = (formData as any)[imgKey] || '';
                    return (
                      <div key={imgNum} className="p-4 bg-amber-50 border border-amber-200 rounded">
                        <h4 className="text-sm font-medium text-amber-900 mb-3">Image {imgNum}</h4>
                        <FileUploadField
                          label=""
                          value={imgValue}
                          onChange={(url) => setFormData({ ...formData, [imgKey]: url })}
                          accept="image"
                          placeholder="https://..."
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Buttons Section */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Button Settings</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-sm text-black/60">Primary Button</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Button Text</label>
                      <input
                        type="text"
                        value={formData.buttonPrimaryText}
                        onChange={(e) => setFormData({ ...formData, buttonPrimaryText: e.target.value })}
                        className="w-full border p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Link To</label>
                      <select
                        value={formData.buttonPrimaryLink}
                        onChange={(e) => setFormData({ ...formData, buttonPrimaryLink: e.target.value })}
                        className="w-full border p-2"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm text-black/60">Secondary Button</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">Button Text</label>
                      <input
                        type="text"
                        value={formData.buttonSecondaryText}
                        onChange={(e) => setFormData({ ...formData, buttonSecondaryText: e.target.value })}
                        className="w-full border p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Link To</label>
                      <select
                        value={formData.buttonSecondaryLink}
                        onChange={(e) => setFormData({ ...formData, buttonSecondaryLink: e.target.value })}
                        className="w-full border p-2"
                      >
                        {linkOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive === 1}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm">Active (visible on homepage)</label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border hover:bg-black/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 hover:bg-black/80 transition-colors"
              >
                <Save size={18} />
                Save Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="bg-white p-12 text-center">
            <Image size={48} className="mx-auto text-black/20 mb-4" />
            <p className="text-black/60">No slides yet. Create your first slide.</p>
          </div>
        ) : (
          slides.map((slide) => (
            <div
              key={slide.id}
              className={`bg-white border flex items-stretch ${!slide.isActive ? 'opacity-60' : ''}`}
            >
              <div className="w-48 h-32 flex-shrink-0 bg-neutral-100">
                {slide.image && (
                  <img
                    src={getImageUrl(slide.image)}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-xs text-black/50 tracking-wider">{slide.tag}</span>
                    <h3 className="font-medium">{slide.title}</h3>
                    <p className="text-sm text-black/60 mt-1 line-clamp-2">{slide.description}</p>
                    
                    {/* Videos and Images Status */}
                    <div className="flex gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-blue-600">📹</span>
                        <span className="text-black/60">
                          {[slide.video, slide.video_2, slide.video_3].filter(Boolean).length}/2 Videos
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-amber-600">🖼️</span>
                        <span className="text-black/60">
                          {[slide.image, slide.image_2, slide.image_3].filter(Boolean).length}/3 Images
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-black text-white px-2 py-1">{slide.buttonPrimaryText}</span>
                      <span className="text-xs border px-2 py-1">{slide.buttonSecondaryText}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-black/40">#{slide.sortOrder}</span>
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`p-2 rounded transition-colors ${slide.isActive ? 'text-green-600 hover:bg-green-50' : 'text-black/40 hover:bg-black/5'}`}
                      title={slide.isActive ? 'Active' : 'Inactive'}
                    >
                      {slide.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleEdit(slide)}
                      className="p-2 hover:bg-black/5 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
