import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Mic, MicOff, MessageCircle, Download, Maximize, Settings, Users, Clock, BookOpen } from 'lucide-react';
import { Course, Lesson } from '../../types';
import { RealisticAvatar } from './RealisticAvatar';
import DynamicWhiteboard from './DynamicWhiteboard';
import { RealTimeChat } from './RealTimeChat';

interface AIClassroomProps {
  course: Course;
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
}

export const AIClassroom: React.FC<AIClassroomProps> = ({ course, lesson, isOpen, onClose }) => {
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [whiteboardContent, setWhiteboardContent] = useState<any[]>([]);
  const [avatarGender, setAvatarGender] = useState<'male' | 'female'>('female');

  // Generate lesson segments based on the selected course/lesson
  const generateLessonSegments = () => {
    const baseSegments = [
      {
        title: 'Introduction',
        content: `Welcome to today's lesson on ${lesson.title}. I'm Professor YUGA, your AI instructor. Today we'll explore the fundamental concepts and practical applications of this topic. Let's begin our journey into ${course.category.toLowerCase()}.`,
        keyPoints: [
          `Understanding ${lesson.title}`,
          'Learning objectives for today',
          'Real-world applications',
          'Prerequisites and background'
        ],
        duration: 8000 // 8 seconds for demo
      },
      {
        title: 'Core Concepts',
        content: `Let's dive into the core concepts. ${lesson.content} This forms the foundation of our understanding. Pay close attention as we break down each component step by step.`,
        keyPoints: [
          'Fundamental principles',
          'Key definitions and terminology',
          'Important relationships',
          'Common patterns and structures'
        ],
        duration: 10000 // 10 seconds
      },
      {
        title: 'Practical Examples',
        content: `Now let's see how these concepts apply in real-world scenarios. I'll walk you through several examples to solidify your understanding and show you practical implementations.`,
        keyPoints: [
          'Real-world applications',
          'Industry case studies',
          'Problem-solving approaches',
          'Best practices and guidelines'
        ],
        duration: 9000 // 9 seconds
      },
      {
        title: 'Interactive Practice',
        content: `Time for some hands-on practice! Let's work through some problems together. Feel free to ask questions at any time using the chat feature or microphone.`,
        keyPoints: [
          'Practice exercises',
          'Step-by-step solutions',
          'Common mistakes to avoid',
          'Tips and optimization techniques'
        ],
        duration: 8000 // 8 seconds
      },
      {
        title: 'Summary & Next Steps',
        content: `Excellent work! Let's summarize what we've learned today and discuss how to apply these concepts moving forward. Remember, practice makes perfect!`,
        keyPoints: [
          'Key takeaways from today',
          'Summary of main concepts',
          'Next lesson preview',
          'Recommended practice exercises'
        ],
        duration: 7000 // 7 seconds
      }
    ];

    // Customize content based on course category
    if (course.category === 'Technology') {
      baseSegments[1].content += ' We\'ll explore algorithms, data structures, and implementation details.';
      baseSegments[2].keyPoints.push('Code examples and implementations');
    } else if (course.category === 'Business') {
      baseSegments[1].content += ' We\'ll analyze market trends, strategies, and business models.';
      baseSegments[2].keyPoints.push('Market analysis and case studies');
    }

    return baseSegments;
  };

  const lessonSegments = generateLessonSegments();
  const currentLessonSegment = lessonSegments[currentSegment];

  useEffect(() => {
    if (isLessonActive && currentSegment < lessonSegments.length) {
      const segment = lessonSegments[currentSegment];
      setCurrentSpeech(segment.content);
      setWhiteboardContent(segment.keyPoints);

      const timer = setTimeout(() => {
        if (currentSegment < lessonSegments.length - 1) {
          setCurrentSegment(prev => prev + 1);
          setLessonProgress(((currentSegment + 1) / lessonSegments.length) * 100);
        } else {
          setIsLessonActive(false);
          setLessonProgress(100);
          setCurrentSpeech('Great job completing this lesson! Feel free to ask any questions or review the material on the whiteboard.');
        }
      }, segment.duration);

      return () => clearTimeout(timer);
    }
  }, [isLessonActive, currentSegment]);

  const handleStartLesson = () => {
    setIsLessonActive(true);
    setCurrentSegment(0);
    setLessonProgress(0);
  };

  const handlePauseLesson = () => {
    setIsLessonActive(false);
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const handleQuestionAsked = (question: string) => {
    // Pause lesson when question is asked
    setIsLessonActive(false);
    setCurrentSpeech(`Great question! Let me address that: "${question}". This is an important point that relates to our current topic.`);
    
    // Resume lesson after answering
    setTimeout(() => {
      if (currentSegment < lessonSegments.length) {
        setIsLessonActive(true);
      }
    }, 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 text-white p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{course.title}</h1>
            <p className="text-purple-200 text-sm">{lesson.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4" />
            <span>1,247 students</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration}</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors p-2"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Classroom Interface */}
      <div className="flex-1 flex min-h-0">
        {/* Left Side - AI Avatar and Controls */}
        <div className="flex-1 bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 relative overflow-hidden">
          {/* Ambient Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          {/* AI Avatar Section */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
            <RealisticAvatar
              gender={avatarGender}
              isTeaching={isLessonActive}
              currentSpeech={currentSpeech}
              emotion={isLessonActive ? 'teaching' : 'friendly'}
              soundEnabled={soundEnabled}
              onQuestionAsked={handleQuestionAsked}
            />

            {/* Lesson Progress */}
            {lessonProgress > 0 && (
              <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-80">
                <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Lesson Progress</span>
                    <span className="text-sm">{Math.round(lessonProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                    <div
                      className="h-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${lessonProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-purple-200">{currentLessonSegment?.title}</p>
                    <p className="text-xs text-purple-300 mt-1">
                      Segment {currentSegment + 1} of {lessonSegments.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Control Panel */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-4 flex items-center space-x-4">
                <button
                  onClick={isLessonActive ? handlePauseLesson : handleStartLesson}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  {isLessonActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${
                    isChatOpen ? 'bg-green-500' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setAvatarGender(avatarGender === 'male' ? 'female' : 'male')}
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  title={`Switch to ${avatarGender === 'male' ? 'female' : 'male'} avatar`}
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Chat Overlay */}
          {isChatOpen && (
            <div className="absolute top-4 left-4 w-80 h-96 z-20">
              <RealTimeChat
                onQuestionAsked={handleQuestionAsked}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Right Side - Dynamic Smart Whiteboard */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between flex-shrink-0">
            <h2 className="font-bold">Smart Whiteboard</h2>
            <div className="flex items-center space-x-2">
              {isLessonActive && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
              <button className="text-white hover:text-gray-200">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <DynamicWhiteboard
            content={whiteboardContent}
            lessonTitle={lesson.title}
            currentSegment={currentLessonSegment?.title || ''}
            isActive={isLessonActive}
          />
        </div>
      </div>
    </div>
  );
};