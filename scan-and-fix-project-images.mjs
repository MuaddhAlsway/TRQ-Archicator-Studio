import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const turso = createClient({
  url: 'libsql://trq-database-muaddhalsway.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwNjA1ODcsImlkIjoiYmZjYWE5ZGItMjZlOC00Njc4LThiZjYtOGExYmVmYWZjNTQxIiwicmlkIjoiNjdkMTVjMzMtN2M3OC00YWViLTkzOTMtN2YwMGQzYTBhZmQyIn0.5SImIwTalcpI1jc70PZYuV-0Prjlvnia2FABgAO267z5qOK-JaRWAcNw_Kz9tvR9r-2_SdAlB_R8s-Uy9ZANAA',
});

function getFirstImageInFolder(folderPath) {
  try {
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
    if (imageFiles.length > 0) {
      return imageFiles[0];
    }
  } catch (e) {
    console.error(`Error reading folder ${folderPath}:`, e.message);
  }
  return null;
}

function findProjectFolder(projectTitle) {
  const projectsPath = './public/TRQ STUDIO _ PROJECTS';
  
  try {
    const folders = fs.readdirSync(projectsPath);
    
    // Exact match
    if (folders.includes(projectTitle)) {
      return projectTitle;
    }
    
    // Case-insensitive match
    const lowerTitle = projectTitle.toLowerCase();
    for (const folder of folders) {
      if (folder.toLowerCase() === lowerTitle) {
        return folder;
      }
    }
    
    // Partial match
    for (const folder of folders) {
      if (folder.toLowerCase().includes(lowerTitle) || lowerTitle.includes(folder.toLowerCase())) {
        return folder;
      }
    }
  } catch (e) {
    console.error('Error reading projects folder:', e.message);
  }
  
  return null;
}

async function scanAndFix() {
  try {
    console.log('Scanning public folder and updating project images...\n');
    
    // Get all projects
    const result = await turso.execute('SELECT id, title FROM projects ORDER BY id');
    
    console.log(`Found ${result.rows.length} projects\n`);
    
    for (const project of result.rows) {
      console.log(`Processing: ${project.title}`);
      
      // Find matching folder
      const folderName = findProjectFolder(project.title);
      
      if (!folderName) {
        console.log(`  ⚠️  No folder found for "${project.title}"`);
        continue;
      }
      
      // Get first image in folder
      const folderPath = `./public/TRQ STUDIO _ PROJECTS/${folderName}`;
      const imageName = getFirstImageInFolder(folderPath);
      
      if (!imageName) {
        console.log(`  ⚠️  No images found in folder "${folderName}"`);
        continue;
      }
      
      const imagePath = `/TRQ STUDIO _ PROJECTS/${folderName}/${imageName}`;
      
      // Update database
      await turso.execute({
        sql: 'UPDATE projects SET image = ? WHERE id = ?',
        args: [imagePath, project.id]
      });
      
      console.log(`  ✓ Updated: ${imagePath}`);
    }
    
    console.log('\n✅ All project images updated!\n');
    
    // Verify
    const verify = await turso.execute('SELECT id, title, image FROM projects ORDER BY id');
    console.log('Final image paths:');
    verify.rows.forEach(p => {
      console.log(`ID ${p.id}: ${p.title}`);
      console.log(`  → ${p.image}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

scanAndFix();
