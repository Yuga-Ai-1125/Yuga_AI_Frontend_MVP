import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookOpen, MessageCircle, BarChart3, Award, Menu, X, Search, Bell, User, HelpCircle, RefreshCw, Trophy, Notebook, Video, Image } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { CourseCard } from './components/CourseCard';
import { ChatInterface } from './components/ChatInterface';
import { QuizComponent } from './components/QuizComponent';
import { AIClassroom } from './components/course/AIClassroom';
import { DoubtSolver } from './components/doubts/DoubtSolver';
import { AIAvatar } from './components/AIAvatar';
import { Footer } from './components/Footer';
import { Navigation } from './components/Navigation';
import { mockCourses, mockUserProgress, mockQuizQuestions } from './data/mockData';
import { Course } from './types';

// Import all page components
import { AboutUs } from './pages/company/AboutUs';
import { OurMission } from './pages/company/OurMission';
import { Careers } from './pages/company/Careers';
import { Press } from './pages/company/Press';
import { HelpCenter } from './pages/support/HelpCenter';
import { ContactUs } from './pages/support/ContactUs';
import { SystemStatus } from './pages/support/SystemStatus';
import { Community } from './pages/support/Community';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { TermsOfService } from './pages/legal/TermsOfService';
import { CookiePolicy } from './pages/legal/CookiePolicy';
import { GDPR } from './pages/legal/GDPR';

type ActiveView = 'dashboard' | 'notes' | 'certificate' | 'revision' | 'media';

