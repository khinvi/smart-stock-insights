const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Config
const SOURCE_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const FILES_TO_COPY = [
  'manifest.json',
  'public/**/*',
  'LICENSE',
  'README.md'
];

// Load environment variables from .env file
require('dotenv').config();

// Create dist directory
if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
} else {
  // Clean dist directory
  execSync(`rm -rf ${DIST_DIR}/*`);
}

// Process JavaScript files
processJsFiles();

// Copy files
copyFiles();

// Create icons
createIcons();

console.log('Build completed successfully!');

// Function to process JavaScript files
function processJsFiles() {
  const srcDir = path.join(SOURCE_DIR, 'src');
  const destDir = path.join(DIST_DIR, 'src');
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Get all JS files
  const jsFiles = getAllFiles(srcDir).filter(file => file.endsWith('.js'));
  
  jsFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace API keys
    if (process.env.ALPHA_VANTAGE_API_KEY) {
      content = content.replace(
        /process\.env\.ALPHA_VANTAGE_API_KEY\s*\|\|\s*['"]YOUR_ALPHA_VANTAGE_API_KEY['"]/g,
        `'${process.env.ALPHA_VANTAGE_API_KEY}'`
      );
    }
    
    if (process.env.FMP_API_KEY) {
      content = content.replace(
        /process\.env\.FMP_API_KEY\s*\|\|\s*['"]YOUR_FMP_API_KEY['"]/g,
        `'${process.env.FMP_API_KEY}'`
      );
    }
    
    // Create relative path in dist directory
    const relativePath = path.relative(srcDir, file);
    const destPath = path.join(destDir, relativePath);
    
    // Create parent directory if it doesn't exist
    const destParentDir = path.dirname(destPath);
    if (!fs.existsSync(destParentDir)) {
      fs.mkdirSync(destParentDir, { recursive: true });
    }
    
    // Write processed file
    fs.writeFileSync(destPath, content);
    console.log(`Processed: ${relativePath}`);
  });
}

// Function to copy files
function copyFiles() {
  FILES_TO_COPY.forEach(pattern => {
    const srcPattern = path.join(SOURCE_DIR, pattern);
    const cmd = `cp -R ${srcPattern} ${DIST_DIR}/`;
    execSync(cmd);
    console.log(`Copied: ${pattern}`);
  });
}

// Function to create icons
function createIcons() {
  try {
    execSync(`node ${path.join(SOURCE_DIR, 'scripts', 'create-icons.js')}`);
  } catch (error) {
    console.error('Error creating icons:', error.message);
  }
}

// Function to get all files recursively
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file));
    } else {
      results.push(file);
    }
  });
  
  return results;
}