import fs from 'fs';

// Read the English AdminSettings.tsx
let content = fs.readFileSync('src/admin/AdminSettings.tsx', 'utf-8');

// Replace function name
content = content.replace('export function AdminSettings()', 'export function AdminSettingsArabic()');

// Add dir="rtl" to main div
content = content.replace(
  '<div>',
  '<div dir="rtl" style={{ direction: \'rtl\', textAlign: \'right\' }}>',
  1
);

// Replace all setting keys with _ar suffix
const settingsMap = {
  'blogHidden:': 'blogHidden_ar:',
  'homeIntroTitle:': 'homeIntroTitle_ar:',
  'homeIntroText1:': 'homeIntroText1_ar:',
  'homeIntroText2:': 'homeIntroText2_ar:',
  'homeIntroImage:': 'homeIntroImage_ar:',
  'homeIntroLinkText:': 'homeIntroLinkText_ar:',
  'homeIntroLinkPage:': 'homeIntroLinkPage_ar:',
  'homeFeaturedTitle:': 'homeFeaturedTitle_ar:',
  'homeFeaturedDescription:': 'homeFeaturedDescription_ar:',
  'homeFeaturedProjects:': 'homeFeaturedProjects_ar:',
  'homeWorkflowTitle:': 'homeWorkflowTitle_ar:',
  'homeWorkflowDescription:': 'homeWorkflowDescription_ar:',
  'homeWorkflowStep1Title:': 'homeWorkflowStep1Title_ar:',
  'homeWorkflowStep1Desc:': 'homeWorkflowStep1Desc_ar:',
  'homeWorkflowStep2Title:': 'homeWorkflowStep2Title_ar:',
  'homeWorkflowStep2Desc:': 'homeWorkflowStep2Desc_ar:',
  'homeWorkflowStep3Title:': 'homeWorkflowStep3Title_ar:',
  'homeWorkflowStep3Desc:': 'homeWorkflowStep3Desc_ar:',
  'homeWorkflowStep4Title:': 'homeWorkflowStep4Title_ar:',
  'homeWorkflowStep4Desc:': 'homeWorkflowStep4Desc_ar:',
  'homeWorkflowStep5Title:': 'homeWorkflowStep5Title_ar:',
  'homeWorkflowStep5Desc:': 'homeWorkflowStep5Desc_ar:',
  'homeWorkflowLinkText:': 'homeWorkflowLinkText_ar:',
  'homeWorkflowLinkPage:': 'homeWorkflowLinkPage_ar:',
  'homeCtaTitle:': 'homeCtaTitle_ar:',
  'homeCtaDescription:': 'homeCtaDescription_ar:',
  'homeCtaButton1Text:': 'homeCtaButton1Text_ar:',
  'homeCtaButton1Page:': 'homeCtaButton1Page_ar:',
  'homeCtaButton2Text:': 'homeCtaButton2Text_ar:',
  'homeCtaButton2Page:': 'homeCtaButton2Page_ar:',
};

Object.entries(settingsMap).forEach(([key, value]) => {
  content = content.split(key).join(value);
});

// Write the Arabic version
fs.writeFileSync('src/admin/AdminSettingsArabic.tsx', content, 'utf-8');

console.log('AdminSettingsArabic.tsx transformed successfully!');
