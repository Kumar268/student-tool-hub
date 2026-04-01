const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Auto-Fix Script for React Build Errors
 * -------------------------------------
 * 1. Runs npm run build
 * 2. Parses errors (file, line, type)
 * 3. Applies minimal fixes
 * 4. Verifies build
 */

const LOG_FILE = 'auto-fix-log.txt';
const BACKUP_DIR = './backups';

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

function log(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function runBuild() {
  log('Running build...');
  try {
    execSync('npm run build', { stdio: 'pipe', encoding: 'utf-8' });
    return { success: true, output: '' };
  } catch (err) {
    return { success: false, output: (err.stdout || '') + '\n' + (err.stderr || '') };
  }
}

function parseErrors(output) {
  const errors = [];
  // Pattern: C:/path/to/file.jsx:line:col: ERROR: message
  const lines = output.split('\n');
  const regex = /^(.*?):(\d+):(\d+):\s+ERROR:\s+(.*)$/;
  const regexAlt = /^(.*?):(\d+):(\d+):\s+error:\s+(.*)$/;
  const regexVite = /^\s*file:\s+(.*?):(\d+):(\d+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    let match = line.match(regex) || line.match(regexAlt);
    
    if (match) {
      errors.push({
        filePath: match[1].trim(),
        lineNum: parseInt(match[2]),
        colNum: parseInt(match[3]),
        message: match[4].trim()
      });
    } else {
      // Check for Vite's multiline format
      const viteMatch = line.match(regexVite);
      if (viteMatch && i + 2 < lines.length) {
        const nextLine = lines[i+2].trim();
        errors.push({
          filePath: viteMatch[1].trim(),
          lineNum: parseInt(viteMatch[2]),
          colNum: parseInt(viteMatch[3]),
          message: nextLine
        });
      }
    }
  }
  return errors;
}

function backupFile(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.${Date.now()}.bak`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

function fixFile(error) {
  const { filePath, lineNum, message } = error;
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, 'utf-8').split('\n');
  const originalLine = content[lineNum - 1];
  let fixed = false;

  log(`Attempting fix for ${path.basename(filePath)} at line ${lineNum}: ${message}`);

  // 1. Unexpected closing fragment tag without opening (often matches "Unexpected closing fragment tag does not match opening 'div' tag")
  if (message.includes('Unexpected closing fragment tag') && originalLine.trim() === '</>') {
    log(`Fixing: Removing unmatched fragment closing tag`);
    content[lineNum - 1] = '// ' + originalLine; // Comment it out
    fixed = true;
  }

  // 2. Missing closing </div> (esbuild often says "Unexpected closing tag" or similar if mismatch occurs)
  // If we see "Unexpected closing 'div' tag does not match opening fragment tag", it means the fragment is unclosed or there are extra divs.
  if (message.includes('Unexpected closing "div" tag does not match opening fragment tag')) {
    log(`Fixing: Removing extra </div> that mismatches fragment`);
    content[lineNum - 1] = '// ' + originalLine; 
    fixed = true;
  }

  // 3. Unclosed JSX tag (generic)
  if (message.includes('Expected closing tag') || message.includes('Unclosed JSX tag')) {
    const tagMatch = message.match(/"(.*?)"/);
    if (tagMatch) {
      const tag = tagMatch[1];
      log(`Fixing: Closing unclosed tag <${tag}>`);
      content[lineNum - 1] = originalLine + `</${tag}>`;
      fixed = true;
    }
  }

  // 4. Missing imports (often a reference error in logic, but esbuild might flag it)
  // Note: Build might fail with "is not defined" which is a JS error, not always a JSX syntax error.
  // We handle specific common missing imports.
  if (message.includes('is not defined')) {
    const varName = message.split(' ')[0].replace(/['"]/g, '');
    const imports = {
      'React': "import React from 'react';",
      'useState': "import { useState } from 'react';",
      'useEffect': "import { useEffect } from 'react';",
      'useMemo': "import { useMemo } from 'react';",
      'useCallback': "import { useCallback } from 'react';",
      'useRef': "import { useRef } from 'react';",
      'motion': "import { motion } from 'framer-motion';",
      'AnimatePresence': "import { AnimatePresence } from 'framer-motion';"
    };

    if (imports[varName]) {
      log(`Fixing: Adding missing import for ${varName}`);
      content.unshift(imports[varName]);
      fixed = true;
    }
  }

  if (fixed) {
    backupFile(filePath);
    fs.writeFileSync(filePath, content.join('\n'));
    return true;
  }

  return false;
}

async function main() {
  log('Starting auto-fix process...');
  
  let attempts = 0;
  const maxAttempts = 100; // Increased safety cap

  while (attempts < maxAttempts) {
    const build = runBuild();
    if (build.success) {
      log('Build SUCCESSFUL! No more errors to fix.');
      break;
    }

    const errors = parseErrors(build.output);
    if (errors.length === 0) {
      log('Build failed but could not parse any specific line-level errors. Manual check required.');
      log('Last build output excerpt:\n' + build.output.slice(-500));
      break;
    }

    log(`Found ${errors.length} errors. Fixing first one...`);
    
    // Fix only the first error to be safe and re-test
    const fixed = fixFile(errors[0]);
    
    if (!fixed) {
      log(`Could not apply an automated fix for: ${errors[0].message}`);
      log('Stopping to prevent infinite loop or incorrect changes.');
      break;
    }

    attempts++;
  }

  if (attempts >= maxAttempts) {
    log('Reached maximum fix attempts. Some errors may persist.');
  }

  log('Process complete. Check auto-fix-log.txt for details.');
}

main().catch(err => {
  console.error('Script failed:', err);
  fs.appendFileSync(LOG_FILE, `FATAL ERROR: ${err.message}\n`);
});
