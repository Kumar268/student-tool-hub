import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import SolutionStep from '../../components/SolutionStep';
import { BlockMath, InlineMath } from 'react-katex';

const EconomicsElasticity = ({ isDarkMode }) => {
  const [p1, setP1] = useState(10);
  const [p2, setP2] = useState(12);
  const [q1, setQ1] = useState(100);
  const [q2, setQ2] = useState(80);

  const result = useMemo(() => {
    const pStart = parseFloat(p1);
    const pEnd = parseFloat(p2);
    const qStart = parseFloat(q1);
    const qEnd = parseFloat(q2);

    if (isNaN(pStart) || isNaN(pEnd) || isNaN(qStart) || isNaN(qEnd)) return null;

    // Midpoint Formula
    const pctChangeQ = (qEnd - qStart) / ((qStart + qEnd) / 2);
    const pctChangeP = (pEnd - pStart) / ((pStart + pEnd) / 2);
    const ped = pctChangeQ / pctChangeP;
    const absPed = Math.abs(ped);

    let type = '';
    if (absPed > 1) type = 'Elastic';
    else if (absPed < 1) type = 'Inelastic';
    else type = 'Unitary Elastic';

    return { ped, absPed, type, pctChangeQ, pctChangeP };
  }, [p1, p2, q1, q2]);

  return (
    <div className="space-y-8">
      {/* AdSense Placeholder Top */}

      {/* Calculator Interface */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Initial Price (P1)</label>
              <input
                type="number"
                value={p1}
                onChange={(e) => setP1(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>New Price (P2)</label>
              <input
                type="number"
                value={p2}
                onChange={(e) => setP2(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Initial Quantity (Q1)</label>
              <input
                type="number"
                value={q1}
                onChange={(e) => setQ1(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
            <div className="space-y-2">
              <label className={`block text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>New Quantity (Q2)</label>
              <input
                type="number"
                value={q2}
                onChange={(e) => setQ2(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                }`}
              />
            </div>
          </div>

          <div className="space-y-4">
            {result && (
              <div className={`p-6 rounded-2xl border text-center ${isDarkMode ? 'bg-blue-900/20 border-blue-700/30' : 'bg-blue-50 border-blue-200'}`}>
                <p className="text-xs uppercase font-bold text-blue-500 mb-2">Elasticity (PED)</p>
                <h4 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{result.ped.toFixed(2)}</h4>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  result.absPed > 1 ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'
                }`}>
                  {result.type}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Solution Engine Section */}
      {result && (
        <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
          <div className="flex items-center space-x-3 mb-8">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <TrendingUp size={24} />
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Elasticity Solution Engine</h2>
          </div>

          <div className="space-y-6">
            <SolutionStep
              stepNumber={1}
              title="Apply the Midpoint Formula"
              description="We use the midpoint formula to calculate percentage changes, which ensures the elasticity is the same whether price increases or decreases."
              formula="PED = \frac{(Q_2 - Q_1) / [(Q_1 + Q_2) / 2]}{(P_2 - P_1) / [(P_1 + P_2) / 2]}"
              isDarkMode={isDarkMode}
            />
            
            <SolutionStep
              stepNumber={2}
              title="Calculate Percentage Changes"
              description="Find the relative change in quantity demanded and price."
              formula={`\% \Delta Q = ${(result.pctChangeQ * 100).toFixed(1)}\%, \quad \% \Delta P = ${(result.pctChangeP * 100).toFixed(1)}\%`}
              isDarkMode={isDarkMode}
            />

            <SolutionStep
              stepNumber={3}
              title="Interpret the Result"
              description={`The absolute value is ${result.absPed.toFixed(2)}. Since this is ${result.absPed > 1 ? 'greater' : 'less'} than 1, the demand is ${result.type}.`}
              formula={`|PED| = ${result.absPed.toFixed(2)}`}
              isLast={true}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}

      {/* SEO Article */}
      <article className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <BookOpen size={24} />
          </div>
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Understanding Price Elasticity: An Economics Guide</h2>
        </div>

        <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert prose-gray-300' : 'prose-gray-600'}`}>
          <p>
            Price Elasticity of Demand (PED) is a measurement used in economics to show the responsiveness, or 
            elasticity, of the quantity demanded of a good or service to a change in its price. For business 
            students and policy makers, understanding PED is essential for making pricing decisions.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Types of Elasticity</h3>
          <p>
            How much consumers react to price changes determines the category of elasticity:
          </p>
          <ul>
            <li><strong>Elastic Demand (|PED| &gt; 1):</strong> Consumers are very sensitive to price changes. A small increase in price leads to a large drop in quantity demanded (e.g., luxury goods, electronics).</li>
            <li><strong>Inelastic Demand (|PED| &lt; 1):</strong> Consumers are not very sensitive to price changes. Even a large price increase only causes a small drop in quantity (e.g., gasoline, medicine, salt).</li>
            <li><strong>Unitary Elastic (|PED| = 1):</strong> The percentage change in quantity is exactly equal to the percentage change in price.</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">The Midpoint Formula Advantage</h3>
          <p>
            Standard percentage change formulas give different results depending on whether you're moving from 
            P1 to P2 or vice-versa. The <strong>Midpoint Formula</strong> (or Arc Elasticity) solves this by 
            using the average of the starting and ending values as the denominator. This is the standard method 
            taught in introductory economics courses.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Factors Influencing Elasticity</h3>
          <ul>
            <li><strong>Availability of Substitutes:</strong> The more substitutes available, the more elastic the demand.</li>
            <li><strong>Necessity vs. Luxury:</strong> Necessities tend to be inelastic, while luxuries are elastic.</li>
            <li><strong>Proportion of Income:</strong> Goods that take up a large part of a consumer's budget tend to be more elastic.</li>
            <li><strong>Time Horizon:</strong> Demand is usually more elastic in the long run as consumers have more time to find alternatives.</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">FAQ: Economics Concepts</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">Why is PED usually negative?</h4>
              <p className="text-sm">PED is negative because of the Law of Demand: price and quantity demanded move in opposite directions. However, economists often use the absolute value for easier interpretation.</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">What is perfectly inelastic demand?</h4>
              <p className="text-sm">Perfectly inelastic demand (PED = 0) occurs when quantity demanded does not change at all, regardless of price. This is represented by a vertical demand curve.</p>
            </div>
          </div>
        </div>
      </article>

      {/* AdSense Placeholder Bottom */}
      
    </div>
  );
};

export default EconomicsElasticity;
