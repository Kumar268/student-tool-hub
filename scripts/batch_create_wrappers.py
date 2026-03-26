#!/usr/bin/env python3
"""
Batch Create Missing Wrapper Pages for StudentToolHub

Usage:
    python scripts/batch_create_wrappers.py

This script:
1. Reads all tools from src/data/tools.js
2. Checks which wrapper pages already exist in src/pages/tools/
3. Creates missing pages using the template
4. Shows a summary of created files

Requires: Python 3.6+
"""

import os
import re
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# TOOL METADATA MAPPING: slug → (ComponentName, ToolName, Category, Emoji)
# 
# Keep this synchronized with src/data/tools.js
# Format: 'slug-name': ('ComponentName', 'Display Name', 'category_folder', '📌')
# ─────────────────────────────────────────────────────────────────────────────

TOOL_METADATA = {
    # Academic Tools
    'calculus-solver': ('CalculusSolver', 'Calculus Solver', 'academic', '🚀'),
    'integral-calculator': ('IntegralCalculator', 'Integral Calculator', 'academic', '∫'),
    'matrix-algebra': ('MatrixAlgebra', 'Matrix Calculator', 'academic', '📊'),
    'basic-stats': ('BasicStats', 'Statistics Master', 'academic', '📈'),
    'projectile-simulator': ('ProjectileSimulator', 'Physics Simulator', 'academic', '🎯'),
    'chemistry-balancer': ('ChemistryBalancer', 'Chemistry Balancer', 'academic', '⚗️'),
    'circuit-designer': ('CircuitDesigner', 'Circuit Analyzer', 'academic', '⚡'),
    'economics-elasticity': ('EconomicsElasticity', 'Economics Tool', 'academic', '💹'),
    'unit-converter': ('UnitConverter', 'Unit Converter', 'academic', '📏'),
    'gpa-calculator': ('GPACalculator', 'GPA Calculator', 'academic', '🎓'),
    'scientific-calculator': ('scientificCalc', 'Scientific Calculator', 'academic', '🧮'),
    'quadratic-solver': ('QuadraticSolver', 'Quadratic Solver', 'academic', '📐'),

    # Financial Tools
    'loan-repayment': ('StudentLoanRepayment', 'Student Loan Estimator', 'financial', '💰'),
    'scholarship-roi': ('ScholarshipROICalc', 'Scholarship Finder', 'financial', '🏆'),
    'student-budgeting': ('StudentBudgeting', 'Student Budget Planner', 'financial', '💳'),
    'housing-calc': ('HousingCalc', 'Rent vs. Buy (Dorm) Calc', 'financial', '🏠'),
    'textbook-resale': ('TextbookResale', 'Textbook Buyback Calc', 'financial', '📚'),
    'moving-costs': ('MovingCosts', 'Relocation Calculator', 'financial', '🚚'),
    'emi-loan-calculator': ('EMILoanCalc', 'EMI / Loan Calculator', 'financial', '🏦'),
    'sip-calculator': ('SIPCalculator', 'SIP Calculator', 'financial', '📊'),
    'salary-calculator': ('salaryTax', 'Salary Calculator', 'financial', '💵'),

    # Utility Tools
    'final-grade-calc': ('FinalGradeCalc', 'Grade Calculator', 'utility', '🎯'),
    'pomodoro-timer': ('PomodoroTimer', 'Pomodoro Timer', 'utility', '⏱️'),
    'study-planner': ('StudyPlanner', 'Study Planner', 'utility', '📅'),
    'scientific-notation': ('ScientificNotation', 'Scientific Notation', 'utility', '#'),
    'assignment-tracker': ('AssignmentTracker', 'Assignment Tracker', 'utility', '✓'),
    'percentage-calc': ('PercentageCalc', 'Percentage Calculator', 'utility', '%'),
    'exam-weighting': ('ExamWeighting', 'Exam Weighting Calc', 'utility', '⚖️'),
    'date-difference': ('DateDifference', 'Date Difference', 'utility', '📆'),
    'age-calculator': ('AgeCalculator', 'Age Calculator', 'utility', '🎂'),

    # Niche Tools
    'rsa-demo': ('RSADemo', 'RSA Cryptography', 'niche', '🔐'),
    'truth-table': ('TruthTableGenerator', 'Truth Table Generator', 'niche', '⊕'),
    'astronomy-calc': ('AstronomyCalc', 'Astronomy Calculator', 'niche', '🔭'),
    'music-theory': ('MusicTheoryCalc', 'Music Theory Tool', 'niche', '🎵'),
    'nutrition-calc': ('NutritionCalc', 'Nutrition Tracker', 'niche', '🥗'),
    'carbon-footprint': ('CarbonFootprint', 'Carbon Footprint', 'niche', '🌱'),
    'binary-converter': ('BinaryConverter', 'Binary Converter', 'niche', '💾'),
    'typing-speed-test': ('TypingSpeedTest', 'Typing Speed Test', 'niche', '⌨️'),

    # Health Tools
    'bmi-calorie-calculator': ('BMIAndCalorie', 'BMI & Calorie Calculator', 'health', '🏋️'),
    'nutrition-calculator': ('NutritionCalc', 'Nutrition Calculator', 'health', '🥗'),
    'age-calculator-health': ('agecalc', 'Age Calculator', 'health', '🎂'),

    # Image Tools
    'image-resizer': ('ImageResizer', 'Image Resizer', 'image', '📏'),
    'image-compressor': ('ImageCompressor', 'Image Compressor', 'image', '📦'),
    'image-editor': ('ImageEditor', 'Basic Image Editor', 'image', '✏️'),
    'format-converter': ('FormatConverter', 'Format Converter', 'image', '🔄'),
    'background-remover': ('BackgroundRemover', 'Background Remover', 'image', '✂️'),
    'image-to-pdf': ('ImageToPDF', 'Image to PDF', 'image', '📄'),
    'screenshot-mockup': ('ScreenshotMockup', 'Screenshot Mockup', 'image', '🖼️'),

    # PDF Tools
    'pdf-merger-splitter': ('PDFMergeSplit', 'PDF Merger', 'pdf', '📎'),
    'pdf-splitter': ('PDFMergeSplit', 'PDF Splitter', 'pdf', '✂️'),
    'pdf-compressor': ('PDFCompressor', 'PDF Compressor', 'pdf', '📦'),
    'pdf-to-word': ('PDFToWord', 'PDF to Word', 'pdf', '📝'),
    'word-to-pdf': ('WordToPDF', 'Word to PDF', 'pdf', '📄'),
    'pdf-unlock': ('PDFUnlock', 'PDF Password Remover', 'pdf', '🔓'),

    # Text Tools
    'word-counter': ('WordCounter', 'Word Counter', 'text', '📊'),
    'grammar-checker': ('GrammarChecker', 'Grammar Checker', 'text', '✏️'),
    'text-formatter': ('TextFormatter', 'Text Formatter', 'text', '🎨'),
    'case-converter': ('CaseConverter', 'Case Converter', 'text', '🔤'),
    'plagiarism-check': ('PlagiarismCheck', 'Plagiarism Checker', 'text', '🔍'),

    # Audio Tools
    'audio-converter': ('AudioConverter', 'Audio Converter', 'audio', '🔄'),
    'voice-recorder': ('VoiceRecorder', 'Voice Recorder', 'audio', '🎤'),
    'tts-converter': ('TextToSpeech', 'Text to Speech', 'audio', '🔊'),

    # Developer Tools
    'code-formatter': ('CodeFormatter', 'JSON Formatter', 'developer', '💻'),
    'css-minifier': ('CSSMinifier', 'CSS Minifier', 'developer', '🎨'),
    'html-previewer': ('HTMLPreviewer', 'HTML Previewer', 'developer', '👁️'),
    'color-picker': ('ColorPicker', 'Color Picker', 'developer', '🎨'),
    'qr-generator': ('QRGenerator', 'QR Generator', 'developer', '📱'),
    'password-generator': ('PasswordGenerator', 'Password Generator', 'developer', '🔐'),

    # Document Maker Tools
    'resume-maker': ('ResumeMaker', 'Resume Maker', 'documentmaker', '👔'),
    'cv-maker': ('CVMaker', 'CV Maker', 'documentmaker', '🎓'),
    'biodata-maker': ('BiodataMaker', 'Biodata Maker', 'documentmaker', '👤'),
    'cover-letter-generator': ('CoverLetterGenerator', 'Cover Letter Generator', 'documentmaker', '💌'),
    'linkedin-summary': ('LinkedInSummaryGen', 'LinkedIn Summary Gen', 'documentmaker', '🔗'),
    'job-tracker': ('JobApplicationTracker', 'Job Application Tracker', 'documentmaker', '📋'),
    'research-outline': ('ResearchPaperOutline', 'Research Paper Outline', 'documentmaker', '📚'),
    'reference-generator': ('ReferenceGenerator', 'Reference Generator', 'documentmaker', '📖'),
    'lab-report': ('LabReportBuilder', 'Lab Report Builder', 'documentmaker', '🧪'),
    'cover-page': ('AssignmentCoverPage', 'Assignment Cover Page', 'documentmaker', '📄'),
    'scholarship-letter': ('ScholarshipLatter', 'Scholarship Application', 'documentmaker', '🏆'),
    'sop-generator': ('SOPGenerator', 'SOP Generator', 'documentmaker', '📝'),
    'recommendation-letter': ('RecommendationLetter', 'Recommendation Letter', 'documentmaker', '✉️'),
    'internship-letter': ('InternshipLetter', 'Internship Application', 'documentmaker', '💼'),
}

