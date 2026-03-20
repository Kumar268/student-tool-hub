const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src');
const toolsJsPath = path.join(srcPath, 'data', 'tools.js');
const toolDetailPath = path.join(srcPath, 'components', 'ToolDetail.jsx');

const newTools = [
  {
    id: 71,
    name: 'BMI & Calorie Calculator',
    description: 'Calculate Body Mass Index and daily caloric needs',
    category: 'health',
    icon: 'HeartPulse',
    slug: 'bmi-calorie-calculator',
    tags: ['health', 'bmi', 'calories', 'fitness'],
    component: 'BMIAndCalorie',
    dir: 'health'
  },
  {
    id: 72,
    name: 'EMI / Loan Calculator',
    description: 'Calculate Equated Monthly Installment for home or car loans',
    category: 'financial',
    icon: 'Landmark',
    slug: 'emi-loan-calculator',
    tags: ['finance', 'loan', 'emi', 'mortgage'],
    component: 'EMILoanCalc',
    dir: 'financial'
  },
  {
    id: 73,
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days',
    category: 'utility',
    icon: 'CalendarDays',
    slug: 'age-calculator',
    tags: ['age', 'date', 'calculator'],
    component: 'AgeCalculator',
    dir: 'utility'
  },
  {
    id: 74,
    name: 'Password Generator',
    description: 'Generate secure, random passwords with custom parameters',
    category: 'developer',
    icon: 'Key',
    slug: 'password-generator',
    tags: ['security', 'password', 'generator'],
    component: 'PasswordGenerator',
    dir: 'developer'
  },
  {
    id: 75,
    name: 'SIP Calculator',
    description: 'Calculate returns on Systematic Investment Plan (SIP)',
    category: 'financial',
    icon: 'TrendingUp',
    slug: 'sip-calculator',
    tags: ['finance', 'investment', 'sip', 'compound-interest'],
    component: 'SIPCalculator',
    dir: 'financial'
  },
  {
    id: 76,
    name: 'Scientific Calculator',
    description: 'Advanced calculator with trigonometry, logs, and more',
    category: 'academic',
    icon: 'Calculator',
    slug: 'scientific-calculator',
    tags: ['math', 'science', 'calculator'],
    component: 'ScientificCalculator',
    dir: 'academic'
  },
  {
    id: 77,
    name: 'Typing Speed Test',
    description: 'Test and improve your Words Per Minute (WPM)',
    category: 'niche',
    icon: 'Keyboard',
    slug: 'typing-speed-test',
    tags: ['typing', 'speed', 'test', 'wpm'],
    component: 'TypingSpeedTest',
    dir: 'niche'
  },
  {
    id: 78,
    name: 'Date Difference',
    description: 'Calculate the exact number of days between two dates',
    category: 'utility',
    icon: 'CalendarRange',
    slug: 'date-difference',
    tags: ['date', 'time', 'calculator'],
    component: 'DateDifference',
    dir: 'utility'
  },
  {
    id: 79,
    name: 'Salary Calculator',
    description: 'Calculate take-home pay after taxes and deductions',
    category: 'financial',
    icon: 'Wallet',
    slug: 'salary-calculator',
    tags: ['finance', 'salary', 'tax', 'income'],
    component: 'SalaryCalculator',
    dir: 'financial'
  }
];

// Update tools.js
let toolsJsStr = fs.readFileSync(toolsJsPath, 'utf8');
const arrayEndIndex = toolsJsStr.lastIndexOf('];');

let newToolsStr = '';
for (const tool of newTools) {
  newToolsStr += `,\n  {\n    id: ${tool.id},\n    name: '${tool.name}',\n    description: '${tool.description}',\n    category: '${tool.category}',\n    icon: '${tool.icon}',\n    slug: '${tool.slug}',\n    tags: ${JSON.stringify(tool.tags)}\n  }`;
}

toolsJsStr = toolsJsStr.slice(0, arrayEndIndex) + newToolsStr + '\n];\n';
fs.writeFileSync(toolsJsPath, toolsJsStr);

// Update ToolDetail.jsx
let toolDetailStr = fs.readFileSync(toolDetailPath, 'utf8');

// Insert Imports
let importsStr = '';
for (const tool of newTools) {
  importsStr += `import ${tool.component} from '../tools/${tool.dir}/${tool.component}';\n`;
}

toolDetailStr = toolDetailStr.replace(
  "import InternshipApplication from '../tools/documentmaker/InternshipApplication';",
  "import InternshipApplication from '../tools/documentmaker/InternshipApplication';\n" + importsStr
);

// Insert dictionary mapping
let dictStr = '';
for (const tool of newTools) {
  dictStr += `,\n  '${tool.slug}': ${tool.component}`;
}

toolDetailStr = toolDetailStr.replace(
  "  'internship-letter': InternshipApplication\n};",
  "  'internship-letter': InternshipApplication" + dictStr + "\n};"
);

fs.writeFileSync(toolDetailPath, toolDetailStr);

// Generate component files
for (const tool of newTools) {
  const dirPath = path.join(srcPath, 'tools', tool.dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, `${tool.component}.jsx`);
  const componentStr = `import React from 'react';\nimport ComingSoonTemplate from '../ComingSoonTemplate';\n\nconst ${tool.component} = ({ isDarkMode, toolName }) => {\n  return <ComingSoonTemplate toolName={toolName || '${tool.name}'} isDarkMode={isDarkMode} />;\n};\n\nexport default ${tool.component};\n`;
  fs.writeFileSync(filePath, componentStr);
}

console.log('Successfully scaffolded the popular tools!');
