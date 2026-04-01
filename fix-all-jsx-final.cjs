const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'tools');
const logFile = path.join(__dirname, 'jsx-fix-report.txt');

let logContent = '';

function log(message) {
  console.log(message);
  logContent += message + '\n';
}

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

function countTags(content, tag) {
  const openPattern = new RegExp(`<${tag}[\\s>]`, 'g');
  const closePattern = new RegExp(`</${tag}>`, 'g');
  const selfClosing = new RegExp(`<${tag}[^>]*/>`, 'g');
  
  const opens = (content.match(openPattern) || []).length;
  const closes = (content.match(closePattern) || []).length;
  const selfClose = (content.match(selfClosing) || []).length;
  
  return { opens: opens - selfClose, closes, selfClose };
}

function fixJsxStructure(content, filePath) {
  const changes = [];
  
  // Step 1: Fix mismatched fragment closings (</> without <>)
  // Pattern: closing </> that appears after a closing tag like </button> or </div>
  const fragmentPattern = /(<\/(?:button|div|span|section|article|main|header|footer|nav)>)\s*\n\s*\)\}/g;
  if (fragmentPattern.test(content)) {
    content = content.replace(fragmentPattern, (match, closingTag) => {
      changes.push('Fixed fragment closure after closing tag');
      return closingTag + '\n            </>\n          )}';
    });
  }
  
  // Step 2: Fix orphaned </> in ternary expressions
  content = content.replace(/\n\s{4,8}<\/div>\n\s{2,4}\):/g, (match) => {
    changes.push('Fixed ternary expression fragment');
    return match.replace('</div>', '</>');
  });
  
  content = content.replace(/\n\s{4,8}<\/div>\n\s{2,4}\)\}/g, (match) => {
    changes.push('Fixed conditional expression fragment');
    return match.replace('</div>', '</>');
  });
  
  // Step 3: Count divs and fix unclosed ones
  const divCounts = countTags(content, 'div');
  const divDiff = divCounts.opens - divCounts.closes;
  
  if (divDiff > 0) {
    changes.push(`Found ${divDiff} unclosed div(s)`);
    
    // Find the last return statement's closing
    const lines = content.split('\n');
    let returnDepth = 0;
    let lastReturnIndex = -1;
    let closingParenIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('return (')) {
        lastReturnIndex = i;
        returnDepth = 1;
      } else if (lastReturnIndex >= 0 && returnDepth > 0) {
        returnDepth += (lines[i].match(/\(/g) || []).length;
        returnDepth -= (lines[i].match(/\)/g) || []).length;
        
        if (returnDepth === 0) {
          closingParenIndex = i;
          break;
        }
      }
    }
    
    if (closingParenIndex > 0) {
      // Add missing closing divs before the closing paren
      const indent = lines[closingParenIndex].match(/^(\s*)/)[1];
      const closingDivs = Array(divDiff).fill(`${indent}      </div>`).join('\n');
      lines.splice(closingParenIndex, 0, closingDivs);
      content = lines.join('\n');
      changes.push(`Added ${divDiff} closing div(s)`);
    }
  } else if (divDiff < 0) {
    changes.push(`Warning: ${Math.abs(divDiff)} extra closing div(s) found`);
  }
  
  // Step 4: Fix specific fragment patterns
  // Pattern: </> appearing right after a closing tag without proper nesting
  content = content.replace(/(<\/\w+>)\s*\n\s*<\/>\s*\n\s*\)/g, '$1\n  )');
  
  return { content, changes };
}

