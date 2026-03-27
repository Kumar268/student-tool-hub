const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/ToolDetail.jsx');

// Read raw bytes
const raw = fs.readFileSync(file);
let txt = raw.toString('utf16le');
const hasBOM = raw[0] === 0xFF && raw[1] === 0xFE;

// Remove motion import (but keep AnimatePresence if present)
txt = txt.replace(/import\s*\{\s*motion\s*,\s*AnimatePresence\s*\}\s*from\s*['"`]framer-motion['"`]\s*;/g, "import { AnimatePresence } from 'framer-motion';");
txt = txt.replace(/import\s*\{\s*AnimatePresence\s*,\s*motion\s*\}\s*from\s*['"`]framer-motion['"`]\s*;/g, "import { AnimatePresence } from 'framer-motion';");
// If only motion was imported
txt = txt.replace(/import\s*\{\s*motion\s*\}\s*from\s*['"`]framer-motion['"`]\s*;\r?\n?/g, '');

// Remove unused remove parameter from Toast
txt = txt.replace(/const Toast = \(\{ toasts, remove \}\) =>/g, "const Toast = ({ toasts }) =>");

// Import Home from lucide-react
txt = txt.replace(/import\s*\{(.*?)\}\s*from\s*['"`]lucide-react['"`];/s, (match, p1) => {
    if (!p1.includes('Home')) {
        return `import { Home, ${p1.trim()} } from 'lucide-react';`;
    }
    return match;
});

// Remove unused actionBtnStyle
txt = txt.replace(/const actionBtnStyle = \{[\s\S]*?\};\r?\n?/g, '');

// Write back with appropriate encoding
// Node 'utf16le' writing writes the raw bytes, so if we had BOM, we need to ensure it's there.
// Buffer.from with utf16le does NOT add BOM automatically.
let outBuf = Buffer.from(txt, 'utf16le');
if (hasBOM && (outBuf.length < 2 || outBuf[0] !== 0xFF || outBuf[1] !== 0xFE)) {
    outBuf = Buffer.concat([Buffer.from([0xFF, 0xFE]), outBuf]);
}

fs.writeFileSync(file, outBuf);
console.log('ToolDetail.jsx updated');
