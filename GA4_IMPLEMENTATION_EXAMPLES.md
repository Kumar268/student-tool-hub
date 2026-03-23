# GA4 Analytics Implementation Examples

Copy these examples into your tool components. Each shows real-world tracking patterns.

---

## Example 1: Simple Calculator Tool

File: `src/tools/utility/GPA​Calculator.jsx`

```jsx
import React, { useState } from 'react';
import { trackToolUsage, trackExport, trackError } from '../../utils/analytics';

const GPACalculator = ({ isDarkMode }) => {
  const [grades, setGrades] = useState([]);
  const [gpa, setGPA] = useState(null);

  const calculateGPA = () => {
    try {
      if (grades.length === 0) {
        alert('Add grades first');
        return;
      }

      const totalGrade = grades.reduce((sum, g) => sum + (g.grade * g.credit), 0);
      const totalCredit = grades.reduce((sum, g) => sum + g.credit, 0);
      const calculatedGPA = totalGrade / totalCredit;

      setGPA(calculatedGPA);

      // ✅ TRACK: User calculated GPA
      trackToolUsage('calculate', 'GPA Calculator', 'utility');

    } catch (error) {
      // ✅ TRACK: Error occurred
      trackError('gpa_calculation_failed', 'GPA Calculator', error.message);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(`GPA: ${gpa.toFixed(2)}`);
    
    // ✅ TRACK: User copied result
    trackExport('copy', 'GPA Calculator');
  };

  const downloadPDF = () => {
    // ... PDF generation code ...
    
    // ✅ TRACK: User downloaded PDF
    trackExport('pdf', 'GPA Calculator');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <h1>GPA Calculator</h1>
      
      {/* Grade input UI */}
      <input type="number" placeholder="Grade" />
      <input type="number" placeholder="Credits" />
      
      {/* Actions */}
      <button onClick={calculateGPA}>
        Calculate GPA
      </button>

      {gpa && (
        <>
          <p>Your GPA: {gpa.toFixed(2)}</p>
          <button onClick={copyResult}>Copy</button>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}
    </div>
  );
};

export default GPACalculator;
```

---

## Example 2: Conversion Tool

File: `src/tools/image/ImageConverter.jsx`

```jsx
import React, { useState } from 'react';
import { trackToolUsage, trackExport, trackError } from '../../utils/analytics';

const ImageConverter = ({ isDarkMode }) => {
  const [image, setImage] = useState(null);
  const [format, setFormat] = useState('png');

  const convertImage = async (targetFormat) => {
    try {
      // ✅ TRACK: User started conversion
      trackToolUsage('convert', 'Image Converter', 'image');

      // Simulate conversion
      const canvas = document.createElement('canvas');
      // ... conversion logic ...

      // ✅ TRACK: Export with specific format
      trackExport(targetFormat.toLowerCase(), 'Image Converter');

      // Download starts
      const link = document.createElement('a');
      link.href = canvas.toDataURL(`image/${targetFormat.toLowerCase()}`);
      link.download = `image.${targetFormat.toLowerCase()}`;
      link.click();

    } catch (error) {
      trackError('conversion_error', 'Image Converter', error.message);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <h1>Image Converter</h1>
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setImage(e.target.files[0])} 
      />

      <div>
        <button onClick={() => convertImage('png')}>Convert to PNG</button>
        <button onClick={() => convertImage('jpeg')}>Convert to JPEG</button>
        <button onClick={() => convertImage('webp')}>Convert to WEBP</button>
      </div>
    </div>
  );
};

export default ImageConverter;
```

**GA4 Data You'll See:**
- `convert` action → Most used conversion feature
- `export` actions → Most popular output formats
- Error tracking → Which conversions fail most

---

## Example 3: Document Generator

File: `src/tools/documentmaker/ResumeBuild​er.jsx`

