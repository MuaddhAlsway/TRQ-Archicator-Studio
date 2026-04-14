import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: 'image' | 'video' | 'both';
  placeholder?: string;
  preview?: boolean;
}

export function FileUploadField({
  label,
  value,
  onChange,
  accept = 'image',
  placeholder,
  preview = true,
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptAttr =
    accept === 'image' ? 'image/*' :
    accept === 'video' ? 'video/mp4,video/webm,video/ogg,video/quicktime' :
    'image/*,video/mp4,video/webm,video/ogg,video/quicktime';

  const maxSize = accept === 'image' ? 10 : 500; // MB

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (accept === 'image' && !isImage) {
      alert('Please select an image file');
      return;
    }
    if (accept === 'video' && !isVideo) {
      alert('Please select a video file (MP4, WebM, MOV)');
      return;
    }

    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('trq_access_token');
      const apiUrl = import.meta.env.VITE_API_URL;
      
      // Ensure token is fresh before upload
      const tokenExpiry = localStorage.getItem('trq_token_expiry');
      if (tokenExpiry && Date.now() > parseInt(tokenExpiry) - 2 * 60 * 1000) {
        // Token expiring soon, try to refresh
        const refreshToken = localStorage.getItem('trq_refresh_token');
        if (refreshToken) {
          try {
            const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
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
      
      const res = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.url) {
        onChange(result.url);
      } else {
        // Worker returns a helpful message when upload isn't supported
        const msg = result.message || 'Upload failed';
        if (msg.includes('local server') || msg.includes('only available')) {
          alert('⚠️ File upload requires the local backend server.\n\nTo upload files:\n1. Run the backend locally: cd server && node index.js\n2. Set VITE_API_URL=http://localhost:4242/api in .env.development\n3. Or paste a direct URL in the field above.');
        } else {
          alert('Upload failed: ' + msg);
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed. Make sure the local backend server is running.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isVideo = value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.endsWith('.mov') || value.endsWith('.ogv'));

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 border p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder={placeholder || (accept === 'video' ? '/uploads/video.mp4 or https://...' : 'https://... or /uploads/image.jpg')}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 text-red-500 hover:bg-red-50 border border-red-200 rounded"
              title="Clear"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 w-full justify-center bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={16} />
          {uploading ? 'Uploading...' : `Upload ${accept === 'video' ? 'Video' : accept === 'image' ? 'Image' : 'File'} from Computer`}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptAttr}
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="text-xs text-black/40">
          Max {maxSize}MB.{' '}
          {accept === 'image' && 'JPG, PNG, WebP, GIF'}
          {accept === 'video' && 'MP4, WebM, MOV'}
          {accept === 'both' && 'Images or Videos'}
        </p>

        {/* Preview */}
        {preview && value && (
          <div className="mt-2 rounded overflow-hidden border border-black/10">
            {isVideo ? (
              <video
                src={value.startsWith('http') ? value : value}
                className="w-full h-32 object-cover bg-black"
                controls={false}
                muted
                preload="metadata"
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-32 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
