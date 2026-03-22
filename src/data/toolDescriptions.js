/**
 * Tool Descriptions & Metadata
 * ────────────────────────────────────────────────────
 *
 * This file provides rich metadata for all 56+ tools including:
 * - Detailed descriptions (150-160 chars for SEO)
 * - Short descriptions for UI
 * - Tags for search & filtering
 * - Difficulty levels
 * - Time estimates
 * - Colors & icons
 * - Related tools
 */

export const toolDescriptions = {
  'calculus-solver': {
    name: 'Calculus Solver',
    description: 'Solve derivatives (1st, 2nd, 3rd order) and limits with step-by-step logic and graphs',
    shortDescription: 'Derivatives and limits calculator',
    tags: ['calculus', 'math', 'derivative', 'limit', 'polynomial'],
    difficulty: 'hard',
    timeEstimate: '2 minutes',
    category: 'academic',
    icon: '📐',
    color: 'blue',
    relatedTools: ['integral-calculator', 'matrix-algebra', 'basic-stats']
  },

  'integral-calculator': {
    name: 'Integral Calculator',
    description: 'Step-by-step Indefinite and Definite integrals with visual area shading and explanations',
    shortDescription: 'Indefinite & definite integrals',
    tags: ['integral', 'calculus', 'math', 'antiderivative'],
    difficulty: 'hard',
    timeEstimate: '2-3 minutes',
    category: 'academic',
    icon: '∫',
    color: 'purple',
    relatedTools: ['calculus-solver', 'basic-stats']
  },

  'matrix-algebra': {
    name: 'Matrix Calculator',
    description: 'Matrix addition, multiplication, and inverse calculations for linear algebra (up to 5x5)',
    shortDescription: 'Matrix operations & transformations',
    tags: ['matrix', 'algebra', 'linear', 'determinant', 'inverse'],
    difficulty: 'medium',
    timeEstimate: '1-2 minutes',
    category: 'academic',
    icon: '⬜',
    color: 'indigo',
    relatedTools: ['basic-stats', 'economics-elasticity']
  },

  'basic-stats': {
    name: 'Statistics Master',
    description: 'Calculate Mean, Median, Mode, and Standard Deviation with step-by-step breakdown tables',
    shortDescription: 'Statistical analysis & calculations',
    tags: ['statistics', 'mean', 'median', 'mode', 'std-dev', 'variance'],
    difficulty: 'easy',
    timeEstimate: '1 minute',
    category: 'academic',
    icon: '📊',
    color: 'green',
    relatedTools: ['calculus-solver', 'matrix-algebra']
  },

  'projectile-simulator': {
    name: 'Physics Simulator',
    description: 'Interactive projectile motion and force calculators with real-time 3D telemetry visualization',
    shortDescription: 'Projectile motion calculator',
    tags: ['physics', 'projectile', 'motion', 'trajectory', 'velocity'],
    difficulty: 'medium',
    timeEstimate: '2 minutes',
    category: 'academic',
    icon: '🎯',
    color: 'orange',
    relatedTools: ['circuit-designer', 'chemistry-balancer']
  },

  'chemistry-balancer': {
    name: 'Chemistry Balancer',
    description: 'Balance complex chemical equations and calculate molar mass with step-by-step breakdown',
    shortDescription: 'Chemical equation balancer',
    tags: ['chemistry', 'equation', 'molar-mass', 'stoichiometry'],
    difficulty: 'medium',
    timeEstimate: '1-2 minutes',
    category: 'academic',
    icon: '⚗️',
    color: 'cyan',
    relatedTools: ['projectile-simulator', 'circuit-designer']
  },

  'circuit-designer': {
    name: 'Circuit Analyzer',
    description: "Ohm's Law and series/parallel resistance calculator with interactive circuit visualizations",
    shortDescription: "Ohm's Law & resistance calculator",
    tags: ['physics', 'electricity', 'ohms-law', 'resistance', 'circuit'],
    difficulty: 'medium',
    timeEstimate: '1-2 minutes',
    category: 'academic',
    icon: '⚡',
    color: 'yellow',
    relatedTools: ['chemistry-balancer', 'unit-converter']
  },

  'economics-elasticity': {
    name: 'Economics Tool',
    description: 'Supply and demand equilibrium calculator with price elasticity analysis and visual graphs',
    shortDescription: 'Supply, demand & elasticity',
    tags: ['economics', 'elasticity', 'price', 'demand', 'supply'],
    difficulty: 'medium',
    timeEstimate: '1-2 minutes',
    category: 'academic',
    icon: '📈',
    color: 'red',
    relatedTools: ['basic-stats', 'matrix-algebra']
  },

  'unit-converter': {
    name: 'Unit Converter',
    description: 'Comprehensive length, mass, volume, temperature conversion suite with 100+ unit types',
    shortDescription: 'Universal unit converter',
    tags: ['units', 'conversion', 'length', 'mass', 'volume', 'science'],
    difficulty: 'easy',
    timeEstimate: '30 seconds',
    category: 'academic',
    icon: '📏',
    color: 'emerald',
    relatedTools: ['circuit-designer', 'projectile-simulator']
  },

  // Add remaining tools with similar structure...
  // For brevity, showing pattern. You'll add all 56+ tools
};

/**
 * Utility function to get tool description
 * Usage: getToolDescription('calculus-solver')
 */
export const getToolDescription = (slug) => {
  return toolDescriptions[slug] || {
    name: 'Unknown Tool',
    description: 'Tool description not found',
    shortDescription: 'Unknown tool',
    tags: [],
    difficulty: 'unknown',
    timeEstimate: 'Unknown',
    category: 'niche'
  };
};

/**
 * Get related tools by category or tags
 */
export const getRelatedTools = (slug, tools) => {
  const toolDesc = toolDescriptions[slug];
  if (!toolDesc) return [];

  return tools
    .filter(t =>
      t.slug !== slug && (
        t.category === toolDesc.category ||
        t.tags?.some(tag => toolDesc.tags?.includes(tag))
      )
    )
    .slice(0, 4);
};

/**
 * Search tools by multiple criteria
 */
export const searchTools = (query, tools) => {
  const lower = query.toLowerCase();

  return tools.filter(t => {
    const desc = toolDescriptions[t.slug];
    if (!desc) return false;

    return (
      t.name.toLowerCase().includes(lower) ||
      t.description.toLowerCase().includes(lower) ||
      desc.shortDescription.toLowerCase().includes(lower) ||
      desc.tags.some(tag => tag.toLowerCase().includes(lower))
    );
  });
};
