const fs = require('fs');
const path = require('path');

const srcDir = path.join('c:/Users/Aman kumar/OneDrive/Pictures/main/student/StudentToolHub', 'src');
const toolsDir = path.join(srcDir, 'tools');
const pagesDir = path.join(srcDir, 'pages', 'tools');

if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
}

function findJSXFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            findJSXFiles(fullPath, fileList);
        } else if (file.endsWith('.jsx')) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

const allFiles = findJSXFiles(toolsDir);
let count = 0;

allFiles.forEach(file => {
    if (file.includes('ComingSoonTemplate.jsx')) return;
    
    const relativePath = file.substring(toolsDir.length + 1).split(path.sep).join('/');
    const parts = relativePath.split('/');
    if (parts.length < 2) return; // Must be in a category folder
    
    const category = parts[0];
    const filename = parts[parts.length - 1];
    const componentName = filename.replace('.jsx', '');
    
    // Example: GPACalculator -> GPA Calculator
    const title = componentName
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .replace(/([a-z\\d])([A-Z])/g, '$1 $2');
        
    const content = `import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import ${componentName} from '@/tools/${category}/${componentName}';

function ${componentName}Extras() {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Related Tips</h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
        <li>Make sure to double check your inputs.</li>
        <li>Explore related tools in this category to streamline your work.</li>
      </ul>
    </div>
  );
}

export default function ${componentName}Page() {
  return (
    <ToolPageLayout
      title="${title}"
      icon="🚀"
      extraFeatures={<${componentName}Extras />}
      adClient={import.meta.env.VITE_ADSENSE_PUB_ID}
      adSlots={{
        video: import.meta.env.VITE_VIDEO_AD_SLOT,
        top: import.meta.env.VITE_BANNER_AD_SLOT,
        middle: import.meta.env.VITE_DISPLAY_AD_SLOT,
        bottom: import.meta.env.VITE_BANNER_AD_SLOT,
      }}
    >
      <${componentName} />
    </ToolPageLayout>
  );
}
`;

    const pagePath = path.join(pagesDir, `${componentName}Page.jsx`);
    fs.writeFileSync(pagePath, content);
    count++;
});

console.log(`Successfully created ${count} Tool Page wrappers in src/pages/tools.`);
