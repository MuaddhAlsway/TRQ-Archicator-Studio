// Helper to convert relative image paths to absolute URLs
function processImagePaths(obj, baseUrl = 'https://production.trq-studio.pages.dev') {
  if (!obj) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => processImagePaths(item, baseUrl));
  }
  
  if (typeof obj === 'object') {
    const processed = { ...obj };
    
    // Process image field
    if (processed.image && typeof processed.image === 'string' && processed.image.startsWith('/')) {
      processed.image = `${baseUrl}${processed.image}`;
    }
    
    // Process gallery field (JSON array)
    if (processed.gallery && typeof processed.gallery === 'string') {
      try {
        const gallery = JSON.parse(processed.gallery);
        if (Array.isArray(gallery)) {
          processed.gallery = JSON.stringify(
            gallery.map(img => {
              if (typeof img === 'string' && img.startsWith('/')) {
                return `${baseUrl}${img}`;
              }
              return img;
            })
          );
        }
      } catch (e) {
        // If not valid JSON, leave as is
      }
    }
    
    // Process video fields (hero slides and about videos)
    const videoFields = ['video', 'video_2', 'video_3', 'video_url', 'video_url_ar', 'video_ar', 'video_2_ar', 'video_3_ar'];
    videoFields.forEach(field => {
      if (processed[field] && typeof processed[field] === 'string' && processed[field].startsWith('/')) {
        processed[field] = `${baseUrl}${processed[field]}`;
      }
    });
    
    // Process any other fields that might contain paths (recursive for nested objects)
    for (const key in processed) {
      if (key.includes('image') || key.includes('video') || key.includes('url')) {
        if (typeof processed[key] === 'string' && processed[key].startsWith('/')) {
          processed[key] = `${baseUrl}${processed[key]}`;
        }
      }
    }
    
    return processed;
  }
  
  return obj;
}

// Test
const slide = {
  id: 1,
  video: '/Video1.mp4',
  image: '/uploads/test.webp'
};

const result = processImagePaths(slide);
console.log('Input:', slide);
console.log('Output:', result);
