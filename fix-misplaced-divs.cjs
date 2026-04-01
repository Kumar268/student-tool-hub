const fs = require('fs');
const path = require('path');

const files = [
  'src/tools/health/agecalc.jsx',
];

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Remove closing divs that appear inside useEffect or other hooks
  // Pattern: }, []); followed by </div>
  content = content.replace(/(\}, \[\]\);)\s*\n\s*<\/div>/g, '$1');
  
  // Pattern: return () => clearInterval(id); followed by </div>
  content = content.replace(/(return \(\) => clearInterval\([^)]+\);)\s*\n\s*<\/div>/g, '$1');
  
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✅ Fixed ${file}`);
}

console.log('\n✨ Done!');
