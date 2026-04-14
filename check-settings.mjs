import fs from 'fs';

const englishPath = 'src/admin/AdminSettings.tsx';
const arabicPath = 'src/admin/AdminSettingsArabic.tsx';

const englishContent = fs.readFileSync(englishPath, 'utf-8');
const arabicContent = fs.readFileSync(arabicPath, 'utf-8');

// Count lines
const englishLines = englishContent.split('\n').length;
const arabicLines = arabicContent.split('\n').length;

console.log('English file lines:', englishLines);
console.log('Arabic file lines:', arabicLines);

// Check for key patterns
const englishKeyCount = (englishContent.match(/^\s+\w+:/gm) || []).length;
const arabicKeyCount = (arabicContent.match(/^\s+\w+_ar:/gm) || []).length;

console.log('English keys (no _ar):', englishKeyCount);
console.log('Arabic keys (with _ar):', arabicKeyCount);

// Check for mismatches
const englishOnlyKeys = (englishContent.match(/^\s+(\w+):\s/gm) || [])
  .map(k => k.trim().split(':')[0])
  .filter(k => !k.endsWith('_ar'));

const arabicOnlyKeys = (arabicContent.match(/^\s+(\w+_ar):\s/gm) || [])
  .map(k => k.trim().split(':')[0]);

console.log('Sample English keys:', englishOnlyKeys.slice(0, 5));
console.log('Sample Arabic keys:', arabicOnlyKeys.slice(0, 5));
