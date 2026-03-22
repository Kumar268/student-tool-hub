import React, { useState, useMemo } from 'react';
import { Plus, Trash, ArrowRight, BookOpen, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleAd from '../../components/monetization/GoogleAd';
import AffiliateLink from '../../components/monetization/AffiliateLink';
import SolutionStep from '../../components/SolutionStep';

const scaleConfigs = {
  '4.0': {
    name: '4.0 Scale (Standard)',
    grades: {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    }
  },
  '5.0': {
    name: '5.0 Scale',
    grades: {
      'A+': 5.0, 'A': 5.0, 'A-': 4.7,
      'B+': 4.3, 'B': 4.0, 'B-': 3.7,
      'C+': 3.3, 'C': 3.0, 'C-': 2.7,
      'D+': 2.3, 'D': 2.0, 'F': 0.0
    }
  },
  '10.0': {
    name: '10.0 Scale',
    grades: {
      'O': 10.0, 'A+': 9.0, 'A': 8.0,
      'B+': 7.0, 'B': 6.0, 'C': 5.0,
      'P': 4.0, 'F': 0.0
    }
  },
  'CBSE': {
    name: 'CBSE (9.5 %)',
    grades: {
      'A1': 10.0, 'A2': 9.0, 'B1': 8.0,
      'B2': 7.0, 'C1': 6.0, 'C2': 5.0,
      'D': 4.0, 'E1': 0.0, 'E2': 0.0
    }
  }
};

const GPACalculator = ({ isDarkMode }) => {
  const [scale, setScale] = useState('4.0');
  const [courses, setCourses] = useState([
    { id: 1, name: 'Course 1', grade: 'A', credits: 3 },
    { id: 2, name: 'Course 2', grade: 'B', credits: 4 }
  ]);

  const addCourse = () => {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    const defaultGrade = Object.keys(scaleConfigs[scale].grades)[0];
    setCourses([...courses, { id: newId, name: `Course ${newId}`, grade: defaultGrade, credits: 3 }]);
  };

  const removeCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calculation = useMemo(() => {
    const currentScale = scaleConfigs[scale];
    
    const courseDetails = courses.map(course => {
      const points = currentScale.grades[course.grade] || 0;
      const qualityPoints = points * parseFloat(course.credits || 0);
      return { ...course, points, qualityPoints };
    });

    const totalQualityPoints = courseDetails.reduce((sum, c) => sum + c.qualityPoints, 0);
    const totalCredits = courseDetails.reduce((sum, c) => sum + parseFloat(c.credits || 0), 0);
    const totalPointsForCBSE = courseDetails.reduce((sum, c) => sum + c.points, 0);

    let gpa;
    if (scale === 'CBSE') {
      const cgpa = totalPointsForCBSE / courses.length;
      const percentage = cgpa * 9.5;
      gpa = `${cgpa.toFixed(2)} CGPA (${percentage.toFixed(1)}%)`;
    } else {
      gpa = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : '0.00';
    }

    // Save result to history if it changed significantly
    if (gpa !== '0.00' && gpa !== 'NaN') {
      const historyEntry = {
        name: 'GPA Calculation',
        slug: 'gpa-calculator',
        result: gpa,
        timestamp: new Date().toISOString()
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('tool_history') || '[]');
      const newHistory = [
        historyEntry,
        ...existingHistory.filter(item => item.slug !== 'gpa-calculator' || item.result !== gpa)
      ].slice(0, 10);
      
      localStorage.setItem('tool_history', JSON.stringify(newHistory));
    }

    return { courseDetails, totalQualityPoints, totalCredits, gpa, totalPointsForCBSE };
  }, [courses, scale]);

  const handleScaleChange = (newScale) => {
    setScale(newScale);
    // Reset grades to first available in new scale to avoid mismatch
    const defaultGrade = Object.keys(scaleConfigs[newScale].grades)[0];
    setCourses(courses.map(c => ({ ...c, grade: defaultGrade })));
  };

  return (
    <div className="space-y-8">

      {/* Scale Selector */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <label className={`block text-sm font-medium mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select Grading Scale</label>
        <div className="flex flex-wrap gap-3">
          {Object.entries(scaleConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleScaleChange(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                scale === key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {config.name}
            </button>
          ))}
        </div>
      </div>

      {/* Native Contextual Ad Placement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <GoogleAd slot="NATIVE_GPA_AD_SLOT" format="fluid" className="my-0" />
        <AffiliateLink 
          url="https://example.com/student-discount" 
          title="Student Discount Hub" 
          description="Get up to 60% off software, laptops, and textbooks with your .edu email"
          category="textbook"
        />
      </div>

      {/* Calculator Interface */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Course List</h3>
          <button
            onClick={addCourse}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            <span>Add Course</span>
          </button>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {courses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-5">
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                    placeholder="Course Name"
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                    }`}
                  />
                </div>
                <div className="md:col-span-3">
                  <select
                    value={course.grade}
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                    }`}
                  >
                    {Object.keys(scaleConfigs[scale].grades).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="md:col-span-3">
                  <input
                    type="number"
                    disabled={scale === 'CBSE'}
                    value={course.credits}
                    onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                    placeholder={scale === 'CBSE' ? 'N/A' : 'Credits'}
                    className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                      isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                    } ${scale === 'CBSE' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Result Display */}
        <div className={`mt-8 p-6 rounded-xl border ${isDarkMode ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-50 border-blue-200'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {scale === 'CBSE' ? 'Total Subjects' : 'Total Credit Hours'}
              </p>
              <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {scale === 'CBSE' ? courses.length : calculation.totalCredits}
              </h4>
            </div>
            {scale !== 'CBSE' && (
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Total Quality Points</p>
                <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{calculation.totalQualityPoints.toFixed(1)}</h4>
              </div>
            )}
            <div className={`p-4 px-8 rounded-xl ${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'} text-white shadow-lg shadow-blue-500/20`}>
              <p className="text-sm font-medium opacity-80">{scale === 'CBSE' ? 'Result' : 'Final GPA'}</p>
              <h4 className="text-4xl font-bold">{calculation.gpa}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Engine Section */}
      <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex items-center space-x-3 mb-8">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
            <Calculator size={24} />
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{scaleConfigs[scale].name} Solution Engine</h2>
        </div>

        <div className="space-y-6">
          <SolutionStep
            stepNumber={1}
            title="Map Letter Grades to Numeric Points"
            description={`We first convert each course's letter grade to its ${scaleConfigs[scale].name} numeric equivalent.`}
            isDarkMode={isDarkMode}
          />
          
          <div className={`ml-12 mb-8 overflow-x-auto rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <table className="w-full text-sm text-left">
              <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <tr>
                  <th className="px-6 py-3 font-semibold">Course</th>
                  <th className="px-6 py-3 font-semibold">Grade</th>
                  <th className="px-6 py-3 font-semibold">Point Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {calculation.courseDetails.map((c, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">{c.name}</td>
                    <td className="px-6 py-4 font-bold">{c.grade}</td>
                    <td className="px-6 py-4 text-blue-500 font-mono">{c.points.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {scale !== 'CBSE' ? (
            <>
              <SolutionStep
                stepNumber={2}
                title="Calculate Quality Points per Course"
                description="For each course, we multiply the numeric grade value by the number of credit hours. This gives us the 'Quality Points' for that specific course."
                isDarkMode={isDarkMode}
              />

              <div className="ml-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {calculation.courseDetails.map((c, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-blue-900/10 border-blue-500/20 shadow-glow-dark' : 'bg-blue-50/50 border-blue-200 shadow-glow'}`}>
                    <p className="text-xs opacity-60 mb-1">{c.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-mono">{c.points.toFixed(1)} × {c.credits}</span>
                      <ArrowRight size={14} className="opacity-40" />
                      <span className="font-bold text-blue-500">{c.qualityPoints.toFixed(1)} pts</span>
                    </div>
                  </div>
                ))}
              </div>

              <SolutionStep
                stepNumber={3}
                title="Calculate Totals and Final GPA"
                description="Sum all Quality Points and divide by the sum of all Credit Hours."
                formula={`GPA = \\frac{\\text{Total Quality Points}}{\\text{Total Credit Hours}} = \\frac{${calculation.totalQualityPoints.toFixed(1)}}{${calculation.totalCredits}} = ${calculation.gpa}`}
                isLast={true}
                isDarkMode={isDarkMode}
              />
            </>
          ) : (
            <>
              <SolutionStep
                stepNumber={2}
                title="Calculate Average Grade Points (CGPA)"
                description="Sum all grade points and divide by the total number of subjects."
                formula={`CGPA = \\frac{\\text{Sum of Grade Points}}{\\text{Total Subjects}} = \\frac{${calculation.totalPointsForCBSE.toFixed(1)}}{${courses.length}} = ${(calculation.totalPointsForCBSE / courses.length).toFixed(2)}`}
                isDarkMode={isDarkMode}
              />

              <SolutionStep
                stepNumber={3}
                title="Convert CGPA to Percentage"
                description="Multiply the CGPA by the CBSE conversion factor of 9.5."
                formula={`\\text{Percentage} = \\text{CGPA} \\times 9.5 = ${(calculation.totalPointsForCBSE / courses.length).toFixed(2)} \\times 9.5 = ${((calculation.totalPointsForCBSE / courses.length) * 9.5).toFixed(1)}\\%`}
                isLast={true}
                isDarkMode={isDarkMode}
              />
            </>
          )}
        </div>
      </div>

      {/* SEO Article */}
      <article className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
            <BookOpen size={24} />
          </div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>The Ultimate Guide to GPA Calculation: Manual vs. Automated Methods</h2>
        </div>

        <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert prose-gray-300' : 'prose-gray-600'}`}>
          <p>
            Understanding your Grade Point Average (GPA) is crucial for academic success, scholarship applications, and career planning. 
            Whether you are a high school student eyeing college admissions or a university student tracking your progress, knowing how GPA 
            is calculated empowers you to take control of your academic journey. This guide will walk you through everything you need to know 
            about the mechanics of GPA, the differences between various scales, and why accuracy is paramount in your academic records.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Manual GPA Calculation: The Step-by-Step Breakdown</h3>
          <p>
            Manual calculation requires precision and an understanding of your institution's specific weighting system. The most common 
            standard is the 4.0 scale, where an 'A' equals 4.0 points, a 'B' equals 3.0, and so on. To calculate your GPA manually, 
            follow these four essential steps:
          </p>
          <ul>
            <li><strong>Step 1: Grade Conversion.</strong> Every letter grade must be translated into its numerical equivalent. This is the foundation of the calculation. For instance, an A- might be a 3.7 while a B+ is a 3.3.</li>
            <li><strong>Step 2: Weighted Values (Quality Points).</strong> Multiply the grade points by the course's credit hours. A 4-credit course has double the impact of a 2-credit course. This product is known as 'Quality Points'.</li>
            <li><strong>Step 3: Aggregation.</strong> Sum all quality points earned in the semester or throughout your degree to get a total numerator. Simultaneously, sum all credits attempted to get your denominator.</li>
            <li><strong>Step 4: Final Division.</strong> Divide the total quality points by the total credits attempted. The resulting quotient is your Grade Point Average.</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">The Automated Advantage: Why Use a GPA Calculator?</h3>
          <p>
            While manual calculation is a great exercise in understanding academic mechanics, automated tools like the Student Tool Hub GPA Calculator 
            offer significant advantages that go beyond simple arithmetic:
          </p>
          <ul>
            <li><strong>Precision & Accuracy:</strong> Human error is common in multi-step multiplication and long division. Our calculator uses high-precision floating-point math to ensure your results are exact to the second decimal place.</li>
            <li><strong>Speed & Efficiency:</strong> Get instant results as you input your grades. This allows for 'what-if' scenarios, helping you determine exactly what grade you need in a final exam to reach a target GPA.</li>
            <li><strong>Visual Learning:</strong> Our Solution Engine doesn't just give you a number; it shows you exactly where every point comes from, reinforcing your understanding of the weighted average concept.</li>
            <li><strong>Scalability:</strong> Easily manage 40+ courses across multiple semesters. Keeping track of this volume of data manually is prone to record-keeping errors.</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">Weighted vs. Unweighted GPA: What's the Difference?</h3>
          <p>
            It is important to note the difference between weighted and unweighted averages. Unweighted GPAs treat all courses equally on a 4.0 scale, 
            regardless of difficulty. This provides a baseline of performance across all subjects.
          </p>
          <p>
            Weighted GPAs, often used in high schools, provide extra points for AP (Advanced Placement), IB (International Baccalaureate), or Honors courses. 
            In these systems, an 'A' in an AP class might count as 5.0 points instead of 4.0. This rewards students for taking on more rigorous 
            academic challenges and provides a more accurate reflection of a student's academic standing when comparing different course loads.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">The Global Context: GPA Scales Around the World</h3>
          <p>
            While the 4.0 scale is the standard in the United States and Canada, many countries use vastly different systems. 
            For example, in the United Kingdom, degrees are classified into First Class, Upper Second (2:1), Lower Second (2:2), and Third. 
            In India, many universities use a 10-point CGPA (Cumulative Grade Point Average) or a percentage system. Understanding these 
            differences is vital if you plan to study abroad or apply for international internships.
          </p>
          <p>
            Our GPA Calculator is designed to be flexible. Although it defaults to the 4.0 scale, the principles of quality points and 
            weighted averages remain consistent across most numeric systems. By understanding the math behind the numbers, you can 
            easily adapt your calculations to fit your specific institutional requirements.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Strategies for Boosting Your GPA</h3>
          <p>
            Improving a low GPA is a marathon, not a sprint. Because GPA is a cumulative average, the more credits you have completed, 
            the more difficult it becomes to significantly change the final number. However, with a strategic approach, you can still 
            make a meaningful impact:
          </p>
          <ul>
            <li><strong>Retake Courses:</strong> Many universities offer 'Grade Replacement' policies. If you failed or performed poorly in a high-credit course, retaking it can replace the old grade in your GPA calculation, providing the fastest possible boost.</li>
            <li><strong>Focus on High-Credit Classes:</strong> Since GPA is weighted by credit hours, an 'A' in a 4-credit science lab has more impact than an 'A' in a 1-credit physical education class. Prioritize your study time where it counts most mathematically.</li>
            <li><strong>Consistent Performance:</strong> Avoid 'rollercoaster' semesters. A steady stream of B+ and A- grades is often more beneficial than a mix of A+ and C grades, as it builds a stable foundation for your cumulative average.</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">FAQ: Common GPA Questions</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">How do 'Withdrawals' (W) or 'Incompletes' (I) affect my GPA?</h4>
              <p className="text-sm">Generally, 'W' or 'I' grades do not factor into your GPA calculation because no credits are earned and no grade points are assigned. However, they remain on your permanent transcript and may be questioned by admissions officers if they appear frequently.</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">Can a high GPA guarantee a scholarship?</h4>
              <p className="text-sm">While a high GPA is a primary filter for many merit-based scholarships, most selection committees also look at extracurriculars, leadership roles, and personal essays. Think of GPA as your ticket into the room, and your other achievements as the reason you win the award.</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">How do I improve a low GPA?</h4>
              <p className="text-sm">The most effective way to improve your GPA is through 'Grade Replacement' if your school allows it, or by taking additional courses and performing exceptionally well. Since GPA is an average, the more credits you have, the harder it is to move the needle significantly in one semester.</p>
            </div>
          </div>
        </div>
      </article>

    </div>
  );
};

export default GPACalculator;