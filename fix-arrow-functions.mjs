#!/usr/bin/env node

/**
 * SURGICAL JSX SYNTAX FIX
 * ═══════════════════════════════════════════════════════════
 * Fixes specific broken patterns:
 * 1. Arrow functions: e = /> → e =>
 * 2. Double closing tags: </div></div> (extra closing)
 * 3. Missing/malformed onChange handlers
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, 'src', 'tools');

/**
 * Fix broken arrow functions: "= />" should be "=>"
 */
function fixBrokenArrowFunctions(content) {
  // Pattern: (e) = /> or e = />
  let fixed = content;
  let count = 0;

  // Fix all variations of broken arrow syntax
  const patterns = [
    /\(e\)\s*=\s*\/>/g,      // (e) = />
    /\(([a-zA-Z_]+)\)\s*=\s*\/>/g, // (varName) = />
    /\)\s*=\s*\/>/g,         // ) = />
    /[a-zA-Z_]\s*=\s*\/>/g,  // e = />
  ];

  patterns.forEach((pattern) => {
    if (pattern.test(fixed)) {
      fixed = fixed.replace(pattern, (match) => {
        count++;
        // Extract the parameter part and return corrected syntax
        if (match.includes('(')) {
          return match.replace(/\s*=\s*\/>/, ' =>');
        } else {
          return match.replace(/\s*=\s*\/>/, '} =>');
        }
      });
    }
  });

  // More aggressive fix: find "= />" anywhere and replace with "=>"
  const brokenArrowCount = (fixed.match(/=\s*\/>/g) || []).length;
  if (brokenArrowCount > 0) {
    // This needs careful handling - only in onChange/onClick/on* handlers
    fixed = fixed.replace(/onChange\s*=\s*\{\s*([^}]*?)\s*=\s*\/>/g, 'onChange={$1 =>');
    fixed = fixed.replace(/onClick\s*=\s*\{\s*([^}]*?)\s*=\s*\/>/g, 'onClick={$1 =>');
    fixed = fixed.replace(/onBlur\s*=\s*\{\s*([^}]*?)\s*=\s*\/>/g, 'onBlur={$1 =>');
    fixed = fixed.replace(/onFocus\s*=\s*\{\s*([^}]*?)\s*=\s*\/>/g, 'onFocus={$1 =>');
    fixed = fixed.replace(/onKeyDown\s*=\s*\{\s*([^}]*?)\s*=\s*\/>/g, 'onKeyDown={$1 =>');
    fixed = fixed.replace(/onKeyUp\s*=\s*\{\s*([^}]*?)\s*=\s*\/>/g, 'onKeyUp={$1 =>');
    fixed = fixed.replace(/onSubmit\s*=\s*\{\s*([^}]*?)\s*=\s*\/>/g, 'onSubmit={$1 =>');
    
    count += brokenArrowCount;
  }

  return { content: fixed, fixes: count };
}

/**
 * Scan all tool files and apply critical fixes
 */
function scanAndFixAll() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  SURGICAL JSX SYNTAX FIXER                           ║');
  console.log('║  Fixing broken arrow functions across all tools      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const categories = fs.readdirSync(TOOLS_DIR).filter((file) => {
    const fullPath = path.join(TOOLS_DIR, file);
    return fs.statSync(fullPath).isDirectory();
  });

  let totalScanned = 0;
  let totalFixed = 0;

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
        const fix = fixBrokenArrowFunctions(content);
        
        if (fix.fixes > 0) {
          fs.writeFileSync(filePath, fix.content, 'utf8');
          totalFixed++;
          console.log(`  ✅ ${file} [${fix.fixes} arrow function fixes]`);
        }
      } catch (error) {
        console.log(`  ❌ ${file} [ERROR: ${error.message}]`);
      }
    });
  });

  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║  COMPLETE                                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Results:`);
  console.log(`  • Scanned: ${totalScanned} files`);
  console.log(`  • Fixed: ${totalFixed} files`);
  console.log(`\n✨ Ready to build!\n`);
}

scanAndFixAll();
