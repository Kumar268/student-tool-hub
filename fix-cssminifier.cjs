const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'tools', 'developer', 'CSSMinifier.jsx');

let content = fs.readFileSync(file, 'utf8');

// Fix the specific mismatched tags
content = content.replace(/\n    <\/div>\n  \):\(/g, '\n          ):(');
content = content.replace(/\n    <\/div>\n  \)\}/g, '\n          )}');

// Fix any remaining orphaned closing divs after fragments
content = content.replace(/<\/>\s*\n\s*<\/div>\s*\n\s*\)/g, '</>\n  )');

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Fixed CSSMinifier.jsx');
