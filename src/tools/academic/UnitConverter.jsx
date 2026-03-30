import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, RefreshCw, BookOpen } from 'lucide-react';
import SolutionStep from '../../components/SolutionStep';
import { BlockMath } from 'react-katex';

const units = {
  length: {
    meters: 1,
    kilometers: 1000,
    centimeters: 0.01,
    millimeters: 0.001,
    miles: 1609.34,
    yards: 0.9144,
    feet: 0.3048,
    inches: 0.0254,
    nanometers: 1e-9,
    micrometers: 1e-6,
    nautical_miles: 1852
  },
  weight: {
    kilograms: 1,
    grams: 0.001,
    milligrams: 1e-6,
    pounds: 0.453592,
    ounces: 0.0283495,
    metric_tons: 1000,
    stones: 6.35029
  },
  temperature: {
    celsius: 'C',
    fahrenheit: 'F',
    kelvin: 'K'
  },
  area: {
    square_meters: 1,
    square_kilometers: 1e6,
    square_miles: 2.59e6,
    acres: 4046.86,
    hectares: 10000,
    square_feet: 0.092903,
    square_inches: 0.00064516
  },
  volume: {
    liters: 1,
    milliliters: 0.001,
    cubic_meters: 1000,
    gallons_us: 3.78541,
    quarts_us: 0.946353,
    pints_us: 0.473176,
    cups_us: 0.236588,
    fluid_ounces_us: 0.0295735
  },
  speed: {
    meters_per_second: 1,
    kilometers_per_hour: 0.277778,
    miles_per_hour: 0.44704,
    knots: 0.514444,
    feet_per_second: 0.3048
  },
  time: {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months_avg: 2.628e6,
    years_avg: 3.154e7
  },
  force: {
    newtons: 1,
    kilonewtons: 1000,
    pound_force: 4.44822,
    dyne: 1e-5
  },
  energy: {
    joules: 1,
    kilojoules: 1000,
    calories: 4.184,
    kilocalories: 4184,
    watt_hours: 3600,
    kilowatt_hours: 3.6e6,
    electronvolts: 1.60218e-19,
    british_thermal_units: 1055.06
  },
  power: {
    watts: 1,
    kilowatts: 1000,
    horsepower_us: 745.7,
    megawatts: 1e6,
    gigawatts: 1e9
  },
  pressure: {
    pascals: 1,
    kilopascals: 1000,
    bars: 1e5,
    atmospheres: 101325,
    psi: 6894.76,
    torr: 133.322
  },
  data: {
    bytes: 1,
    kilobytes: 1024,
    megabytes: 1.04858e6,
    gigabytes: 1.07374e9,
    terabytes: 1.1e12,
    bits: 0.125
  },
  angle: {
    degrees: 1,
    radians: 57.2958,
    gradians: 0.9,
    arcminutes: 0.0166667,
    arcseconds: 0.000277778
  }
};

