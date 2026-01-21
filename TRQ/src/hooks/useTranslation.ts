import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Hook for translating content in components
 * 
 * Usage:
 * const { t, isRTL } = useTranslation(['Hello', 'Welcome']);
 * return <h1>{t('Hello')}</h1>
 */
export function useTranslation(textsToTranslate: string[] = []) {
  const { t, translateBatch, isRTL, language, isTranslating } = useLanguage();

  useEffect(() => {
    if (language === 'ar' && textsToTranslate.length > 0) {
      translateBatch(textsToTranslate);
    }
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  return { t, isRTL, language, isTranslating };
}
