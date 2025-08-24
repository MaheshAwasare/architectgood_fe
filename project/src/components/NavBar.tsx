import React from 'react';
import { FileText, Puzzle, Code2, Sparkles, Layers, User, LogOut, BookCheck } from 'lucide-react';

interface NavBarProps {
  onLogin: () => void;
  onViewBlog: () => void;
  scrollToSection: (id: string) => void;
  isLoggedIn: boolean;
  user?: { name: string };
  onLogout?: () => void;
  onShowProfile?: () => void;
  activeTab?: 'editor' | 'viewer' | 'advanced' | 'ai' | 'uml' | 'ai-uml';
  setActiveTab?: (tab: 'editor' | 'viewer' | 'advanced' | 'ai' | 'uml' | 'ai-uml') => void;
  setShowLandingPage: (show: boolean) => void;
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
  setShowLandingPage,
}) => {
  const handleLogoClick = () => {
    if (isLoggedIn) {
      setActiveTab && setActiveTab('editor'); // Go to the first menu of logged-in user
      setShowLandingPage(false); // Ensure landing page is hidden
    } else {
      setShowLandingPage(true); // Ensure landing page is shown
      scrollToSection('home'); // Always scroll to home section on landing page
    }
  };

  return (
    <nav className="bg-white p-4 shadow-lg fixed w-full z-10 top-0 transition-all duration-300 ease-in-out">
      <div className="container mx-auto flex justify-between items-center">
        <button onClick={handleLogoClick} className="text-2xl font-extrabold text-primary tracking-wide" style={{ cursor: 'pointer' }}>
          ArchitectGood
        </button>
        {!isLoggedIn ? (
          <div className="space-x-6">
            <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Features
            </button>
            <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Services
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              How It Works
            </button>
            <button onClick={onViewBlog} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Blog
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium">
              Contact
            </button>
            <button
              onClick={onLogin}
              className="px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-md hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl text-lg"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setActiveTab && setActiveTab('editor')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                Diagram Editor
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('viewer')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'viewer'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Puzzle className="w-4 h-4" />
                Plug & Play Viewer
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('advanced')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'advanced'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code2 className="w-4 h-4" />
                Advanced Editor
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('ai')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'ai'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Mermaid Generator
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('uml')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'uml'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                UML Generator
              </button>
              <button
                onClick={() => setActiveTab && setActiveTab('ai-uml')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'ai-uml'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BookCheck className="w-4 h-4" />
                AI UML Generator
              </button>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Welcome, {user?.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onShowProfile}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Profile"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;