#!/usr/bin/env node

/**
 * FINAL COMPREHENSIVE JSX FIX
 * ═══════════════════════════════════════════════════════════
 * Fixes remaining structural issues:
 * 1. Fragment closures: mismatched </div> when should be </>
 * 2. Conditional render closures where </div> indicates </> needed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, 'src', 'tools');

function fixFragmentMismatches(content) {
  let fixed = content;
  let changes = 0;

  // Pattern: ternary operator with fragments
  // ({something) ? (<>...{something_else}) : (...)
  // If the closing islike:   </div>  ) : ( then should be </>

  // Match: </div>\n  ) : (  or similar where </div> closes a fragment
  if (/\n\s*<\/div>\n\s*\)\s*:\s*\(/.test(fixed)) {
    fixed = fixed.replace(/\n(\s*)<\/div>\n(\s*)\)\s*:\s*\(/g, '\n$1</>\n$2) : (');
    changes++;
  }

  // Pattern: {condition ? <>\n...\n  </div>\n) : ...}
  // The </div> should be </>
  if (/\)\s*\?\s*<>[^]*?\n\s*<\/div>\n\s*\)\s*:/g.test(fixed)) {
    // This is trickier - need to find unmatched divs before conditional
    // Simpler approach: find closing divs right before ") :" patterns
    fixed = fixed.replace(/\n(\s*)<\/div>\n(\s*)\)\s*:/g, (match, spaces1, spaces2) => {
      // Check context: if this looks like it's closing a fragment in a ternary
      const before = fixed.substring(Math.max(0, fixed.indexOf(match) - 500), fixed.indexOf(match));
      if (before.includes('<>') && !before.includes('</>')) {
        return `\n${spaces1}</>\n${spaces2}) :`;
      }
      return match;
    });
  }

  // Pattern: ) : (\n...  </div>\n})
  // The </div> before }) might need to be </>
  if (/\)\s*:\s*\([^]*?\n\s*<\/div>\n\s*\}\)/.test(fixed)) {
    fixed = fixed.replace(/\n(\s*)<\/div>\n(\s*)\}\)/g, '\n$1</>\n$2})');
    changes++;
  }

  return { content: fixed, changes };
}

function scanAndFix() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  FINAL JSX STRUCTURE FIXER                           ║');
  console.log('║  Fixing fragment closure mismatches                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const categories = fs.readdirSync(TOOLS_DIR).filter((file) => {
    const fullPath = path.join(TOOLS_DIR, file);
    return fs.statSync(fullPath).isDirectory();
  });

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

      try {
        const result = fixFragmentMismatches(content);
        
        if (result.changes > 0) {
          fs.writeFileSync(filePath, result.content, 'utf8');
          totalFixed += result.changes;
          filesFixed++;
          console.log(`  ✅ ${file}`);
        }
      } catch (error) {
        console.log(`  ⚠️  ${file} [Skipped]`);
      }
    });
  });

  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║  COMPLETE                                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Results: ${filesFixed} files processed\n`);
}

scanAndFix();