```jsx
import React, { useState } from 'react';
import { trackToolUsage, trackExport, trackError } from '../../utils/analytics';

const ResumeBuilder = ({ isDarkMode }) => {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    experience: []
  });

  const generateResume = () => {
    try {
      // ✅ TRACK: User generated resume
      trackToolUsage('generate', 'Resume Builder', 'documentmaker');

      // ... generation logic ...
    } catch (error) {
      trackError('generation_failed', 'Resume Builder', error.message);
    }
  };

  const exportResume = (format) => {
    try {
      if (format === 'pdf') {
        // ... PDF export ...
      } else if (format === 'docx') {
        // ... DOCX export ...
      }

      // ✅ TRACK: Export with format
      trackExport(format, 'Resume Builder');

    } catch (error) {
      trackError('export_failed', 'Resume Builder', error.message);
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <h1>Resume Builder</h1>
      
      {/* Form fields */}
      <input placeholder="Your Name" />
      <input placeholder="Email" />
      
      {/* Actions */}
      <button onClick={generateResume}>Generate Resume</button>
      
      <div>
        <button onClick={() => exportResume('pdf')}>Download as PDF</button>
        <button onClick={() => exportResume('docx')}>Download as DOCX</button>
        <button onClick={() => exportResume('print')}>Print</button>
      </div>
    </div>
  );
};

export default ResumeBuilder;
```

---

## Example 4: PDF Tool with Complex Workflow

File: `src/tools/pdf/PDFMerger.jsx`

```jsx
import React, { useState } from 'react';
import { trackToolUsage, trackExport, trackError, trackEvent } from '../../utils/analytics';

const PDFMerger = ({ isDarkMode }) => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
    
    // ✅ TRACK: Files uploaded
    trackEvent('files_uploaded', {
      tool_name: 'PDF Merger',
      file_count: newFiles.length,
      total_files: files.length + newFiles.length,
    });
  };

  const mergePDFs = async () => {
    try {
      if (files.length < 2) {
        alert('Upload at least 2 PDFs');
        return;
      }

      // ✅ TRACK: Merge action
      trackToolUsage('merge', 'PDF Merger', 'pdf');

      // ... merge logic ...

      // ✅ TRACK: Export after merge
      setTimeout(() => {
        trackExport('pdf', 'PDF Merger');
      }, 500);

    } catch (error) {
      trackError('merge_failed', 'PDF Merger', error.message);
    }
  };

  const splitPDF = async (file) => {
    try {
      // ✅ TRACK: Split action
      trackToolUsage('split', 'PDF Splitter', 'pdf');

      // ... split logic ...

      trackExport('pdf', 'PDF Splitter');

    } catch (error) {
      trackError('split_failed', 'PDF Splitter', error.message);
    }
  };

  const resetFiles = () => {
    setFiles([]);
    
    // ✅ OPTIONAL: Track reset (useful for understanding usage patterns)
    trackEvent('reset_clicked', {
      tool_name: 'PDF Merger',
      files_cleared: files.length,
    });
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <h1>PDF Tools</h1>
      
      <div className="upload-area">
        <input 
          type="file" 
          multiple 
          accept=".pdf" 
          onChange={handleFileUpload}
        />
        <p>Files uploaded: {files.length}</p>
      </div>

      <div className="actions">
        <button onClick={mergePDFs} disabled={files.length < 2}>
          Merge PDFs
        </button>
        <button onClick={resetFiles}>Reset</button>
      </div>

      <div className="file-list">
        {files.map((file, idx) => (
          <div key={idx}>
            <span>{file.name}</span>
            <button onClick={() => splitPDF(file)}>Split</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFMerger;
```

---

## Example 5: Multi-Purpose Tool with Error Tracking

File: `src/tools/academic/MatrixAlgebra.jsx`

