import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-3 py-1.5 text-sm tracking-wider opacity-60 hover:opacity-100 transition-opacity"
      disabled={isTranslating}
    >
      <Globe size={16} />
      <span>{language === 'en' ? 'العربية' : 'English'}</span>
      {isTranslating && (
        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      )}
    </button>
  );
}
