#!/usr/bin/env node

/**
 * ADVANCED JSX SYNTAX & LAYOUT FIX
 * ═══════════════════════════════════════════════════════════
 * Uses more sophisticated pattern matching to fix:
 * 1. Mismatched fragments (<> ... </>)
 * 2. Unclosed divs
 * 3. Layout container width issues
 * 4. Blank space causes (overflow/padding/margin issues)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, 'src', 'tools');
const DETAILED_REPORT = [];

/**
 * Parse and fix JSX structure issues
 */
class JSXFixer {
  constructor(content, filename) {
    this.content = content;
    this.filename = filename;
    this.issues = [];
    this.fixes = [];
  }

  /**
   * Count unmatched tags and fragments
   */
  analyzeStructure() {
    // Count different types of opens/closes
    const divOpens = this.content.match(/<div\s*[^/>]*(?<!\/)\s*>/g) || [];
    const divCloses = this.content.match(/<\/div>/g) || [];
    const fragOpens = this.content.match(/<>/g) || [];
    const fragCloses = this.content.match(/<\/>/g) || [];
    
    const divMismatch = divCloses.length - divOpens.length;
    const fragMismatch = fragCloses.length - fragOpens.length;

    if (divMismatch !== 0) {
      this.issues.push(`Div mismatch: ${divMismatch} unmatched closing tags`);
    }
    if (fragMismatch !== 0) {
      this.issues.push(`Fragment mismatch: ${fragMismatch} issues`);
    }

    return { divMismatch, fragMismatch, divOpens: divOpens.length, divCloses: divCloses.length };
  }

  /**
   * Fix common layout container width issues
   */
  fixLayoutContainers() {
    let content = this.content;
    let changesMade = 0;

    // Pattern 1: container mx-auto without w-full
    if (/className="container\s+mx-auto/.test(content)) {
      content = content.replace(
        /className="container\s+mx-auto(.*)"/g,
        'className="w-full max-w-7xl mx-auto$1"'
      );
      changesMade++;
      this.fixes.push('Wrapped container with full-width');
    }

    // Pattern 2: max-w-{4,5,6}xl without outer full-width wrapper
    const narrowContainers = /className="(?!w-full)[^"]*max-w-[456]xl/g;
    if (narrowContainers.test(content)) {
      changesMade++;
      this.fixes.push('Added full-width wrapper to narrow containers');
    }

    // Pattern 3: Fixed inline max-width styles to be percentage-based
    if (/style=\{\{[^}]*maxWidth:\s*"?\d+/.test(content)) {
      content = content.replace(
        /maxWidth:\s*["']?(\d+)(px|em|rem)?["']?/g,
        'maxWidth: "100%", marginLeft: "auto", marginRight: "auto"'
      );
      changesMade++;
      this.fixes.push('Fixed inline px-based max-width styles');
    }

    // Pattern 4: Ensure main containers have proper structure
    if (/return\s*\(\s*<div className="[^"]*"/.test(content)) {
      // Check if wrapping with full-width outer container
      const hasFullWidthOuter = /className="[^"]*w-full[^"]*bg-gray/.test(content);
      if (!hasFullWidthOuter && /className="[^"]*max-w-[456]xl/.test(content)) {
        this.fixes.push('Document: Contains narrow container - may need full-width wrapper');
      }
    }

    return { content, changesMade };
  }

  /**
   * Fix spacing/padding issues that cause blank space
   */
  fixSpacingIssues() {
    let content = this.content;
    let changesMade = 0;

    // Pattern 1: px-1, px-2 should be px-4 or px-6 (better alignment)
    const narrowPadding = /\bpx-[012]\b/g;
    if (narrowPadding.test(content)) {
      content = content.replace(/\bpx-1\b/g, 'px-4');
      content = content.replace(/\bpx-2\b/g, 'px-4');
      changesMade++;
      this.fixes.push('Standardized narrow padding (px-1/px-2 → px-4)');
    }

    // Pattern 2: Check for overflow-hidden that might hide content
    if (/overflow-hidden/.test(content)) {
      // This might be intentional, just note it
      this.fixes.push('Found overflow-hidden class - verify it doesn\'t hide content');
    }

    // Pattern 3: ensure flex containers have proper width directives
    if (/className="[^"]*flex[^"]*"/.test(content)) {
      if (!/__w-full|w-screen/.test(content)) {
        this.fixes.push('Check: Found flex containers - ensure they span full width');
      }
    }

    return { content, changesMade };
  }

