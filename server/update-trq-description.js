#!/usr/bin/env node

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, 'trq.db'));

console.log('\n🔄 Updating TRQ STUDIO Description...\n');

const updates = [
  {
    key: 'aboutWhoWeArePara1_ar',
    value: 'TRQ STUDIO هو أستديو تصميم داخلي يبدع مساحات فاخرة تجسد الأناقة من خلال نهج شامل يوازن بين الجمال, الوظيفة والتجربة الحسية.'
  },
  {
    key: 'aboutWhoWeArePara2_ar',
    value: 'تقدم تصاميم متكاملة تراعي في السياق والهوية وتنفذ بأعلى المعايير سواء في المشاريع السكنية الراقية أو التجارية والمؤسسية الرفيعة.'
  },
  {
    key: 'aboutWhoWeArePara3_ar',
    value: 'نحن نصنع حلول تصميم خالدة تعكس رؤيتك وتحسّن طريقة عيشك وعملك من خلال الجمع بين الرؤية الفنية والخبرة العملية.'
  },
  {
    key: 'aboutWhoWeArePara1',
    value: 'TRQ STUDIO is an interior design studio that crafts luxurious spaces embodying elegance through a holistic approach that harmoniously balances aesthetics, functionality, and sensory experience.'
  },
  {
    key: 'aboutWhoWeArePara2',
    value: 'The studio delivers fully integrated design solutions that respect context and identity, executed to the highest standards across high-end residential, commercial, and distinguished institutional projects.'
  },
  {
    key: 'aboutWhoWeArePara3',
    value: 'We create lasting design solutions that reflect your vision and enhance the way you live and work through a combination of artistic vision and practical expertise.'
  }
];

try {
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)');
  
  for (const update of updates) {
    stmt.run(update.key, update.value);
    console.log(`✓ Updated: ${update.key}`);
  }
  
  console.log('\n✅ TRQ STUDIO description updated successfully!\n');
} catch (error) {
  console.error('❌ Error updating description:', error.message);
  process.exit(1);
}
