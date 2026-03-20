import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, BookOpen, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import SolutionStep from '../../components/SolutionStep';
import { BlockMath } from 'react-katex';

const PercentageCalc = ({ isDarkMode }) => {
  const [mode, setMode] = useState('find_percent');
  const [val1, setVal1] = useState(25);
  const [val2, setVal2] = useState(200);

  const calculation = useMemo(() => {
    const v1 = parseFloat(val1) || 0;
    const v2 = parseFloat(val2) || 0;
    
    if (mode === 'find_percent') {
      const res = (v1 / v2) * 100;
      return {
        result: res.toFixed(2),
        formula: `\\text{Percentage} = \\left( \\frac{${v1}}{${v2}} \\right) \\times 100 = ${res.toFixed(2)}\\%`
      };
    } else if (mode === 'find_value') {
      const res = (v1 / 100) * v2;
      return {
        result: res.toFixed(2),
        formula: `\\text{Value} = \\left( \\frac{${v1}}{100} \\right) \\times ${v2} = ${res.toFixed(2)}`
      };
    } else {
      const res = ((v2 - v1) / v1) * 100;
      return {
        result: res.toFixed(2),
        formula: `\\text{Change} = \\left( \\frac{${v2} - ${v1}}{${v1}} \\right) \\times 100 = ${res.toFixed(2)}\\%`
      };
    }
  }, [mode, val1, val2]);

  return (
    <div className="space-y-8">
      {/* AdSense Placeholder Top */}

      {/* Calculator Interface */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={() => setMode('find_percent')} className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'find_percent' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>What is % of X in Y?</button>
          <button onClick={() => setMode('find_value')} className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'find_value' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>What is X% of Y?</button>
          <button onClick={() => setMode('find_change')} className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === 'find_change' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>% Increase/Decrease</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-2">
            <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {mode === 'find_percent' ? 'Part' : mode === 'find_value' ? 'Percentage' : 'Initial Value'}
            </label>
            <input
              type="number"
              value={val1}
              onChange={(e) => setVal1(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {mode === 'find_percent' || mode === 'find_value' ? 'Whole' : 'Final Value'}
            </label>
            <input
              type="number"
              value={val2}
              onChange={(e) => setVal2(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Result</label>
            <div className={`w-full px-4 py-3 rounded-xl border font-bold text-xl flex items-center justify-center min-h-[56px] ${
              isDarkMode ? 'bg-blue-900/20 border-blue-700/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
            }`}>
              {calculation.result}{mode === 'find_value' ? '' : '%'}
            </div>
          </div>
        </div>
      </div>

      {/* Solution Engine Section */}
      <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex items-center space-x-3 mb-8">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
            <Percent size={24} />
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Step-by-Step Calculation</h2>
        </div>

        <div className="space-y-6">
          <SolutionStep
            stepNumber={1}
            title="Identify the Values"
            description={`We have two numbers: ${val1} and ${val2}. We need to calculate their ${mode.replace('_', ' ')} relationship.`}
            isDarkMode={isDarkMode}
          />
          
          <SolutionStep
            stepNumber={2}
            title="Apply the Percentage Formula"
            description="We use the mathematical formula for the chosen mode."
            formula={calculation.formula}
            isDarkMode={isDarkMode}
          />

          <SolutionStep
            stepNumber={3}
            title="Final Interpretation"
            description={`The final result is ${calculation.result}${mode === 'find_value' ? '' : '%'}. This represents the relationship between your values.`}
            isLast={true}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* SEO Article */}
      <article className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <BookOpen size={24} />
          </div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mastering Percentage Calculations: A Student's Essential Toolkit</h2>
        </div>

        <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert prose-gray-300' : 'prose-gray-600'}`}>
          <p>
            Percentages are everywhere—from calculating your test scores and determining sale prices while shopping to analyzing 
            statistical data in research. A percentage represents a part of a whole, specifically scaled to a total of 100.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">The Three Common Types of Percentage Problems</h3>
          <p>Most percentage questions fall into one of three categories, which our calculator handles effortlessly:</p>
          
          <h4 className="text-xl font-bold mt-6 mb-2">1. Finding the Percentage of a Whole</h4>
          <p>This is used when you know the part and the total, and want to know the percentage. <strong>Example:</strong> "If I got 18 out of 20 on a quiz, what percentage is that?" (Answer: 90%).</p>

          <h4 className="text-xl font-bold mt-6 mb-2">2. Finding the Value from a Percentage</h4>
          <p>This is used when you know the percentage and the total, and want to know the numerical value. <strong>Example:</strong> "A store is offering 20% off a $50 shirt. How much is the discount?" (Answer: $10).</p>

          <h4 className="text-xl font-bold mt-6 mb-2">3. Percentage Increase or Decrease</h4>
          <p>This is used to measure change over time. <strong>Example:</strong> "If a stock went from $100 to $120, what was the percentage increase?" (Answer: 20% increase).</p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Why Is This Important for Students?</h3>
          <p>
            Understanding percentages helps students make better decisions. It allows you to compare different sets of data fairly, 
            understand interest rates on student loans, and calculate weighted averages in your GPA.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Mastering the Three Types of Percentage Calculations</h3>
          <p>
            Percentages are everywhere—from sales tax at the grocery store to interest rates on a savings account. 
            Understanding the different ways we calculate percentages is key to financial literacy and academic success. 
            Our tool covers the three most common scenarios you'll encounter:
          </p>

          <h4 className="text-xl font-bold mt-6 mb-2">1. Finding the Percentage (Part/Whole)</h4>
          <p>
            This is the most basic form of percentage. You have a 'part' and a 'whole', and you want to know what portion 
            the part represents. For example, if you got 45 out of 50 on a test, you'd calculate \( (45/50) \times 100 \) 
             to find that you earned a 90%. This is essential for tracking your grades and performance.
          </p>

          <h4 className="text-xl font-bold mt-6 mb-2">2. Finding the Value (Percentage of Whole)</h4>
          <p>
            Here, you know the percentage and the total amount, and you want to find the specific value. This is 
            incredibly useful for calculating discounts. If a $200 jacket is 25% off, you'd calculate \( 0.25 \times 200 \) 
            to find that the discount is $50.
          </p>

          <h4 className="text-xl font-bold mt-6 mb-2">3. Percentage Increase and Decrease</h4>
          <p>
            This measures how much a value has changed relative to its starting point. It's used to track everything 
            from stock market growth to inflation. If your rent goes from $1,000 to $1,100, that's a 10% increase. 
            The formula involves finding the difference and dividing it by the original (initial) value.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Real-World Applications for Students</h3>
          <ul>
            <li><strong>Financial Literacy:</strong> Calculating interest on student loans or credit cards.</li>
            <li><strong>Statistics:</strong> Interpreting data in social science or biology labs.</li>
            <li><strong>Shopping:</strong> Comparing 'Buy One Get One' deals versus flat percentage discounts.</li>
            <li><strong>Health:</strong> Understanding nutritional labels and daily value percentages.</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">Tips for Fast Mental Percentage Math</h3>
          <p>
            While our calculator provides exact results, being able to estimate percentages in your head is a 
            valuable life skill. Here are some quick tricks:
          </p>
          <ul>
            <li><strong>The 10% Rule:</strong> To find 10% of any number, just move the decimal one place to the left.</li>
            <li><strong>The 1% Rule:</strong> To find 1%, move the decimal two places to the left.</li>
            <li><strong>Halving for 50%:</strong> 50% is just half. 25% is half of that.</li>
            <li><strong>Combining:</strong> To find 15% (common for tipping), find 10% and then add half of that amount (which is 5%).</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">Can a percentage be higher than 100?</h4>
              <p className="text-sm">Yes, if the value being compared is larger than the original reference point. For example, if a population doubles, that's a 100% increase, resulting in 200% of the original population.</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">What is the quickest way to calculate 10%?</h4>
              <p className="text-sm">To find 10% of any number, simply move the decimal point one place to the left. 10% of $150 is $15.00.</p>
            </div>
          </div>
        </div>
      </article>

      {/* AdSense Placeholder Bottom */}
      
    </div>
  );
};

export default PercentageCalc;
