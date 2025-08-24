import React, { useState, useEffect, useCallback } from 'react';

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

import { FileText, Puzzle, Code2, Sparkles, Layers, User, LogOut, BookCheck, Rss } from 'lucide-react';
import { authService } from './utils/authService';
import { User as UserType } from './types/auth';

function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'viewer' | 'advanced' | 'ai' | 'uml' | 'ai-uml'>('editor');
  const [user, setUser] = useState<UserType | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showBlog, setShowBlog] = useState(false);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setShowLandingPage(false);
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setShowLandingPage(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowProfile(false);
    setShowLandingPage(true);
    setShowBlog(false);
    setCurrentArticleId(null);
  };

  const handleLoginFromLanding = () => {
    setShowLandingPage(false);
    setShowBlog(false);
    setCurrentArticleId(null);
  };

  const handleViewBlog = () => {
    setShowLandingPage(false);
    setShowBlog(true);
    setCurrentArticleId(null);
  };

  const handleViewArticle = (articleId: string) => {
    setShowBlog(true);
    setCurrentArticleId(articleId);
  };

  const handleBackToBlog = () => {
    setCurrentArticleId(null);
  };

  const scrollToSection = useCallback((id: string) => {
    // If currently on blog or auth page, switch to landing page first
    if (!showLandingPage) {
      setShowLandingPage(true);
      setShowBlog(false);
      setCurrentArticleId(null);
      // Allow state update to render LandingPage, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0); // Use setTimeout to ensure state update and re-render happens before scroll
    } else {
      // Already on landing page, just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [showLandingPage]);

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
        onShowProfile={() => setShowProfile(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowLandingPage={setShowLandingPage}
      />

      {showLandingPage ? (
        <LandingPage onLogin={handleLoginFromLanding} onViewBlog={handleViewBlog} />
      ) : showBlog ? (
        currentArticleId ? (
          <ArticlePage articleId={currentArticleId} onBack={handleBackToBlog} />
        ) : (
          <BlogPage onViewArticle={handleViewArticle} />
        )
      ) : !user ? (
        <AuthPage onAuthSuccess={handleAuthSuccess} onLogin={handleLoginFromLanding} onViewBlog={handleViewBlog} scrollToSection={scrollToSection} />
      ) : showProfile ? (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 pt-16"> {/* Added pt-16 for navbar */}
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <button
                onClick={() => setShowProfile(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Tools
              </button>
            </div>
            <UserProfile user={user} onLogout={handleLogout} />
          </div>
        </div>
      ) : (
        <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
          {activeTab === 'editor' && <MermaidEditor />}
          {activeTab === 'viewer' && <PlugAndPlayViewer />}
          {activeTab === 'advanced' && <AdvancedEditor />}
          {activeTab === 'ai' && <AIGenerator />}
          {activeTab === 'uml' && <UMLGenerator />}
          {activeTab === 'ai-uml' && <AIUMLGenerator />}
        </div>
      )}
    </div>
  );
}

export default App;


