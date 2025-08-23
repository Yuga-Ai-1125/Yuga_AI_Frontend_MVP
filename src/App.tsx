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
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Start Learning Free
                  </button>
                  <button
                    onClick={() => handleAuthAction("login")}
                    className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    AI Avatar Teaching
                  </h3>
                  <p className="text-gray-600">
                    Interactive AI tutors that adapt to your learning style and
                    provide personalized explanations.
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Instant Doubt Solving
                  </h3>
                  <p className="text-gray-600">
                    Get immediate answers to your questions with our advanced
                    AI-powered doubt resolution system.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCourses.slice(0, 4).map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${getSubjectColor(
                            course.category
                          )}`}
                        ></div>
                        <h3 className="font-medium text-gray-900">
                          {course.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {course.notesCount || 0} note
                        {course.notesCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Notes */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Notes
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Your most recently created or updated notes.
                </p>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Quadratic Equations
                        </h3>
                        <p className="text-sm text-gray-600">
                          Mathematics • 2 days ago
                        </p>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      The general form of a quadratic equation is ax² + bx + c =
                      0. The discriminant D = b² - 4ac determines...
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Photosynthesis
                        </h3>
                        <p className="text-sm text-gray-600">
                          Science • 5 days ago
                        </p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      Process by which green plants use sunlight to synthesize
                      foods from carbon dioxide and water...
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          French Revolution
                        </h3>
                        <p className="text-sm text-gray-600">
                          Social Science • 1 week ago
                        </p>
                      </div>
                      <button className="text-green-600 hover:text-green-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      The French Revolution was a period of radical political
                      and societal change in France that began with...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create New Note */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Create New Note
              </h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
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
                    placeholder="Note title"
                  />
                </div>
                <div className="flex-1">
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
                    <option value="">Select subject</option>
                    {mockCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
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
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Course Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockCourses.flatMap((course) =>
                    course.lessons
                      .filter((lesson) => lesson.videoUrl)
                      .map((lesson) => (
                        <div
                          key={lesson.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                          <div className="relative pt-[56.25%] bg-gray-200">
                            <video
                              className="absolute top-0 left-0 w-full h-full object-cover"
                              controls
                              poster={lesson.thumbnailUrl}
                            >
                              <source src={lesson.videoUrl} type="video/mp4" />
                            </video>
                          </div>
                          <div className="p-4">
                            <h3 className="font-bold text-gray-900">
                              {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {course.title}
                            </p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <span>{lesson.duration}</span>
                              <span className="mx-2">•</span>
                              <span>{lesson.dateAdded}</span>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Course Images
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {mockCourses.flatMap((course) =>
                    course.lessons
                      .filter(
                        (lesson) => lesson.images && lesson.images.length > 0
                      )
                      .flatMap(
                        (lesson) =>
                          lesson.images?.map(
                            (
                              image: { url: string | undefined; alt: any },
                              index: number
                            ) => (
                              <div
                                key={`${lesson.id}-${index}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                              >
                                <img
                                  src={image.url}
                                  alt={
                                    image.alt ||
                                    `${lesson.title} image ${index + 1}`
                                  }
                                  className="w-full h-40 object-cover"
                                />
                                <div className="p-2">
                                  <p className="text-xs text-gray-600 truncate">
                                    {course.title}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {lesson.title}
                                  </p>
                                </div>
                              </div>
                            )
                          ) || []
                      )
                  )}
                </div>
                {mockCourses.every((course) =>
                  course.lessons.every(
                    (lesson) => !lesson.images || lesson.images.length === 0
                  )
                ) && (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                      No images found
                    </h3>
                    <p className="text-gray-500">
                      No course images available yet.
                    </p>
                  </div>
                )}
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
                Upload images of exercises and get AI-powered solutions
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* OCR Upload Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Upload Exercise
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Take a photo or upload an image of your exercise problem to
                  get step-by-step solutions.
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
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex-shrink-0 overflow-hidden">
                        <img
                          src="https://via.placeholder.com/100"
                          alt="Exercise preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          Mathematics Problem
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Quadratic Equations • Solved 2 days ago
                        </p>
                        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                          View Solution
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex-shrink-0 overflow-hidden">
                        <img
                          src="https://via.placeholder.com/100"
                          alt="Exercise preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          Physics Problem
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Kinematics • Solved 1 week ago
                        </p>
                        <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                          View Solution
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="text-center py-4 text-gray-500">
                    <p>
                      No recent exercises found. Upload your first exercise!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                How Exercises with OCR Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Upload Exercise
                  </h3>
                  <p className="text-gray-600">
                    Take a clear photo or upload an image of your textbook
                    exercise or handwritten problem.
                  </p>
                </div>

                <div className="p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    AI Processing
                  </h3>
                  <p className="text-gray-600">
                    Our advanced OCR technology extracts text while AI
                    identifies the problem type and concepts.
                  </p>
                </div>

                <div className="p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Get Solution</h3>
                  <p className="text-gray-600">
                    Receive step-by-step explanations, similar practice
                    problems, and concept reviews.
                  </p>
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
                AI Career Guide (NCERT 10th)
              </h1>
              <p className="text-gray-600">
                Discover career paths based on your favorite NCERT 10th subjects
              </p>
            </div>

            {/* Subject-based Career Paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Mathematics */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
                <div className="flex items-center mb-3">
                  <Calculator className="w-6 h-6 text-purple-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Mathematics
                  </h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Careers for students strong in algebra, geometry, and
                  statistics
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-purple-600 mr-2" />
                    <span className="text-sm">Data Scientist</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-purple-600 mr-2" />
                    <span className="text-sm">Actuary</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-purple-600 mr-2" />
                    <span className="text-sm">AI Engineer</span>
                  </div>
                </div>
              </div>

              {/* Science */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                <div className="flex items-center mb-3">
                  <FlaskConical className="w-6 h-6 text-green-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">Science</h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Careers in physics, chemistry, and biology
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-green-600 mr-2" />
                    <span className="text-sm">Biotechnologist</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-green-600 mr-2" />
                    <span className="text-sm">Environmental Scientist</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-green-600 mr-2" />
                    <span className="text-sm">Medical Researcher</span>
                  </div>
                </div>
              </div>

              {/* Social Science */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-amber-600">
                <div className="flex items-center mb-3">
                  <Globe className="w-6 h-6 text-amber-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Social Science
                  </h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Careers in history, geography, political science, and
                  economics
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-amber-600 mr-2" />
                    <span className="text-sm">Urban Planner</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-amber-600 mr-2" />
                    <span className="text-sm">Economist</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-amber-600 mr-2" />
                    <span className="text-sm">Archaeologist</span>
                  </div>
                </div>
              </div>

              {/* English */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                <div className="flex items-center mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">English</h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Careers for students strong in language and literature
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-blue-600 mr-2" />
                    <span className="text-sm">Content Writer</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-blue-600 mr-2" />
                    <span className="text-sm">Journalist</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-blue-600 mr-2" />
                    <span className="text-sm">Translator</span>
                  </div>
                </div>
              </div>

              {/* Hindi */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
                <div className="flex items-center mb-3">
                  <Languages className="w-6 h-6 text-orange-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">Hindi</h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Careers in Hindi language and literature
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-orange-600 mr-2" />
                    <span className="text-sm">Hindi Content Specialist</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-orange-600 mr-2" />
                    <span className="text-sm">Subtitling Expert</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-orange-600 mr-2" />
                    <span className="text-sm">Hindi Linguist</span>
                  </div>
                </div>
              </div>

              {/* Computer Applications */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
                <div className="flex items-center mb-3">
                  <Code className="w-6 h-6 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Computer Applications
                  </h2>
                </div>
                <p className="text-gray-600 mb-4 text-sm">
                  Careers in IT and computer science
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-indigo-600 mr-2" />
                    <span className="text-sm">Software Developer</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-indigo-600 mr-2" />
                    <span className="text-sm">Cybersecurity Analyst</span>
                  </div>
                  <div className="flex items-center">
                    <Circle className="w-2 h-2 text-indigo-600 mr-2" />
                    <span className="text-sm">Game Developer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Assessment */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Subject-Based Career Assessment
              </h2>
              <p className="text-gray-600 mb-6">
                Take our AI-powered assessment to discover which careers best
                match your performance in NCERT 10th subjects.
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                Start Assessment
              </button>
            </div>

            {/* Success Stories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Alumni Success Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Rahul Sharma</h3>
                      <p className="text-sm text-gray-600">
                        Data Scientist at Google
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "My journey began with a strong interest in NCERT
                    Mathematics. The problem-solving skills I developed in 10th
                    grade became the foundation for my career in data science."
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold">Priya Patel</h3>
                      <p className="text-sm text-gray-600">
                        Biotech Researcher
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    "NCERT Biology textbooks sparked my curiosity about living
                    organisms. Today, I'm working on cutting-edge genetic
                    research thanks to that early interest."
                  </p>
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
                Earn certificates by demonstrating mastery of your subjects
              </p>
            </div>

            {/* Certificate Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Available Certificates */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Trophy className="w-6 h-6 text-gold-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Available Certificates
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Complete assessments to earn certificates in your Class 10
                  subjects.
                </p>
                <div className="space-y-3">
                  {mockCourses.slice(0, 4).map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Progress: {course.progress}%
                          </p>
                        </div>
                        <div className="flex items-center">
                          {course.progress >= 80 ? (
                            <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm">
                              Take Assessment
                            </button>
                          ) : (
                            <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
                              {80 - course.progress}% more needed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earned Certificates */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Earned Certificates
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Your achievements and completed certifications.
                </p>
                <div className="space-y-3">
                  <div className="p-4 bg-gradient-to-r from-gold-50 to-yellow-50 border border-gold-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <Trophy className="w-4 h-4 text-gold-600 mr-2" />
                          Mathematics Champion
                        </h3>
                        <p className="text-sm text-gray-600">
                          Earned on: Dec 15, 2023
                        </p>
                        <p className="text-sm text-green-600">Score: 95%</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      Complete more assessments to earn certificates
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Center */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Assessment Center
              </h2>
              <p className="text-gray-600 mb-6">
                Take comprehensive assessments to demonstrate your mastery and
                earn champion certificates.
              </p>

              {quizScore === null ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-dashed border-purple-300 rounded-lg text-center">
                    <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Quick Assessment
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Test your knowledge with a quick 5-question assessment
                    </p>
                    <button
                      onClick={() => setQuizScore(null)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Start Quick Test
                    </button>
                  </div>

                  <div className="p-6 border-2 border-dashed border-gold-300 rounded-lg text-center">
                    <Award className="w-12 h-12 text-gold-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Full Assessment
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Complete comprehensive assessment for certificate
                    </p>
                    <button className="px-6 py-2 bg-gradient-to-r from-gold-600 to-yellow-600 text-white rounded-lg hover:from-gold-700 hover:to-yellow-700 transition-all duration-200">
                      Start Full Assessment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
                  <AIAvatar size="large" emotion="encouraging" isActive />
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
                    Assessment Complete!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You scored {quizScore} out of {mockQuizQuestions.length}
                  </p>
                  <div className="text-4xl font-bold text-purple-600 mb-4">
                    {Math.round((quizScore / mockQuizQuestions.length) * 100)}%
                  </div>
                  {quizScore / mockQuizQuestions.length >= 0.8 ? (
                    <div className="mb-4">
                      <div className="text-green-600 font-bold mb-2">
                        🏆 Certificate Earned!
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 mr-2">
                        Download Certificate
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="text-orange-600 font-bold mb-2">
                        Keep Practicing!
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
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
                <div className="space-y-3">
                  {mockCourses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer"
                    >
                      <h3 className="font-medium text-gray-900">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Last studied: 2 days ago
                      </p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                  Start Quick Revision
                  </button>
              </div>

              {/* Spaced Repetition */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Award className="w-6 h-6 text-emerald-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    Spaced Repetition
                  </h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Optimize your memory retention with scientifically-backed
                  spaced repetition schedules.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-900">
                      Due Now (5 items)
                    </h3>
                    <p className="text-sm text-red-700">Mathematics Formulas</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-900">
                      Due Tomorrow (3 items)
                    </h3>
                    <p className="text-sm text-yellow-700">Science Concepts</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-900">
                      Upcoming (12 items)
                    </h3>
                    <p className="text-sm text-green-700">Various topics</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200">
                  Start Spaced Repetition
                </button>
              </div>
            </div>

            {/* Revision Statistics */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Revision Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">87%</div>
                  <div className="text-sm text-gray-600">Retention Rate</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">23</div>
                  <div className="text-sm text-gray-600">Topics Mastered</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <div className="text-sm text-gray-600">Cards Reviewed</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // Default view: Dashboard
        return (
          <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-xl p-8 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, {user?.fullName}!
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
