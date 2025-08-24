import React, { useState } from 'react';
import { 
  User, Mail, Lock, Eye, EyeOff, LogIn, UserPlus, 
  ArrowLeft, AlertCircle, CheckCircle, Loader2, FileText
} from 'lucide-react';
import { authService } from '../utils/authService';
import { LoginCredentials, RegisterCredentials } from '../types/auth';
import NavBar from './NavBar'; // Import NavBar

interface AuthPageProps {
  onAuthSuccess: () => void;
  onLogin: () => void; // Passed from App.tsx to NavBar
  onViewBlog: () => void; // Passed from App.tsx to NavBar
  scrollToSection: (id: string) => void; // Passed from App.tsx to NavBar
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onLogin, onViewBlog, scrollToSection }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotEmail, setForgotEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(loginForm);
      
      if (response.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          onAuthSuccess();
        }, 1000);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(registerForm);
      
      if (response.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          onAuthSuccess();
        }, 1000);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.resetPassword(forgotEmail);
      
      if (response.success) {
        setSuccess(response.message || 'Reset instructions sent!');
        setTimeout(() => {
          setMode('login');
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.message || 'Failed to send reset instructions');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ name: '', email: '', password: '', confirmPassword: '' });
    setForgotEmail('');
    setError(null);
    setSuccess(null);
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    resetForms();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar
        onLogin={onLogin}
        onViewBlog={onViewBlog}
        scrollToSection={scrollToSection}
        isLoggedIn={false} // AuthPage means not logged in yet
      />
      <div className="pt-16 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">ArchitectGood AI Diagrams</h1>
            </div>
            <p className="text-gray-600">
              {mode === 'login' && 'Welcome back! Sign in to your account'}
              {mode === 'register' && 'Create your account to get started'}
              {mode === 'forgot' && 'Reset your password'}
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              {/* Mode Tabs */}
              {mode !== 'forgot' && (
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => switchMode('login')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === 'login'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                  <button
                    onClick={() => switchMode('register')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === 'register'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </button>
                </div>
              )}

              {/* Back Button for Forgot Password */}
              {mode === 'forgot' && (
                <button
                  onClick={() => switchMode('login')}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </button>
              )}

              {/* Error/Success Messages */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-green-700 text-sm">{success}</p>
                  </div>
                </div>
              )}

              {/* Login Form */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-primary hover:text-primary-dark text-sm"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <LogIn className="w-5 h-5" />
                    )}
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              )}

              {/* Register Form */}
              {mode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      required
                      className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:text-primary-dark">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary hover:text-primary-dark">
                        Privacy Policy
                      </a>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* Forgot Password Form */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-600 text-sm">
                      Enter your email address and we'll send you instructions to reset your password.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-xl hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Mail className="w-5 h-5" />
                    )}
                    {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                {mode === 'login' && (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => switchMode('register')}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Sign up here
                    </button>
                  </>
                )}
                {mode === 'register' && (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => switchMode('login')}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Sign in here
                    </button>
                  </>
                )}
                {mode === 'forgot' && (
                  <>
                    Remember your password?{' '}
                    <button
                      onClick={() => switchMode('login')}
                      className="text-primary hover:text-primary-dark font-medium"
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
