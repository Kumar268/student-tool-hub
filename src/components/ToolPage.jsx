import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ToolPage = ({ tool }) => {
  const navigate = useNavigate();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": tool.name,
    "description": tool.description,
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${tool.name} - Student Tool Hub`}</title>
        <meta name="description" content={tool.description} />
        <meta name="keywords" content={tool.tags.join(', ')} />
        <meta property="og:title" content={`${tool.name} - Student Tool Hub`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${tool.name} - Student Tool Hub`} />
        <meta name="twitter:description" content={tool.description} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-gray-200/50 dark:border-gray-700/50">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Tools</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <a
                  href={`https://github.com/studenttoolhub/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
                
                <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors">
                  <Star size={20} />
                  <span>Rate</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-8 py-12 max-w-6xl">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl mb-6">
              {tool.icon}
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {tool.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {tool.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {tool.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Tool Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 mb-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Tool Interface Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This tool is currently in development. The interface will be available shortly.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="text-gray-500 dark:text-gray-400">Development in progress...</span>
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <ExternalLink className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Web-Based
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                No installation required. Works directly in your browser.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Free to Use
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Completely free with no hidden costs or subscriptions.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                <ExternalLink className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Mobile Friendly
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Responsive design that works on all devices.
              </p>
            </div>
          </motion.div>

          {/* Related Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Related Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* This would be populated with related tools from the same category */}
              <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-lg border border-gray-200/30 dark:border-gray-700/30 p-4 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-lg">🔧</span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  Related Tool
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Description of related tool
                </p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default ToolPage;