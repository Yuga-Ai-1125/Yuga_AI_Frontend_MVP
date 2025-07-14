import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthProvider as AuthProviderType } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: AuthProviderType) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Simulated user database
const userDatabase = new Map<string, any>();

// Helper functions for password hashing (simplified for demo)
const hashPassword = (password: string): string => {
  // In a real app, use bcrypt or similar
  return btoa(password + 'salt');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Helper function to generate user ID
const generateUserId = (): string => {
  return 'user_' + Math.random().toString(36).substr(2, 9);
};

// Helper function to validate email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Check for existing session
    const checkSession = () => {
      try {
        const sessionData = localStorage.getItem('yuga_session');
        const userData = localStorage.getItem('yuga_user');
        
        if (sessionData && userData) {
          const session = JSON.parse(sessionData);
          const user = JSON.parse(userData);
          
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - session.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            // Convert date strings back to Date objects
            if (user.createdAt) user.createdAt = new Date(user.createdAt);
            if (user.lastLogin) user.lastLogin = new Date(user.lastLogin);
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            return;
          } else {
            // Session expired
            localStorage.removeItem('yuga_session');
            localStorage.removeItem('yuga_user');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        localStorage.removeItem('yuga_session');
        localStorage.removeItem('yuga_user');
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate input
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Check if user exists in our simulated database
      const userData = userDatabase.get(email.toLowerCase());
      
      if (!userData) {
        throw new Error('No account found with this email address');
      }
      
      // Verify password
      if (!verifyPassword(password, userData.passwordHash)) {
        throw new Error('Incorrect password');
      }
      
      // Check if email is verified
      if (!userData.emailVerified) {
        throw new Error('Please verify your email address before signing in');
      }
      
      // Update last login
      userData.lastLogin = new Date();
      userDatabase.set(email.toLowerCase(), userData);
      
      // Create user object (without sensitive data)
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        preferences: userData.preferences,
        progress: userData.progress,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin
      };

      // Create session
      const session = {
        userId: user.id,
        timestamp: Date.now()
      };

      localStorage.setItem('yuga_session', JSON.stringify(session));
      localStorage.setItem('yuga_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed. Please try again.'
      }));
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate input
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      if (!isValidPassword(password)) {
        throw new Error('Password must be at least 8 characters long');
      }
      
      // Check if user already exists
      if (userDatabase.has(email.toLowerCase())) {
        throw new Error('An account with this email already exists');
      }
      
      // Create new user
      const userId = generateUserId();
      const now = new Date();
      
      const userData = {
        id: userId,
        name: name.trim(),
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        emailVerified: true, // Auto-verify for demo purposes
        avatar: null,
        preferences: {
          learningStyle: 'visual' as const,
          difficulty: 'beginner' as const,
          subjects: [],
          notifications: true
        },
        progress: {
          totalCourses: 0,
          completedCourses: 0,
          currentStreak: 0,
          totalHours: 0,
          achievements: [],
          weeklyGoal: 5,
          weeklyProgress: 0
        },
        createdAt: now,
        lastLogin: now
      };
      
      // Store in database
      userDatabase.set(email.toLowerCase(), userData);
      
      // Create user object (without sensitive data)
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        preferences: userData.preferences,
        progress: userData.progress,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin
      };

      // Create session
      const session = {
        userId: user.id,
        timestamp: Date.now()
      };

      localStorage.setItem('yuga_session', JSON.stringify(session));
      localStorage.setItem('yuga_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Signup failed. Please try again.'
      }));
      throw error;
    }
  };

  const loginWithProvider = async (provider: AuthProviderType) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful OAuth response
      const mockOAuthUser = {
        id: generateUserId(),
        name: provider === 'google' ? 'John Doe' : 'Jane Smith',
        email: provider === 'google' ? 'john.doe@gmail.com' : 'jane.smith@icloud.com',
        avatar: provider === 'google' 
          ? 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100'
          : 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
        emailVerified: true
      };
      
      // Check if user already exists
      let userData = userDatabase.get(mockOAuthUser.email.toLowerCase());
      
      if (!userData) {
        // Create new user from OAuth data
        const now = new Date();
        userData = {
          ...mockOAuthUser,
          passwordHash: null, // OAuth users don't have passwords
          preferences: {
            learningStyle: 'visual' as const,
            difficulty: 'beginner' as const,
            subjects: [],
            notifications: true
          },
          progress: {
            totalCourses: 0,
            completedCourses: 0,
            currentStreak: 0,
            totalHours: 0,
            achievements: [],
            weeklyGoal: 5,
            weeklyProgress: 0
          },
          createdAt: now,
          lastLogin: now
        };
        
        userDatabase.set(mockOAuthUser.email.toLowerCase(), userData);
      } else {
        // Update last login for existing user
        userData.lastLogin = new Date();
        userDatabase.set(mockOAuthUser.email.toLowerCase(), userData);
      }
      
      // Create user object (without sensitive data)
      const user: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        preferences: userData.preferences,
        progress: userData.progress,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin
      };

      // Create session
      const session = {
        userId: user.id,
        timestamp: Date.now()
      };

      localStorage.setItem('yuga_session', JSON.stringify(session));
      localStorage.setItem('yuga_user', JSON.stringify(user));
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: `${provider} login failed. Please try again.`
      }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('yuga_session');
    localStorage.removeItem('yuga_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;
    
    try {
      // Update user data in database
      const userData = userDatabase.get(authState.user.email.toLowerCase());
      if (userData) {
        Object.assign(userData, updates);
        userDatabase.set(authState.user.email.toLowerCase(), userData);
      }
      
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem('yuga_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!isValidEmail(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      const userData = userDatabase.get(email.toLowerCase());
      if (!userData) {
        // Don't reveal if email exists for security
        return;
      }
      
      // In a real app, send password reset email
      console.log('Password reset email sent to:', email);
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // Simulate email verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, verify the token and update user's email verification status
      console.log('Email verified with token:', token);
    } catch (error) {
      throw new Error('Email verification failed');
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      loginWithProvider,
      logout,
      updateProfile,
      resetPassword,
      verifyEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};