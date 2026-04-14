import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image, Save, X, Upload } from 'lucide-react';
import * as api from '../api';
import { getImageUrl } from '../api';
import { ConfirmModal } from './ConfirmModal';

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

export function AdminArabicAboutVideos() {
  const [videos, setVideos] = useState<AboutVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<AboutVideo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setVideos(data);
    } catch (error) {
      console.error('Error loading videos:', error);
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
      title_ar: video.title_ar || '',
      description_ar: video.description_ar || '',
      video_url_ar: video.video_url_ar || '',
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
      title: 'حذف الفيديو',
      message: 'هل أنت متأكد من رغبتك في حذف هذا الفيديو؟ لا يمكن التراجع عن هذا الإجراء.',
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى تحديد ملف صورة');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('يجب أن يكون حجم الملف أقل من 5 ميجابايت');
      return;
    }

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const token = localStorage.getItem('trq_access_token');
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/upload`, {
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
        alert('فشل التحميل: ' + (result.message || 'خطأ غير معروف'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('خطأ في تحميل الملف');
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
    <div dir="rtl" style={{ direction: 'rtl', textAlign: 'right' }}>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-wide">فيديوهات من نحن</h1>
          <p className="text-black/60 mt-1">إدارة الفيديوهات لقسم من نحن</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 hover:bg-black/80 transition-colors"
        >
          <Plus size={20} />
          إضافة فيديو
        </button>
      </div>

      {/* Editor Modal */}
      {(isCreating || editingVideo) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <button onClick={handleCancel} className="p-2 hover:bg-black/5 rounded">
                <X size={20} />
              </button>
              <h2 className="text-xl font-light">
                {isCreating ? 'إنشاء فيديو جديد' : 'تعديل الفيديو'}
              </h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                {formData.image ? (
                  <img
                    src={getImageUrl(formData.image)}
                    alt="معاينة الفيديو"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-black/40">
                    <Image size={48} />
                  </div>
                )}
              </div>

              {/* English Fields */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">المحتوى الإنجليزي</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">العنوان (إنجليزي)</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border p-2"
                    placeholder="عنوان الفيديو"
                    dir="ltr"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">الوصف (إنجليزي)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border p-2 h-24 resize-none"
                    placeholder="وصف الفيديو..."
                    dir="ltr"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">رابط الفيديو (إنجليزي)</label>
                  <input
                    type="text"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    className="w-full border p-2"
                    placeholder="https://... (رابط فيديو MP4)"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Arabic Fields */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">المحتوى العربي</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">العنوان (عربي)</label>
                  <input
                    type="text"
                    value={formData.title_ar || ''}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    className="w-full border p-2"
                    placeholder="العنوان بالعربية"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">الوصف (عربي)</label>
                  <textarea
                    value={formData.description_ar || ''}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    className="w-full border p-2 h-24 resize-none"
                    placeholder="الوصف بالعربية..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">رابط الفيديو (عربي - اختياري)</label>
                  <input
                    type="text"
                    value={formData.video_url_ar || ''}
                    onChange={(e) => setFormData({ ...formData, video_url_ar: e.target.value })}
                    className="w-full border p-2"
                    placeholder="https://... (رابط فيديو MP4 منفصل)"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Thumbnail and Settings */}
              <div className="border-t pt-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">صورة مصغرة</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full border p-2"
                      placeholder="https://..."
                      dir="ltr"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 flex-1 bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Upload size={18} />
                        {uploading ? 'جاري التحميل...' : 'تحميل صورة'}
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-black/50">الحد الأقصى: 5 ميجابايت. الصيغ المدعومة: JPG, PNG, WebP, GIF</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">ترتيب العرض</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full border p-2"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive === 1}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm">نشط (مرئي على صفحة من نحن)</label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-start gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-black text-white px-6 py-2 hover:bg-black/80 transition-colors"
              >
                <Save size={18} />
                حفظ الفيديو
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 border hover:bg-black/5 transition-colors"
              >
                إلغاء
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
            <p className="text-black/60">لا توجد فيديوهات حتى الآن. أنشئ فيديوك الأول.</p>
          </div>
        ) : (
          videos.map((video) => (
            <div
              key={video.id}
              className={`bg-white border flex items-stretch ${!video.isActive ? 'opacity-60' : ''}`}
              dir="rtl"
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-black/40">#{video.sortOrder}</span>
                    <button
                      onClick={() => handleToggleActive(video)}
                      className={`p-2 rounded transition-colors ${video.isActive ? 'text-green-600 hover:bg-green-50' : 'text-black/40 hover:bg-black/5'}`}
                      title={video.isActive ? 'نشط' : 'غير نشط'}
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
                  <div>
                    <h3 className="font-medium">{video.title_ar || video.title}</h3>
                    <p className="text-sm text-black/60 mt-1 line-clamp-2">{video.description_ar || video.description}</p>
                    <p className="text-xs text-black/40 mt-2 truncate">{video.video_url_ar || video.video_url}</p>
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
