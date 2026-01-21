import { useState } from 'react';
import { Globe, Copy, Check } from 'lucide-react';

interface BilingualEditorProps {
  label: string;
  englishValue: string;
  arabicValue: string;
  onEnglishChange: (value: string) => void;
  onArabicChange: (value: string) => void;
  type?: 'text' | 'textarea';
  placeholder?: string;
  maxLength?: number;
}

export function BilingualEditor({
  label,
  englishValue,
  arabicValue,
  onEnglishChange,
  onArabicChange,
  type = 'text',
  placeholder = '',
  maxLength,
}: BilingualEditorProps) {
  const [copied, setCopied] = useState<'en' | 'ar' | null>(null);

  const handleCopyToArabic = () => {
    onArabicChange(englishValue);
    setCopied('ar');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyToEnglish = () => {
    onEnglishChange(arabicValue);
    setCopied('en');
    setTimeout(() => setCopied(null), 2000);
  };

  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-black/80">{label}</label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-black/60 uppercase tracking-wider">English</span>
            <button
              onClick={handleCopyToArabic}
              className="p-1 hover:bg-black/5 rounded transition-colors"
              title="Copy to Arabic"
            >
              {copied === 'ar' ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} className="text-black/40" />
              )}
            </button>
          </div>
          <InputComponent
            type={type === 'text' ? 'text' : undefined}
            value={englishValue}
            onChange={(e) => onEnglishChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`w-full px-3 py-2 border border-black/10 rounded bg-white text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 ${
              type === 'textarea' ? 'min-h-[120px] resize-none' : ''
            }`}
          />
          {maxLength && (
            <div className="text-xs text-black/40">
              {englishValue.length} / {maxLength}
            </div>
          )}
        </div>

        {/* Arabic */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-black/60 uppercase tracking-wider">العربية</span>
            <button
              onClick={handleCopyToEnglish}
              className="p-1 hover:bg-black/5 rounded transition-colors"
              title="Copy to English"
            >
              {copied === 'en' ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} className="text-black/40" />
              )}
            </button>
          </div>
          <InputComponent
            type={type === 'text' ? 'text' : undefined}
            value={arabicValue}
            onChange={(e) => onArabicChange(e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            dir="rtl"
            className={`w-full px-3 py-2 border border-black/10 rounded bg-white text-black placeholder-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 text-right ${
              type === 'textarea' ? 'min-h-[120px] resize-none' : ''
            }`}
          />
          {maxLength && (
            <div className="text-xs text-black/40 text-right">
              {arabicValue.length} / {maxLength}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-black/50 bg-black/5 p-2 rounded">
        <Globe size={14} />
        <span>Edit content in both languages. Use copy buttons to quickly populate one language from the other.</span>
      </div>
    </div>
  );
}