function MainApp() {
  const { user, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(!isAuthenticated);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDoubtSolverOpen, setIsDoubtSolverOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [activeMediaTab, setActiveMediaTab] = useState<'videos' | 'images'>('videos');

  // Show onboarding for new users
  if (showOnboarding && !isAuthenticated) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'notes', label: 'Notes', icon: <Notebook className="w-5 h-5" /> },
  { id: 'media', label: 'Media', icon: <Video className="w-5 h-5" /> }, // New tab
  { id: 'certificate', label: 'Champion Certificate', icon: <Trophy className="w-5 h-5" /> },
  { id: 'revision', label: 'Revision', icon: <RefreshCw className="w-5 h-5" /> },
];

  const handleAuthAction = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCourseClick = (course: Course) => {
    if (!isAuthenticated) {
      handleAuthAction('login');
      return;
    }
    setSelectedCourse(course);
    setSelectedLesson(course.lessons[0]); // Start with first lesson
  };

  // Filter courses based on search query
  const filteredCourses = mockCourses.filter(course => {
    if (!courseSearchQuery.trim()) return true;
    
    const searchTerm = courseSearchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchTerm) ||
      course.description.toLowerCase().includes(searchTerm) ||
      course.category.toLowerCase().includes(searchTerm) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });

  const renderContent = () => {
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
                  Revolutionary AI-powered education platform with interactive avatars, 
                  personalized learning paths, and intelligent doubt-solving capabilities.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => handleAuthAction('signup')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Start Learning Free
                  </button>
                  <button
                    onClick={() => handleAuthAction('login')}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI Avatar Teaching</h3>
                  <p className="text-gray-600">Interactive AI tutors that adapt to your learning style and provide personalized explanations.</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Doubt Solving</h3>
                  <p className="text-gray-600">Get immediate answers to your questions with our advanced AI-powered doubt resolution system.</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Progress Tracking</h3>
                  <p className="text-gray-600">Monitor your learning journey with detailed analytics and personalized recommendations.</p>
                </div>
              </div>
            </div>

            {/* Course Preview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Explore Our Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockCourses.slice(0, 6).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'notes':
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Notes</h1>
              <p className="text-gray-600">Your personalized notes from all courses</p>
            </div>
            
            {/* Notes Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Notes by Subject */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Notebook className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Notes by Subject</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Organized notes from each of your courses. Click to view and edit.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockCourses.slice(0, 4).map((course) => (
                    <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                      <div className="flex items-center mb-2">
                        <div className={`w-3 h-3 rounded-full mr-2 ${getSubjectColor(course.category)}`}></div>
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        {course.notesCount || 0} note{course.notesCount === 1 ? '' : 's'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Notes */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <RefreshCw className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Recent Notes</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Your most recently created or updated notes.
                </p>
                <div className="space-y-4">
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Quadratic Equations</h3>
                        <p className="text-sm text-gray-600">Mathematics • 2 days ago</p>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      The general form of a quadratic equation is ax² + bx + c = 0. The discriminant D = b² - 4ac determines...
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">Photosynthesis</h3>
                        <p className="text-sm text-gray-600">Science • 5 days ago</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      Process by which green plants use sunlight to synthesize foods from carbon dioxide and water...
                    </p>
                  </div>
                  
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">French Revolution</h3>
                        <p className="text-sm text-gray-600">Social Science • 1 week ago</p>
                      </div>
                      <button className="text-green-600 hover:text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                      The French Revolution was a period of radical political and societal change in France that began with...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create New Note */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Note</h2>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    id="note-title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Note title"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="note-subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select
                    id="note-subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select subject</option>
                    {mockCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="note-content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
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
   case 'media':
  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Media Library</h1>
        <p className="text-gray-600">Your videos and images for all courses</p>
      </div>

      {/* Tabs for Videos/Images */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 ${activeMediaTab === 'videos' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveMediaTab('videos')}
        >
          <div className="flex items-center">
            <Video className="w-4 h-4 mr-2" />
            Videos
          </div>
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm border-b-2 ${activeMediaTab === 'images' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveMediaTab('images')}
        >
          <div className="flex items-center">
            <Image className="w-4 h-4 mr-2" />
            Images
          </div>
        </button>
      </div>

      {activeMediaTab === 'videos' ? (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.flatMap(course => 
              course.lessons
                .filter(lesson => lesson.videoUrl)
                .map(lesson => (
                  <div key={lesson.id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                      <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{course.title}</p>
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mockCourses.flatMap(course => 
              course.lessons
                .filter(lesson => lesson.images && lesson.images.length > 0)
                .flatMap(lesson => 
                  lesson.images?.map((image, index) => (
                    <div key={`${lesson.id}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt || `${lesson.title} image ${index + 1}`}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{course.title}</p>
                        <p className="text-xs text-gray-500 truncate">{lesson.title}</p>
                      </div>
                    </div>
                  )) || []
                )
            )}
          </div>
          {mockCourses.every(course => 
            course.lessons.every(lesson => !lesson.images || lesson.images.length === 0)
          ) && (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No images found</h3>
              <p className="text-gray-500">No course images available yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
      case 'certificate':
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Champion Certificate</h1>
              <p className="text-gray-600">Earn certificates by demonstrating mastery of your subjects</p>
            </div>
            
            {/* Certificate Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Available Certificates */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Trophy className="w-6 h-6 text-gold-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Available Certificates</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Complete assessments to earn certificates in your Class 10 subjects.
                </p>
                <div className="space-y-3">
                  {mockCourses.slice(0, 4).map((course) => (
                    <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">Progress: {course.progress}%</p>
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
                  <h2 className="text-xl font-bold text-gray-900">Earned Certificates</h2>
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
                        <p className="text-sm text-gray-600">Earned on: Dec 15, 2023</p>
                        <p className="text-sm text-green-600">Score: 95%</p>
                      </div>
                      <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors">
                        Download
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Complete more assessments to earn certificates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Center */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Assessment Center</h2>
              <p className="text-gray-600 mb-6">
                Take comprehensive assessments to demonstrate your mastery and earn champion certificates.
              </p>
              
              {quizScore === null ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-dashed border-purple-300 rounded-lg text-center">
                    <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Quick Assessment</h3>
                    <p className="text-gray-600 mb-4">Test your knowledge with a quick 5-question assessment</p>
                    <button
                      onClick={() => setQuizScore(null)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Start Quick Test
                    </button>
                  </div>
                  
                  <div className="p-6 border-2 border-dashed border-gold-300 rounded-lg text-center">
                    <Award className="w-12 h-12 text-gold-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Full Assessment</h3>
                    <p className="text-gray-600 mb-4">Complete comprehensive assessment for certificate</p>
                    <button className="px-6 py-2 bg-gradient-to-r from-gold-600 to-yellow-600 text-white rounded-lg hover:from-gold-700 hover:to-yellow-700 transition-all duration-200">
                      Start Full Assessment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 text-center">
                  <AIAvatar size="large" emotion="encouraging" isActive />
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">Assessment Complete!</h2>
                  <p className="text-gray-600 mb-4">
                    You scored {quizScore} out of {mockQuizQuestions.length}
                  </p>
                  <div className="text-4xl font-bold text-purple-600 mb-4">
                    {Math.round((quizScore / mockQuizQuestions.length) * 100)}%
                  </div>
                  {(quizScore / mockQuizQuestions.length) >= 0.8 ? (
                    <div className="mb-4">
                      <div className="text-green-600 font-bold mb-2">🏆 Certificate Earned!</div>
                      <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 mr-2">
                        Download Certificate
                      </button>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="text-orange-600 font-bold mb-2">Keep Practicing!</div>
                      <p className="text-sm text-gray-600 mb-2">You need 80% or higher to earn a certificate</p>
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
      
      case 'revision':
        return (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Revision Center</h1>
              <p className="text-gray-600">Review and reinforce your learning with AI-powered revision tools</p>
            </div>
            
            {/* Revision Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Revision */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <RefreshCw className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Quick Revision</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Review key concepts from your recent lessons with AI-generated summaries and flashcards.
                </p>
                <div className="space-y-3">
                  {mockCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="p-3 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
                      <h3 className="font-medium text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">Last studied: 2 days ago</p>
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
                  <h2 className="text-xl font-bold text-gray-900">Spaced Repetition</h2>
                </div>
                <p className="text-gray-600 mb-4">
                  Optimize your memory retention with scientifically-backed spaced repetition schedules.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-900">Due Now (5 items)</h3>
                    <p className="text-sm text-red-700">Mathematics Formulas</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-medium text-yellow-900">Due Tomorrow (3 items)</h3>
                    <p className="text-sm text-yellow-700">Science Concepts</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-900">Upcoming (12 items)</h3>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Revision Statistics</h2>
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
        return (
          <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 rounded-xl p-8 text-white mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                  <p className="text-purple-100 text-lg">Ready to continue your AI-powered learning journey?</p>
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
                  <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
                  <p className="text-gray-600 mt-1">Continue learning or explore new subjects</p>
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
                      onClick={() => setCourseSearchQuery('')}
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
                      : `Found ${filteredCourses.length} course${filteredCourses.length === 1 ? '' : 's'} matching "${courseSearchQuery}"`
                    }
                  </p>
                  {filteredCourses.length === 0 && (
                    <p className="text-blue-600 text-sm mt-1">
                      Try searching for: Mathematics, Science, English, Hindi, Social Science, or Computer Applications
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => handleCourseClick(course)}
                  />
                ))}
              </div>

              {/* No results message */}
              {filteredCourses.length === 0 && courseSearchQuery && (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No courses found</h3>
                  <p className="text-gray-500 mb-4">
                    We couldn't find any courses matching your search. Try different keywords or browse all courses.
                  </p>
                  <button
                    onClick={() => setCourseSearchQuery('')}
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
                    <p className="text-2xl font-bold text-gray-900">{user?.progress.currentStreak} days</p>
                  </div>
                  <Award className="w-8 h-8 text-emerald-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Hours This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{user?.progress.weeklyProgress}</p>
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

  // Helper function to get subject color
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'bg-purple-500',
      'Science': 'bg-green-500',
      'English': 'bg-blue-500',
      'Hindi': 'bg-yellow-500',
      'Social Science': 'bg-red-500',
      'Computer Applications': 'bg-indigo-500'
    };
    return colors[subject] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/mission" element={<OurMission />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/community" element={<Community />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;