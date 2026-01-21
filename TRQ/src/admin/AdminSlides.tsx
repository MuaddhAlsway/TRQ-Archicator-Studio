import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Eye, EyeOff, Image, Save, X, Upload } from 'lucide-react';
import * as api from '../api';
import { ConfirmModal } from './ConfirmModal';

interface Slide {
  id: number;
  tag: string;
  title: string;
  description: string;
  image: string;
  buttonPrimaryText: string;
  buttonPrimaryLink: string;
  buttonSecondaryText: string;
  buttonSecondaryLink: string;
  sortOrder: number;
  isActive: number;
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emptySlide: Omit<Slide, 'id'> = {
    tag: '',
    title: '',
    description: '',
    image: '',
    buttonPrimaryText: 'VIEW PORTFOLIO',
    buttonPrimaryLink: 'portfolio',
    buttonSecondaryText: 'GET IN TOUCH',
    buttonSecondaryLink: 'contact',
    sortOrder: 0,
    isActive: 1,
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
      setSlides(data);
    } catch (error) {
      console.error('Error loading slides:', error);
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
      buttonPrimaryText: slide.buttonPrimaryText,
      buttonPrimaryLink: slide.buttonPrimaryLink,
      buttonSecondaryText: slide.buttonSecondaryText,
      buttonSecondaryLink: slide.buttonSecondaryLink,
      sortOrder: slide.sortOrder,
      isActive: slide.isActive,
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
      if (isCreating) {
        await api.createSlide(formData);
      } else if (editingSlide) {
        await api.updateSlide(editingSlide.id, formData);
      }
      await loadSlides();
      handleCancel();
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Error saving slide: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const token = localStorage.getItem('trq_token');
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      const result = await response.json();
      if (result.success && result.url) {
        setFormData({ ...formData, image: result.url });
      } else {
        alert('Upload failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
                    src={formData.image}
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

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full border p-2"
                    placeholder="https://..."
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 flex-1 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Upload size={18} />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-black/50">Max file size: 5MB. Supported formats: JPG, PNG, WebP, GIF</p>
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
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs text-black/50 tracking-wider">{slide.tag}</span>
                    <h3 className="font-medium">{slide.title}</h3>
                    <p className="text-sm text-black/60 mt-1 line-clamp-2">{slide.description}</p>
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
