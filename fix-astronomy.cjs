const fs = require('fs');
const path = 'c:\\Users\\Aman kumar\\OneDrive\\Pictures\\main\\student\\StudentToolHub\\src\\tools\\niche\\AstronomyCalc.jsx';

let content = fs.readFileSync(path, 'utf8');

// Find the problematic line with extra closing div
const before = content;
content = content.replace('</div>\r\n                            </div>\r\n                      );', '</div>\r\n                      );');

if (content !== before) {
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed extra closing div!');
} else {
  console.log('Pattern not found');
}
