/**
 * ACCESSIBLE COMPONENT EXAMPLES
 * 
 * This file contains accessibility-enhanced versions of common components
 * used throughout the Student Tool Hub application.
 * 
 * Key Improvements:
 * - Proper ARIA labels and roles
 * - Keyboard navigation support
 * - Focus management with visible indicators
 * - Screen reader announcements
 * - Semantic HTML elements
 */

import React, { useState } from 'react';
import { Calculator, Download, Upload, Trash2, Plus, Minus } from 'lucide-react';

// ============================================================================
// 1. ACCESSIBLE TOOL BUTTON
// ============================================================================

/**
 * Primary action button for tools (Calculate, Convert, Generate, etc.)
 * 
 * Features:
 * - Clear aria-label describing the action
 * - Visible focus ring
 * - Disabled state properly announced
 * - Loading state with aria-live announcement
 */
export const AccessibleToolButton = ({ 
  onClick, 
  label = 'Calculate',
  icon: Icon = Calculator,
  disabled = false,
  loading = false,
  isDarkMode = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={loading ? `${label} in progress` : label}
      aria-busy={loading}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg 
        font-semibold text-base transition-all
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${loading || disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105 active:scale-95'
        }
        ${isDarkMode 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
        }
        ${className}
      `}
    >
      {loading ? (
        <>
          <div 
            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
            aria-hidden="true"
          />
          <span>Processing...</span>
        </>
      ) : (
        <>
          <Icon size={20} aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

// ============================================================================
// 2. ACCESSIBLE INPUT FIELD
// ============================================================================

/**
 * Form input with proper label association and error handling
 * 
 * Features:
 * - Label properly associated with input
 * - Error messages announced to screen readers
 * - Required field indication
 * - Clear focus styles
 */
export const AccessibleInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error = '',
  helpText = '',
  isDarkMode = false,
  className = ''
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;
  const helpId = `${inputId}-help`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={inputId}
        className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={`${error ? errorId : ''} ${helpText ? helpId : ''}`.trim() || undefined}
        className={`
          w-full px-4 py-2 rounded-lg border transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : isDarkMode 
              ? 'bg-gray-900/50 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }
        `}
      />
      
      {helpText && !error && (
        <p id={helpId} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId} 
          role="alert"
          className="text-xs text-red-500 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};

// ============================================================================
// 3. ACCESSIBLE SELECT DROPDOWN
// ============================================================================

/**
 * Select dropdown with proper labeling
 * 
 * Features:
 * - Label association
 * - Keyboard navigation (native select)
 * - Clear focus styles
 */
export const AccessibleSelect = ({
  id,
  label,
  value,
  onChange,
  options = [],
  required = false,
  isDarkMode = false,
  className = ''
}) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={selectId}
        className={`block text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required}
        className={`
          w-full px-4 py-2 rounded-lg border transition-all
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${isDarkMode 
            ? 'bg-gray-900/50 border-gray-700 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
          }
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ============================================================================
// 4. ACCESSIBLE ICON BUTTON
// ============================================================================

/**
 * Icon-only button with proper labeling
 * 
 * Features:
 * - Descriptive aria-label (no visible text)
 * - Icon marked as decorative
 * - Clear focus indicator
 */
export const AccessibleIconButton = ({
  onClick,
  icon: Icon,
  label,
  variant = 'default', // 'default' | 'danger' | 'success'
  isDarkMode = false,
  className = ''
}) => {
  const variantStyles = {
    default: isDarkMode 
      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
    danger: 'hover:bg-red-500/10 text-red-500 hover:text-red-600',
    success: 'hover:bg-green-500/10 text-green-500 hover:text-green-600'
  };

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        p-2 rounded-lg transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-500
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
};

// ============================================================================
// 5. ACCESSIBLE FILE UPLOAD
// ============================================================================

/**
 * File upload button with drag-and-drop support
 * 
 * Features:
 * - Keyboard accessible
 * - Clear instructions
 * - File type and size announced
 */
export const AccessibleFileUpload = ({
  onFileSelect,
  accept = '*',
  maxSize = 10, // MB
  isDarkMode = false,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputId = 'file-upload-input';

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center w-full h-32 
          border-2 border-dashed rounded-lg cursor-pointer transition-all
          focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
          ${dragActive 
            ? 'border-blue-500 bg-blue-500/10' 
            : isDarkMode 
              ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
        `}
      >
        <Upload 
          size={32} 
          className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}
          aria-hidden="true"
        />
        <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Max file size: {maxSize}MB
        </p>
        
        <input
          id={inputId}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="sr-only"
          aria-label={`Upload file, maximum size ${maxSize} megabytes`}
        />
      </label>
    </div>
  );
};

