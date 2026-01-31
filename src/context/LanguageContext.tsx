import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import i18n from '../i18n';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // Static translation (react-i18next) - for UI text from JSON files
  ts: (key: string) => string;
  // Dynamic translation - NO API, just returns text
  td: (text: string) => string;
  // Legacy t function
  t: (text: string) => string;
  // Convert numbers to Arabic numerals
  toArabicNum: (num: string | number) => string;
  // Batch translate - NO-OP (disabled)
  translateBatch: (texts: string[]) => void;
  isRTL: boolean;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Convert Western numerals to Arabic-Indic numerals
const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabicNumerals = (str: string): string => {
  return str.replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('trq_language');
    return (saved === 'ar' ? 'ar' : 'en') as Language;
  });

  const isRTL = language === 'ar';

  // Static translation - uses i18next to get translations from JSON files
  const ts = useCallback((key: string): string => {
    return i18n.t(key);
  }, []);

  // Dynamic translation - NO API, just returns text as-is
  const td = useCallback((text: string): string => {
    return text;
  }, []);

  // Legacy t function
  const t = td;

  // Convert numbers to Arabic numerals when in Arabic mode
  const toArabicNum = useCallback((num: string | number): string => {
    const str = String(num);
    if (language === 'ar') {
      return toArabicNumerals(str);
    }
    return str;
  }, [language]);

  // NO-OP batch translate (disabled - no automatic translation)
  const translateBatch = useCallback(() => {
    // Disabled - no automatic translation
  }, []);

  // Handle language change
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('trq_language', lang);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  // Initialize direction on mount
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      ts,
      td,
      t,
      toArabicNum,
      translateBatch,
      isRTL,
      isTranslating: false,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
