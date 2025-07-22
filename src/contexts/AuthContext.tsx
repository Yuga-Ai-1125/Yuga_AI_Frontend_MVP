import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { User, AuthState, AuthProvider as AuthProviderType } from "../types";
import { api } from "../utils/api";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: AuthProviderType) => Promise<void>; // Optional
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>; // Optional
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/auth/me");
        console.log(res);

        setAuthState({
          user: {
            ...res.data.user,
            progress: {
              currentStreak: 5,
            }, // 👈 static value
          },
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await api.post("/auth/login", { email, password });

      setAuthState({
        user: {
          ...res.data.user,
          progress: {
            currentStreak: 5,
          }, // 👈 Static value added here
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Store token for session persistence
      localStorage.setItem("token", res.data.token);

      console.log(res);
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Login failed",
      }));
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await api.post("/auth/signup", {
        fullName: name,
        email,
        password,
        confirmPassword: password,
      });
      setAuthState({
        user: res.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || "Signup failed",
      }));
      throw error;
    }
  };
  const logout = async () => {
    try {
      await api.post("/auth/logout"); // Optional
    } catch (err) {
      console.warn("Logout failed, continuing anyway...");
    } finally {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) return;
    try {
      const res = await api.put(`/auth/users/${authState.user.id}`, updates);
      const updatedUser = res.data.user;
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
    } catch (err) {
      console.error("Update profile error:", err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await api.post("/auth/forgot-password", { email });
    } catch (err) {
      console.error("Reset password error:", err);
      throw err;
    }
  };

  const verifyEmail = async (token: string) => {
    console.log("⚠️ Email verification not implemented in backend yet.");
  };

  const loginWithProvider = async (provider: AuthProviderType) => {
    console.log("⚠️ OAuth not implemented in frontend yet.");
  };

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
