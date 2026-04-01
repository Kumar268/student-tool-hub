const fs = require('fs');
const path = 'c:\\Users\\Aman kumar\\OneDrive\\Pictures\\main\\student\\StudentToolHub\\src\\tools\\niche\\AstronomyCalc.jsx';

let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

// Remove line 542 (index 541)
lines.splice(541, 1);

content = lines.join('\n');
fs.writeFileSync(path, content, 'utf8');
console.log('Removed extra closing div at line 542!');
