import React from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun } from 'lucide-react';
import { tools } from '../data/tools';
import ToolCard3D from './ToolCard3D';

const Dashboard = (props) => {
  const { selectedCategory, searchQuery, setSearchQuery, isDarkMode, onToggleDarkMode, onToolClick } = props;
  
  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className='min-h-screen relative'>
      <header className={`sticky top-0 z-20 border-b backdrop-blur-xl transition-colors duration-500 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-white/40 border-gray-200/50'}`}>
        <div className='px-8 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex-1 max-w-2xl'>
              <div className='relative group'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors' />
                <input
                  type='text'
                  placeholder='Search 56+ specialized tools...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-500' : 'bg-gray-100/50 border-gray-200 text-gray-900 placeholder-gray-400'} backdrop-blur-md shadow-inner`}
                />
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`ml-6 p-3 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-gray-100'} backdrop-blur-md shadow-lg`}
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </div>
      </header>
      
      <main className='p-8'>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className='mb-8'>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedCategory === 'all' ? 'All Tools' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + ' Tools'}
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{filteredTools.length} tools available</p>
        </motion.div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ToolCard3D tool={tool} isDarkMode={isDarkMode} onClick={() => onToolClick(tool)} />
            </motion.div>
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='text-center py-12'>
            <div className={`text-6xl mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>🔍</div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No tools found</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your search or filter criteria</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
