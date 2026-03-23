#!/usr/bin/env node

/* eslint-env node */

/**
 * Generate OG Image Script
 * Converts SVG to PNG for Open Graph / Twitter Cards
 * 
 * Usage: node scripts/generate-og-image.js
 * 
 * Requires: sharp (install with: npm install -D sharp)
 * 
 * This script:
 * 1. Takes public/og-image.svg
 * 2. Converts to PNG (1200x630px)
 * 3. Outputs to public/og-image.png
 */

const fs = require('fs');
const path = require('path');

async function generateOGImage() {
  try {
    // Try using 'sharp' library if installed
    try {
      const sharp = require('sharp');
      
      const svgPath = path.join(__dirname, '../public/og-image.svg');
      const pngPath = path.join(__dirname, '../public/og-image.png');
      
      if (!fs.existsSync(svgPath)) {
        console.error('❌ SVG file not found:', svgPath);
        process.exit(1);
      }
      
      console.log('🎨 Converting SVG to PNG...');
      
      await sharp(svgPath)
        .png()
        .toFile(pngPath);
      
      console.log('✅ OG image generated successfully!');
      console.log(`📦 Output: ${pngPath}`);
      console.log(`📐 Size: 1200x630px`);
      console.log('\n✨ You can now:');
      console.log('   1. Deploy to production');
      console.log('   2. Test on Twitter Card Validator: https://cards-dev.twitter.com/validator');
      console.log('   3. Test on OG Debugger: https://www.opengraphcheck.com/');
      process.exit(0);
    } catch (sharpError) {
      console.log('⚠️  Sharp not installed. Trying alternative method...\n');
      
      // Fallback: use built-in Canvas API if available
      if (typeof Canvas !== 'undefined' || require.resolve('canvas')) {
        const { createCanvas } = require('canvas');
        
        const canvas = createCanvas(1200, 630);
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
        gradient.addColorStop(0, '#020408');
        gradient.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 630);
        
        // Accent circles
        ctx.fillStyle = 'rgba(14, 165, 233, 0.2)';
        ctx.beginPath();
        ctx.arc(150, 150, 80, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.beginPath();
        ctx.arc(1050, 500, 120, 0, Math.PI * 2);
        ctx.fill();
        
        // Text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 72px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText('StudentToolHub', 600, 220);
        
        ctx.fillStyle = '#0ea5e9';
        ctx.font = '42px system-ui';
        ctx.fillText('56+ Free Tools for Students', 600, 310);
        
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '28px system-ui';
        ctx.fillText('Calculators • Converters • PDF Tools • Editors', 600, 380);
        
        const pngPath = path.join(__dirname, '../public/og-image.png');
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(pngPath, buffer);
        
        console.log('✅ OG image generated successfully (canvas method)!');
        process.exit(0);
      } else {
        throw sharpError;
      }
    }
  } catch (error) {
    console.error('❌ Error generating OG image:');
    console.error(error.message);
    console.log('\n📚 Solutions:');
    console.log('1. Install sharp: npm install -D sharp');
    console.log('2. Or install canvas: npm install -D canvas');
    console.log('3. Or create og-image.png manually and place in /public');
    console.log('4. Or use an online converter: CloudConvert, Convertio, etc.');
    console.log('\n🔗 Quick links:');
    console.log('   - CloudConvert: https://cloudconvert.com/svg-to-png');
    console.log('   - Online-Convert: https://www.online-convert.com/');
    console.log('   - VectorMagic: https://vectormagic.com/');
    process.exit(1);
  }
}

generateOGImage();
