const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'tools', 'image', 'ImageResizer.jsx');
let content = fs.readFileSync(file, 'utf8');

// Remove the duplicate closing divs at lines 342-343
const lines = content.split('\n');

// Find and remove extra closing divs around line 342
if (lines[341] && lines[341].trim() === '</div>' && 
    lines[342] && lines[342].trim() === '</div>' &&
    lines[343] && lines[343].trim() === '</div>') {
  // Remove lines 342 and 343 (the extras)
  lines.splice(342, 2);
  content = lines.join('\n');
  fs.writeFileSync(file, content, 'utf8');
  console.log('✅ Fixed ImageResizer.jsx - removed extra closing divs');
} else {
  console.log('⚠️  Pattern not found, checking manually...');
  console.log('Line 341:', lines[341]);
  console.log('Line 342:', lines[342]);
  console.log('Line 343:', lines[343]);
}