function implementFullWidthLayout(content) {
  const changes = [];
  
  // Check if already has full-width
  if (content.includes('w-full max-w-7xl mx-auto')) {
    return { content, changes };
  }
  
  // Pattern 1: Replace narrow containers in main return
  const narrowPatterns = [
    {
      pattern: /return\s*\(\s*\n\s*<div className="container mx-auto([^"]*)"/,
      name: 'container mx-auto'
    },
    {
      pattern: /return\s*\(\s*\n\s*<div className="max-w-4xl mx-auto([^"]*)"/,
      name: 'max-w-4xl'
    },
    {
      pattern: /return\s*\(\s*\n\s*<div className="max-w-5xl mx-auto([^"]*)"/,
      name: 'max-w-5xl'
    },
    {
      pattern: /return\s*\(\s*\n\s*<div className="max-w-6xl mx-auto([^"]*)"/,
      name: 'max-w-6xl'
    },
    {
      pattern: /return\s*\(\s*\n\s*<div className="mx-auto max-w-[45]xl([^"]*)"/,
      name: 'mx-auto max-w'
    }
  ];
  
  for (const { pattern, name } of narrowPatterns) {
    if (pattern.test(content)) {
      content = content.replace(
        pattern,
        'return (\n    <div className="w-full bg-gray-50 dark:bg-gray-900">\n      <div className="w-full max-w-7xl mx-auto px-4 py-8"'
      );
      changes.push(`Replaced ${name} with full-width layout`);
      
      // Now we need to add an extra closing div
      const lines = content.split('\n');
      let parenDepth = 0;
      let returnFound = false;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('return (')) {
          returnFound = true;
          parenDepth = 1;
        } else if (returnFound) {
          parenDepth += (lines[i].match(/\(/g) || []).length;
          parenDepth -= (lines[i].match(/\)/g) || []).length;
          
          if (parenDepth === 0) {
            // Found closing ) - add closing div before it
            const indent = lines[i].match(/^(\s*)/)[1];
            if (lines[i].trim() === ');') {
              lines.splice(i, 0, `${indent}      </div>`);
            } else if (lines[i].trim() === ')') {
              lines.splice(i, 0, `${indent}      </div>`);
            }
            changes.push('Added wrapper closing div');
            break;
          }
        }
      }
      
      content = lines.join('\n');
      break;
    }
  }
  
  return { content, changes };
}

function fixFile(filePath) {
  const relativePath = path.relative(__dirname, filePath);
  log(`\n${'='.repeat(70)}`);
  log(`📄 ${relativePath}`);
  log('='.repeat(70));
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    const allChanges = [];
    
    // Apply JSX structure fixes
    const jsxResult = fixJsxStructure(content, filePath);
    content = jsxResult.content;
    allChanges.push(...jsxResult.changes);
    
    // Apply full-width layout
    const layoutResult = implementFullWidthLayout(content);
    content = layoutResult.content;
    allChanges.push(...layoutResult.changes);
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      log('✅ Changes applied:');
      allChanges.forEach(change => log(`   • ${change}`));
      return { fixed: true, changes: allChanges.length };
    } else {
      log('ℹ️  No changes needed');
      return { fixed: false, changes: 0 };
    }
  } catch (error) {
    log(`❌ Error: ${error.message}`);
    return { fixed: false, changes: 0, error: true };
  }
}

// Main execution
log('🔧 COMPREHENSIVE JSX FIX SCRIPT');
log('🔧 Fixing: Unclosed divs + Fragments + Full-width layout');
log('🔧 Started: ' + new Date().toLocaleString());
log('\n' + '='.repeat(70));

const allFiles = getAllJsxFiles(toolsDir);
log(`\n📊 Found ${allFiles.length} JSX files to process\n`);

const stats = {
  total: allFiles.length,
  fixed: 0,
  unchanged: 0,
  errors: 0,
  totalChanges: 0
};

for (const file of allFiles) {
  const result = fixFile(file);
  if (result.error) {
    stats.errors++;
  } else if (result.fixed) {
    stats.fixed++;
    stats.totalChanges += result.changes;
  } else {
    stats.unchanged++;
  }
}

log('\n' + '='.repeat(70));
log('\n📊 FINAL SUMMARY');
log('='.repeat(70));
log(`Total files processed: ${stats.total}`);
log(`Files fixed: ${stats.fixed}`);
log(`Files unchanged: ${stats.unchanged}`);
log(`Errors encountered: ${stats.errors}`);
log(`Total changes applied: ${stats.totalChanges}`);
log('\n✨ Script completed: ' + new Date().toLocaleString());
log('='.repeat(70));

// Save log
fs.writeFileSync(logFile, logContent, 'utf8');
log(`\n📄 Full report saved to: ${path.basename(logFile)}`);

console.log('\n🎯 Next step: Run "npm run build" to test');