const UnitConverter = ({ isDarkMode }) => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('kilometers');
  const [value, setValue] = useState(1);

  const convert = (val, from, to, cat) => {
    if (cat === 'temperature') {
      let celsius;
      if (from === 'celsius') celsius = val;
      else if (from === 'fahrenheit') celsius = (val - 32) * 5/9;
      else if (from === 'kelvin') celsius = val - 273.15;

      if (to === 'celsius') return celsius;
      else if (to === 'fahrenheit') return (celsius * 9/5) + 32;
      else if (to === 'kelvin') return celsius + 273.15;
    } else {
      const inBase = val * units[cat][from];
      return inBase / units[cat][to];
    }
  };

  const result = useMemo(() => convert(parseFloat(value) || 0, fromUnit, toUnit, category), [value, fromUnit, toUnit, category]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    const firstUnit = Object.keys(units[cat])[0];
    const secondUnit = Object.keys(units[cat])[1] || firstUnit;
    setFromUnit(firstUnit);
    setToUnit(secondUnit);
  };

  const formatUnitName = (name) => name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="space-y-8">
      {/* AdSense Placeholder Top */}

      {/* Category Selector */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex flex-wrap gap-2">
          {Object.keys(units).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calculator Interface */}
      <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>From</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`flex-grow px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                }`}
              />
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className={`px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                }`}
              >
                {Object.keys(units[category]).map(u => <option key={u} value={u}>{formatUnitName(u)}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>To</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className={`flex-grow px-4 py-3 rounded-xl border font-bold text-lg flex items-center overflow-x-auto ${
                isDarkMode ? 'bg-blue-900/20 border-blue-700/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}>
                {result < 0.000001 || result > 1000000 ? result.toExponential(4) : result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className={`px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white/50 border-gray-200 text-gray-900'
                }`}
              >
                {Object.keys(units[category]).map(u => <option key={u} value={u}>{formatUnitName(u)}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Engine Section */}
      <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800/40 border-gray-700/50' : 'bg-white/40 border-gray-200/50'} backdrop-blur-md`}>
        <div className="flex items-center space-x-3 mb-8">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
            <RefreshCw size={24} />
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Step-by-Step Conversion</h2>
        </div>

        <div className="space-y-6">
          <SolutionStep
            stepNumber={1}
            title="Identify the Base Factor"
            description={`Every ${category} unit is related to a base unit (${category === 'weight' ? 'kilograms' : category === 'length' ? 'meters' : 'celsius'}). We first find the conversion factor for your input unit.`}
            formula={category !== 'temperature' ? `1 \\text{ ${fromUnit}} = ${units[category][fromUnit]} \\text{ base units}` : undefined}
            isDarkMode={isDarkMode}
          />
          
          <SolutionStep
            stepNumber={2}
            title="Normalize to Base Unit"
            description="We convert the input value into our reference base unit by multiplying it by its factor."
            formula={category !== 'temperature' ? `${value} \\times ${units[category][fromUnit]} = ${value * units[category][fromUnit]} \\text{ base units}` : undefined}
            isDarkMode={isDarkMode}
          />

          <SolutionStep
            stepNumber={3}
            title="Convert to Target Unit"
            description={`Finally, we divide the normalized base value by the conversion factor of the target unit (${toUnit}).`}
            formula={category !== 'temperature' 
              ? `\\frac{${value * units[category][fromUnit]}}{${units[category][toUnit]}} = ${result.toFixed(6)} \\text{ ${toUnit}}`
              : `\\text{Using }{${fromUnit} \\to ${toUnit}} \\text{ formula: } ${result.toFixed(2)}`
            }
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
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mastering Unit Conversions: A Comprehensive Student Guide</h2>
        </div>

        <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert prose-gray-300' : 'prose-gray-600'}`}>
          <p>
            Unit conversion is a fundamental skill used across science, engineering, and everyday life. Whether you are adjusting a recipe, 
            calculating distances for a physics problem, or converting temperatures for international travel, understanding how to switch 
            between different measurement systems is essential.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Why Do We Use Different Units?</h3>
          <p>
            Historically, different regions developed their own measurement systems. Today, the world primarily uses the Metric System 
            (International System of Units, or SI), while the United States still uses the Imperial System. Being able to convert between 
            these systems allows for global collaboration in science and trade.
          </p>

          <h4 className="text-xl font-bold mt-6 mb-2">The Metric Advantage</h4>
          <p>
            The Metric system is based on powers of ten, making it incredibly easy to scale. For example, 1,000 meters is 1 kilometer, 
            and 1,000 grams is 1 kilogram. This consistency reduces errors in calculation compared to the Imperial system, where 12 inches 
            make a foot and 5,280 feet make a mile.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Historical Evolution of Measurement</h3>
          <p>
            Before the standardization of units, measurements were often based on the human body or local traditions. The 'foot' was 
            literally the length of a person's foot, and the 'inch' was often defined as the width of a thumb. This led to massive 
            inconsistencies when trading between different cities or countries. The French Revolution sparked the creation of the 
            Metric system in the late 18th century, aiming for a system "for all people, for all time."
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">Understanding Different Measurement Categories</h3>
          <p>
            Our Unit Converter handles the three most common categories students encounter in their coursework:
          </p>
          
          <h4 className="text-xl font-bold mt-6 mb-2">1. Length and Distance</h4>
          <p>
            Length is the most common conversion. In physics, the 'meter' is the standard SI unit. When dealing with astronomical 
            distances, we might use light-years, while in microscopic biology, we use micrometers or nanometers. Our tool allows 
            you to bridge the gap between small-scale measurements (inches/centimeters) and large-scale distances (miles/kilometers).
          </p>

          <h4 className="text-xl font-bold mt-6 mb-2">2. Mass and Weight</h4>
          <p>
            Technically, mass (kilograms) and weight (pounds) are different concepts in physics—mass is the amount of matter, 
            while weight is the force of gravity on that matter. However, in daily life and most classroom settings, they are 
            used interchangeably. Knowing that 1 kilogram is approximately 2.2 pounds is a useful mental shortcut for students 
            moving between metric and imperial data sets.
          </p>

          <h4 className="text-xl font-bold mt-6 mb-2">3. Temperature: A Unique Challenge</h4>
          <p>
            Temperature is unique because it doesn't scale linearly from zero in the same way length does. While 2 meters is 
            exactly double 1 meter, 20°C is NOT double the 'heat' of 10°C. This is because the Celsius and Fahrenheit scales 
            have arbitrary zero points. The Kelvin scale, however, starts at absolute zero, which is why it's the preferred 
            scale for scientific thermodynamic calculations.
          </p>

          <h3 className="text-2xl font-bold mt-8 mb-4">How to Convert Units Manually</h3>
          <p>
            The most reliable way to convert units manually is the <strong>Factor-Label Method</strong> (also known as Dimensional Analysis). 
            This involves multiplying your starting value by a conversion factor expressed as a fraction.
          </p>
          <div className={`p-4 rounded-xl border mb-6 ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <p className="font-mono text-sm">Example: Convert 5 miles to kilometers</p>
            <p className="font-mono text-sm">5 miles × (1.609 km / 1 mile) = 8.045 km</p>
          </div>

          <h3 className="text-2xl font-bold mt-8 mb-4">Common Conversion Pitfalls to Avoid</h3>
          <ul>
            <li><strong>Mixing Systems:</strong> Never assume a pint is the same everywhere (a UK pint is larger than a US pint).</li>
            <li><strong>Precision Errors:</strong> Rounding too early in a multi-step conversion can lead to significant errors in the final result.</li>
            <li><strong>Temperature Traps:</strong> Remember that temperature conversions involve an offset (like adding 32 for Fahrenheit), not just multiplication.</li>
          </ul>

          <h3 className="text-2xl font-bold mt-8 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">What is the most common unit of measurement?</h4>
              <p className="text-sm">The meter is the base unit of length in the SI system and is the most widely used measurement of distance globally.</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h4 className="font-bold mb-2">Why is temperature conversion different?</h4>
              <p className="text-sm">Unlike length or weight, temperature scales have different starting points (zero points). Celsius and Kelvin have the same scale size but start 273.15 degrees apart, while Fahrenheit has a completely different scale size.</p>
            </div>
          </div>
        </div>
      </article>

      {/* AdSense Placeholder Bottom */}
      
    </div>
  );
};

export default UnitConverter;