WRAPPER_TEMPLATE = '''\
import React from 'react';
import ToolPageLayout from '@/components/ToolPageLayout';
import {component_name} from '@/tools/{category}/{component_name}';

function {component_name}Extras() {{
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        💡 Quick Tips
      </h3>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
        <li>Use this tool to streamline your workflow</li>
        <li>Check the sidebar for related tools</li>
        <li>Save your results for future reference</li>
      </ul>
    </div>
  );
}}

export default function {component_name}Page() {{
  return (
    <ToolPageLayout
      title="{tool_name}"
      icon="{emoji}"
      extraFeatures={<{component_name}Extras />}
      adClient={{import.meta.env.VITE_ADSENSE_PUB_ID}}
      adSlots={{{{
        video: import.meta.env.VITE_VIDEO_AD_SLOT,
        top: import.meta.env.VITE_BANNER_AD_SLOT,
        middle: import.meta.env.VITE_DISPLAY_AD_SLOT,
        bottom: import.meta.env.VITE_BANNER_AD_SLOT,
      }}}}
    >
      <{component_name} isDarkMode={{false}} />
    </ToolPageLayout>
  );
}}
'''


def main():
    # Get project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    pages_dir = project_root / 'src' / 'pages' / 'tools'
    
    # Create pages directory if it doesn't exist
    pages_dir.mkdir(parents=True, exist_ok=True)
    
    print('🚀 Starting batch wrapper page creation...\n')
    print(f'📁 Output directory: {pages_dir}\n')
    
    created = 0
    skipped = 0
    errors = 0
    
    # Process each tool
    for slug, (component_name, tool_name, category, emoji) in sorted(TOOL_METADATA.items()):
        page_file = pages_dir / f'{component_name}Page.jsx'
        
        # Check if file already exists
        if page_file.exists():
            print(f'⏭️  SKIP: {component_name}Page.jsx (already exists)')
            skipped += 1
            continue
        
        try:
            # Generate content from template
            content = WRAPPER_TEMPLATE.format(
                component_name=component_name,
                category=category,
                tool_name=tool_name,
                emoji=emoji
            )
            
            # Write file
            page_file.write_text(content, encoding='utf-8')
            print(f'✅ CREATE: {component_name}Page.jsx ({slug})')
            created += 1
            
        except Exception as e:
            print(f'❌ ERROR: {component_name}Page.jsx - {str(e)}')
            errors += 1
    
    # Print summary
    print('\n' + '='*70)
    print(f'📊 SUMMARY')
    print('='*70)
    print(f'✅ Created: {created} files')
    print(f'⏭️  Skipped: {skipped} files (already exist)')
    print(f'❌ Errors:  {errors} files')
    print(f'📊 Total:   {created + skipped + errors} tools')
    print('='*70)
    
    if created > 0:
        print(f'\n✨ Successfully created {created} wrapper pages!')
        print('   Next step: Update Router.jsx to use these pages')
    elif errors == 0:
        print('\n✅ All wrapper pages already exist!')
    else:
        print(f'\n⚠️  {errors} errors occurred. Check output above.')
        sys.exit(1)


if __name__ == '__main__':
    main()
