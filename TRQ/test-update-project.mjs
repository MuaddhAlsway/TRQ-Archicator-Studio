import fetch from 'node:fetch';

const API_URL = 'http://localhost:3001';

// First, let's get a project to see its current state
console.log('Getting project 12...');
const getRes = await fetch(`${API_URL}/api/projects/12`);
const project = await getRes.json();
console.log('Current project:', {
  id: project.id,
  title: project.title,
  title_ar: project.title_ar,
  category: project.category,
  category_ar: project.category_ar,
});

// Now let's update only the Arabic fields
console.log('\nUpdating Arabic fields...');
const updateData = {
  title_ar: 'مجموعة المصمم - تحديث',
  category_ar: 'أثاث',
  description_ar: 'قطع أثاث مخصصة تعرض الحرفية والتصميم الحديث',
};

const updateRes = await fetch(`${API_URL}/api/projects/12`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer test-token',
  },
  body: JSON.stringify(updateData),
});

if (updateRes.ok) {
  const updated = await updateRes.json();
  console.log('✓ Update successful');
  console.log('Updated project:', {
    id: updated.id,
    title: updated.title,
    title_ar: updated.title_ar,
    category: updated.category,
    category_ar: updated.category_ar,
  });
} else {
  console.error('✗ Update failed:', updateRes.status, await updateRes.text());
}
