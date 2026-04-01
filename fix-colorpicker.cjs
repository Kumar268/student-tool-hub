const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'tools', 'developer', 'ColorPicker.jsx');
let content = fs.readFileSync(file, 'utf8');

// Fix the theme toggle button fragment issues
content = content.replace(
  /NIT<\/span>\n          \):\(/,
  'NIT</span>\n            </>\n          ):('
);

content = content.replace(
  /<\/div>\n          \)\}\n          <\/button>/,
  '</div>\n            </>\n          )}\n          </button>'
);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Fixed ColorPicker.jsx');
