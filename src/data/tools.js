export const categories = [
  { id: 'academic', name: 'Academic Tools', icon: 'GraduationCap', color: 'blue' },
  { id: 'financial', name: 'Financial Tools', icon: 'DollarSign', color: 'green' },
  { id: 'utility', name: 'Utility Tools', icon: 'Settings', color: 'orange' },
  { id: 'niche', name: 'Niche Tools', icon: 'Sparkles', color: 'purple' },
  { id: 'health', name: 'Health Tools', icon: 'Heart', color: 'rose' },
  { id: 'image', name: 'Image Tools', icon: 'Image', color: 'pink' },
  { id: 'pdf', name: 'PDF Tools', icon: 'FileText', color: 'red' },
  { id: 'text', name: 'Text Tools', icon: 'Type', color: 'yellow' },
  { id: 'audio', name: 'Audio Tools', icon: 'Music', color: 'cyan' },
  { id: 'developer', name: 'Developer Tools', icon: 'Code', color: 'indigo' },
  { id: 'documentmaker', name: 'Document Maker', icon: 'FileSignature', color: 'teal' },
  { id: 'useful', name: 'Useful Tools', icon: 'Wrench', color: 'emerald' }
];

export const tools = [
  // 📚 Academic Tools (10)
  {
    id: 1,
    name: 'Calculus Solver',
    description: 'Solve derivatives (1st, 2nd, 3rd order) and limits with step-by-step logic and graphs',
    category: 'academic',
    icon: 'Variable',
    slug: 'calculus-solver',
    tags: ['calculus', 'math', 'derivative', 'limit']
  },
  {
    id: 2,
    name: 'Integral Calculator',
    description: 'Step-by-step Indefinite and Definite integrals with visual area shading',
    category: 'academic',
    icon: 'Sigma',
    slug: 'integral-calculator',
    tags: ['calculus', 'integral', 'math']
  },
  {
    id: 3,
    name: 'Matrix Calculator',
    description: 'Addition, Multiplication, and Inverse for Linear Algebra (up to 5x5)',
    category: 'academic',
    icon: 'Grid3X3',
    slug: 'matrix-algebra',
    tags: ['matrix', 'algebra', 'math']
  },
  {
    id: 4,
    name: 'Statistics Master',
    description: 'Mean, Median, Mode, and Standard Deviation with step-by-step tables',
    category: 'academic',
    icon: 'BarChart3',
    slug: 'basic-stats',
    tags: ['statistics', 'mean', 'median', 'std dev']
  },
  {
    id: 5,
    name: 'Physics Simulator',
    description: 'Interactive Projectile Motion and Force calculators with real-time telemetry',
    category: 'academic',
    icon: 'Target',
    slug: 'projectile-simulator',
    tags: ['physics', 'projectile', 'motion', 'sim']
  },
  {
    id: 6,
    name: 'Chemistry Balancer',
    description: 'Balance complex chemical equations and calculate Molar Mass',
    category: 'academic',
    icon: 'FlaskConical',
    slug: 'chemistry-balancer',
    tags: ['chemistry', 'equations', 'molar mass']
  },
  {
    id: 7,
    name: 'Circuit Analyzer',
    description: "Ohm's Law and Series/Parallel Resistance Calculator with visuals",
    category: 'academic',
    icon: 'Cpu',
    slug: 'circuit-designer',
    tags: ['physics', 'electricity', 'circuits']
  },
  {
    id: 8,
    name: 'Economics Tool',
    description: 'Supply/Demand equilibrium and Elasticity calculators',
    category: 'academic',
    icon: 'TrendingUp',
    slug: 'economics-elasticity',
    tags: ['economics', 'price', 'demand']
  },
  {
    id: 9,
    name: 'Unit Converter',
    description: 'Comprehensive Length, Mass, and Volume conversion suite',
    category: 'academic',
    icon: 'Scale',
    slug: 'unit-converter',
    tags: ['units', 'conversion', 'science']
  },
  {
    id: 10,
    name: 'GPA Calculator',
    description: 'Multi-Semester Weighted and Unweighted GPA Calculator (4.0, 5.0, 10.0)',
    category: 'academic',
    icon: 'Calculator',
    slug: 'gpa-calculator',
    tags: ['gpa', 'grades', 'cgpa']
  },

  // 💰 Financial Tools (6)
  {
    id: 11,
    name: 'Student Loan Estimator',
    description: 'Repayment and Interest calculator for university loans',
    category: 'financial',
    icon: 'Banknote',
    slug: 'loan-repayment',
    tags: ['finance', 'loan', 'repayment']
  },
  {
    id: 12,
    name: 'Scholarship Finder',
    description: 'Mock Database Filter for Academic Grants and scholarships',
    category: 'financial',
    icon: 'Award',
    slug: 'scholarship-roi',
    tags: ['scholarship', 'finance', 'grants']
  },
  {
    id: 13,
    name: 'Student Budget Planner',
    description: 'Monthly Income vs. Expense tracker with student-specific tips',
    category: 'financial',
    icon: 'PieChart',
    slug: 'student-budgeting',
    tags: ['budget', 'finance', 'expenses']
  },
  {
    id: 14,
    name: 'Rent vs. Buy (Dorm) Calc',
    description: 'Comparison Tool for Student Housing and dorm costs',
    category: 'financial',
    icon: 'Home',
    slug: 'housing-calc',
    tags: ['housing', 'dorm', 'rent']
  },
  {
    id: 15,
    name: 'Textbook Buyback Calc',
    description: 'Estimated Depreciation and Resale Value for textbooks',
    category: 'financial',
    icon: 'Book',
    slug: 'textbook-resale',
    tags: ['books', 'resale', 'finance']
  },
  {
    id: 16,
    name: 'Relocation Calculator',
    description: 'Moving Costs for University Students changing cities',
    category: 'financial',
    icon: 'Truck',
    slug: 'moving-costs',
    tags: ['moving', 'relocation', 'travel']
  },

  // ⚙️ Utility Tools (7)
  {
    id: 17,
    name: 'Grade Calculator',
    description: '"What do I need on my final?" Calculator to reach your goal',
    category: 'utility',
    icon: 'GraduationCap',
    slug: 'final-grade-calc',
    tags: ['grades', 'final exam', 'calculator']
  },
  {
    id: 18,
    name: 'Pomodoro Timer',
    description: 'Custom intervals for deep focus and scheduled breaks',
    category: 'utility',
    icon: 'Clock',
    slug: 'pomodoro-timer',
    tags: ['focus', 'pomodoro', 'study']
  },
  {
    id: 19,
    name: 'Study Planner',
    description: 'Dynamic Exam Countdown and Schedule Generator',
    category: 'utility',
    icon: 'Calendar',
    slug: 'study-planner',
    tags: ['planner', 'exam', 'schedule']
  },
  {
    id: 20,
    name: 'Scientific Notation',
    description: 'Convert numbers to standard scientific format easily',
    category: 'utility',
    icon: 'Hash',
    slug: 'scientific-notation',
    tags: ['notation', 'science', 'numbers']
  },
  {
    id: 21,
    name: 'Assignment Tracker',
    description: 'Deadline list with urgency indicators and status',
    category: 'utility',
    icon: 'ClipboardList',
    slug: 'assignment-tracker',
    tags: ['assignments', 'deadlines', 'tasks']
  },
  {
    id: 22,
    name: 'Percentage Calculator',
    description: 'Quick Discount, Growth, and Basic Percentage calculations',
    category: 'utility',
    icon: 'Percent',
    slug: 'percentage-calc',
    tags: ['percent', 'math', 'discount']
  },
  {
    id: 23,
    name: 'Exam Weighting Calc',
    description: 'Calculate final grades based on syllabus weighting',
    category: 'utility',
    icon: 'Scale',
    slug: 'exam-weighting',
    tags: ['grades', 'syllabus', 'weighting']
  },

  // 🌌 Niche Tools (7)
  {
    id: 24,
    name: 'RSA Cryptography',
    description: 'Simple Encryption/Decryption visual demonstrator',
    category: 'niche',
    icon: 'ShieldCheck',
    slug: 'rsa-demo',
    tags: ['security', 'rsa', 'encryption']
  },
  {
    id: 25,
    name: 'Truth Table Generator',
    description: 'For Computer Science (Logic Gates and Boolean Algebra)',
    category: 'niche',
    icon: 'Binary',
    slug: 'truth-table',
    tags: ['logic', 'cs', 'boolean']
  },
  {
    id: 26,
    name: 'Astronomy Calculator',
    description: 'Star Distance and Planet Weight calculators for space science',
    category: 'niche',
    icon: 'Orbit',
    slug: 'astronomy-calc',
    tags: ['space', 'astronomy', 'science']
  },
  {
    id: 27,
    name: 'Music Theory Tool',
    description: 'Scale and Chord Generator with visual intervals',
    category: 'niche',
    icon: 'Music',
    slug: 'music-theory',
    tags: ['music', 'scales', 'chords']
  },
  {
    id: 28,
    name: 'Nutrition Tracker',
    description: 'Student-friendly calorie and macro calculator for budget meals',
    category: 'niche',
    icon: 'Utensils',
    slug: 'nutrition-calc',
    tags: ['nutrition', 'calories', 'health']
  },
  {
    id: 29,
    name: 'Carbon Footprint',
    description: 'Estimate environmental impact of campus life and travel',
    category: 'niche',
    icon: 'Leaf',
    slug: 'carbon-footprint',
    tags: ['environment', 'carbon', 'impact']
  },
  {
    id: 30,
    name: 'Binary Converter',
    description: 'Convert between Binary, Decimal, and Hexadecimal formats',
    category: 'niche',
    icon: 'Hash',
    slug: 'binary-converter',
    tags: ['binary', 'hex', 'conversion']
  },

  // 🖼️ Image Tools (7)
  {
    id: 31,
    name: 'Image Resizer',
    description: 'Bulk resize images for project submissions and portals',
    category: 'image',
    icon: 'Maximize',
    slug: 'image-resizer',
    tags: ['image', 'resize', 'bulk']
  },
  {
    id: 32,
    name: 'Image Compressor',
    description: 'Reduce file size without losing quality for fast uploads',
    category: 'image',
    icon: 'FileArchive',
    slug: 'image-compressor',
    tags: ['image', 'compress', 'optimize']
  },
  {
    id: 33,
    name: 'Basic Image Editor',
    description: 'Quick Crop, Rotate, and Filter adjustments in-browser',
    category: 'image',
    icon: 'ImagePlus',
    slug: 'image-editor',
    tags: ['image', 'edit', 'crop']
  },
  {
    id: 34,
    name: 'Format Converter',
    description: 'Convert between JPG, PNG, and WebP instantly',
    category: 'image',
    icon: 'RefreshCw',
    slug: 'format-converter',
    tags: ['image', 'converter', 'format']
  },
  {
    id: 35,
    name: 'Background Remover',
    description: 'Clean up profile photos or project assets using AI',
    category: 'image',
    icon: 'Eraser',
    slug: 'background-remover',
    tags: ['image', 'ai', 'background']
  },
  {
    id: 36,
    name: 'Image to PDF',
    description: 'Convert multiple photos into a single professional report',
    category: 'image',
    icon: 'FileImage',
    slug: 'image-to-pdf',
    tags: ['image', 'pdf', 'report']
  },
  {
    id: 37,
    name: 'Screenshot Mockup',
    description: 'Place screenshots into clean Laptop/Mobile frames for demos',
    category: 'image',
    icon: 'Monitor',
    slug: 'screenshot-mockup',
    tags: ['mockup', 'design', 'presentation']
  },

  // 📄 PDF Tools (6)
  {
    id: 38,
    name: 'PDF Merger',
    description: 'Combine multiple assignment files into one document',
    category: 'pdf',
    icon: 'FileStack',
    slug: 'pdf-merger-splitter',
    tags: ['pdf', 'merge', 'combine']
  },
  {
    id: 39,
    name: 'PDF Splitter',
    description: 'Extract specific pages from a textbook scan or large file',
    category: 'pdf',
    icon: 'Scissors',
    slug: 'pdf-splitter',
    tags: ['pdf', 'split', 'extract']
  },
  {
    id: 40,
    name: 'PDF Compressor',
    description: 'Make files small enough for email or portal limits',
    category: 'pdf',
    icon: 'FileArchive',
    slug: 'pdf-compressor',
    tags: ['pdf', 'compress', 'optimize']
  },
  {
    id: 41,
    name: 'PDF to Word',
    description: 'Extract editable text from PDF files for note-taking',
    category: 'pdf',
    icon: 'FileEdit',
    slug: 'pdf-to-word',
    tags: ['pdf', 'word', 'converter']
  },
  {
    id: 42,
    name: 'Word to PDF',
    description: 'Convert Word documents to professional PDF submissions',
    category: 'pdf',
    icon: 'FileCheck',
    slug: 'word-to-pdf',
    tags: ['pdf', 'word', 'converter']
  },
  {
    id: 43,
    name: 'PDF Password Remover',
    description: 'Unlock password-protected PDFs for easier editing',
    category: 'pdf',
    icon: 'Unlock',
    slug: 'pdf-unlock',
    tags: ['pdf', 'password', 'unlock']
  },

  // ✍️ Text Tools (5)
  {
    id: 44,
    name: 'Word Counter',
    description: 'Real-time Word, Character, and Reading Time counter',
    category: 'text',
    icon: 'FileText',
    slug: 'word-counter',
    tags: ['text', 'counter', 'essay']
  },
  {
    id: 45,
    name: 'Grammar Checker',
    description: 'Basic Spell-Check and Grammar highlighting for drafts',
    category: 'text',
    icon: 'CheckSquare',
    slug: 'grammar-checker',
    tags: ['text', 'grammar', 'check']
  },
  {
    id: 46,
    name: 'Text Formatter',
    description: 'Remove extra spaces or clean up messy lecture notes',
    category: 'text',
    icon: 'Type',
    slug: 'text-formatter',
    tags: ['text', 'format', 'notes']
  },
  {
    id: 47,
    name: 'Case Converter',
    description: 'Toggle UPPERCASE, lowercase, and Title Case instantly',
    category: 'text',
    icon: 'CaseSensitive',
    slug: 'case-converter',
    tags: ['text', 'case', 'converter']
  },
  {
    id: 48,
    name: 'Plagiarism Checker',
    description: 'Basic internal similarity check for draft notes',
    category: 'text',
    icon: 'FileSearch',
    slug: 'plagiarism-check',
    tags: ['text', 'plagiarism', 'academic']
  },

  // 🎙️ Audio Tools (3)
  {
    id: 49,
    name: 'Audio Converter',
    description: 'Convert between MP3, WAV, and AAC file formats',
    category: 'audio',
    icon: 'RefreshCw',
    slug: 'audio-converter',
    tags: ['audio', 'converter', 'format']
  },
  {
    id: 50,
    name: 'Voice Recorder',
    description: 'Record lectures directly into the browser as high-quality audio',
    category: 'audio',
    icon: 'Mic',
    slug: 'voice-recorder',
    tags: ['audio', 'record', 'lecture']
  },
  {
    id: 51,
    name: 'Text to Speech',
    description: 'Read out notes for auditory learning and accessibility',
    category: 'audio',
    icon: 'Volume2',
    slug: 'tts-converter',
    tags: ['audio', 'tts', 'accessibility']
  },

  // 💻 Developer Tools (5)
  {
    id: 52,
    name: 'JSON Formatter',
    description: 'Prettify and validate JSON code snippets for debugging',
    category: 'developer',
    icon: 'Code',
    slug: 'code-formatter',
    tags: ['json', 'formatter', 'debug']
  },
  {
    id: 53,
    name: 'CSS Minifier',
    description: 'Compress styles for faster web loading and performance',
    category: 'developer',
    icon: 'FileCode',
    slug: 'css-minifier',
    tags: ['css', 'minify', 'dev']
  },
  {
    id: 54,
    name: 'HTML Previewer',
    description: 'Real-time code playground for students learning web dev',
    category: 'developer',
    icon: 'Eye',
    slug: 'html-previewer',
    tags: ['html', 'preview', 'dev']
  },
  {
    id: 55,
    name: 'Color Picker',
    description: 'HEX, RGB, and HSL palette generator for design projects',
    category: 'developer',
    icon: 'Palette',
    slug: 'color-picker',
    tags: ['color', 'design', 'hex']
  },
  {
    id: 56,
    name: 'QR Generator',
    description: 'Create QR codes for project links or social media profiles',
    category: 'developer',
    icon: 'QrCode',
    slug: 'qr-generator',
    tags: ['qr', 'code', 'link']
  },

  // 📄 Document Maker Tools (13)
  {
    id: 57,
    name: 'Resume Maker',
    description: 'Professional resume builder with templates',
    category: 'documentmaker',
    icon: 'FileUser',
    slug: 'resume-maker',
    tags: ['resume', 'career', 'job']
  },
  {
    id: 58,
    name: 'CV Maker',
    description: 'Academic CV format generator for research and grad school',
    category: 'documentmaker',
    icon: 'GraduationCap',
    slug: 'cv-maker',
    tags: ['cv', 'academic', 'career']
  },
  {
    id: 59,
    name: 'Biodata Maker',
    description: 'Standard biodata format popular in India/South Asia',
    category: 'documentmaker',
    icon: 'UserCircle',
    slug: 'biodata-maker',
    tags: ['biodata', 'profile', 'personal']
  },
  {
    id: 60,
    name: 'Cover Letter Generator',
    description: 'Customized cover letters for job applications',
    category: 'documentmaker',
    icon: 'FileText',
    slug: 'cover-letter-generator',
    tags: ['cover letter', 'job', 'application']
  },
  {
    id: 61,
    name: 'LinkedIn Summary Gen',
    description: 'Professional summary generator for LinkedIn profiles',
    category: 'documentmaker',
    icon: 'Linkedin',
    slug: 'linkedin-summary',
    tags: ['linkedin', 'profile', 'networking']
  },
  {
    id: 62,
    name: 'Job Application Tracker',
    description: 'Organize and track your job applications',
    category: 'documentmaker',
    icon: 'ListChecks',
    slug: 'job-tracker',
    tags: ['jobs', 'tracker', 'application']
  },
  {
    id: 63,
    name: 'Research Paper Outline',
    description: 'Structured generator for academic papers',
    category: 'documentmaker',
    icon: 'BookOpen',
    slug: 'research-outline',
    tags: ['research', 'paper', 'outline']
  },
  {
    id: 64,
    name: 'Reference Generator',
    description: 'Citation formatter (APA, MLA, Chicago styles)',
    category: 'documentmaker',
    icon: 'Quote',
    slug: 'reference-generator',
    tags: ['citation', 'reference', 'bibliography']
  },
  {
    id: 65,
    name: 'Lab Report Builder',
    description: 'Standardized template for scientific lab reports',
    category: 'documentmaker',
    icon: 'FlaskConical',
    slug: 'lab-report',
    tags: ['lab', 'report', 'science']
  },
  {
    id: 66,
    name: 'Assignment Cover Page',
    description: 'University standard cover page generator',
    category: 'documentmaker',
    icon: 'FileBadge',
    slug: 'cover-page',
    tags: ['assignment', 'cover page', 'university']
  },
  {
    id: 67,
    name: 'Scholarship Application',
    description: 'Letter template for scholarship applications',
    category: 'documentmaker',
    icon: 'Award',
    slug: 'scholarship-letter',
    tags: ['scholarship', 'letter', 'finance']
  },
  {
    id: 68,
    name: 'SOP Generator',
    description: 'Statement of Purpose builder for grad school',
    category: 'documentmaker',
    icon: 'PenTool',
    slug: 'sop-generator',
    tags: ['sop', 'statement', 'grad school']
  },
  {
    id: 69,
    name: 'Recommendation Letter',
    description: 'Template for professors and employers',
    category: 'documentmaker',
    icon: 'ThumbsUp',
    slug: 'recommendation-letter',
    tags: ['recommendation', 'letter', 'reference']
  },
  {
    id: 70,
    name: 'Internship Application',
    description: 'Letter format specific to internships',
    category: 'documentmaker',
    icon: 'Briefcase',
    slug: 'internship-letter',
    tags: ['internship', 'application', 'letter']
  },
  // 🏥 Health Apps
  {
    id: 71,
    name: 'BMI & Calorie Calculator',
    description: 'Calculate Body Mass Index and daily caloric needs',
    category: 'health',
    icon: 'HeartPulse',
    slug: 'bmi-calorie-calculator',
    tags: ['health', 'bmi', 'calories', 'fitness']
  },
  {
    id: 72,
    name: 'Nutrition Calculator',
    description: 'Student-friendly calorie and macro calculator for budget meals',
    category: 'health',
    icon: 'Apple',
    slug: 'nutrition-calculator',
    tags: ['nutrition', 'calories', 'macros', 'health']
  },
  {
    id: 73,
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days',
    category: 'health',
    icon: 'CalendarDays',
    slug: 'age-calculator-health',
    tags: ['age', 'health', 'date']
  },
  // Adding more financial, utility, and academic apps
  {
    id: 74,
    name: 'EMI / Loan Calculator',
    description: 'Calculate Equated Monthly Installment for home or car loans',
    category: 'financial',
    icon: 'Landmark',
    slug: 'emi-loan-calculator',
    tags: ['finance', 'loan', 'emi', 'mortgage']
  },
  {
    id: 75,
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days',
    category: 'utility',
    icon: 'CalendarDays',
    slug: 'age-calculator',
    tags: ['age', 'date', 'calculator']
  },
  {
    id: 80,
    name: 'Password Generator',
    description: 'Generate secure, random passwords with custom parameters',
    category: 'developer',
    icon: 'Key',
    slug: 'password-generator',
    tags: ['security', 'password', 'generator']
  },
  {
    id: 81,
    name: 'SIP Calculator',
    description: 'Calculate returns on Systematic Investment Plan (SIP)',
    category: 'financial',
    icon: 'TrendingUp',
    slug: 'sip-calculator',
    tags: ['finance', 'investment', 'sip', 'compound-interest']
  },
  {
    id: 82,
    name: 'Date Difference',
    description: 'Calculate exact days, weeks and months between two dates',
    category: 'utility',
    icon: 'CalendarDays',
    slug: 'date-difference',
    tags: ['date', 'calculator', 'days', 'time']
  },
  {
    id: 83,
    name: 'Quadratic Solver',
    description: 'Solve quadratic equations ax² + bx + c = 0 with step-by-step working',
    category: 'academic',
    icon: 'Sigma',
    slug: 'quadratic-solver',
    tags: ['quadratic', 'algebra', 'equation', 'roots', 'math']
  },
  {
    id: 84,
    name: 'Salary Calculator',
    description: 'Calculate take-home salary after tax deductions for Indian CTC packages',
    category: 'financial',
    icon: 'IndianRupee',
    slug: 'salary-calculator',
    tags: ['salary', 'tax', 'ctc', 'income', 'finance']
  },
  {
    id: 85,
    name: 'Scientific Calculator',
    description: 'Full-featured scientific calculator with trigonometry, logarithms and constants',
    category: 'academic',
    icon: 'Calculator',
    slug: 'scientific-calculator',
    tags: ['calculator', 'math', 'science', 'trigonometry']
  },
  {
    id: 86,
    name: 'Typing Speed Test',
    description: 'Test and improve your typing speed in Words Per Minute (WPM)',
    category: 'niche',
    icon: 'Keyboard',
    slug: 'typing-speed-test',
    tags: ['typing', 'speed', 'wpm', 'test', 'practice']
  }
];