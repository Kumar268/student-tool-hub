/* eslint-env node */
import fs from 'fs';
const code = fs.readFileSync('src/components/ToolDetail.jsx', 'utf8');
const lines = code.split('\n');

// Find the main ToolDetail component
let componentFound = false;
let componentStartLine = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].match(/^const ToolDetail\s*=|^export.*ToolDetail/)) {
    componentFound = true;
    componentStartLine = i;
    console.log(`ToolDetail component found at line ${i + 1}`);
    break;
  }
}

if (!componentFound) {
  console.log('ToolDetail component not found');
  process.exit(0);
}

console.log('\nSearching for hooks inside if statements or early returns...\n');

// Look for issues
let inIf = false;
let ifStartLine = 0;
let braceCount = 0;
let foundIssues = 0;

for (let i = componentStartLine; i < Math.min(componentStartLine + 200, lines.length); i++) {
  const line = lines[i];
  
  // Check for if statements
  if (line.match(/^\s*if\s*\(/)) {
    inIf = true;
    ifStartLine = i;
    braceCount = 0;
  }
  
  // Check for early returns
  if (line.match(/^\s*return/)) {
    console.log(`Line ${i + 1}: ${line.trim()} (EARLY RETURN - hooks should be before this)`);
  }
  
  if (inIf) {
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;
    
    if (line.match(/useEffect|useState|useCallback|useMemo|useRef/)) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
      console.log(`  └─ ISSUE: Hook inside if statement (started at line ${ifStartLine + 1})`);
      foundIssues++;
    }
    
    if (braceCount === 0 && inIf) {
      inIf = false;
    }
  }
}

console.log(`\nTotal issues found: ${foundIssues}`);