```jsx
import React, { useState } from 'react';
import { trackToolUsage, trackExport, trackError, trackEvent } from '../../utils/analytics';
import * as math from 'mathjs';

const MatrixAlgebra = ({ isDarkMode }) => {
  const [matrixA, setMatrixA] = useState('');
  const [matrixB, setMatrixB] = useState('');
  const [result, setResult] = useState(null);

  const performOperation = (operation) => {
    try {
      // Validate input
      if (!matrixA || !matrixB) {
        alert('Enter both matrices');
        return;
      }

      const a = math.matrix(JSON.parse(matrixA));
      const b = math.matrix(JSON.parse(matrixB));

      let res;
      switch(operation) {
        case 'add':
          res = math.add(a, b);
          break;
        case 'multiply':
          res = math.multiply(a, b);
          break;
        case 'determinant':
          res = math.det(a);
          break;
        case 'inverse':
          res = math.inv(a);
          break;
        default:
          return;
      }

      setResult(res);

      // ✅ TRACK: Operation performed
      trackToolUsage(operation, 'Matrix Algebra', 'academic');

      // ✅ OPTIONAL: Track specific operations for advanced analytics
      trackEvent('matrix_operation', {
        operation_type: operation,
        matrix_a_size: `${a.size()[0]}x${a.size()[1]}`,
        matrix_b_size: b.size ? `${b.size()[0]}x${b.size()[1]}` : 'scalar',
      });

    } catch (error) {
      // ✅ TRACK: Errors for debugging
      trackError('operation_failed', 'Matrix Algebra', error.message);
      alert('Invalid matrix format');
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(JSON.stringify(result));
    trackExport('copy', 'Matrix Algebra');
  };

  const downloadAsCSV = () => {
    // ... CSV generation ...
    trackExport('csv', 'Matrix Algebra');
  };

  const downloadAsJSON = () => {
    // ... JSON generation ...
    trackExport('json', 'Matrix Algebra');
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <h1>Matrix Algebra</h1>
      
      <textarea 
        placeholder='Matrix A: [[1,2],[3,4]]'
        value={matrixA}
        onChange={(e) => setMatrixA(e.target.value)}
      />
      
      <textarea 
        placeholder='Matrix B: [[5,6],[7,8]]'
        value={matrixB}
        onChange={(e) => setMatrixB(e.target.value)}
      />

      <div className="operations">
        <button onClick={() => performOperation('add')}>Add</button>
        <button onClick={() => performOperation('multiply')}>Multiply</button>
        <button onClick={() => performOperation('determinant')}>Determinant</button>
        <button onClick={() => performOperation('inverse')}>Inverse</button>
      </div>

      {result && (
        <div className="result">
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <button onClick={copyResult}>Copy</button>
          <button onClick={downloadAsCSV}>Download as CSV</button>
          <button onClick={downloadAsJSON}>Download as JSON</button>
        </div>
      )}
    </div>
  );
};

export default MatrixAlgebra;
```

---

## Pattern: Best Practices

### ✅ DO Track These

```javascript
// User completes a calculation
trackToolUsage('calculate', 'Tool Name', 'category');

// User exports/downloads result
trackExport('pdf', 'Tool Name');

// User copies result
trackExport('copy', 'Tool Name');

// Tool encounters an error
trackError('invalid_input', 'Tool Name', 'error details');

// User searches for tools
trackSearch('python calculator', 3); // 3 results found

// User uploads a file
trackEvent('file_uploaded', {
  tool_name: 'PDF Merger',
  file_size: 1024000, // bytes
  file_type: 'application/pdf'
});
```

### ❌ DON'T Track These

```javascript
// ❌ Personal information
trackEvent('user_email', { email: 'user@example.com' }); // WRONG

// ❌ Passwords or sensitive data
trackEvent('password_entered', { password: '***' }); // WRONG

// ❌ Every single keystroke
trackEvent('key_pressed', { key: 'a' }); // Too noisy

// ❌ Internal/debug events
trackEvent('internal_state_change', { state: x }); // Not useful
```

### ✅ DO Use Meaningful Names

```javascript
// ✅ GOOD - Clear action names
trackToolUsage('calculate', 'GPA Calculator', 'utility');
trackToolUsage('convert', 'Image Converter', 'image');
trackToolUsage('generate', 'Resume Builder', 'documentmaker');
trackToolUsage('merge', 'PDF Merger', 'pdf');
trackToolUsage('split', 'PDF Splitter', 'pdf');

// ❌ BAD - Unclear action names
trackToolUsage('click', 'Tool', 'misc');
trackToolUsage('process', 'Something', 'other');
trackToolUsage('do_stuff', 'Tool Name', 'category');
```

---

## Template: Add to Your Tool

Copy this template into any tool component:

```jsx
import { trackToolUsage, trackExport, trackError, trackEvent } from '../../utils/analytics';

// At the start of main action:
trackToolUsage('action_name', 'Tool Name', 'category');

// When exporting/downloading:
trackExport('format', 'Tool Name');

// On errors:
trackError('error_type', 'Tool Name', error.message);

// For custom events:
trackEvent('event_name', { additional_data: value });
```

---

## Viewing Results in GA4

After implementing tracking, view your data:

**Most Used Tools:**
```
Google Analytics Dashboard
  → Reports  
  → Events
  → Filter: event_category = "tool_usage"
  → View by: tool_name
```

**Export Formats:**
```
Google Analytics Dashboard
  → Reports
  → Events
  → Filter: event_category = "tool_export"
  → View by: export_type
```

**Error Tracking:**
```
Google Analytics Dashboard
  → Reports
  → Events
  → Filter: event_category = "tool_error"
  → View by: error_type (find bugs!)
```

---

Done! Copy-paste these examples into your tools and you'll have full analytics tracking. 🎉
