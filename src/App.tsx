import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  BookOpen,
  MessageCircle,
  BarChart3,
  Award,
  Menu,
  X,
  Search,
  Bell,
  HelpCircle,
  RefreshCw,
  Trophy,
  Notebook,
  Video,
  Image,
  Briefcase,
  Calculator,
  FlaskConical,
  Globe,
  Languages,
  Circle,
  User,
  ClipboardList,
  Compass,
  Cpu,
  Code,
  Dna,
} from "lucide-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthModal } from "./components/auth/AuthModal";
import { ProfileModal } from "./components/profile/ProfileModal";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import CourseCard from "./components/CourseCard";
import { ChatInterface } from "./components/ChatInterface";
import { QuizComponent } from "./components/QuizComponent";
import { AIClassroom } from "./components/course/AIClassroom";
import { DoubtSolver } from "./components/doubts/DoubtSolver";
import { AIAvatar } from "./components/AIAvatar";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";
import {
  mockCourses,
  mockUserProgress,
  mockQuizQuestions,
} from "./data/mockData";
import { Course } from "./types";
import ErrorBoundary from "./ErrorBoundary";

// Import all page components for routing
import { AboutUs } from "./pages/company/AboutUs";
import { OurMission } from "./pages/company/OurMission";
import { Careers } from "./pages/company/Careers";
import { Press } from "./pages/company/Press";
import { HelpCenter } from "./pages/support/HelpCenter";
import { ContactUs } from "./pages/support/ContactUs";
import { SystemStatus } from "./pages/support/SystemStatus";
import { Community } from "./pages/support/Community";
import { PrivacyPolicy } from "./pages/legal/PrivacyPolicy";
import { TermsOfService } from "./pages/legal/TermsOfService";
import { CookiePolicy } from "./pages/legal/CookiePolicy";
import { GDPR } from "./pages/legal/GDPR";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";

// Define possible active views in the application
type ActiveView =
  | "dashboard"
  | "notes"
  | "exercises"
  | "career-guide"
  | "certificate"
  | "revision"
  | "media";

