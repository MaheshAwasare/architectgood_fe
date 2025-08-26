import React, { useState } from 'react';
import { FileText, Puzzle, Code2, Sparkles, Layers, User, LogOut, BookCheck, Rss, Home, Star, Briefcase, Lightbulb, Mail, MessageSquare, GraduationCap, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  onLogin: () => void;
  onViewBlog: () => void;
  scrollToSection: (id: string) => void;
  isLoggedIn: boolean;
  user?: { name: string };
  onLogout?: () => void;
  onShowProfile?: () => void;
  activeTab: 'editor' | 'viewer' | 'advanced' | 'ai' | 'uml' | 'ai-uml';
  setActiveTab: (tab: 'editor' | 'viewer' | 'advanced' | 'ai' | 'uml' | 'ai-uml') => void;
}

const NavBar: React.FC<NavBarProps> = ({
  onLogin,
  onViewBlog,
  scrollToSection,
  isLoggedIn,
  user,
  onLogout,
  onShowProfile,
  activeTab,
  setActiveTab,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-extrabold text-primary tracking-wide focus:outline-none"
            onClick={closeMobileMenu}
          >
            <img src="/ag_logo_new.png" alt="ArchitectGood Logo" className="h-10" />
            <span>ArchitectGood</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            {!isLoggedIn ? (
              <>
                {/* Landing Page Navigation */}
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1"
                >
                  <Star className="w-5 h-5" />
                  <span>Features</span>
                </button>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Services</span>
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1"
                >
                  <Lightbulb className="w-5 h-5" />
                  <span>How It Works</span>
                </button>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1"
                >
                  <Mail className="w-5 h-5" />
                  <span>Contact</span>
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Testimonials</span>
                </button>
              </>
            ) : (
              <>
                {/* Tools for Logged In Users */}
                <Link 
                  to="/dashboard" 
                  onClick={() => setActiveTab('editor')} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'editor' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Diagram Editor
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={() => setActiveTab('viewer')} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'viewer' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Puzzle className="w-4 h-4" />
                  Plug & Play Viewer
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={() => setActiveTab('advanced')} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'advanced' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  Advanced Editor
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={() => setActiveTab('ai')} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'ai' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI Mermaid Generator
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={() => setActiveTab('uml')} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'uml' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  UML Generator
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={() => setActiveTab('ai-uml')} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'ai-uml' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <BookCheck className="w-4 h-4" />
                  AI UML Generator
                </Link>
              </>
            )}

            {/* Always visible links */}
            <Link 
              to="/blog" 
              className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1"
            >
              <Rss className="w-5 h-5" />
              <span>Blog</span>
            </Link>
            {/*
            <Link 
              to="/training" 
              className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1"
            >
              <GraduationCap className="w-5 h-5" />
              <span>Training</span>
            </Link>
 */}
            {/* Auth Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/profile" 
                  onClick={onShowProfile} 
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  title="Profile"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl text-lg flex items-center space-x-1"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-primary focus:outline-none p-2"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {!isLoggedIn ? (
                <>
                  {/* Landing Page Navigation for Mobile */}
                  <button 
                    onClick={() => { scrollToSection('home'); closeMobileMenu(); }} 
                    className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-300 text-lg font-medium flex items-center space-x-2 px-4 py-2 rounded-lg"
                  >
                    <Home className="w-5 h-5" />
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => { scrollToSection('features'); closeMobileMenu(); }} 
                    className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-300 text-lg font-medium flex items-center space-x-2 px-4 py-2 rounded-lg"
                  >
                    <Star className="w-5 h-5" />
                    <span>Features</span>
                  </button>
                  <button 
                    onClick={() => { scrollToSection('services'); closeMobileMenu(); }} 
                    className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-300 text-lg font-medium flex items-center space-x-2 px-4 py-2 rounded-lg"
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Services</span>
                  </button>
                  <button 
                    onClick={() => { scrollToSection('how-it-works'); closeMobileMenu(); }} 
                    className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-300 text-lg font-medium flex items-center space-x-2 px-4 py-2 rounded-lg"
                  >
                    <Lightbulb className="w-5 h-5" />
                    <span>How It Works</span>
                  </button>
                  <button 
                    onClick={() => { scrollToSection('contact'); closeMobileMenu(); }} 
                    className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-300 text-lg font-medium flex items-center space-x-2 px-4 py-2 rounded-lg"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Contact</span>
                  </button>
                  <button 
                    onClick={() => { scrollToSection('testimonials'); closeMobileMenu(); }} 
                    className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-300 text-lg font-medium flex items-center space-x-2 px-4 py-2 rounded-lg"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Testimonials</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Tools for Logged In Users - Mobile */}
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Tools</h3>
                    <div className="space-y-1">
                      <Link 
                        to="/dashboard" 
                        onClick={() => { setActiveTab('editor'); closeMobileMenu(); }} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          activeTab === 'editor' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <FileText className="w-5 h-5" />
                        Diagram Editor
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => { setActiveTab('viewer'); closeMobileMenu(); }} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          activeTab === 'viewer' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Puzzle className="w-5 h-5" />
                        Plug & Play Viewer
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => { setActiveTab('advanced'); closeMobileMenu(); }} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          activeTab === 'advanced' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Code2 className="w-5 h-5" />
                        Advanced Editor
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => { setActiveTab('ai'); closeMobileMenu(); }} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          activeTab === 'ai' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Sparkles className="w-5 h-5" />
                        AI Mermaid Generator
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => { setActiveTab('uml'); closeMobileMenu(); }} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          activeTab === 'uml' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Layers className="w-5 h-5" />
                        UML Generator
                      </Link>
                      <Link 
                        to="/dashboard" 
                        onClick={() => { setActiveTab('ai-uml'); closeMobileMenu(); }} 
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          activeTab === 'ai-uml' ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <BookCheck className="w-5 h-5" />
                        AI UML Generator
                      </Link>
                    </div>
                  </div>
                  <hr className="border-gray-200" />
                </>
              )}

              {/* Always visible links - Mobile */}
              <Link 
                to="/blog" 
                onClick={closeMobileMenu}
                className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-300 text-lg font-medium flex items-center space-x-2 px-4 py-2 rounded-lg"
              >
                <Rss className="w-5 h-5" />
                <span>Blog</span>
              </Link>
              {/* 
              <Link 
                to="/training" 
                onClick={closeMobileMenu}
                className="text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors duration-300 text-lg font-medium flex items-center space-x-2 px-4 py-2 rounded-lg"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Training</span>
              </Link>
*/}
              {/* Auth Section - Mobile */}
              {isLoggedIn ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link 
                    to="/profile" 
                    onClick={() => { onShowProfile?.(); closeMobileMenu(); }}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => { onLogout?.(); closeMobileMenu(); }}
                    className="w-full text-left text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 px-4 py-2 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button
                    onClick={() => { onLogin(); closeMobileMenu(); }}
                    className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition duration-300 ease-in-out flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;