import React, { useState } from "react";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<
    "login" | "signup" | "forgot-password" | "success"
  >(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const { login, signup, loginWithProvider, resetPassword, isLoading, error } =
    useAuth();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (mode === "signup") {
      if (!formData.name.trim()) {
        errors.name = "Name is required";
      } else if (formData.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (mode !== "forgot-password") {
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        onClose();
      } else if (mode === "signup") {
        await signup(formData.name, formData.email, formData.password);
        onClose();
      } else if (mode === "forgot-password") {
        await resetPassword(formData.email);
        setMode("success");
      }
    } catch (error) {
      // Error is handled by context
    }
  };

  const handleProviderLogin = async (provider: "google" | "apple") => {
    try {
      await loginWithProvider(provider);
      onClose();
    } catch (error) {
      // Error is handled by context
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setValidationErrors({});
  };

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 p-4 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {mode === "forgot-password" && (
            <button
              onClick={() => handleModeChange("login")}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 text-white hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              {mode === "success" ? (
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              ) : (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    Y
                  </span>
                </div>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {mode === "login" && "Welcome Back"}
              {mode === "signup" && "Join YUGA AI"}
              {mode === "forgot-password" && "Reset Password"}
              {mode === "success" && "Check Your Email"}
            </h2>
            <p className="text-purple-100 text-sm sm:text-base">
              {mode === "login" && "Continue your learning journey"}
              {mode === "signup" && "Start your AI-powered education"}
              {mode === "forgot-password" &&
                "Enter your email to reset your password"}
              {mode === "success" && "We've sent you a password reset link"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          {mode === "success" ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                If an account with that email exists, you'll receive a password
                reset link shortly.
              </p>
              <button
                onClick={() => handleModeChange("login")}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium text-sm sm:text-base"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                          validationErrors.name
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                        validationErrors.email
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-red-600 text-xs sm:text-sm mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {mode !== "forgot-password" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                          validationErrors.password
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </button>
                    </div>
                    {validationErrors.password && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {validationErrors.password}
                      </p>
                    )}
                  </div>
                )}

                {mode === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
                          validationErrors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirm your password"
                      />
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-red-600 text-xs sm:text-sm mt-1">
                        {validationErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                )}

                {mode === "login" && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => handleModeChange("forgot-password")}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                >
                  {isLoading ? (
                    <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <>
                      {mode === "login" && "Sign In"}
                      {mode === "signup" && "Create Account"}
                      {mode === "forgot-password" && "Send Reset Link"}
                    </>
                  )}
                </button>
              </form>

              {mode !== "forgot-password" && (
                <>
                  {/* Divider */}
                  <div className="my-4 sm:my-6 flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-xs sm:text-sm text-gray-500">
                      or continue with
                    </span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* Social Login */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleProviderLogin("google")}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-3"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Continue with Google
                    </button>

                    <button
                      onClick={() => handleProviderLogin("apple")}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-3"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      Continue with Apple
                    </button>
                  </div>

                  {/* Toggle Mode */}
                  <div className="mt-4 sm:mt-6 text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                      {mode === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}
                      <button
                        onClick={() =>
                          handleModeChange(
                            mode === "login" ? "signup" : "login"
                          )
                        }
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {mode === "login" ? "Sign up" : "Sign in"}
                      </button>
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
