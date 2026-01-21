import { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { BilingualEditor } from './BilingualEditor';
import * as api from '../api';

interface ArabicContent {
  english: Record<string, any>;
  arabic: Record<string, any>;
}

type ContentType = 'slides' | 'projects' | 'services' | 'blog';

interface AdminArabicCustomizeProps {
  contentType: ContentType;
  contentId: number;
  onClose: () => void;
  onSave?: () => void;
}

export function AdminArabicCustomize({
  contentType,
  contentId,
  onClose,
  onSave,
}: AdminArabicCustomizeProps) {
  const [content, setContent] = useState<ArabicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [contentType, contentId]);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '';
      switch (contentType) {
        case 'slides':
          endpoint = `/api/slides/${contentId}/arabic`;
          break;
        case 'projects':
          endpoint = `/api/projects/${contentId}/arabic`;
          break;
        case 'services':
          endpoint = `/api/services/${contentId}/arabic`;
          break;
        case 'blog':
          endpoint = `/api/articles/${contentId}/arabic`;
          break;
      }

      const response = await fetch(`http://localhost:3001${endpoint}`);
      const result = await response.json();

      if (result.success) {
        setContent(result.data);
      } else {
        setError(result.message || 'Failed to load content');
      }
    } catch (err) {
      setError('Error loading content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      let endpoint = '';
      switch (contentType) {
        case 'slides':
          endpoint = `/api/slides/${contentId}/arabic`;
          break;
        case 'projects':
          endpoint = `/api/projects/${contentId}/arabic`;
          break;
        case 'services':
          endpoint = `/api/services/${contentId}/arabic`;
          break;
        case 'blog':
          endpoint = `/api/articles/${contentId}/arabic`;
          break;
      }

      const token = localStorage.getItem('trq_token');
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('Arabic content saved successfully!');
        setTimeout(() => {
          onSave?.();
          onClose();
        }, 1500);
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={20} />
            <p>{error || 'Failed to load content'}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded hover:bg-black/80 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-black">Arabic Customization</h2>
            <p className="text-sm text-black/60 mt-1">
              Edit content in English and Arabic. Use copy buttons to quickly populate one language from the other.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded p-4 text-red-700">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded p-4 text-green-700">
              <AlertCircle size={20} />
              <p>{successMessage}</p>
            </div>
          )}

          {/* Render fields based on content type */}
          {contentType === 'slides' && (
            <>
              <BilingualEditor
                label="Tag"
                englishValue={content.english.tag}
                arabicValue={content.arabic.tag}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, tag: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, tag: val },
                  })
                }
              />
              <BilingualEditor
                label="Title"
                englishValue={content.english.title}
                arabicValue={content.arabic.title}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, title: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, title: val },
                  })
                }
              />
              <BilingualEditor
                label="Description"
                type="textarea"
                englishValue={content.english.description}
                arabicValue={content.arabic.description}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, description: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, description: val },
                  })
                }
              />
              <BilingualEditor
                label="Primary Button Text"
                englishValue={content.english.buttonPrimaryText}
                arabicValue={content.arabic.buttonPrimaryText}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, buttonPrimaryText: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, buttonPrimaryText: val },
                  })
                }
              />
              <BilingualEditor
                label="Secondary Button Text"
                englishValue={content.english.buttonSecondaryText}
                arabicValue={content.arabic.buttonSecondaryText}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, buttonSecondaryText: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, buttonSecondaryText: val },
                  })
                }
              />
            </>
          )}

          {contentType === 'projects' && (
            <>
              <BilingualEditor
                label="Title"
                englishValue={content.english.title}
                arabicValue={content.arabic.title}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, title: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, title: val },
                  })
                }
              />
              <BilingualEditor
                label="Description"
                type="textarea"
                englishValue={content.english.description}
                arabicValue={content.arabic.description}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, description: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, description: val },
                  })
                }
              />
              <BilingualEditor
                label="Detailed Description"
                type="textarea"
                englishValue={content.english.detailedDescription}
                arabicValue={content.arabic.detailedDescription}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, detailedDescription: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, detailedDescription: val },
                  })
                }
              />
              <BilingualEditor
                label="Challenge"
                type="textarea"
                englishValue={content.english.challenge}
                arabicValue={content.arabic.challenge}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, challenge: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, challenge: val },
                  })
                }
              />
              <BilingualEditor
                label="Solution"
                type="textarea"
                englishValue={content.english.solution}
                arabicValue={content.arabic.solution}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, solution: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, solution: val },
                  })
                }
              />
              <BilingualEditor
                label="Client Quote"
                type="textarea"
                englishValue={content.english.clientQuote}
                arabicValue={content.arabic.clientQuote}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, clientQuote: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, clientQuote: val },
                  })
                }
              />
              <BilingualEditor
                label="Client Name"
                englishValue={content.english.clientName}
                arabicValue={content.arabic.clientName}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, clientName: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, clientName: val },
                  })
                }
              />
            </>
          )}

          {contentType === 'services' && (
            <>
              <BilingualEditor
                label="Title"
                englishValue={content.english.title}
                arabicValue={content.arabic.title}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, title: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, title: val },
                  })
                }
              />
              <BilingualEditor
                label="Description"
                type="textarea"
                englishValue={content.english.description}
                arabicValue={content.arabic.description}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, description: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, description: val },
                  })
                }
              />
            </>
          )}

          {contentType === 'blog' && (
            <>
              <BilingualEditor
                label="Title"
                englishValue={content.english.title}
                arabicValue={content.arabic.title}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, title: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, title: val },
                  })
                }
              />
              <BilingualEditor
                label="Excerpt"
                type="textarea"
                englishValue={content.english.excerpt}
                arabicValue={content.arabic.excerpt}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, excerpt: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, excerpt: val },
                  })
                }
              />
              <BilingualEditor
                label="Content"
                type="textarea"
                englishValue={content.english.content}
                arabicValue={content.arabic.content}
                onEnglishChange={(val) =>
                  setContent({
                    ...content,
                    english: { ...content.english, content: val },
                  })
                }
                onArabicChange={(val) =>
                  setContent({
                    ...content,
                    arabic: { ...content.arabic, content: val },
                  })
                }
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-black/10 p-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
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
            {saving ? 'Saving...' : 'Save Arabic Content'}
          </button>
        </div>
      </div>
    </div>
  );
}
