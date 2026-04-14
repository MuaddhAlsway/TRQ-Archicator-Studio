import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

// Derive base URL from the VITE_API_URL env var (strips trailing /api)
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL as string;
  if (envUrl) return envUrl.replace(/\/api$/, '');
  return '';
};

export function ImageUpload({ value, onChange, label = 'IMAGE', placeholder = 'https://... or /uploads/filename.jpg' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, WebP, GIF, or SVG.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const apiBaseUrl = getApiBaseUrl();
      
      // Ensure token is fresh before upload
      const tokenExpiry = localStorage.getItem('trq_token_expiry');
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry) - 2 * 60 * 1000) {
        // Token expiring soon, try to refresh
        const refreshToken = localStorage.getItem('trq_refresh_token');
        if (refreshToken) {
          try {
            const refreshRes = await fetch(`${apiBaseUrl}/api/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refreshToken }),
            });
            if (refreshRes.ok) {
              const refreshData = await refreshRes.json();
              localStorage.setItem('trq_access_token', refreshData.accessToken);
              localStorage.setItem('trq_token_expiry', Date.now() + (refreshData.expiresIn * 1000));
            }
          } catch (err) {
            console.error('Token refresh failed:', err);
          }
        }
      }
      
      const response = await fetch(`${apiBaseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('trq_access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm tracking-wider font-medium">{label}</label>
      
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 border border-black/20 focus:border-black focus:outline-none"
          placeholder={placeholder}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-4 py-3 bg-black text-white hover:bg-black/80 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          {uploading ? (
            <>
              <Loader size={18} className="animate-spin" />
              <span className="hidden sm:inline">Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={18} />
              <span className="hidden sm:inline">Upload</span>
            </>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-3 py-3 border border-black/20 hover:bg-red-50 text-red-600 transition-colors"
            title="Clear image"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {value && (
        <div className="relative w-full h-40 bg-neutral-100 rounded overflow-hidden">
          <img src={value} alt="Preview" className="w-full h-full object-cover"  loading="lazy" />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-xs text-black/60">
        Supported formats: JPG, PNG, WebP, GIF, SVG (max 10MB)
      </div>
    </div>
  );
}
