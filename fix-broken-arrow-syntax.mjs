#!/usr/bin/env node

/**
 * FIX BROKEN ARROW FUNCTION SYNTAX
 * ═══════════════════════════════════════════════════════════
 * Fixes: onChange={e} => → onChange={e =>
 * Pattern: closing brace before arrow function
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, 'src', 'tools');

function fixBrokenArrowFunctions(content) {
  let fixed = content;
  let count = 0;

  // Pattern: onChange={e} => setX(...)}
  // Should be: onChange={e => setX(...)}
  // The issue is the closing brace `}` is before the arrow
  
  // General pattern: attribute={variable} => rest}
  // This appears in forms like onChange={e} => setSomething(...)}
  const patterns = [
    // onChange={e} => becomes onChange={e =>
    /onChange\s*=\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*=>/g,
    // onClick, onBlur, onFocus, etc.
    /onClick\s*=\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*=>/g,
    /onBlur\s*=\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*=>/g,
    /onFocus\s*=\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*=>/g,
    /onKeyDown\s*=\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*=>/g,
    /onKeyUp\s*=\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*=>/g,
    /onSubmit\s*=\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*=>/g,
    /onInput\s*=\s*\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\s*=>/g,
  ];

  patterns.forEach((pattern) => {
    let matches = 0;
    fixed = fixed.replace(pattern, (match, paramName) => {
      matches++;
      // Extract handler name
      const handlerMatch = match.match(/^(\w+)\s*=/);
      const handlerName = handlerMatch ? handlerMatch[1] : 'onChange';
      return `${handlerName}={${paramName} =>`;
    });
    count += matches;
  });

  return { content: fixed, fixes: count };
}

function scanAndFix() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  ADVANCED ARROW FUNCTION FIXER                       ║');
  console.log('║  Fixing: {e} => → {e =>                              ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const categories = fs.readdirSync(TOOLS_DIR).filter((file) => {
    const fullPath = path.join(TOOLS_DIR, file);
    return fs.statSync(fullPath).isDirectory();
  });

  let totalScanned = 0;
  let totalFixed = 0;
  let filesFixed = 0;

  categories.forEach((category) => {
    const categoryPath = path.join(TOOLS_DIR, category);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.jsx'));

    if (files.length === 0) return;

    console.log(`\n📁 ${category}/`);

    files.forEach((file) => {
      const filePath = path.join(categoryPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      totalScanned++;

      try {
        const result = fixBrokenArrowFunctions(content);
        
        if (result.fixes > 0) {
          fs.writeFileSync(filePath, result.content, 'utf8');
          totalFixed += result.fixes;
          filesFixed++;
          console.log(`  ✅ ${file} [${result.fixes} fixes]`);
        }
      } catch (error) {
        console.log(`  ❌ ${file} [ERROR]`);
      }
    });
  });

  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║  COMPLETE                                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Results: ${filesFixed}/${totalScanned} files fixed (${totalFixed} total fixes)\n`);
}

scanAndFix();
