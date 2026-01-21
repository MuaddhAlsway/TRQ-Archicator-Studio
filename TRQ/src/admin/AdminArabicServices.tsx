import { useState, useEffect } from 'react';
import { Save, Edit2, AlertCircle } from 'lucide-react';
import { useAdmin } from './AdminContext';
import { BilingualEditor } from './BilingualEditor';

interface ArabicService {
  id: number;
  englishTitle: string;
  arabicTitle: string;
  englishDescription: string;
  arabicDescription: string;
}

export function AdminArabicServices() {
  const { services } = useAdmin();
  const [items, setItems] = useState<ArabicService[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ArabicService>>({});

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('trq_token');
      const response = await fetch('http://localhost:3001/api/services', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      
      if (Array.isArray(result)) {
        const arabicServices: ArabicService[] = result.map((service: any) => ({
          id: service.id,
          englishTitle: service.title || '',
          arabicTitle: service.title || '',
          englishDescription: service.description || '',
          arabicDescription: service.description || '',
        }));
        setItems(arabicServices);
      } else if (result && result.data && Array.isArray(result.data)) {
        const arabicServices: ArabicService[] = result.data.map((service: any) => ({
          id: service.id,
          englishTitle: service.title || '',
          arabicTitle: service.title || '',
          englishDescription: service.description || '',
          arabicDescription: service.description || '',
        }));
        setItems(arabicServices);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError('Error loading services');
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ArabicService) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const handleSave = async () => {
    if (!editData.id) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('trq_token');
      const response = await fetch(`http://localhost:3001/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          [`service_${editData.id}_title_ar`]: editData.arabicTitle,
          [`service_${editData.id}_desc_ar`]: editData.arabicDescription,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('Service Arabic content saved successfully!');
        setEditingId(null);
        setEditData({});
        loadItems();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.message || 'Failed to save content');
      }
    } catch (err) {
      setError('Error saving content');
      console.error(err);
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
        <h1 className="text-3xl font-bold mb-2">🇸🇦 Services (Arabic)</h1>
        <p className="text-black/60">Customize services content in Arabic</p>
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
              <p className="text-blue-700 font-medium">Editing: {editData.englishTitle}</p>
            </div>

            <BilingualEditor
              label="Title"
              englishValue={editData.englishTitle || ''}
              arabicValue={editData.arabicTitle || ''}
              onEnglishChange={() => {}}
              onArabicChange={(val) =>
                setEditData({ ...editData, arabicTitle: val })
              }
            />

            <BilingualEditor
              label="Description"
              type="textarea"
              englishValue={editData.englishDescription || ''}
              arabicValue={editData.arabicDescription || ''}
              onEnglishChange={() => {}}
              onArabicChange={(val) =>
                setEditData({ ...editData, arabicDescription: val })
              }
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
            <p className="text-black/60 mb-4">No services found</p>
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
                  <h3 className="font-medium text-black">{item.englishTitle}</h3>
                  <p className="text-sm text-black/60 mt-1">{item.arabicTitle || 'Not translated'}</p>
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
