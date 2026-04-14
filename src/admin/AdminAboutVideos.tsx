import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image, Save, X } from 'lucide-react';
import * as api from '../api';
import { getImageUrl } from '../api';
import { ConfirmModal } from './ConfirmModal';
import { FileUploadField } from './FileUploadField';

interface AboutVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
  image?: string;
  sortOrder: number;
  isActive: number;
  title_ar?: string;
  description_ar?: string;
  video_url_ar?: string;
}

export function AdminAboutVideos() {
  const [videos, setVideos] = useState<AboutVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<AboutVideo | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const emptyVideo: Omit<AboutVideo, 'id'> = {
    title: '',
    description: '',
    video_url: '',
    image: '',
    sortOrder: 0,
    isActive: 1,
  };

  const [formData, setFormData] = useState<Omit<AboutVideo, 'id'>>(emptyVideo);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const data = await api.getAboutVideos();
      setVideos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setFormData({ ...emptyVideo, sortOrder: videos.length + 1 });
    setIsCreating(true);
    setEditingVideo(null);
  };

  const handleEdit = (video: AboutVideo) => {
    setFormData({
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      image: video.image || '',
      sortOrder: video.sortOrder,
      isActive: video.isActive,
    });
    setEditingVideo(video);
    setIsCreating(false);
  };

  const handleCancel = () => {
    setEditingVideo(null);
    setIsCreating(false);
    setFormData(emptyVideo);
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await api.createAboutVideo(formData);
      } else if (editingVideo) {
        await api.updateAboutVideo(editingVideo.id, formData);
      }
      await loadVideos();
      handleCancel();
    } catch (error) {
      console.error('Error saving video:', error);
      alert('Error saving video: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Video',
      message: 'Are you sure you want to delete this video? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.deleteAboutVideo(id);
          await loadVideos();
        } catch (error) {
          console.error('Error deleting video:', error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleToggleActive = async (video: AboutVideo) => {
    try {
      await api.updateAboutVideo(video.id, { ...video, isActive: video.isActive ? 0 : 1 });
      await loadVideos();
    } catch (error) {
      console.error('Error toggling video:', error);
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
          <h1 className="text-2xl font-light tracking-wide">About Videos</h1>
          <p className="text-black/60 mt-1">Manage videos for the About Us section</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-black/80 transition-colors"
        >
          <Plus size={20} />
          Add Video
        </button>
      </div>

      {/* Editor Modal */}
      {(isCreating || editingVideo) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-light">
                {isCreating ? 'Create New Video' : 'Edit Video'}
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
                    alt="Video preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-black/40">
                    <Image size={48} />
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border p-2"
                  placeholder="Video title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2 h-24 resize-none"
                  placeholder="Video description..."
                />
              </div>

              <FileUploadField
                label="Video File"
                value={formData.video_url}
                onChange={(url) => setFormData({ ...formData, video_url: url })}
                accept="video"
                placeholder="/uploads/video.mp4 or https://..."
              />

              <FileUploadField
                label="Thumbnail Image"
                value={formData.image || ''}
                onChange={(url) => setFormData({ ...formData, image: url })}
                accept="image"
                placeholder="https://... or upload from computer"
              />

              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="w-full border p-2"
                />
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
                <label htmlFor="isActive" className="text-sm">Active (visible on About page)</label>
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
                Save Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        {videos.length === 0 ? (
          <div className="bg-white p-12 text-center">
            <Image size={48} className="mx-auto text-black/20 mb-4" />
            <p className="text-black/60">No videos yet. Create your first video.</p>
          </div>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className={`bg-white border flex items-stretch ${!video.isActive ? 'opacity-60' : ''}`}
            >
              <div className="w-48 h-32 flex-shrink-0 bg-neutral-100">
                {video.image && (
                  <img
                    src={getImageUrl(video.image)}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{video.title}</h3>
                    <p className="text-sm text-black/60 mt-1 line-clamp-2">{video.description}</p>
                    <p className="text-xs text-black/40 mt-2 truncate">{video.video_url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-black/40">#{video.sortOrder}</span>
                    <button
                      onClick={() => handleToggleActive(video)}
                      className={`p-2 rounded transition-colors ${video.isActive ? 'text-green-600 hover:bg-green-50' : 'text-black/40 hover:bg-black/5'}`}
                      title={video.isActive ? 'Active' : 'Inactive'}
                    >
                      {video.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => handleEdit(video)}
                      className="p-2 hover:bg-black/5 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
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
