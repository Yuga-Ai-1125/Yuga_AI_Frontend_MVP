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

  // Generate subject-specific introduction based on course category
  const getSubjectIntroduction = (category: string, lessonTitle: string) => {
    const subjectIntroductions: Record<string, string> = {
      'Mathematics': `Welcome to today's mathematics lesson. I'm Professor Yuga, your AI mathematics instructor. Mathematics is the language of patterns and relationships, and today we'll explore how these concepts apply to real-world problem solving.`,
      'Science': `Welcome to today's science lesson. I'm Professor Yuga, your AI science instructor. Science helps us understand the natural world through observation and experimentation, and today we'll discover how these principles work in practice.`,
      'Social Studies': `Welcome to today's social studies lesson. I'm Professor Yuga, your AI social studies instructor. Social studies helps us understand human societies and our place in the world, and today we'll explore important historical and cultural concepts.`,
      'Hindi': `नमस्ते! आज के हिंदी पाठ "${lessonTitle}" में आपका स्वागत है। मैं प्रोफेसर युगा हूं, आपकी AI हिंदी शिक्षिका। आज हम हिंदी भाषा की सुंदरता और इसकी सांस्कृतिक महत्व को समझेंगे।`,
      'English': `Welcome to today's English lesson. I'm Professor Yuga, your AI English instructor. Language is the foundation of communication and expression, and today we'll explore how to use English effectively in various contexts.`,
      'Physics': `Welcome to today's physics lesson. I'm Professor Yuga, your AI physics instructor. Physics helps us understand the fundamental laws that govern our universe, and today we'll explore how these principles shape our world.`,
      'Chemistry': `Welcome to today's chemistry lesson. I'm Professor Yuga, your AI chemistry instructor. Chemistry is the science of matter and its transformations, and today we'll discover how these processes work at the molecular level.`,
      'Biology': `Welcome to today's biology lesson. I'm Professor Yuga, your AI biology instructor. Biology is the study of life in all its forms, and today we'll explore the fascinating processes that sustain living organisms.`,
      'History': `Welcome to today's history lesson. I'm Professor Yuga, your AI history instructor. History helps us understand our past to make sense of our present, and today we'll examine important events that have shaped our world.`,
      'Geography': `Welcome to today's geography lesson. I'm Professor Yuga, your AI geography instructor. Geography helps us understand the relationship between people and their environments, and today we'll explore how physical and human systems interact.`,
      'Economics': `Welcome to today's economics lesson. I'm Professor Yuga, your AI economics instructor. Economics is the study of how societies allocate scarce resources, and today we'll examine fundamental economic principles and their applications.`,
      'Computer Science': `Welcome to today's computer science lesson. I'm Professor Yuga, your AI computer science instructor. Computer science is the study of computational systems and algorithms, and today we'll explore how these concepts power modern technology.`
    };

    return subjectIntroductions[category] || `Welcome to today's lesson on ${lessonTitle}. I'm Professor Yuga, your AI instructor. Today we'll explore the fundamental concepts and practical applications of this topic.`;
  };

  // Generate subject-specific content segments
  const getSubjectSegments = (category: string) => {
    const subjectSegments: Record<string, {title: string, keyPoints: string[]}[]> = {
      'Mathematics': [
        {
          title: 'Problem Solving Approach',
          keyPoints: [
            'Understanding the problem statement',
            'Identifying known and unknown variables',
            'Selecting appropriate formulas and methods',
            'Step-by-step solution process'
          ]
        },
        {
          title: 'Concept Application',
          keyPoints: [
            'Real-world applications of mathematical concepts',
            'Connecting theory to practical problems',
            'Multiple approaches to the same problem',
            'Common pitfalls and how to avoid them'
          ]
        }
      ],
      'Science': [
        {
          title: 'Scientific Principles',
          keyPoints: [
            'Understanding fundamental scientific laws',
            'Experimental verification of concepts',
            'Connecting theory to observable phenomena',
            'Scientific method application'
          ]
        },
        {
          title: 'Practical Applications',
          keyPoints: [
            'Real-world examples of scientific principles',
            'Technology derived from scientific discoveries',
            'Environmental and societal impacts',
            'Future developments in the field'
          ]
        }
      ],
      'Hindi': [
        {
          title: 'भाषा के नियम',
          keyPoints: [
            'व्याकरण के मूल सिद्धांत',
            'वाक्य संरचना और रचना',
            'शब्दावली विस्तार',
            'उच्चारण और वर्तनी'
          ]
        },
        {
          title: 'साहित्यिक समझ',
          keyPoints: [
            'पाठ की विषयवस्तु',
            'लेखक की शैली और दृष्टिकोण',
            'सांस्कृतिक संदर्भ',
            'आलोचनात्मक विश्लेषण'
          ]
        }
      ],
      'English': [
        {
          title: 'Language Skills',
          keyPoints: [
            'Grammar and syntax rules',
            'Vocabulary building techniques',
            'Reading comprehension strategies',
            'Effective communication skills'
          ]
        },
        {
          title: 'Literary Analysis',
          keyPoints: [
            'Understanding literary devices',
            'Theme and character analysis',
            'Contextual interpretation',
            'Critical thinking about texts'
          ]
        }
      ]
    };

    return subjectSegments[category] || [
      {
        title: 'Core Concepts',
        keyPoints: [
          'Fundamental principles',
          'Key definitions and terminology',
          'Important relationships',
          'Common patterns and structures'
        ]
      },
      {
        title: 'Practical Applications',
        keyPoints: [
          'Real-world applications',
          'Industry case studies',
          'Problem-solving approaches',
          'Best practices and guidelines'
        ]
      }
    ];
  };

  // Generate lesson segments based on the selected course/lesson
  const generateLessonSegments = () => {
    const subjectIntro = getSubjectIntroduction(course.category, lesson.title);
    const subjectSpecificSegments = getSubjectSegments(course.category);
    
    const baseSegments = [
      {
        title: 'Introduction',
        content: subjectIntro,
        keyPoints: [
          `Understanding ${lesson.title}`,
          'Learning objectives for today',
          'Real-world applications',
          'Prerequisites and background'
        ],
        duration: 8000 // 8 seconds for demo
      },
      {
        title: subjectSpecificSegments[0].title,
        content: `Let's dive into the core concepts. ${lesson.content} This forms the foundation of our understanding. Pay close attention as we break down each component step by step.`,
        keyPoints: subjectSpecificSegments[0].keyPoints,
        duration: 10000 // 10 seconds
      },
      {
        title: subjectSpecificSegments[1].title,
        content: `Now let's see how these concepts apply in real-world scenarios. I'll walk you through several examples to solidify your understanding and show you practical implementations.`,
        keyPoints: subjectSpecificSegments[1].keyPoints,
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
    if (course.category === 'Technology' || course.category === 'Computer Science') {
      baseSegments[1].content += ' We\'ll explore algorithms, data structures, and implementation details.';
      baseSegments[2].keyPoints.push('Code examples and implementations');
    } else if (course.category === 'Business' || course.category === 'Economics') {
      baseSegments[1].content += ' We\'ll analyze market trends, strategies, and business models.';
      baseSegments[2].keyPoints.push('Market analysis and case studies');
    } else if (course.category === 'Hindi') {
      baseSegments[1].content = 'आइए अब मूल अवधारणाओं में गहराई से जाएं। यह हमारी समझ की नींव बनाता है। कृपया ध्यान दें क्योंकि हम प्रत्येक घटक को चरण दर चरण तोड़ते हैं।';
      baseSegments[2].content = 'अब आइए देखें कि ये अवधारणाएं वास्तविक दुनिया के परिदृश्यों में कैसे लागू होती हैं। मैं आपके साथ कई उदाहरणों से गुजरूंगा ताकि आपकी समझ को मजबूत किया जा सके और व्यावहारिक कार्यान्वयन दिखाया जा सके।';
      baseSegments[3].content = 'अब कुछ व्यावहारिक अभ्यास का समय आ गया है! आइए मिलकर कुछ समस्याओं पर काम करें। चैट सुविधा या माइक्रोफोन का उपयोग करके किसी भी समय प्रश्न पूछने में संकोच न करें।';
      baseSegments[4].content = 'उत्कृष्ट काम! आइए आज हमने जो सीखा है उसका सारांश दें और चर्चा करें कि आगे बढ़ने के लिए इन अवधारणाओं को कैसे लागू किया जाए। याद रखें, अभ्यास परिपूर्ण बनाता है!';
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
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col overflow-hidden">
      {/* Header Bar - Fixed at top */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 text-white p-4 flex items-center justify-between flex-shrink-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="max-w-[50%]">
            <h1 className="text-xl font-bold truncate">{course.title}</h1>
            <p className="text-purple-200 text-sm truncate">{lesson.title}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm">
            <Users className="w-4 h-4" />
            <span>1,247 students</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-sm">
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

      {/* Main Classroom Interface - Scrollable content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto">
        {/* Left Side - AI Avatar and Controls */}
        <div className="flex-1 bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 relative overflow-hidden min-h-[60vh] lg:min-h-0">
          {/* Ambient Background Effects */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          {/* AI Avatar Section - Centered with proper spacing */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-16 lg:pt-8">
            <RealisticAvatar
              gender={avatarGender}
              isTeaching={isLessonActive}
              currentSpeech={currentSpeech}
              emotion={isLessonActive ? 'teaching' : 'friendly'}
              soundEnabled={soundEnabled}
              onQuestionAsked={handleQuestionAsked}
            />

            {/* Lesson Progress - Positioned with proper spacing */}
            {lessonProgress > 0 && (
              <div className="absolute bottom-28 lg:bottom-32 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-4">
                <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">Lesson Progress</span>
                    <span className="text-sm">{Math.round(lessonProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className="h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${lessonProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-purple-200 truncate">{currentLessonSegment?.title}</p>
                    <p className="text-xs text-purple-300 mt-1">
                      Segment {currentSegment + 1} of {lessonSegments.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Control Panel - Fixed at bottom with proper spacing */}
            <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
              <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl p-3 flex items-center justify-center space-x-3 lg:space-x-4">
                <button
                  onClick={isLessonActive ? handlePauseLesson : handleStartLesson}
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                >
                  {isLessonActive ? <Pause className="w-5 h-5 lg:w-6 lg:h-6" /> : <Play className="w-5 h-5 lg:w-6 lg:h-6" />}
                </button>
                
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-8 h-8 lg:w-10 lg:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 lg:w-5 lg:h-5" /> : <VolumeX className="w-4 h-4 lg:w-5 lg:h-5" />}
                </button>
                
                <button
                  onClick={() => setIsListening(!isListening)}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white transition-colors ${
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4 lg:w-5 lg:h-5" /> : <Mic className="w-4 h-4 lg:w-5 lg:h-5" />}
                </button>
                
                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white transition-colors ${
                    isChatOpen ? 'bg-green-500' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
                
                <button
                  onClick={() => setAvatarGender(avatarGender === 'male' ? 'female' : 'male')}
                  className="w-8 h-8 lg:w-10 lg:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  title={`Switch to ${avatarGender === 'male' ? 'female' : 'male'} avatar`}
                >
                  <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Chat Overlay */}
          {isChatOpen && (
            <div className="absolute top-16 lg:top-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-80 h-96 z-20">
              <RealTimeChat
                onQuestionAsked={handleQuestionAsked}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Right Side - Dynamic Smart Whiteboard */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-l border-gray-200 flex flex-col">
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
