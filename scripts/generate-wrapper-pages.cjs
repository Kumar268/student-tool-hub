/**
 * Generate missing wrapper pages for all tools
 * Usage: node scripts/generate-wrapper-pages.cjs
 * 
 * This script:
 * 1. Reads all tools from src/data/tools.js
 * 2. Checks which wrapper pages already exist
 * 3. Creates missing wrapper pages in src/pages/tools/
 * 4. Uses consistent naming: {ToolName}Page.jsx
 */

const fs = require('fs');
const path = require('path');

// Import tools data
const toolsFile = fs.readFileSync(path.join(__dirname, '../src/data/tools.js'), 'utf8');

// Extract tools array using regex
const toolsMatch = toolsFile.match(/export const tools = \[([\s\S]*?)\];/);
if (!toolsMatch) {
  console.error('❌ Could not parse tools.js');
  process.exit(1);
}

// Parse tools (using a simple regex to find slug: 'slug-name')
const tools = [];
const slugRegex = /slug:\s*['"`]([^'"`]+)['"`]/g;
let match;
while ((match = slugRegex.exec(toolsFile)) !== null) {
  tools.push(match[1]);
}

// Remove duplicates
const uniqueSlugs = [...new Set(tools)];

console.log(`✅ Found ${uniqueSlugs.length} unique tools\n`);

// Tool slug to component name mapping
const slugToComponent = {
  'calculus-solver': 'CalculusSolver',
  'integral-calculator': 'IntegralCalculator',
  'matrix-algebra': 'MatrixAlgebra',
  'basic-stats': 'BasicStats',
  'projectile-simulator': 'ProjectileSimulator',
  'chemistry-balancer': 'ChemistryBalancer',
  'circuit-designer': 'CircuitDesigner',
  'economics-elasticity': 'EconomicsElasticity',
  'unit-converter': 'UnitConverter',
  'gpa-calculator': 'GPACalculator',
  'loan-repayment': 'StudentLoanRepayment',
  'scholarship-roi': 'ScholarshipROICalc',
  'student-budgeting': 'StudentBudgeting',
  'housing-calc': 'HousingCalc',
  'textbook-resale': 'TextbookResale',
  'moving-costs': 'MovingCosts',
  'final-grade-calc': 'FinalGradeCalc',
  'pomodoro-timer': 'PomodoroTimer',
  'study-planner': 'StudyPlanner',
  'scientific-notation': 'ScientificNotation',
  'assignment-tracker': 'AssignmentTracker',
  'percentage-calc': 'PercentageCalc',
  'exam-weighting': 'ExamWeighting',
  'rsa-demo': 'RSADemo',
  'truth-table': 'TruthTableGenerator',
  'astronomy-calc': 'AstronomyCalc',
  'music-theory': 'MusicTheoryCalc',
  'nutrition-calc': 'NutritionCalc',
  'carbon-footprint': 'CarbonFootprint',
  'binary-converter': 'BinaryConverter',
  'image-resizer': 'ImageResizer',
  'image-compressor': 'ImageCompressor',
  'image-editor': 'ImageEditor',
  'format-converter': 'FormatConverter',
  'background-remover': 'BackgroundRemover',
  'image-to-pdf': 'ImageToPDF',
  'screenshot-mockup': 'ScreenshotMockup',
  'pdf-merger-splitter': 'PDFMergeSplit',
  'pdf-splitter': 'PDFMergeSplit',
  'pdf-compressor': 'PDFCompressor',
  'pdf-to-word': 'PDFToWord',
  'word-to-pdf': 'WordToPDF',
  'pdf-unlock': 'PDFUnlock',
  'word-counter': 'WordCounter',
  'grammar-checker': 'GrammarChecker',
  'text-formatter': 'TextFormatter',
  'case-converter': 'CaseConverter',
  'plagiarism-check': 'PlagiarismCheck',
  'audio-converter': 'AudioConverter',
  'voice-recorder': 'VoiceRecorder',
  'tts-converter': 'TextToSpeech',
  'code-formatter': 'CodeFormatter',
  'css-minifier': 'CSSMinifier',
  'html-previewer': 'HTMLPreviewer',
  'color-picker': 'ColorPicker',
  'qr-generator': 'QRGenerator',
  'resume-maker': 'ResumeMaker',
  'cv-maker': 'CVMaker',
  'biodata-maker': 'BiodataMaker',
  'cover-letter-generator': 'CoverLetterGenerator',
  'linkedin-summary': 'LinkedInSummaryGen',
  'job-tracker': 'JobApplicationTracker',
  'research-outline': 'ResearchPaperOutline',
  'reference-generator': 'ReferenceGenerator',
  'lab-report': 'LabReportBuilder',
  'cover-page': 'AssignmentCoverPage',
  'scholarship-letter': 'ScholarshipLatter',
  'sop-generator': 'SOPGenerator',
  'recommendation-letter': 'RecommendationLetter',
  'internship-letter': 'InternshipLetter',
  'bmi-calorie-calculator': 'BMIAndCalorie',
  'nutrition-calculator': 'NutritionCalc',
  'age-calculator-health': 'agecalc',
  'emi-loan-calculator': 'EMILoanCalc',
  'age-calculator': 'AgeCalculator',
  'password-generator': 'PasswordGenerator',
  'sip-calculator': 'SIPCalculator',
  'scientific-calculator': 'scientificCalc',
  'typing-speed-test': 'TypingSpeedTest',
  'date-difference': 'DateDifference',
  'salary-calculator': 'salaryTax',
  'quadratic-solver': 'QuadraticSolver',
};

// Check which wrapper pages exist
const pagesDir = path.join(__dirname, '../src/pages/tools');
const existingPages = new Set();

if (fs.existsSync(pagesDir)) {
  fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('Page.jsx')) {
      existingPages.add(file.replace('Page.jsx', '').toLowerCase());
    }
  });
}

// Function to convert slug to component name
function slugToName(slug) {
  // Try manual mapping first
  if (slugToComponent[slug]) {
    return slugToComponent[slug];
  }

  // Fallback: convert kebab-case to PascalCase
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Generate wrapper page template

// Create pages directory if it doesn't exist
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
  console.log(`📁 Created directory: src/pages/tools/\n`);
}

// Identify missing pages
const missingPages = [];
uniqueSlugs.forEach(slug => {
  const componentName = slugToName(slug);
  // Check if page exists (case-insensitive)
  const exists = Array.from(existingPages).some(
    page => page.toLowerCase() === componentName.toLowerCase()
  );

  if (!exists && slug !== 'coming-soon') {
    missingPages.push({ slug, componentName });
  }
});

console.log(`Found ${missingPages.length} missing wrapper pages:\n`);

// Log missing pages that need to be created
missingPages.forEach(({ slug, componentName }) => {
  console.log(`  ⏳ ${componentName}Page.jsx (tool: ${slug})`);
});

if (missingPages.length === 0) {
  console.log('\n✅ All tools have wrapper pages! No files to create.');
  process.exit(0);
}

console.log('\n' + '='.repeat(60));
console.log('Next Steps:');
console.log('='.repeat(60));
console.log('\n1. Manually verify tool paths in src/tools/{category}/');
console.log('   These pages need CATEGORY and proper component imports.');
console.log('\n2. Create each page with the correct import path.');
console.log('\n3. Run: npm run build\n');

// Generate a config file with all mappings for reference
const configOutput = {
  totalTools: uniqueSlugs.length,
  createdPages: 0,
  missingPages: missingPages.map(({ slug, componentName }) => ({
    slug,
    componentName,
    pageName: `${componentName}Page.jsx`
  }))
};

fs.writeFileSync(
  path.join(__dirname, '../wrapper-pages-config.json'),
  JSON.stringify(configOutput, null, 2)
);

console.log('✅ Generated: wrapper-pages-config.json');
console.log(`
To batch create these pages, you can:
1. Use the template above for each missing page
2. Update the import path with the correct category
3. Update the tool name and icon in ToolPageLayout props
`);
