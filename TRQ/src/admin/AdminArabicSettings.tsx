import { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface ArabicSetting {
  key: string;
  englishValue: string;
  arabicValue: string;
}

export function AdminArabicSettings() {
  const [items, setItems] = useState<ArabicSetting[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('trq_token');
      const response = await fetch(`http://localhost:4242/api/arabic/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        const arabicSettings: ArabicSetting[] = result.data.map((item: any) => ({
          key: item.key,
          englishValue: item.key.replace('_ar', ''),
          arabicValue: item.value || '',
        }));
        setItems(arabicSettings);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError('Error loading settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ArabicSetting) => {
    setEditingKey(item.key);
    setEditValue(item.arabicValue);
  };

  const handleSave = async () => {
    if (!editingKey) return;

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
          [editingKey]: editValue,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('Setting saved successfully!');
        setEditingKey(null);
        setEditValue('');
        loadSettings();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(result.message || 'Failed to save setting');
      }
    } catch (err) {
      setError('Error saving setting');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 border border-black/10">
        <h1 className="text-3xl font-bold mb-2">🇸🇦 Site Settings (Arabic)</h1>
        <p className="text-black/60">Customize site settings and labels in Arabic</p>
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
        ) : editingKey ? (
          // Edit Mode
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-700 font-medium">Editing: {editingKey}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Arabic Value</label>
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full px-4 py-3 border border-black/10 rounded focus:outline-none focus:ring-2 focus:ring-black/20"
                rows={4}
                dir="rtl"
              />
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
            <p className="text-black/60 mb-4">No settings found</p>
          </div>
        ) : (
          // List Mode
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 border border-black/10 rounded hover:bg-black/2 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-black text-sm">{item.key}</h3>
                  <p className="text-sm text-black/60 mt-1 truncate">{item.arabicValue || 'Not set'}</p>
                </div>
                <button
                  onClick={() => handleEdit(item)}
                  className="px-4 py-2 text-sm bg-black/5 hover:bg-black/10 rounded transition-colors"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
