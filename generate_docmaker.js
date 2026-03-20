import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dir = path.join(__dirname, 'src', 'tools', 'documentmaker');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

const components = [
    { file: 'ResumeMaker.jsx', name: 'ResumeMaker', title: 'Resume Maker', desc: 'Build a professional resume.' },
    { file: 'CVMaker.jsx', name: 'CVMaker', title: 'CV Maker', desc: 'Create an academic CV.' },
    { file: 'BiodataMaker.jsx', name: 'BiodataMaker', title: 'Biodata Maker', desc: 'Generate a standard biodata.' },
    { file: 'CoverLetterGenerator.jsx', name: 'CoverLetterGenerator', title: 'Cover Letter Generator', desc: 'Write customized cover letters.' },
    { file: 'LinkedInSummaryGen.jsx', name: 'LinkedInSummaryGen', title: 'LinkedIn Summary Generator', desc: 'Generate a LinkedIn summary.' },
    { file: 'JobApplicationTracker.jsx', name: 'JobApplicationTracker', title: 'Job Application Tracker', desc: 'Track your job applications.' },
    { file: 'ResearchPaperOutline.jsx', name: 'ResearchPaperOutline', title: 'Research Paper Outline', desc: 'Structure your research paper.' },
    { file: 'ReferenceGenerator.jsx', name: 'ReferenceGenerator', title: 'Reference Generator', desc: 'Format your citations.' },
    { file: 'LabReportBuilder.jsx', name: 'LabReportBuilder', title: 'Lab Report Builder', desc: 'Build a scientific lab report.' },
    { file: 'AssignmentCoverPage.jsx', name: 'AssignmentCoverPage', title: 'Assignment Cover Page', desc: 'Create a cover page for your assignment.' },
    { file: 'ScholarshipApplication.jsx', name: 'ScholarshipApplication', title: 'Scholarship Application', desc: 'Write a scholarship application letter.' },
    { file: 'SOPGenerator.jsx', name: 'SOPGenerator', title: 'SOP Generator', desc: 'Generate a Statement of Purpose.' },
    { file: 'RecommendationLetter.jsx', name: 'RecommendationLetter', title: 'Recommendation Letter', desc: 'Template for recommendation letters.' },
    { file: 'InternshipApplication.jsx', name: 'InternshipApplication', title: 'Internship Application', desc: 'Write an internship application letter.' }
];

components.forEach(c => {
    const content = `import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Download, Edit3 } from 'lucide-react';

const ${c.name} = ({ isDarkMode, addToHistory, copyResult, toolName }) => {
  const [content, setContent] = useState('');

  const handleGenerate = () => {
    const generated = \`=========================================
\${toolName.toUpperCase()}
=========================================

Title: Example \${toolName} Document
Date: \${new Date().toLocaleDateString()}

This is a generated placeholder document for the \${toolName} tool. 
We will implement the full form inputs and custom generation logic for this specific template shortly.
      \`;
    setContent(generated);
    if(addToHistory) addToHistory(generated);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={\`p-6 md:p-8 rounded-2xl shadow-sm border \${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}\`}>
        <div className="flex items-center space-x-4 mb-8">
          <div className={\`p-4 rounded-xl \${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}\`}>
            <FileText size={28} />
          </div>
          <div>
            <h2 className={\`text-2xl font-bold \${isDarkMode ? 'text-white' : 'text-gray-900'}\`}>{toolName}</h2>
            <p className={\`text-sm mt-1 \${isDarkMode ? 'text-gray-400' : 'text-gray-500'}\`}>Fill out the form below to generate your document.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Placeholder for future form inputs */}
          <div className={\`p-8 rounded-xl border border-dashed text-center \${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-300'}\`}>
             <Edit3 size={32} className={\`mx-auto mb-3 \${isDarkMode ? 'text-gray-500' : 'text-gray-400'}\`} />
             <p className={\`font-medium \${isDarkMode ? 'text-gray-300' : 'text-gray-600'}\`}>Template Form Coming Soon</p>
             <p className={\`text-sm mt-2 max-w-md mx-auto \${isDarkMode ? 'text-gray-400' : 'text-gray-500'}\`}>
               The specialized form inputs for the {toolName} are currently being developed. You can test the document generation flow below.
             </p>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:scale-[1.01] active:scale-95 font-bold shadow-md flex items-center justify-center space-x-2"
          >
            <FileText size={20} />
            <span>Generate Document Preview</span>
          </button>

          {content && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={\`mt-8 p-6 rounded-xl border \${isDarkMode ? 'bg-gray-900 border-gray-700 shadow-inner' : 'bg-gray-50 border-gray-200 shadow-inner'}\`}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-4 dark:border-gray-700 border-gray-200">
                <h3 className={\`font-bold \${isDarkMode ? 'text-gray-200' : 'text-gray-800'}\`}>Generated Document</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyResult(content)}
                    className={\`p-2.5 rounded-lg border transition-colors flex items-center space-x-2 \${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}\`}
                    title="Copy to clipboard"
                  >
                    <Copy size={16} /> <span className="text-xs font-semibold">Copy</span>
                  </button>
                  <button
                    onClick={() => {
                        const blob = new Blob([content], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = \`\${toolName.replace(/\s+/g, '-').toLowerCase()}-preview.txt\`;
                        a.click();
                        URL.revokeObjectURL(url);
                    }}
                    className={\`p-2.5 rounded-lg border transition-colors flex items-center space-x-2 \${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}\`}
                    title="Download as TXT"
                  >
                    <Download size={16} /> <span className="text-xs font-semibold">Download</span>
                  </button>
                </div>
              </div>
              <pre className={\`whitespace-pre-wrap font-mono text-sm leading-relaxed \${isDarkMode ? 'text-gray-300' : 'text-gray-700'}\`}>
                {content}
              </pre>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ${c.name};
`;

    fs.writeFileSync(path.join(dir, c.file), content);
});

console.log('Successfully generated 14 Document Maker tool components.');
