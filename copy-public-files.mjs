import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Files/folders to exclude (large videos and unnecessary folders)
const excludePatterns = [
  'Full.mp4',
  'CottonSkin',
  'Graphik_Collection',
  'larsseit-sans-serif-font-family',
  'GretaTextArabicAR',
  'videos/',
  '.DS_Store'
];

// Small images to include (for testing)
const includePatterns = [];

function shouldExclude(filePath) {
  const relativePath = path.relative(publicDir, filePath);
  
  // Check if should be included
  if (includePatterns.some(pattern => relativePath.includes(pattern))) {
    return false;
  }
  
  return excludePatterns.some(pattern => {
    if (pattern.endsWith('/')) {
      // Directory pattern
      return relativePath.startsWith(pattern.slice(0, -1));
    }
    return relativePath.includes(pattern) || filePath.includes(pattern);
  });
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyFileSync(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      callback(filePath);
    }
  });
}

async function copyPublicFiles() {
  try {
    console.log('Copying public files to dist...\n');

    let copiedCount = 0;
    let skippedCount = 0;

    walkDir(publicDir, (filePath) => {
      // Check if should exclude
      if (shouldExclude(filePath)) {
        console.log(`⊘ Skipped: ${path.relative(publicDir, filePath)}`);
        skippedCount++;
        return;
      }

      const destPath = path.join(distDir, path.relative(publicDir, filePath));
      copyFileSync(filePath, destPath);
      console.log(`✓ Copied: ${path.relative(publicDir, filePath)}`);
      copiedCount++;
    });

    console.log(`\n✓ Copied ${copiedCount} files`);
    console.log(`⊘ Skipped ${skippedCount} files/folders`);
    console.log('\n✓ Public files copied successfully!');

  } catch (error) {
    console.error('Error copying public files:', error);
    process.exit(1);
  }
}

copyPublicFiles();
