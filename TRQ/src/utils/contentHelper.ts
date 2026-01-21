/**
 * Helper functions for getting content in the correct language
 * No automatic translation - uses direct database fields
 */

export function getContent(
  language: 'en' | 'ar',
  englishValue: string | undefined,
  arabicValue: string | undefined
): string {
  if (language === 'ar' && arabicValue) {
    return arabicValue;
  }
  return englishValue || '';
}

export function getContentFromSettings(
  language: 'en' | 'ar',
  settings: Record<string, any>,
  key: string
): string {
  if (language === 'ar') {
    const arabicKey = `${key}_ar`;
    if (settings[arabicKey]) {
      return settings[arabicKey];
    }
  }
  return settings[key] || '';
}
