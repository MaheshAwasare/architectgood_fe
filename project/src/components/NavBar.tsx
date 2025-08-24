import React from 'react';
import { FileText, Puzzle, Code2, Sparkles, Layers, User, LogOut, BookCheck, Rss, Home, Star, Briefcase, Lightbulb, Mail, MessageSquare, GraduationCap, LogIn } from 'lucide-react'; // Import all necessary Lucide icons
import { Link } from 'react-router-dom'; // Import Link for navigation

interface NavBarProps {
  onLogin: () => void;
  onViewBlog: () => void;
  scrollToSection: (id: string) => void;
  isLoggedIn: boolean;
  user?: { name: string };
  onLogout?: () => void;
  onShowProfile?: () => void;
  // activeTab?: 'editor' | 'viewer' | 'advanced' | 'ai' | 'uml' | 'ai-uml'; // No longer needed in NavBar
  // setActiveTab?: (tab: 'editor' | 'viewer' | 'advanced' | 'ai' | 'uml' | 'ai-uml') => void; // No longer needed in NavBar
  // setShowLandingPage: (show: boolean) => void; // No longer directly setting landing page visibility
}

const NavBar: React.FC<NavBarProps> = ({
  onLogin,
  onViewBlog,
  scrollToSection,
  isLoggedIn,
  user,
  onLogout,
  onShowProfile,
  // activeTab, // Removed
  // setActiveTab, // Removed
  // setShowLandingPage, // Removed
}) => {
  // Use Link for internal navigation where appropriate
  // For scrolling to sections on landing page, still use scrollToSection
  // For external links or full page reloads, window.location.href

  return (
    <nav className="bg-white p-4 shadow-lg fixed w-full z-10 top-0 transition-all duration-300 ease-in-out">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold text-primary tracking-wide focus:outline-none">
          <img src="/ag_logo_new.png" alt="ArchitectGood Logo" className="h-10" /> {/* Increased size to h-10 */}
          <span>ArchitectGood</span> {/* Added the text back */}
        </Link>
        <div className="space-x-6 flex items-center">
          <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
            <Star className="w-5 h-5" />
            <span>Features</span>
          </button>
          <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
            <Briefcase className="w-5 h-5" />
            <span>Services</span>
          </button>
          <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
            <Lightbulb className="w-5 h-5" />
            <span>How It Works</span>
          </button>
          {/* Blog button is removed from LandingPage, so it should be a direct link to /blog */}
          <Link to="/blog" className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
            <Rss className="w-5 h-5" />
            <span>Blog</span>
          </Link>
          <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
            <Mail className="w-5 h-5" />
            <span>Contact</span>
          </button>
          <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
            <MessageSquare className="w-5 h-5" />
            <span>Testimonials</span>
          </button>
          <Link to="/training" className="text-gray-600 hover:text-primary transition-colors duration-300 text-lg font-medium flex items-center space-x-1">
            <GraduationCap className="w-5 h-5" />
            <span>Training</span>
          </Link>

          {isLoggedIn ? (
            <>
              {/* Dashboard/Tools button for logged-in users */}
              <Link to="/dashboard" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl text-lg flex items-center space-x-1">
                <Code2 className="w-5 h-5" />
                <span>Tools</span>
              </Link>
              <button
                onClick={onShowProfile}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-full shadow-lg hover:bg-primary-dark transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl text-lg flex items-center space-x-1"
              >
                <User className="w-5 h-5" />
                <span>{user?.name || 'Profile'}</span>
              </button>
              <button
                onClick={onLogout}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full shadow-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl text-lg flex items-center space-x-1"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
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
      </div>
    </nav>
  );
};

export default NavBar;