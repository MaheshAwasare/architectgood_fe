import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private authToken: string | null = null;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    // Load user from localStorage on initialization
    this.loadUserFromStorage();
  }

  // Abstract method - replace with real authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Abstract login logic - replace with real API call
      if (this.validateEmail(credentials.email) && credentials.password.length >= 6) {
        const user: User = {
          id: `user_${Date.now()}`,
          email: credentials.email,
          name: credentials.email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
          createdAt: new Date(),
          lastLogin: new Date()
        };

        const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.currentUser = user;
        this.authToken = token;
        this.saveUserToStorage(user, token);

        return {
          success: true,
          user,
          token,
          message: 'Login successful'
        };
      } else {
        return {
          success: false,
          message: 'Invalid email or password'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  // Abstract method - replace with real authentication
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Validation
      if (!this.validateEmail(credentials.email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      if (credentials.password.length < 6) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long'
        };
      }

      if (credentials.password !== credentials.confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match'
        };
      }

      if (credentials.name.trim().length < 2) {
        return {
          success: false,
          message: 'Name must be at least 2 characters long'
        };
      }

      // Abstract registration logic - replace with real API call
      const user: User = {
        id: `user_${Date.now()}`,
        email: credentials.email,
        name: credentials.name.trim(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
        createdAt: new Date()
      };

      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.currentUser = user;
      this.authToken = token;
      this.saveUserToStorage(user, token);

      return {
        success: true,
        user,
        token,
        message: 'Registration successful'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  // Abstract method - replace with real logout
  async logout(): Promise<void> {
    try {
      // Simulate API call for logout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.currentUser = null;
      this.authToken = null;
      this.clearUserFromStorage();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.authToken !== null;
  }

  // Get auth token
  getAuthToken(): string | null {
    return this.authToken;
  }

  // Abstract method - replace with real token validation
  async validateToken(token: string): Promise<boolean> {
    try {
      // Simulate API call to validate token
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Abstract validation logic - replace with real API call
      return token.startsWith('token_') && token.length > 20;
    } catch (error) {
      return false;
    }
  }

  // Abstract method - replace with real password reset
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!this.validateEmail(email)) {
        return {
          success: false,
          message: 'Please enter a valid email address'
        };
      }

      // Abstract password reset logic - replace with real API call
      return {
        success: true,
        message: 'Password reset instructions sent to your email'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send reset instructions. Please try again.'
      };
    }
  }

  // Utility methods
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private saveUserToStorage(user: User, token: string): void {
    try {
      localStorage.setItem('mermaid_user', JSON.stringify(user));
      localStorage.setItem('mermaid_token', token);
    } catch (error) {
      console.error('Failed to save user to storage:', error);
    }
  }

  private loadUserFromStorage(): void {
    try {
      const userStr = localStorage.getItem('mermaid_user');
      const token = localStorage.getItem('mermaid_token');
      
      if (userStr && token) {
        this.currentUser = JSON.parse(userStr);
        this.authToken = token;
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      this.clearUserFromStorage();
    }
  }

  private clearUserFromStorage(): void {
    try {
      localStorage.removeItem('mermaid_user');
      localStorage.removeItem('mermaid_token');
    } catch (error) {
      console.error('Failed to clear user from storage:', error);
    }
  }
}

export const authService = AuthService.getInstance();