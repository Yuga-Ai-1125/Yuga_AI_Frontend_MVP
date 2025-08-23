import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

// Define user interface for type safety
interface User {
  id: string;
  fullName: string;
  email: string;
  progress: {
    currentStreak: number;
  };
}

// Define authentication state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define authentication context interface with all available methods
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  loginWithProvider: (provider: AuthProviderType) => Promise<void>;
  setNewPassword: (token: string, password: string) => Promise<any>;
}

// Define supported OAuth providers
type AuthProviderType = "google" | "github" | "facebook";

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Authentication Provider Component
 * Provides authentication context to the entire application
 * Currently configured for MVP demo mode - bypasses real authentication
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize authentication state
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  /**
   * Check for existing authentication session on component mount
   * For MVP demo: Always set user as authenticated for seamless access
   */
  useEffect(() => {
    const checkSession = async () => {
      try {
        // For MVP demo: Always authenticate user with mock data
        setAuthState({
          user: {
            id: "demo-user-12345",
            fullName: "Demo User",
            email: "demo@yuga-ai.com",
            progress: {
              currentStreak: 5,
            },
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        /* Original session check logic (commented out for MVP)
        const token = localStorage.getItem("token");
        if (token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/auth/me");
          setAuthState({
            user: {
              ...res.data,
              progress: {
                currentStreak: res.data.currentStreak || 0,
              },
            },
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
        */
      } catch {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();
  }, []);

  /**
   * Demo login function for MVP
   * Accepts any credentials and always returns success
   * TODO: Implement proper authentication before production deployment
   */
  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // For MVP demo: Always succeed with mock user data
      setTimeout(() => {
        const mockUser = {
          id: "demo-user-" + Date.now(),
          fullName: "Demo User",
          email: email || "demo@yuga-ai.com",
          progress: {
            currentStreak: 5,
          },
        };

        // Store mock token for consistency
        localStorage.setItem("token", "demo-token-12345");
        api.defaults.headers.common["Authorization"] = "Bearer demo-token-12345";

        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }, 1000); // Simulate API delay

      /* Original login logic (commented out for MVP)
      const res = await api.post("/auth/login", { email, password });

      const token = res.data.token;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthState({
        user: {
          ...res.data.user,
          progress: {
            currentStreak: 5,
          },
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      */
    } catch (error: any) {
      // For MVP demo: Never actually fail login
      const mockUser = {
        id: "demo-user-fallback",
        fullName: "Demo User",
        email: email || "demo@yuga-ai.com",
        progress: {
          currentStreak: 5,
        },
      };

      localStorage.setItem("token", "demo-token-12345");
      api.defaults.headers.common["Authorization"] = "Bearer demo-token-12345";

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    }
  };

  /**
   * Demo signup function for MVP
   * Accepts any credentials and always returns success
   * TODO: Implement proper registration before production deployment
   */
  const signup = async (name: string, email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // For MVP demo: Always succeed with mock user data
      setTimeout(() => {
        const mockUser = {
          id: "demo-user-" + Date.now(),
          fullName: name || "Demo User",
          email: email || "demo@yuga-ai.com",
          progress: {
            currentStreak: 0,
          },
        };

        // Store mock token for consistency
        localStorage.setItem("token", "demo-token-12345");
        api.defaults.headers.common["Authorization"] = "Bearer demo-token-12345";

        setAuthState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }, 1000); // Simulate API delay

      /* Original signup logic (commented out for MVP)
      const res = await api.post("/auth/signup", {
        fullName: name,
        email,
        password,
        confirmPassword: password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAuthState({
        user: {
          ...res.data.user,
          progress: {
            currentStreak: 5,
          },
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      */
    } catch (error: any) {
      // For MVP demo: Never actually fail signup
      const mockUser = {
        id: "demo-user-fallback",
        fullName: name || "Demo User",
        email: email || "demo@yuga-ai.com",
        progress: {
          currentStreak: 0,
        },
      };

      localStorage.setItem("token", "demo-token-12345");
      api.defaults.headers.common["Authorization"] = "Bearer demo-token-12345";

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    }
  };

  /**
   * Logout function - clears authentication state and tokens
   */
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // Optional API call
    } catch (err) {
      console.warn("Logout API call failed, continuing anyway...");
    } finally {
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  /**
   * Demo update profile function for MVP
   * Always returns success for any update request
   */
  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;
    
    try {
      // For MVP demo: Always succeed with updated mock data
      const updatedUser = {
        ...authState.user,
        ...updates,
      };
      
      setAuthState((prev) => ({ ...prev, user: updatedUser }));

      /* Original update profile logic (commented out for MVP)
      const res = await api.put(`/auth/users/${authState.user.id}`, updates);
      const updatedUser = res.data.user;
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
      */
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  /**
   * Demo reset password function for MVP
   * Always returns success without sending actual email
   */
  const resetPassword = async (email: string) => {
    try {
      // For MVP demo: Always succeed
      console.log("Password reset requested for demo:", email);

      /* Original reset password logic (commented out for MVP)
      await api.post("/auth/forgot-password", { email });
      */
    } catch (err) {
      console.error("Reset password error:", err);
      throw err;
    }
  };

  /**
   * Demo set new password function for MVP
   * Always returns success
   */
  const setNewPassword = async (token: string, password: string) => {
    try {
      // For MVP demo: Always return success
      return { message: "Password reset successful (Demo mode)" };

      /* Original set new password logic (commented out for MVP)
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });
      return res.data;
      */
    } catch (err) {
      throw err;
    }
  };

  /**
   * Placeholder for email verification (optional feature)
   * TODO: Implement email verification before production deployment
   */
  const verifyEmail = async (token: string) => {
    console.log("Email verification not implemented in backend yet.");
  };

  /**
   * Placeholder for OAuth login (optional feature)
   * TODO: Implement OAuth providers before production deployment
   */
  const loginWithProvider = async (provider: AuthProviderType) => {
    console.log("OAuth not implemented in frontend yet.");
  };

  // Provide authentication context to child components
  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateProfile,
        resetPassword,
        verifyEmail,
        loginWithProvider,
        setNewPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