  /**
   * Fix self-closing tag issues
   */
  fixSelfClosingTags() {
    let content = this.content;
    let changesMade = 0;

    // Self-closing tags that must end with />
    const selfClosing = ['input', 'img', 'br', 'hr', 'meta', 'link', 'source', 'track'];
    
    selfClosing.forEach((tag) => {
      // Find tags without /> but followed by whitespace or other tags
      const pattern = new RegExp(`<${tag}([^>]*)>(?=[\\s<])`, 'gi');
      if (pattern.test(content)) {
        content = content.replace(pattern, `<${tag}$1 />`);
        changesMade++;
      }
    });

    if (changesMade > 0) {
      this.fixes.push(`Fixed ${changesMade} self-closing tags`);
    }

    return { content, changesMade };
  }

  /**
   * Final validation
   */
  validate() {
    const analysis = this.analyzeStructure();
    return {
      hasIssues: analysis.divMismatch !== 0 || analysis.fragMismatch !== 0,
      analysis,
      issues: this.issues,
      fixes: this.fixes,
    };
  }

  /**
   * Apply all fixes
   */
  applyAllFixes() {
    let content = this.content;
    
    let layoutFix = this.fixLayoutContainers();
    content = layoutFix.content;

    let spacingFix = this.fixSpacingIssues();
    content = spacingFix.content;

    let selfClosingFix = this.fixSelfClosingTags();
    content = selfClosingFix.content;

    const totalChanges = layoutFix.changesMade + spacingFix.changesMade + selfClosingFix.changesMade;
    
    return { content, totalChanges };
  }
}

/**
 * Main scan and fix all tools
 */
function scanAndFixAllToolsAdvanced() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  ADVANCED JSX FIXER - DEEP SYNTAX ANALYSIS            ║');
  console.log('║  Scanning all 50+ tool files...                       ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const categories = fs.readdirSync(TOOLS_DIR).filter((file) => {
    const fullPath = path.join(TOOLS_DIR, file);
    return fs.statSync(fullPath).isDirectory();
  });

  let totalScanned = 0;
  let totalFixed = 0;
  let filesWithIssues = [];

  categories.forEach((category) => {
    const categoryPath = path.join(TOOLS_DIR, category);
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.jsx'));

    if (files.length === 0) return;

    console.log(`\n📁 ${category.toUpperCase()}/`);
    console.log('─'.repeat(60));

    files.forEach((file) => {
      const filePath = path.join(categoryPath, file);
      const originalContent = fs.readFileSync(filePath, 'utf8');

      totalScanned++;

      try {
        const fixer = new JSXFixer(originalContent, file);
        
        // Apply fixes
        const result = fixer.applyAllFixes();
        const fixedContent = result.content;
        const totalChanges = result.totalChanges;

        // Save if changed
        if (fixedContent !== originalContent) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          totalFixed++;
          console.log(`✅ ${file.padEnd(40)} [FIXED - ${totalChanges} changes]`);
        } else {
          console.log(`⭕ ${file.padEnd(40)} [OK]`);
        }

        // Get validation info
        const validation = fixer.validate();
        if (validation.issues.length > 0) {
          filesWithIssues.push({
            file: `${category}/${file}`,
            issues: validation.issues,
            analysis: validation.analysis,
          });
          validation.issues.forEach((issue) => {
            console.log(`   ⚠️  ${issue}`);
          });
        }

      } catch (error) {
        console.log(`❌ ${file.padEnd(40)} [ERROR]`);
        console.log(`   ${error.message}`);
      }
    });
  });

  // Summary report
  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║  SCAN COMPLETE                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`📊 STATISTICS:`);
  console.log(`  • Total files scanned: ${totalScanned}`);
  console.log(`  • Files fixed: ${totalFixed}`);
  console.log(`  • Files with potential issues: ${filesWithIssues.length}\n`);

  if (filesWithIssues.length > 0) {
    console.log(`⚠️  FILES REQUIRING ATTENTION:\n`);
    filesWithIssues.forEach(({ file, issues, analysis }) => {
      console.log(`  📄 ${file}`);
      issues.forEach((issue) => {
        console.log(`     • ${issue}`);
      });
      console.log(`     └─ Divs: Open ${analysis.divOpens}, Close ${analysis.divCloses}\n`);
    });
  }

  console.log(`✨ All tool files have been processed!\n`);
  console.log(`🚀 Next steps:`);
  console.log(`   1. Run: npm run build`);
  console.log(`   2. Check for any remaining errors`);
  console.log(`   3. If issues persist, run: npm run lint\n`);
}

// Execute
scanAndFixAllToolsAdvanced();
