import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // Import useNavigate



import PlugAndPlayViewer from './components/PlugAndPlayViewer';
import AdvancedEditor from './components/AdvancedEditor';
import AIGenerator from './components/AIGenerator';
import UMLGenerator from './components/UMLGenerator';
import AuthPage from './components/AuthPage';
import UserProfile from './components/UserProfile';
import AIUMLGenerator from './components/AIUMLGenerator';
import MermaidEditor from './components/MermaidEditor';
import LandingPage from './components/LandingPage';
import BlogPage from './components/BlogPage';
import ArticlePage from './components/ArticlePage';
import NavBar from './components/NavBar';
import TrainingCategories from './components/TrainingCategories'; // Import TrainingCategories
import DesignCourses from './components/DesignCourses'; // Import DesignCourses
import ArchitecturalDesignPatternsCoursePage from './components/ArchitecturalDesignPatternsCoursePage'; // Import the renamed component

import DevOpsCourses from './components/DevOpsCourses'; // Import DevOpsCourses
import DevOpsBasicsCoursePage from './components/DevOpsBasicsCoursePage'; // Import DevOpsBasicsCoursePage

import { FileText, Puzzle, Code2, Sparkles, Layers, User, LogOut, BookCheck, Rss } from 'lucide-react';
import { authService } from './utils/authService';
import { User as UserType } from './types/auth';

function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'viewer' | 'advanced' | 'ai' | 'uml' | 'ai-uml'>('editor');
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    navigate('/dashboard'); // Navigate to dashboard after successful login
  };

  const handleLogout = () => {
    authService.logout(); // Assuming authService has a logout method
    setUser(null);
    navigate('/'); // Navigate to landing page after logout
  };

  const handleLoginFromLanding = () => {
    navigate('/login'); // Navigate to login page
  };

  const handleViewBlog = () => {
    navigate('/blog'); // Navigate to blog page
  };

  const handleViewArticle = (articleId: string) => {
    navigate(`/blog/${articleId}`); // Navigate to specific article
  };

  const handleBackToBlog = () => {
    navigate('/blog'); // Navigate back to blog list
  };

  const scrollToSection = useCallback((id: string) => {
    // If not on landing page, navigate to home first, then scroll
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollToId: id } }); // Pass scroll target as state
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [navigate]);

  // Effect to handle scrolling after navigation
  useEffect(() => {
    if (window.location.pathname === '/' && window.history.state && window.history.state.usr && window.history.state.usr.scrollToId) {
      const element = document.getElementById(window.history.state.usr.scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [window.location.pathname]);


  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ArchitectGood...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar
        onLogin={handleLoginFromLanding}
        onViewBlog={handleViewBlog}
        scrollToSection={scrollToSection}
        isLoggedIn={!!user}
        user={user || undefined}
        onLogout={handleLogout}
        onShowProfile={() => navigate('/profile')} // Navigate to profile route
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowLandingPage={() => navigate('/')} // Navigate to home route
      />

      <Routes>
        <Route path="/" element={<LandingPage onLogin={handleLoginFromLanding} onViewBlog={handleViewBlog} />} />
        <Route path="/login" element={<AuthPage onAuthSuccess={handleAuthSuccess} onLogin={handleLoginFromLanding} onViewBlog={handleViewBlog} scrollToSection={scrollToSection} />} />
        <Route path="/blog" element={<BlogPage onViewArticle={handleViewArticle} />} />
        <Route path="/blog/:articleId" element={<ArticlePage onBack={handleBackToBlog} />} />
        <Route path="/profile" element={user ? (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 pt-16">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => navigate('/dashboard')} // Navigate back to dashboard
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to Tools
                </button>
              </div>
              <UserProfile user={user} onLogout={handleLogout} />
            </div>
          </div>
        ) : <AuthPage onAuthSuccess={handleAuthSuccess} onLogin={handleLoginFromLanding} onViewBlog={handleViewBlog} scrollToSection={scrollToSection} />} />
        <Route path="/dashboard" element={user ? (
          <div className="pt-16">
            {activeTab === 'editor' && <MermaidEditor />}
            {activeTab === 'viewer' && <PlugAndPlayViewer />}
            {activeTab === 'advanced' && <AdvancedEditor />}
            {activeTab === 'ai' && <AIGenerator />}
            {activeTab === 'uml' && <UMLGenerator />}
            {activeTab === 'ai-uml' && <AIUMLGenerator />}
          </div>
        ) : <AuthPage onAuthSuccess={handleAuthSuccess} onLogin={handleLoginFromLanding} onViewBlog={handleViewBlog} scrollToSection={scrollToSection} />} />
        {/* Training Routes */}
        <Route path="/training" element={<TrainingCategories />} />
        <Route path="/training/design" element={<DesignCourses />} />
        <Route path="/training/design/architectural-design-patterns" element={<ArchitecturalDesignPatternsCoursePage />} />
        <Route path="/training/devops" element={<DevOpsCourses />} /> {/* New DevOps category route */}
        <Route path="/training/devops/devops-basics" element={<DevOpsBasicsCoursePage />} /> {/* New DevOps course route */}
      </Routes>
    </div>
  );
}

// Wrapper component to use useNavigate outside of App
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;



