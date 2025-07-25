import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, BookOpen, MessageCircle, X, Mic, Send, Lightbulb } from 'lucide-react';
import { Course, Lesson } from '../../types';
import { VirtualTeacher } from './VirtualTeacher';
import { InteractiveDoubtSection } from './InteractiveDoubtSection';
import { SmartWhiteboard } from './SmartWhiteboard';

interface CoursePlayerProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, isOpen, onClose }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDoubtSection, setShowDoubtSection] = useState(false);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [question, setQuestion] = useState('');
  const [isListening, setIsListening] = useState(false);

  const currentLesson = course?.lessons?.[currentLessonIndex];

  // Get key points for whiteboard
  const getKeyPoints = (lesson: Lesson): string[] => {
    const keyPointsMap: Record<string, string[]> = {
      'Introduction to Machine Learning': [
        'ML teaches computers to learn from data',
        'Three main types: Supervised, Unsupervised, Reinforcement',
        'Used in recommendations, voice recognition, medical diagnosis',
        'Pattern recognition is the core concept'
      ],
      'Types of Machine Learning': [
        'Supervised: Learning with labeled examples',
        'Unsupervised: Finding patterns without labels',
        'Reinforcement: Learning through rewards and penalties',
        'Each type serves different problem-solving needs'
      ],
      'Supervised Learning Algorithms': [
        'Linear Regression for continuous predictions',
        'Decision Trees for classification',
        'Neural Networks for complex patterns',
        'Support Vector Machines for classification'
      ]
    };
    
    return keyPointsMap[lesson?.title] || [
      'Key concepts and definitions',
      'Practical applications',
      'Real-world examples',
      'Important principles to remember'
    ];
  };

  useEffect(() => {
    if (isPlaying && currentLesson?.type === 'video') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5; // Slower progress for more realistic teaching pace
        });
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isPlaying, currentLesson]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < course.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleQuestionAsked = (questionText: string) => {
    setShowDoubtSection(true);
  };

  const handleShowWhiteboard = () => {
    setShowWhiteboard(true);
  };

  if (!isOpen || !course) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-90 z-[9999] flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col sm:flex-row overflow-hidden">
          {/* Main Video/Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 p-3 sm:p-4 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold">{course.title}</h2>
                  <p className="text-purple-100 text-sm">{currentLesson?.title}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowDoubtSection(true)}
                  className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-opacity-30 transition-colors"
                  title="Ask Questions"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShowWhiteboard}
                  className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-opacity-30 transition-colors"
                  title="Smart Whiteboard"
                >
                  <Lightbulb className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Video/Content Area */}
            <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative flex items-center justify-center overflow-hidden">
              {currentLesson?.type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  {/* Virtual Teacher */}
                  <VirtualTeacher
                    lessonTitle={currentLesson.title}
                    isTeaching={isPlaying}
                    onQuestionAsked={handleQuestionAsked}
                    onShowWhiteboard={handleShowWhiteboard}
                  />

                  {/* Progress Bar */}
                  <div className="absolute bottom-16 sm:bottom-20 left-2 right-2 sm:left-4 sm:right-4">
                    <div className="bg-black bg-opacity-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between text-white text-xs sm:text-sm mb-2">
                        <span>Lesson Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 sm:p-8 text-white max-w-4xl">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">{currentLesson.title}</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-base sm:text-lg leading-relaxed">
                      {currentLesson.content}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-3 sm:p-4 flex-shrink-0">
              <div className="flex items-center justify-center space-x-4 sm:space-x-6">
                <button
                  onClick={handlePrevLesson}
                  disabled={currentLessonIndex === 0}
                  className="text-white hover:text-purple-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2.5 sm:p-3 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                >
                  {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>
                
                <button
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === course.lessons.length - 1}
                  className="text-white hover:text-purple-400 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                >
                  <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <button className="text-white hover:text-purple-400 transition-colors">
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  onClick={() => setShowDoubtSection(true)}
                  className="text-white hover:text-purple-400 transition-colors"
                >
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full sm:w-80 bg-gray-50 border-t sm:border-t-0 sm:border-l border-gray-200 flex flex-col max-h-60 sm:max-h-none">
            {/* Lesson List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Course Content</h3>
                <p className="text-xs sm:text-sm text-gray-600">{course.lessons.length} lessons</p>
              </div>
              
              <div className="space-y-1 p-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setCurrentLessonIndex(index);
                      setProgress(0);
                      setIsPlaying(false);
                    }}
                    className={`w-full text-left p-2 sm:p-3 rounded-lg transition-colors ${
                      index === currentLessonIndex
                        ? 'bg-purple-50 border border-purple-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium text-xs sm:text-sm ${
                          index === currentLessonIndex ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-600">{lesson.duration}</p>
                      </div>
                      {lesson.completed && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Transcript */}
            {showTranscript && (
              <div className="border-t border-gray-200 p-3 sm:p-4 max-h-40 sm:max-h-60 overflow-y-auto">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">Live Transcript</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {isPlaying ? 
                    "Professor YUGA is explaining the key concepts of this lesson with interactive examples and real-world applications..." :
                    "Transcript will appear here when the lesson starts. This feature provides real-time captions of the AI teacher's explanations."
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Doubt Section */}
      <InteractiveDoubtSection
        isVisible={showDoubtSection}
        lessonTitle={currentLesson?.title || ''}
        onClose={() => setShowDoubtSection(false)}
        onShowWhiteboard={handleShowWhiteboard}
      />

      {/* Smart Whiteboard */}
      <SmartWhiteboard
        isVisible={showWhiteboard}
        currentTopic={currentLesson?.title || ''}
        keyPoints={getKeyPoints(currentLesson)}
        onClose={() => setShowWhiteboard(false)}
      />
    </>
  );
};