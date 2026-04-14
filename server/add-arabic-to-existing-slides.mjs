import fetch from 'node-fetch';

const TURSO_API_URL = 'https://trq-database-muaddhalsway.aws-ap-south-1.turso.io/v2/pipeline';
const TURSO_AUTH_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA';

async function executeQuery(sql, params = []) {
  const response = await fetch(TURSO_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{
        type: 'execute',
        stmt: {
          sql: sql,
          args: params.map(p => ({ type: 'text', value: String(p) })),
        },
      }],
    }),
  });

  const data = await response.json();
  if (data.results?.[0]?.response?.result?.rows) {
    const cols = data.results[0].response.result.cols || [];
    const rows = data.results[0].response.result.rows || [];
    return rows.map(row => {
      const obj = {};
      cols.forEach((col, idx) => {
        obj[col.name] = row[idx]?.value || null;
      });
      return obj;
    });
  }
  return [];
}

const arabicTranslations = {
  1: {
    tag_ar: 'استوديو TRQ للتصميم',
    title_ar: 'رفع المساحات، تحديد الفخامة',
    description_ar: 'حلول تصميم داخلي فاخرة للعملاء الذين يطالبون بالتميز.',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا',
  },
  2: {
    tag_ar: 'تصميم سكني',
    title_ar: 'مساحات معيشة فاخرة',
    description_ar: 'إنشاء ديكورات داخلية سكنية خالدة تعكس نمط حياتك وذوقك الفريد.',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا',
  },
  3: {
    tag_ar: 'التصميم التجاري',
    title_ar: 'مساحات عمل ملهمة',
    description_ar: 'تحويل البيئات التجارية إلى مساحات منتجة وجميلة من الناحية الجمالية.',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا',
  },
  4: {
    tag_ar: 'تميز داخلي',
    title_ar: 'ديكورات مصقولة',
    description_ar: 'نسعى لإنشاء تجربة داخلية لا تُنسى وخالدة.',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا',
  },
  5: {
    tag_ar: 'محفظتنا',
    title_ar: 'المشاريع المميزة',
    description_ar: 'استكشف مجموعتنا من مشاريع التصميم الحائزة على جوائز في جميع أنحاء المملكة العربية السعودية.',
    buttonPrimaryText_ar: 'عرض المحفظة',
    buttonSecondaryText_ar: 'تواصل معنا',
  },
};

async function updateSlides() {
  console.log('🔄 Updating hero slides with Arabic translations...\n');
  
  for (const [id, translations] of Object.entries(arabicTranslations)) {
    const sql = `UPDATE hero_slides SET tag_ar = ?, title_ar = ?, description_ar = ?, buttonPrimaryText_ar = ?, buttonSecondaryText_ar = ? WHERE id = ?`;
    const params = [
      translations.tag_ar,
      translations.title_ar,
      translations.description_ar,
      translations.buttonPrimaryText_ar,
      translations.buttonSecondaryText_ar,
      parseInt(id),
    ];
    
    await executeQuery(sql, params);
    console.log(`✓ Slide ${id} updated with Arabic translations`);
  }
  
  console.log('\n✅ All slides updated successfully!');
}

updateSlides().catch(console.error);
