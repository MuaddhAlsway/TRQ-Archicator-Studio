import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, '../public/TRQ STUDIO _ PROJECTS');

// Helper to get first image from a folder
function getFirstImage(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
    if (imageFiles.length > 0) {
      return `/TRQ STUDIO _ PROJECTS/${path.basename(folderPath)}/${imageFiles[0]}`;
    }
  } catch (e) {
    console.log(`Could not read folder: ${folderPath}`);
  }
  return null;
}

// Helper to get all images from a folder
function getAllImages(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
    return imageFiles.map(f => `/TRQ STUDIO _ PROJECTS/${path.basename(folderPath)}/${f}`);
  } catch (e) {
    return [];
  }
}

// Helper to get images from subfolders (WEB, PNG, webp, OG)
function getImagesFromSubfolders(folderPath) {
  const images = [];
  const subfolders = ['WEB', 'PNG', 'webp', 'OG'];
  
  for (const subfolder of subfolders) {
    const subPath = path.join(folderPath, subfolder);
    if (fs.existsSync(subPath)) {
      try {
        const files = fs.readdirSync(subPath);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
        imageFiles.forEach(f => {
          images.push(`/TRQ STUDIO _ PROJECTS/${path.basename(folderPath)}/${subfolder}/${f}`);
        });
      } catch (e) {
        console.log(`Could not read subfolder: ${subPath}`);
      }
    }
  }
  
  return images;
}

console.log('Scanning TRQ STUDIO _ PROJECTS folder...');
console.log('Projects directory:', projectsDir);

if (!fs.existsSync(projectsDir)) {
  console.error('Projects directory not found:', projectsDir);
  process.exit(1);
}

const projectFolders = fs.readdirSync(projectsDir).filter(f => {
  const fullPath = path.join(projectsDir, f);
  return fs.statSync(fullPath).isDirectory() && f !== '.vscode';
});

console.log(`Found ${projectFolders.length} project folders`);
