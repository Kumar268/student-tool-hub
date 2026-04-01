const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'tools');

function getAllJsxFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllJsxFiles(fullPath));
    } else if (item.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixJsxFragments(content) {
  // Fix mismatched closing divs that should be fragment closings
  // Pattern: </div> followed by ) or )} at wrong indentation
  content = content.replace(/\n    <\/div>\n  \):/g, '\n        </>\n      ):');
  content = content.replace(/\n    <\/div>\n  \)\}/g, '\n        </>\n      )}');
  content = content.replace(/\n      <\/div>\n    \)\}/g, '\n                </>\n              )}');
  
  return content;
}

function implementFullWidthLayout(content) {
  // Check if file already has full-width layout
  if (content.includes('w-full max-w-7xl mx-auto')) {
    return content;
  }

  // Find the main return statement
  const returnMatch = content.match(/return\s*\(\s*\n\s*<([^>\s]+)/);
  if (!returnMatch) return content;

  const rootTag = returnMatch[1];
  
  // Pattern 1: Replace narrow containers in main return
  const narrowPatterns = [
    { pattern: /return\s*\(\s*\n\s*<div className="(container mx-auto[^"]*)">/g, 
      replace: 'return (\n    <div className="w-full bg-gray-50 dark:bg-gray-900">\n      <div className="w-full max-w-7xl mx-auto px-4 py-8">' },
    { pattern: /return\s*\(\s*\n\s*<div className="(max-w-4xl mx-auto[^"]*)">/g,
      replace: 'return (\n    <div className="w-full bg-gray-50 dark:bg-gray-900">\n      <div className="w-full max-w-7xl mx-auto px-4 py-8">' },
    { pattern: /return\s*\(\s*\n\s*<div className="(max-w-5xl mx-auto[^"]*)">/g,
      replace: 'return (\n    <div className="w-full bg-gray-50 dark:bg-gray-900">\n      <div className="w-full max-w-7xl mx-auto px-4 py-8">' },
    { pattern: /return\s*\(\s*\n\s*<div className="(max-w-6xl mx-auto[^"]*)">/g,
      replace: 'return (\n    <div className="w-full bg-gray-50 dark:bg-gray-900">\n      <div className="w-full max-w-7xl mx-auto px-4 py-8">' },
    { pattern: /return\s*\(\s*\n\s*<div className="(mx-auto max-w-[45]xl[^"]*)">/g,
      replace: 'return (\n    <div className="w-full bg-gray-50 dark:bg-gray-900">\n      <div className="w-full max-w-7xl mx-auto px-4 py-8">' },
  ];

  let modified = false;
  for (const {pattern, replace} of narrowPatterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replace);
      modified = true;
      break;
    }
  }

  // If we modified the opening, we need to add an extra closing div before the final )
  if (modified) {
    // Find the last closing tag before the final )
    const lines = content.split('\n');
    let parenDepth = 0;
    let lastReturnIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('return (')) {
        lastReturnIndex = i;
        parenDepth = 1;
      } else if (lastReturnIndex >= 0) {
        parenDepth += (lines[i].match(/\(/g) || []).length;
        parenDepth -= (lines[i].match(/\)/g) || []).length;
        
        if (parenDepth === 0) {
          // Found the closing ) for return
          // Add extra closing div before it
          if (lines[i].trim() === ');') {
            lines.splice(i, 0, '      </div>');
          } else if (lines[i].trim() === ')') {
            lines.splice(i, 0, '      </div>');
          }
          break;
        }
      }
    }
    content = lines.join('\n');
  }

  return content;
}

function fixFile(filePath) {
  const relativePath = path.relative(__dirname, filePath);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    // Apply fixes
    content = fixJsxFragments(content);
    content = implementFullWidthLayout(content);
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${relativePath}`);
      return true;
    } else {
      console.log(`ℹ️  No changes: ${relativePath}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error in ${relativePath}: ${error.message}`);
    return false;
  }
}

// Main execution
console.log('🔧 COMPREHENSIVE TOOL FIX SCRIPT');
console.log('='.repeat(60));
console.log('Fixing: JSX fragments + Full-width layout\n');

const allFiles = getAllJsxFiles(toolsDir);
console.log(`Found ${allFiles.length} JSX files\n`);

let fixedCount = 0;
let unchangedCount = 0;

for (const file of allFiles) {
  if (fixFile(file)) {
    fixedCount++;
  } else {
    unchangedCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 SUMMARY');
console.log('='.repeat(60));
console.log(`Total files: ${allFiles.length}`);
console.log(`Fixed: ${fixedCount}`);
console.log(`Unchanged: ${unchangedCount}`);
console.log('\n✨ Done!');
