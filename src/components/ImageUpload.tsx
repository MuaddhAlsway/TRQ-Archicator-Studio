import { useState, useRef } from 'react';
import { Upload, X, Loader } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  preview?: boolean;
}

export function ImageUpload({ 
  value, 
  onChange, 
  label = 'Upload Image',
  required = false,
  preview = true 
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm tracking-wider">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}

      <div className="space-y-3">
        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative border-2 border-dashed border-black/20 hover:border-black/40 rounded-lg p-6 cursor-pointer transition-colors bg-neutral-50 hover:bg-neutral-100"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader size={32} className="text-black/40 animate-spin" />
                <p className="text-sm text-black/60">Uploading...</p>
              </>
            ) : (
              <>
                <Upload size={32} className="text-black/40" />
                <div className="text-center">
                  <p className="text-sm font-medium text-black/80">Click to upload image</p>
                  <p className="text-xs text-black/50 mt-1">JPG, PNG, WebP, GIF • Max 10MB</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Preview */}
        {value && preview && (
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="max-w-xs h-auto rounded border border-black/10"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* URL Display */}
        {value && !preview && (
          <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded border border-black/10">
            <span className="text-xs text-black/60 truncate flex-1">{value}</span>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              title="Remove"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
