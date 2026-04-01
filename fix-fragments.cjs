const fs = require('fs');
const path = require('path');

const files = [
  'src/tools/developer/CSSMinifier.jsx',
  'src/tools/developer/ColorPicker.jsx',
];

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Fix mismatched closing divs after fragments
  content = content.replace(/\n    <\/div>\n  \):\(/g, '\n          ):(');
  content = content.replace(/\n    <\/div>\n  \)\}/g, '\n          )}');
  content = content.replace(/\n      <\/div>\n    \)\}/g, '\n                </div>\n              )}\n            )');
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Fixed ${file}`);
}

console.log('\n✨ All fragment issues fixed!');
