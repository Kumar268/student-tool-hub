const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'tools');

function getAllJsxFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files = files.concat(getAllJsxFiles(fullPath));
    } else if (item.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixRemainingFragments(content) {
  // Fix pattern: </div> followed by </button> with fragment issues
  // This happens when our script added </> but there's still a mismatch
  
  // Remove standalone </> that don't have matching <>
  content = content.replace(/\n\s*<\/>\s*\n\s*<\/button>/g, '\n          </button>');
  content = content.replace(/\n\s*<\/>\s*\n\s*<\/div>/g, '\n        </div>');
  
  return content;
}

const allFiles = getAllJsxFiles(toolsDir);
let fixed = 0;

for (const file of allFiles) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    content = fixRemainingFragments(content);
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ ${path.relative(__dirname, file)}`);
      fixed++;
    }
  } catch (error) {
    console.log(`❌ Error in ${file}: ${error.message}`);
  }
}

console.log(`\n✨ Fixed ${fixed} files`);
