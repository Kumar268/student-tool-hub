const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'tools', 'documentmaker', 'LinkedInSummaryGen.jsx');
let content = fs.readFileSync(file, 'utf8');

// Fix the two specific mismatched closing tags
content = content.replace(
  /    <\/div>\n  \) : \(/g,
  '        </>\n      ) : ('
);

content = content.replace(
  /    <\/div>\n  \)\}\n                  <\/div>/g,
  '                        </>\n                      )}\n                  </div>'
);

fs.writeFileSync(file, content, 'utf8');
console.log('✅ Fixed LinkedInSummaryGen.jsx');
