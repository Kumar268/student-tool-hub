import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';

export default function About({ isDarkMode }) {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>About Us | StudentToolHub</title>
        <meta name="description" content="Learn more about StudentToolHub - our mission, our tools, and our commitment to providing free resources for students." />
      </Helmet>

      <div className={`min-h-screen py-12 px-6 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border mb-12 transition-all ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'}`}
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>

          <header className="mb-16">
            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Empowering Students Worldwide.
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-3xl">
              StudentToolHub is a dedicated platform designed to simplify the academic and professional life of students. 
              We believe that high-quality productivity tools should be accessible to everyone, everywhere, for free.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 mb-6">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-500 leading-relaxed">
                To provide a comprehensive suite of tools that help students solve complex problems, manage their time, 
                and navigate their financial and academic journey without any cost or barrier to entry.
              </p>
            </div>

            <div className={`p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500 mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Privacy First</h3>
              <p className="text-gray-500 leading-relaxed">
                We respect your data. Most of our tools run entirely in your browser, meaning your files 
                and inputs never even touch our servers. We never sell user data to third parties.
              </p>
            </div>
          </div>

          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-8">What We Offer</h2>
            <div className="space-y-6">
              {[
                { title: 'Academic Excellence', desc: 'From GPA calculators to complex calculus solvers, we make math and science approachable.', icon: <Sparkles size={20}/> },
                { title: 'Financial Clarity', desc: 'Calculate student loans, manage budgets, and plan for your future with our finance tools.', icon: <HeartPulse size={20}/> },
                { title: 'Productivity Power', desc: 'PDF converters, text formatters, and planners designed to save you hours of manual work.', icon: <GraduationCap size={20}/> }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="mt-1 text-blue-400">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="pt-12 border-t border-gray-800 text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} StudentToolHub. Built with ❤️ for students everywhere.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
