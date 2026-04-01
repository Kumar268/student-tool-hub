const fs = require('fs');
const path = 'c:\\Users\\Aman kumar\\OneDrive\\Pictures\\main\\student\\StudentToolHub\\src\\tools\\niche\\AstronomyCalc.jsx';

let content = fs.readFileSync(path, 'utf8');

// Find and fix the extra closing div
content = content.replace(
  /(<span style={{ fontFamily:"'Fira Code',monospace", fontSize:10, color: ltBody===name\?'var\(--acc\)':'var\(--txm\)' }}>{fmtTime\(t\)}<\/span>\s*<\/div>\s*<\/div>\s*\);)/,
  (match) => match.replace('</div>\n                            </div>\n                      );', '</div>\n                      );')
);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed!');
