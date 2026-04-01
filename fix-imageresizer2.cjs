const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'tools', 'image', 'ImageResizer.jsx');
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

// Remove one of the duplicate closing divs at line 342
if (lines[341] && lines[341].includes('</div>') && 
    lines[342] && lines[342].includes('</div>')) {
  lines.splice(342, 1);
  content = lines.join('\n');
  fs.writeFileSync(file, content, 'utf8');
  console.log('✅ Fixed ImageResizer.jsx');
}
