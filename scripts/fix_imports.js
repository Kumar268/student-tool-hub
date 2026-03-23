/* eslint-env node */

const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\Aman kumar\\OneDrive\\Pictures\\main\\student\\StudentToolHub\\src';
const toolDetailPath = path.join(srcDir, 'components', 'ToolDetail.jsx');

if (!fs.existsSync(toolDetailPath)) {
  console.error('ToolDetail.jsx not found');
  process.exit(1);
}

const content = fs.readFileSync(toolDetailPath, 'utf8');
const importRegex = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;

let match;
let createdCount = 0;

while ((match = importRegex.exec(content)) !== null) {
  const compName = match[1];
  const importPath = match[2];
  
  if (importPath.startsWith('../tools/')) {
    const fullPath = path.resolve(path.join(srcDir, 'components'), importPath + '.jsx');
    
    if (!fs.existsSync(fullPath)) {
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const template = `import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const ${compName} = ({ isDarkMode }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 flex flex-col items-center justify-center py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className={\`p-8 rounded-2xl border text-center \${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}\`}>
        <div className={\`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center \${isDarkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-500'}\`}>
          <Settings size={32} />
        </div>
        <h2 className={\`text-2xl font-bold mb-2 \${isDarkMode ? 'text-white' : 'text-gray-900'}\`}>Under Construction</h2>
        <p className={\`\${isDarkMode ? 'text-gray-400' : 'text-gray-500'}\`}>
          This tool is currently being built. Please check back later!
        </p>
      </motion.div>
    </div>
  );
};

export default ${compName};
`;

      fs.writeFileSync(fullPath, template);
      console.log(\`Created missing component: \${fullPath}\`);
      createdCount++;
    }
  }
}

console.log(\`Successfully created \${createdCount} missing components.\`);
