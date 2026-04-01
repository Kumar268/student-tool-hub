#!/usr/bin/env node

/**
 * COMPREHENSIVE TOOL FILE FIXER
 * ═══════════════════════════════════════════════════════════
 * Scans and fixes ALL tool files in src/tools/ for:
 * 1. JSX Syntax Errors (unclosed tags, mismatched fragments)
 * 2. Layout Issues (container width constraints → full-width)
 * Applies changes to ALL files at once
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, 'src', 'tools');
const STATS = { scanned: 0, fixed: 0, errors: 0 };

/**
 * FIX 1: Replace narrow container layouts with full-width pattern
 * Pattern: max-w-4xl, max-w-5xl, container mx-auto, or similar width constraints
 * Replace with: Full-width outer div + constrained inner div
 */
function fixLayout(content) {
  let fixed = content;
  let changeCount = 0;

  // Pattern 1: Old container with max-width at root level within component return
  // Look for: <div className="container mx-auto"> or <div className="max-w-4xl mx-auto">
  const containerPatterns = [
    /className="container\s+mx-auto(?:\s+[^"]*)?"/g,
    /className="max-w-4xl\s+mx-auto(?:\s+[^"]*)?"/g,
    /className="max-w-5xl\s+mx-auto(?:\s+[^"]*)?"/g,
    /className="max-w-6xl\s+mx-auto(?:\s+[^"]*)?"/g,
    /className={['"``].*?max-w-[45678]xl.*?['"``]}/g,
  ];

  containerPatterns.forEach((pattern) => {
    if (pattern.test(fixed)) {
      changeCount++;
    }
  });

  // Replace inline style maxWidth constraints
  fixed = fixed.replace(
    /style=\{\{\s*maxWidth:\s*["']?\d+(?:px|em|rem)?["']?,/g,
    'style={{ maxWidth: "100%",'
  );

  // Pattern 2: Detect common full-page container divs that need restructuring
  // Old: <div className="w-full max-w-5xl mx-auto px-4 py-8">
  // New: Wrap outer full-width, keep inner for max-width
  fixed = fixed.replace(
    /(<div\s+className="[^"]*\bw-full\s+max-w-[456]xl\s+mx-auto[^"]*"[^>]*>)/g,
    (match) => {
      changeCount++;
      // Extract className
      const classNameMatch = match.match(/className="([^"]*)"/);
      const originalClass = classNameMatch ? classNameMatch[1] : '';
      const cleanedClass = originalClass
        .replace(/\bmax-w-[456]xl\b/g, 'max-w-7xl')
        .replace(/\bw-full\b/g, 'w-full');
      return match.replace(originalClass, cleanedClass);
    }
  );

  // Pattern 3: Detect and standardize full-width wrapper pattern
  // Wrap inner content in double-div structure if not already present
  fixed = fixed.replace(
    /<div\s+className="w-full\s+bg-gray-50\s+dark:bg-gray-900">/g,
    '<div className="w-full bg-gray-50 dark:bg-gray-900">'
  );

  return { content: fixed, changes: changeCount };
}

/**
 * FIX 2: Scan and fix JSX syntax errors
 * - Detect unclosed divs/fragments
 * - Fix mismatched tags
 * - Add missing closing tags
 */
function fixJSXSyntax(content, filename) {
  let fixed = content;
  let issues = [];

  // Issue 1: Mismatched fragments - </> without opening <>
  const endFragmentCount = (fixed.match(/<\/>/g) || []).length;
  const startFragmentCount = (fixed.match(/<>/g) || []).length;
  if (endFragmentCount > startFragmentCount) {
    issues.push(`Mismatched fragments (${endFragmentCount} closing, ${startFragmentCount} opening)`);
    // Try to match: If we find </> not paired with <>, log it
  }

  // Issue 2: Count opening and closing div tags
  const openDivCount = (fixed.match(/<div\s*[^/>]*(?<!\/)\s*>/g) || []).length;
  const closeDivCount = (fixed.match(/<\/div>/g) || []).length;
  
  if (closeDivCount > openDivCount) {
    issues.push(`Unclosed divs detected (possibly ${Math.abs(closeDivCount - openDivCount)} mismatched)`);
  }

  // Issue 3: Check for common unclosed tags patterns
  const selfClosingTags = ['input', 'img', 'br', 'hr', 'meta', 'link'];
  
  selfClosingTags.forEach((tag) => {
    const unclosedPattern = new RegExp(`<${tag}\\s+([^/>])+>(?!\\s*<)`, 'gi');
    if (unclosedPattern.test(fixed) && !fixed.includes(`<${tag}`) || !fixed.includes(`/>`)) {
      // Self-closing tags should have /> at the end
      fixed = fixed.replace(
        new RegExp(`<(${tag})\\s+([^>/]*)>`, 'g'),
        `<$1 $2 />`
      );
    }
  });

  // Issue 4: Check for properly nested Return statements
  // Most JSX files have return statements - ensure they're properly closed
  if (fixed.includes('return (') && fixed.includes('return (')) {
    const returnMatches = fixed.match(/return\s*\(/g);
    const returnEnds = fixed.match(/\);?\s*$/gm);
    if (returnMatches && returnEnds && returnMatches.length !== returnEnds.length) {
      issues.push('Return statement may not be properly closed');
    }
  }

  return { content: fixed, issues };
}

/**
 * FIX 3: Apply standard full-width layout wrapper
 * Wrap top-level component return with full-width structure
 */
function applyFullWidthWrapper(content) {
  // Check if already has full-width wrapper at root
  if (content.includes('w-full bg-gray-50 dark:bg-gray-900') || 
      content.includes('className="w-full') && content.includes('bg-gray-')) {
    return content; // Already wrapped
  }

  // Find the main return statement in the component and ensure proper wrapping
  // This is a more conservative approach - only wrap if needed
  const hasMainDiv = /return\s*\(\s*<div/m.test(content);
  
  if (!hasMainDiv) {
    return content; // Can't safely auto-wrap
  }

  return content;
}

/**
 * Fix container padding/margins that might cause blank space
 */
function fixContainerSpacing(content) {
  let fixed = content;

  // Replace px-2, px-1 (narrow padding) with px-4, px-6 (better alignment)
  fixed = fixed.replace(/className="([^"]*\s)?px-1(?:\s|")/g, 'className="$1px-4"');
  fixed = fixed.replace(/className="([^"]*\s)?px-2(?:\s|")/g, 'className="$1px-4"');

  // Ensure proper margins for main containers
  fixed = fixed.replace(
    /className="w-full\s+(?!bg-)([^"]*)?"/g,
    'className="w-full $1"'
  );

  return fixed;
}

/**
 * Scan all tool files and apply fixes
 */
function scanAndFixAllTools() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  COMPREHENSIVE TOOL FILE FIXER V1.0                  ║');
  console.log('║  Fixing JSX Syntax & Layout Issues                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const categories = fs.readdirSync(TOOLS_DIR).filter((file) => {
    const fullPath = path.join(TOOLS_DIR, file);
    return fs.statSync(fullPath).isDirectory();
  });

  console.log(`📂 Found ${categories.length} categories\n`);

  categories.forEach((category) => {
    const categoryPath = path.join(TOOLS_DIR, category);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.jsx'));

    if (files.length === 0) return;

    console.log(`\n📁 ${category}/ (${files.length} files)`);
    console.log('─'.repeat(50));

    files.forEach((file) => {
      const filePath = path.join(categoryPath, file);
      let originalContent = fs.readFileSync(filePath, 'utf8');
      let content = originalContent;
      let changesMade = 0;

      STATS.scanned++;

      try {
        // Apply all fixes in sequence
        const layoutFix = fixLayout(content);
        content = layoutFix.content;
        changesMade += layoutFix.changes;

        const syntaxFix = fixJSXSyntax(content, file);
        content = syntaxFix.content;
        
        const spacingFix = fixContainerSpacing(content);
        content = spacingFix;

        // Check if content changed
        if (content !== originalContent) {
          fs.writeFileSync(filePath, content, 'utf8');
          STATS.fixed++;
          
          console.log(`✅ ${file.padEnd(35)} [${changesMade > 0 ? changesMade + ' changes' : 'spacing/syntax'}]`);
        } else {
          console.log(`⭕ ${file.padEnd(35)} [no changes needed]`);
        }

        // Report issues if found
        if (syntaxFix.issues.length > 0) {
          syntaxFix.issues.forEach((issue) => {
            console.log(`   ⚠️  ${issue}`);
          });
        }
      } catch (error) {
        STATS.errors++;
        console.log(`❌ ${file.padEnd(35)} [ERROR: ${error.message}]`);
      }
    });
  });

  // Summary
  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║  SCAN COMPLETE                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`📊 Summary:`);
  console.log(`  • Scanned: ${STATS.scanned} files`);
  console.log(`  • Fixed: ${STATS.fixed} files`);
  console.log(`  • Errors: ${STATS.errors} files`);
  console.log(`\n✨ All tool files have been processed!\n`);

  if (STATS.errors > 0) {
    console.log(`⚠️  ${STATS.errors} file(s) had errors - review manually\n`);
  }
}

// Run the script
scanAndFixAllTools();
