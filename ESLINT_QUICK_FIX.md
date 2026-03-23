# ESLint Script Configuration - Quick Reference

## 🔧 Quick Fix for Node.js Scripts

Add these two lines at the top of any Node.js script file:

```javascript
/* eslint-env node */
/* eslint-disable no-console */
```

## 📋 Common ESLint Errors in Scripts

| Error | Cause | Fix |
|-------|-------|-----|
| `'require' is not defined` | CommonJS in non-Node env | Add `/* eslint-env node */` |
| `'__dirname' is not defined` | Node.js global not recognized | Add `/* eslint-env node */` |
| `'process' is not defined` | Node.js global not recognized | Add `/* eslint-env node */` |
| `'module' is not defined` | CommonJS not recognized | Add `/* eslint-env node */` |
| `'exports' is not defined` | CommonJS not recognized | Add `/* eslint-env node */` |
| `Unexpected console statement` | Console not allowed | Add `/* eslint-disable no-console */` |

## 🎯 When to Use Each Comment

### `/* eslint-env node */`
**Use when your script has:**
- `require()` statements
- `__dirname` or `__filename`
- `process.env` or `process.exit()`
- `module.exports`
- Any Node.js built-in modules

**Example:**
```javascript
/* eslint-env node */
const fs = require('fs');
const path = require('path');
```

### `/* eslint-disable no-console */`
**Use when your script needs:**
- `console.log()` for output
- `console.error()` for errors
- `console.warn()` for warnings
- Any console methods

**Example:**
```javascript
/* eslint-disable no-console */
console.log('✅ Build complete!');
console.error('❌ Error occurred');
```

### Both Together (Most Common)
```javascript
/* eslint-env node */
/* eslint-disable no-console */

const fs = require('fs');
console.log('Script starting...');
```

## 📁 File Types

### CommonJS Scripts (.js with require)
```javascript
/* eslint-env node */
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

console.log('Hello from CommonJS!');
module.exports = { /* ... */ };
```

### ES Module Scripts (.js with import)
```javascript
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';

console.log('Hello from ES Modules!');
export default { /* ... */ };
```

**Note:** ES modules don't need `/* eslint-env node */` if using `import`

## 🔍 How to Check for Errors

```bash
# Check single file
npx eslint scripts/your-script.js

# Check all scripts
npx eslint scripts/

# Auto-fix
npx eslint scripts/ --fix

# Check with detailed output
npx eslint scripts/ --format=stylish
```

## 🎨 Template for New Scripts

### CommonJS Template
```javascript
#!/usr/bin/env node

/* eslint-env node */
/* eslint-disable no-console */

/**
 * Script Name
 * Description of what this script does
 * 
 * Usage: node scripts/script-name.js
 */

const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('🚀 Starting...');
    
    // Your code here
    
    console.log('✅ Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

### ES Module Template
```javascript
#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Script Name
 * Description of what this script does
 * 
 * Usage: node scripts/script-name.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    console.log('🚀 Starting...');
    
    // Your code here
    
    console.log('✅ Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

## 🚫 What NOT to Do

### ❌ Don't disable all ESLint
```javascript
/* eslint-disable */  // BAD - disables all rules
```

### ❌ Don't ignore the scripts folder
```javascript
// .eslintignore
scripts/  // BAD - you want to catch real errors
```

### ❌ Don't mix module systems
```javascript
// BAD - mixing CommonJS and ES modules
const fs = require('fs');
import path from 'path';  // Error!
```

## ✅ What TO Do

### ✅ Be specific with disables
```javascript
/* eslint-env node */           // Enable Node.js globals
/* eslint-disable no-console */ // Only disable console rule
```

### ✅ Use comments at file level
```javascript
// At the very top of the file
/* eslint-env node */
/* eslint-disable no-console */

// Then your code
const fs = require('fs');
```

### ✅ Choose one module system
```javascript
// Option 1: CommonJS
const fs = require('fs');
module.exports = { /* ... */ };

// Option 2: ES Modules
import fs from 'fs';
export default { /* ... */ };
```

## 📊 Your Project Status

| File | Type | Status |
|------|------|--------|
| generate-og-image.js | CommonJS | ✅ Fixed |
| fix_imports.js | CommonJS | ✅ Fixed |
| generate-sitemap.js | ES Module | ✅ No fix needed |
| update-robots.js | ES Module | ✅ No fix needed |
| verify-robots.js | ES Module | ✅ No fix needed |
| final-check.js | ES Module | ✅ No fix needed |

## 🎯 Summary

**For CommonJS scripts (using `require`):**
```javascript
/* eslint-env node */
/* eslint-disable no-console */
```

**For ES Module scripts (using `import`):**
```javascript
/* eslint-disable no-console */
```

**That's it!** These two lines solve 99% of ESLint errors in scripts.

---

**Quick Copy-Paste:**
```javascript
/* eslint-env node */
/* eslint-disable no-console */
```

Paste at the top of any Node.js script with `require` statements.