// ============================================================================
// 6. ACCESSIBLE RESULT DISPLAY
// ============================================================================

/**
 * Result display with live region announcement
 * 
 * Features:
 * - Results announced to screen readers
 * - Clear visual hierarchy
 * - Copy functionality
 */
export const AccessibleResultDisplay = ({
  label,
  value,
  unit = '',
  onCopy,
  isDarkMode = false,
  className = ''
}) => {
  return (
    <div 
      className={`
        p-6 rounded-xl border
        ${isDarkMode 
          ? 'bg-blue-900/20 border-blue-700/30' 
          : 'bg-blue-50 border-blue-200'
        }
        ${className}
      `}
      role="region"
      aria-label="Calculation result"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {label}
          </p>
          <p 
            className={`text-3xl font-bold mt-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {value} {unit && <span className="text-xl">{unit}</span>}
          </p>
        </div>
        
        {onCopy && (
          <AccessibleIconButton
            onClick={onCopy}
            icon={Download}
            label={`Copy ${label}`}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// 7. ACCESSIBLE COUNTER INPUT
// ============================================================================

/**
 * Number input with increment/decrement buttons
 * 
 * Features:
 * - Keyboard accessible (arrow keys work in input)
 * - Button labels describe action
 * - Min/max values enforced
 */
export const AccessibleCounter = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  isDarkMode = false,
  className = ''
}) => {
  const handleIncrement = () => {
    if (value < max) onChange(value + step);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - step);
  };

  const handleInputChange = (e) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className={`block text-sm font-medium ${
        isDarkMode ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </label>
      
      <div className="flex items-center gap-2">
        <AccessibleIconButton
          onClick={handleDecrement}
          icon={Minus}
          label={`Decrease ${label}`}
          isDarkMode={isDarkMode}
          className="flex-shrink-0"
        />
        
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          className={`
            w-20 px-3 py-2 text-center rounded-lg border transition-all
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${isDarkMode 
              ? 'bg-gray-900/50 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
            }
          `}
        />
        
        <AccessibleIconButton
          onClick={handleIncrement}
          icon={Plus}
          label={`Increase ${label}`}
          isDarkMode={isDarkMode}
          className="flex-shrink-0"
        />
      </div>
    </div>
  );
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*

// Example 1: Tool Calculate Button
<AccessibleToolButton
  onClick={handleCalculate}
  label="Calculate GPA"
  icon={Calculator}
  loading={isCalculating}
  isDarkMode={isDarkMode}
/>

// Example 2: Form Input
<AccessibleInput
  label="Course Name"
  value={courseName}
  onChange={(e) => setCourseName(e.target.value)}
  required
  error={errors.courseName}
  helpText="Enter the name of your course"
  isDarkMode={isDarkMode}
/>

// Example 3: Select Dropdown
<AccessibleSelect
  label="Grading Scale"
  value={scale}
  onChange={(e) => setScale(e.target.value)}
  options={[
    { value: '4.0', label: '4.0 Scale' },
    { value: '5.0', label: '5.0 Scale' },
    { value: '10.0', label: '10.0 Scale' }
  ]}
  required
  isDarkMode={isDarkMode}
/>

// Example 4: Icon Button (Delete)
<AccessibleIconButton
  onClick={() => removeCourse(courseId)}
  icon={Trash2}
  label="Delete course"
  variant="danger"
  isDarkMode={isDarkMode}
/>

// Example 5: File Upload
<AccessibleFileUpload
  onFileSelect={handleFileUpload}
  accept=".pdf,.doc,.docx"
  maxSize={5}
  isDarkMode={isDarkMode}
/>

// Example 6: Result Display
<AccessibleResultDisplay
  label="Your GPA"
  value="3.85"
  onCopy={() => copyToClipboard('3.85')}
  isDarkMode={isDarkMode}
/>

// Example 7: Counter
<AccessibleCounter
  label="Credit Hours"
  value={credits}
  onChange={setCredits}
  min={1}
  max={6}
  isDarkMode={isDarkMode}
/>

*/