// Main application component that handles routing and state management
function MainApp() {
  // Authentication state and user information
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // State management for various UI components and features
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDoubtSolverOpen, setIsDoubtSolverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">(
    "login"
  );
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [activeMediaTab, setActiveMediaTab] = useState<"videos" | "images">(
    "videos"
  );

  // Show loading state while checking authentication session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  // Show onboarding flow for new/unauthenticated users
  if (showOnboarding && !isAuthenticated) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  // Navigation items with icons and labels for the sidebar
  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    { id: "notes", label: "Notes", icon: <Notebook className="w-5 h-5" /> },
    { id: "media", label: "Media", icon: <Video className="w-5 h-5" /> },
    {
      id: "exercises",
      label: "Exercises with OCR",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: "certificate",
      label: "Champion Certificate",
      icon: <Trophy className="w-5 h-5" />,
    },
    {
      id: "revision",
      label: "Revision",
      icon: <RefreshCw className="w-5 h-5" />,
    },
    {
      id: "career-guide",
      label: "AI Career Guide",
      icon: <Briefcase className="w-5 h-5" />,
    },
  ];

  // Handler for authentication actions (login/signup)
  const handleAuthAction = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Handler for when a course is clicked
  const handleCourseClick = (course: Course) => {
    if (!isAuthenticated) {
      handleAuthAction("login");
      return;
    }
    setSelectedCourse(course);
    setSelectedLesson(course.lessons[0]); // Start with first lesson
  };

  // Filter courses based on search query
  const filteredCourses = mockCourses.filter((course) => {
    if (!courseSearchQuery.trim()) return true;

    const searchTerm = courseSearchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
  });

  // Main content renderer based on active view and authentication status
  const renderContent = () => {
    // Show landing page for unauthenticated users
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50">
          {/* Hero Section */}
          <div className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="text-center">
                <div className="mb-8">
                  <AIAvatar size="xl" emotion="happy" isActive />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                  Welcome to YUGA AI
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Revolutionary AI-powered education platform with interactive
                  avatars, personalized learning paths, and intelligent
                  doubt-solving capabilities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleAuthAction("signup")}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Start Learning for Free
                  </button>
                  <button
                    onClick={() => handleAuthAction("login")}
                    className="border border-purple-600 text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why Choose YUGA AI?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    AI Avatar Teachers
                  </h3>
                  <p className="text-gray-600">
                    Learn from intelligent AI avatars that adapt to your learning
                    style and provide personalized guidance.
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Smart Doubt Solving
                  </h3>
                  <p className="text-gray-600">
                    Get instant answers to your questions with our advanced AI
                    doubt-solving system that understands context and provides
                    detailed explanations.
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Progress Tracking
                  </h3>
                  <p className="text-gray-600">
                    Monitor your learning journey with detailed analytics and
                    personalized recommendations.
                  </p>
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Explore Our Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Course cards would be rendered here */}
                {/* <CourseCard
                    onClick={() => handleCourseClick(course)}
                  /> */}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Switch statement to render different views based on activeView state
    switch (activeView) {
      case "notes":
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                My Notes
              </h1>
              <p className="text-gray-600">
                Your personalized notes from all courses
              </p>
            </div>

            {/* Notes Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Notes by Subject */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Notebook className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Notes by Subject
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Organized notes from each of your courses. Click to view and
                  edit.
                </p>

                <div className="space-y-4">
                  {mockCourses.slice(0, 4).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded mr-4 ${course.color}`} />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {course.notesCount || Math.floor(Math.random() * 10) + 1} notes
                        </p>
                      </div>
                      <div className="text-gray-400">
                        <Circle className="w-5 h-5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Notes */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Notes
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-900">
                      Quadratic Equations
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Mathematics • 2 hours ago
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900">
                      Photosynthesis Process
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Science • 1 day ago
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Shakespeare's Sonnets
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      English • 2 days ago
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add new note form */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Note</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="note-title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="note-title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter note title..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="note-subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject
                  </label>
                  <select
                    id="note-subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option>Select subject...</option>
                    <option>Mathematics</option>
                    <option>Science</option>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Social Science</option>
                    <option>Computer Applications</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="note-content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="note-content"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Write your note here..."
                ></textarea>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                  Save Note
                </button>
              </div>
            </div>
          </div>
        );

      case "media":
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Media Library
              </h1>
              <p className="text-gray-600">
                Your videos and images for all courses
              </p>
            </div>

            {/* Tabs for Videos/Images */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeMediaTab === "videos"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveMediaTab("videos")}
              >
                <div className="flex items-center">
                  <Video className="w-4 h-4 mr-2" />
                  Videos
                </div>
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeMediaTab === "images"
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveMediaTab("images")}
              >
                <div className="flex items-center">
                  <Image className="w-4 h-4 mr-2" />
                  Images
                </div>
              </button>
            </div>

            {activeMediaTab === "videos" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Sample Video {index}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Mathematics • {Math.floor(Math.random() * 20) + 5} min
                      </p>
                      <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Watch Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-900 text-sm">
                        Sample Image {index}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Mathematics • Diagram
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "exercises":
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Exercises with OCR
              </h1>
              <p className="text-gray-600">
                Solve problems by writing on paper and let our AI recognize your
                work
              </p>
            </div>

            {/* Exercise Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Area */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Calculator className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Upload Your Work
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Take a photo of your handwritten solutions and our AI will
                  analyze your work and provide feedback.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <div className="flex flex-col items-center justify-center">
                    <Image className="w-12 h-12 text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">
                      Drag and drop image here
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">or</p>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                      Select from device
                    </button>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, PDF. Max file size: 5MB.
                </div>
              </div>

              {/* Recent Exercises */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Exercises
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Your recently solved exercises and their solutions.
                </p>

                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <Calculator className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          Exercise {index}: Quadratic Equations
                        </h3>
                        <p className="text-sm text-gray-600">
                          Mathematics • {Math.floor(Math.random() * 24) + 1} hours ago
                        </p>
                      </div>
                      <div className="text-green-600 font-semibold">
                        {Math.floor(Math.random() * 20) + 80}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "career-guide":
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Career Guide
              </h1>
              <p className="text-gray-600">
                Discover your ideal career path with AI-powered guidance
              </p>
            </div>

            {/* Career Guide Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Career Assessment */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Compass className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Career Assessment
                  </h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Take our comprehensive assessment to discover careers that match
                  your interests, skills, and personality.
                </p>

                <div className="space-y-4">
                  {[
                    "Technical Aptitude Test",
                    "Interest Inventory",
                    "Personality Assessment",
                    "Skills Evaluation",
                  ].map((test, index) => (
                    <div
                      key={index}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <ClipboardList className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{test}</h3>
                        <p className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 20) + 10} questions • {Math.floor(Math.random() * 20) + 15} minutes
                        </p>
                      </div>
                      <div className="text-purple-600 font-semibold">
                        Start
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Suggestions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recommended Careers
                </h3>
                <div className="space-y-3">
                  {[
                    { title: "Software Developer", match: "95%" },
                    { title: "Data Scientist", match: "89%" },
                    { title: "AI Engineer", match: "87%" },
                    { title: "Product Manager", match: "82%" },
                    { title: "UX Designer", match: "78%" },
                  ].map((career, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-medium text-purple-900">
                          {career.title}
                        </p>
                        <span className="text-xs text-purple-600">
                          {career.match} match
                        </span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: career.match }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "certificate":
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Champion Certificate
              </h1>
              <p className="text-gray-600">
                Complete quizzes to earn your certificate of achievement
              </p>
            </div>

            {/* Quiz Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-8 mb-8">
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
                <h2 className="text-3xl font-bold mb-2">Ready for the Challenge?</h2>
                <p className="text-purple-100 text-lg mb-6">
                  Test your knowledge and earn your Champion Certificate. You need
                  80% or higher to pass!
                </p>

                {quizScore !== null && (
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2">
                      {quizScore}%
                    </div>
                    {quizScore >= 80 ? (
                      <div className="mb-4">
                        <div className="text-green-300 font-bold mb-2">
                          🏆 Certificate Earned!
                        </div>
                        <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 mr-2">
                          Download Certificate
                        </button>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <div className="text-orange-300 font-bold mb-2">
                          Keep Practicing!
                        </div>
                        <p className="text-sm text-purple-100 mb-2">
                          You need 80% or higher to earn a certificate
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => setQuizScore(null)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {quizScore === null && (
                  <QuizComponent
                    questions={mockQuizQuestions}
                    onComplete={setQuizScore}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case "revision":
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Revision Center
              </h1>
              <p className="text-gray-600">
                Review and reinforce your learning with AI-powered revision
                tools
              </p>
            </div>

            {/* Revision Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Revision */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <RefreshCw className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Quick Revision
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Review key concepts from your recent lessons with AI-generated
                  summaries and flashcards.
                </p>

                <div className="space-y-4">
                  {mockCourses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className={`w-4 h-4 rounded mr-4 ${course.color}`} />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {course.title} - Quick Review
                        </h3>
                        <p className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 10) + 5} flashcards ready
                        </p>
                      </div>
                      <div className="text-purple-600 font-semibold">
                        Start
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Schedule */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Bell className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Study Schedule
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  AI-optimized schedule based on forgetting curve and your
                  learning patterns.
                </p>

                <div className="space-y-3">
                  {[
                    {
                      topic: "Quadratic Equations",
                      due: "Due now",
                      urgent: true,
                    },
                    {
                      topic: "Cell Division",
                      due: "Due in 2 hours",
                      urgent: false,
                    },
                    {
                      topic: "Shakespeare Analysis",
                      due: "Due tomorrow",
                      urgent: false,
                    },
                    {
                      topic: "Indian Constitution",
                      due: "Due in 3 days",
                      urgent: false,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                        item.urgent
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded mr-3 ${
                          item.urgent ? "bg-red-500" : "bg-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p
                          className={`font-medium ${
                            item.urgent ? "text-red-900" : "text-gray-900"
                          }`}
                        >
                          {item.topic}
                        </p>
                        <p
                          className={`text-sm ${
                            item.urgent ? "text-red-600" : "text-gray-500"
                          }`}
                        >
                          {item.due}
                        </p>
                      </div>
                      {item.urgent && (
                        <Bell className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.fullName || "Student"}!
                  </h1>
                  <p className="text-purple-100 text-lg">
                    Ready to continue your AI-powered learning journey?
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => setIsDoubtSolverOpen(true)}
                      className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Ask Doubt
                    </button>
                    <button
                      onClick={() => setIsChatOpen(true)}
                      className="bg-purple-500 bg-opacity-50 text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-70 transition-colors"
                    >
                      Chat with AI
                    </button>
                  </div>
                </div>
                <AIAvatar size="large" emotion="happy" isActive />
              </div>
            </div>

            {/* Course Search */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Courses
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Continue learning or explore new subjects
                  </p>
                </div>
                <div className="relative w-full lg:w-auto">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses, subjects, or topics..."
                    value={courseSearchQuery}
                    onChange={(e) => setCourseSearchQuery(e.target.value)}
                    className="w-full lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {courseSearchQuery && (
                    <button
                      onClick={() => setCourseSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search Results Info */}
              {courseSearchQuery && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">
                    {filteredCourses.length === 0
                      ? `No courses found for "${courseSearchQuery}"`
                      : `Found ${filteredCourses.length} course${
                          filteredCourses.length === 1 ? "" : "s"
                        } matching "${courseSearchQuery}"`}
                  </p>
                  {filteredCourses.length === 0 && (
                    <p className="text-blue-600 text-sm mt-1">
                      Try searching for: Mathematics, Science, English, Hindi,
                      Social Science, or Computer Applications
                    </p>
                  )}
                </div>
              )}

              <div className="grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <CourseCard
                  onCourseClick={handleCourseClick}
                  searchQuery={courseSearchQuery}
                />
              </div>

              {/* No results message */}
              {filteredCourses.length === 0 && courseSearchQuery && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any courses matching your search. Try
                    different keywords or browse all courses.
                  </p>
                  <button
                    onClick={() => setCourseSearchQuery("")}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Show All Courses
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Courses in Progress</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Learning Streak</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user?.progress.currentStreak ?? 0} days
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Hours This Week</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {user?.progress.weeklyProgress ?? 0}
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Certificates</p>
                    <p className="text-2xl font-bold text-gray-900">1</p>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Helper function to get subject color for UI elements
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      Mathematics: "bg-purple-500",
      Science: "bg-green-500",
      English: "bg-blue-500",
      Hindi: "bg-yellow-500",
      "Social Science": "bg-red-500",
      "Computer Applications": "bg-indigo-500",
    };
    return colors[subject] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation component */}
      <Navigation
        isAuthenticated={isAuthenticated}
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        navigation={navigation}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        handleAuthAction={handleAuthAction}
        setIsDoubtSolverOpen={setIsDoubtSolverOpen}
        setIsChatOpen={setIsChatOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
      />

      {/* Main Content */}
      <main className="flex-1">
        {isAuthenticated ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals and Overlays */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* AI Classroom modal when a course and lesson are selected */}
      {selectedCourse && selectedLesson && (
        <AIClassroom
          course={selectedCourse}
          lesson={selectedLesson}
          isOpen={true}
          onClose={() => {
            setSelectedCourse(null);
            setSelectedLesson(null);
          }}
        />
      )}

      {/* Doubt solver modal */}
      <DoubtSolver
        isOpen={isDoubtSolverOpen}
        onClose={() => setIsDoubtSolverOpen(false)}
      />

      {/* Chat Interface */}
      {isAuthenticated && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {/* Floating Chat Button - Only show when authenticated and chat is closed */}
      {isAuthenticated && !isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-110 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

// Main App component with routing and authentication provider
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* Company pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/mission" element={<OurMission />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          
          {/* Support pages */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/community" element={<Community />} />
          
          {/* Legal pages */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/gdpr" element={<GDPR />} />
          
          {/* Catch-all route redirects to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
