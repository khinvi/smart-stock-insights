const fs = require('fs');
const path = require('path');

// Create SVG icons of different sizes
function createIconSVG(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${size/8}" fill="#4CAF50" />
    <path d="M${size*0.2},${size*0.65} L${size*0.35},${size*0.5} L${size*0.5},${size*0.7} L${size*0.65},${size*0.4} L${size*0.8},${size*0.3}" 
          stroke="white" stroke-width="${size/16}" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="${size*0.8}" cy="${size*0.3}" r="${size/16}" fill="white" />
  </svg>`;
}

// Create directory if it doesn't exist
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create icons of different sizes
const sizes = [16, 48, 128];
sizes.forEach(size => {
  fs.writeFileSync(
    path.join(imagesDir, `icon${size}.svg`), 
    createIconSVG(size)
  );
  console.log(`Created icon${size}.svg`);
});

// Convert SVG to PNG using sharp
try {
  const sharp = require('sharp');
  
  sizes.forEach(size => {
    const svgPath = path.join(imagesDir, `icon${size}.svg`);
    const pngPath = path.join(imagesDir, `icon${size}.png`);
    
    sharp(svgPath)
      .png()
      .toFile(pngPath)
      .then(() => {
        console.log(`Converted icon${size}.svg to PNG`);
      })
      .catch(err => {
        console.error(`Error converting icon${size}.svg to PNG:`, err);
      });
  });
} catch (error) {
  console.log('Sharp module not found. Install with npm install sharp to convert SVG to PNG.');
  console.log('You can also manually convert the SVG files to PNG.');
}