#!/usr/bin/env node

/**
 * FIX MALFORMED SELF-CLOSING TAGS
 * ═══════════════════════════════════════════════════════════
 * Fixes: / /> (double slash) → />
 * Also: <br/ > (space issue) → <br />
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, 'src', 'tools');

function fixMalformedTags(content) {
  let fixed = content;
  let count = 0;

  // Fix 1: / /> → />
  if (/\/\s+\/>/g.test(fixed)) {
    fixed = fixed.replace(/\/\s+\/>/g, '/>');
    count++;
  }

  // Fix 2: <br/ > → <br />
  if (/<br\s*\/\s+>/g.test(fixed)) {
    fixed = fixed.replace(/<br\s*\/\s+>/g, '<br />');
    count++;
  }

  // Fix 3: <img ... / /> → <img ... />
  if (/<(img|input|source|track|meta|link|br|hr)\s+[^>]*\s\/\s+\/>/g.test(fixed)) {
    fixed = fixed.replace(/<(img|input|source|track|meta|link|br|hr)\s+([^>]*)\/\s+\/>/g, '<$1 $2/>');
    count++;
  }

  // Fix 4: Handle "}}/ />" (closing brace + malformed)
  if (/}}\s*\/\s+\/>/g.test(fixed)) {
    fixed = fixed.replace(/}}\s*\/\s+\/>/g, '}} />');
    count++;
  }

  return { content: fixed, fixes: count };
}

function scanAndFix() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  MALFORMED TAG FIXER                                 ║');
  console.log('║  Fixing: / /> → /> patterns                          ║');
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
        const result = fixMalformedTags(content);
        
        if (result.fixes > 0) {
          fs.writeFileSync(filePath, result.content, 'utf8');
          totalFixed++;
          console.log(`  ✅ ${file}`);
        }
      } catch (error) {
        console.log(`  ❌ ${file} [ERROR]`);
      }
    });
  });

  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║  COMPLETE                                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Results: ${totalFixed}/${totalScanned} files fixed\n`);
}

scanAndFix();
