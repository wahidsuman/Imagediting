#!/usr/bin/env node

/**
 * Simple script to generate app icons
 * In a real project, you would use a tool like react-native-make
 * or generate proper PNG files with the correct dimensions
 */

const fs = require('fs');
const path = require('path');

// Icon sizes for different densities
const iconSizes = {
  'ldpi': 36,
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192
};

// Create a simple SVG icon for the pill reminder app
const createIconSVG = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#pillGradient)" stroke="#ffffff" stroke-width="2"/>
  
  <!-- Pill shape -->
  <ellipse cx="${size/2}" cy="${size/2}" rx="${size/3}" ry="${size/6}" fill="#ffffff" opacity="0.9"/>
  
  <!-- Pill line -->
  <line x1="${size/2 - size/6}" y1="${size/2}" x2="${size/2 + size/6}" y2="${size/2}" stroke="#3B82F6" stroke-width="2"/>
  
  <!-- Notification dot -->
  <circle cx="${size * 0.75}" cy="${size * 0.25}" r="${size/12}" fill="#EF4444"/>
</svg>
`;

// Create directories and placeholder files
Object.keys(iconSizes).forEach(density => {
  const size = iconSizes[density];
  const dir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', `mipmap-${density}`);
  
  // Ensure directory exists
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create SVG file (in a real project, you'd convert this to PNG)
  const svgContent = createIconSVG(size);
  fs.writeFileSync(path.join(dir, 'ic_launcher.svg'), svgContent);
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.svg'), svgContent);
  
  console.log(`Generated icon for ${density} (${size}x${size})`);
});

console.log('\n✅ App icons generated!');
console.log('📝 Note: In a real project, convert these SVG files to PNG format');
console.log('🔧 You can use tools like:');
console.log('   - react-native-make');
console.log('   - Android Studio Image Asset Studio');
console.log('   - Online icon generators');