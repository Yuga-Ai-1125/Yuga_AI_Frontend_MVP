// AIClassroom.tsx
import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, MessageCircle, Download, Maximize, Settings, Users, Clock, BookOpen, HelpCircle } from 'lucide-react';
import { Course, Lesson } from '../../types';
import { RealisticAvatar } from './RealisticAvatar';
import DynamicWhiteboard from './DynamicWhiteboard';
import { RealTimeChat } from './RealTimeChat';
import { MCQPopup } from './MCQPopup';
import { VoiceAssistant } from "../voice/VoiceAssistant";

interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  subject: string;
}

interface AIClassroomProps {
  course: Course;
  lesson: Lesson;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to normalize course category for backend
const normalizeCategory = (category: string): string => {
  const cat = category.toLowerCase().replace(/\s+/g, '');
  if (cat === 'neet') return 'NEET';
  if (cat === 'mathematics' || cat === 'math') return 'Mathematics';
  if (cat === 'science') return 'Science';
  if (cat === 'socialscience') return 'SocialScience';
  if (cat === 'english') return 'English';
  if (cat === 'hindi') return 'Hindi';
  if (cat === 'computerscience') return 'ComputerScience';
  return 'NEET'; // default fallback
};

export const AIClassroom: React.FC<AIClassroomProps> = ({ course, lesson, isOpen, onClose }) => {
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentSpeech, setCurrentSpeech] = useState('');
  const [whiteboardContent, setWhiteboardContent] = useState<any[]>([]);
  const [avatarGender, setAvatarGender] = useState<'male' | 'female'>('female');
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // MCQ functionality
  const [showMCQ, setShowMCQ] = useState(false);
  const [currentMCQIndex, setCurrentMCQIndex] = useState(0);
  const [mcqQuestions, setMCQQuestions] = useState<MCQQuestion[]>([]);
  const [mcqAnswered, setMCQAnswered] = useState(false);
  const [hasShownMCQ, setHasShownMCQ] = useState(false);
  const [waitingForSpeech, setWaitingForSpeech] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [isFeedbackGiven, setIsFeedbackGiven] = useState(false);

  // Ref to access RealisticAvatar methods
  const avatarRef = useRef<any>(null);

  const generateMCQForSubject = (courseCategory: string): MCQQuestion[] => {
    const subjectMapping: Record<string, string> = {
      'Mathematics': 'Mathematics',
      'Math': 'Mathematics',
      'Science': 'Science',
      'Physics': 'Science',
      'Chemistry': 'Science',
      'Biology': 'Science',
      'Social Science': 'Social Science',
      'History': 'Social Science',
      'Geography': 'Social Science',
      'English': 'English',
      'Literature': 'English',
      'Language Arts': 'English',
      'NEET': 'NEET'
    };

    const subject = subjectMapping[courseCategory] || 'Mathematics';

    const mcqQuestions: Record<string, MCQQuestion[]> = {
      'Mathematics': [
        {
          id: 'MATH-MCQ-1',
          question: 'What is the value of √16?',
          options: ['2', '4', '8', '16'],
          correctAnswer: '4',
          explanation: '√16 = 4 because 4 × 4 = 16. The square root of a number is the value that, when multiplied by itself, gives the original number.',
          subject: 'Mathematics'
        },
        {
          id: 'MATH-MCQ-2',
          question: 'If 2x + 5 = 15, what is the value of x?',
          options: ['3', '5', '7', '10'],
          correctAnswer: '5',
          explanation: 'To solve 2x + 5 = 15, subtract 5 from both sides: 2x = 10, then divide by 2: x = 5.',
          subject: 'Mathematics'
        }
      ],
      'Science': [
        {
          id: 'SCI-MCQ-1',
          question: 'What is the chemical symbol for water?',
          options: ['H₂O', 'CO₂', 'O₂', 'H₂'],
          correctAnswer: 'H₂O',
          explanation: 'Water has the chemical formula H₂O, indicating it contains two hydrogen atoms bonded to one oxygen atom.',
          subject: 'Science'
        },
        {
          id: 'SCI-MCQ-2',
          question: 'Which planet is closest to the Sun?',
          options: ['Venus', 'Mercury', 'Earth', 'Mars'],
          correctAnswer: 'Mercury',
          explanation: 'Mercury is the innermost planet in our solar system, orbiting closest to the Sun.',
          subject: 'Science'
        }
      ],
      'Social Science': [
        {
          id: 'SS-MCQ-1',
          question: 'In which year did World War II end?',
          options: ['1944', '1945', '1946', '1947'],
          correctAnswer: '1945',
          explanation: 'World War II ended in 1945 with the surrender of Germany in May and Japan in September.',
          subject: 'Social Science'
        }
      ],
      'English': [
        {
          id: 'ENG-MCQ-1',
          question: 'Who wrote "Romeo and Juliet"?',
          options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
          correctAnswer: 'William Shakespeare',
          explanation: '"Romeo and Juliet" is one of William Shakespeare\'s most famous plays.',
          subject: 'English'
        }
      ],
      'NEET': [
      {
        id: 'NEET-MCQ-1',
        question: 'Which of the following is a fundamental force in nature?',
        options: ['Gravitational force', 'Frictional force', 'Tension', 'Normal force'],
        correctAnswer: 'Gravitational force',
        explanation: 'Gravitational force is one of the four fundamental forces of nature. Friction, tension, and normal force are contact forces and not fundamental.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-2',
        question: 'Which law states that energy cannot be created or destroyed?',
        options: ['Law of conservation of energy', 'Newton second law', 'Hooke law', 'Faraday law'],
        correctAnswer: 'Law of conservation of energy',
        explanation: 'The law of conservation of energy states that the total energy of an isolated system remains constant. Energy can only change from one form to another.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-3',
        question: 'Which of the following is the SI unit of power?',
        options: ['Watt', 'Joule', 'Newton', 'Pascal'],
        correctAnswer: 'Watt',
        explanation: 'Power is the rate of doing work and its SI unit is Watt. One Watt equals one Joule per second.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-4',
        question: 'Which of the following is a strong acid?',
        options: ['Hydrochloric acid', 'Acetic acid', 'Carbonic acid', 'Citric acid'],
        correctAnswer: 'Hydrochloric acid',
        explanation: 'Hydrochloric acid is a strong acid as it dissociates completely in water, whereas the others are weak acids.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-5',
        question: 'Which element has the highest electronegativity?',
        options: ['Fluorine', 'Oxygen', 'Chlorine', 'Nitrogen'],
        correctAnswer: 'Fluorine',
        explanation: 'Fluorine has the highest electronegativity because it has a small size and high tendency to attract electrons.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-6',
        question: 'Which of the following is an example of a covalent compound?',
        options: ['Water', 'Sodium chloride', 'Calcium oxide', 'Potassium bromide'],
        correctAnswer: 'Water',
        explanation: 'Water is a covalent compound because the atoms share electrons to form bonds. The others are mainly ionic compounds.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-7',
        question: 'Which plant tissue provides mechanical support and flexibility to young stems and leaves?',
        options: ['Collenchyma', 'Parenchyma', 'Sclerenchyma', 'Xylem'],
        correctAnswer: 'Collenchyma',
        explanation: 'Collenchyma cells have unevenly thickened walls which provide support and flexibility to growing plant parts.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-8',
        question: 'Which plant hormone is responsible for cell elongation and bending towards light?',
        options: ['Auxin', 'Gibberellin', 'Cytokinin', 'Abscisic acid'],
        correctAnswer: 'Auxin',
        explanation: 'Auxin promotes cell elongation and helps plants bend towards light, a phenomenon called phototropism.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-9',
        question: 'Which part of human brain controls heart rate and breathing?',
        options: ['Medulla oblongata', 'Cerebellum', 'Cerebrum', 'Hypothalamus'],
        correctAnswer: 'Medulla oblongata',
        explanation: 'Medulla oblongata controls autonomic functions like heart rate, breathing, and blood pressure.',
        subject: 'NEET'
      },
      {
        id: 'NEET-MCQ-10',
        question: 'Which blood cells produce antibodies to fight infections?',
        options: ['B lymphocytes', 'T lymphocytes', 'Red blood cells', 'Platelets'],
        correctAnswer: 'B lymphocytes',
        explanation: 'B lymphocytes are responsible for producing antibodies as part of the immune response.',
        subject: 'NEET'
      }
]

    };

    return mcqQuestions[subject] || mcqQuestions['Mathematics'];
  };

  const handleSpeechEnd = () => {
    if (isLessonActive && !hasShownMCQ && !showMCQ) {
      setTimeout(() => {
        const questions = generateMCQForSubject(course.category);
        setMCQQuestions(questions);
        setCurrentMCQIndex(0);
        if (course.category === 'NEET') {
          setCurrentSpeech("Let's try these questions to test your understanding so far.");
        } else {
          setCurrentSpeech("Let's try this question to test your understanding so far.");
        }
        setShowMCQ(true);
        setHasShownMCQ(true);
      }, 2000);
    } else if (waitingForSpeech && !isFeedbackGiven) {
      setIsFeedbackGiven(true);
      setWaitingForSpeech(false);
      setCurrentSpeech('');

      if (course.category !== 'NEET') {
        setIsQuizComplete(true);
        setMCQAnswered(true);
      } else if (isQuizComplete) {
        setIsLessonActive(false);
      }
    }
  };

  const handleMCQAnswer = (selectedAnswer: string, isCorrect: boolean) => {
    if (course.category === 'NEET') {
      const currentQuestion = mcqQuestions[currentMCQIndex];

      if (selectedAnswer === '') {
        setCurrentSpeech(`You haven't answered the question. The correct answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`);
      } else if (isCorrect) {
        setCurrentSpeech("Excellent, that's the correct answer!");
      } else {
        setCurrentSpeech(`Not quite right. The correct answer is ${currentQuestion.correctAnswer}. ${currentQuestion.explanation}`);
      }

      setIsFeedbackGiven(false);
      setWaitingForSpeech(true);
      setMCQAnswered(true);
    } else {
      setTimeout(() => {
        if (isCorrect) {
          setCurrentSpeech("Excellent! That's the correct answer. Well done! You're showing great understanding. Let's continue with our lesson.");
        } else {
          const correctAnswer = mcqQuestions[currentMCQIndex]?.correctAnswer || '';
          const explanation = mcqQuestions[currentMCQIndex]?.explanation || '';
          setCurrentSpeech(`That's not quite right. The correct answer is ${correctAnswer}. ${explanation} Let's continue with our lesson.`);
        }
        setMCQAnswered(true);
        setIsQuizComplete(true); // Set quiz complete for single questions
      }, 500);
    }
  };

  const handleNextMCQQuestion = () => {
    if (currentMCQIndex < mcqQuestions.length - 1) {
      setCurrentMCQIndex(prev => prev + 1);
      setMCQAnswered(false);
      setIsFeedbackGiven(false);
      setCurrentSpeech('');
    } else {
      setIsQuizComplete(true);
      // Don't close the popup, let the user click "Continue Learning"
    }
  };

  const handleMCQClose = () => {
    setShowMCQ(false);
    setIsFeedbackGiven(false);
    setCurrentSpeech('');
  };

  const getSubjectIntroduction = (category: string, lessonTitle: string) => {
    const subjectIntroductions: Record<string, string> = {
      'Mathematics': `Welcome to today's mathematics lesson. I'm Professor Diya, your AI mathematics instructor. Mathematics is the language of patterns and relationships, and today we'll explore how these concepts apply to real-world problem solving.`,
      'Science': `Welcome to today's science lesson. I'm Professor Diya, your AI science instructor. Science helps us understand the natural world through observation and experimentation, and today we'll discover how these principles work in practice.`,
      'Hindi': `नमस्ते! आज के हिंदी पाठ "${lessonTitle}" में आपका स्वागत है। मैं प्रोफेसर युगा हूं, आपकी AI हिंदी शिक्षिका। आज हम हिंदी भाषा की सुंदरता और इसकी सांस्कृतिक महत्व को समझेंगे।`,
      'English': `Welcome to today's English lesson. I'm Professor Diya, your AI English instructor. Language is the foundation of communication and expression, and today we'll explore how to use English effectively in various contexts.`,
      'Physics': `Welcome to today's physics lesson. I'm Professor Diya, your AI physics instructor. Physics reveals the fundamental laws governing our universe, from the smallest particles to the largest galaxies.`,
      'Chemistry': `Welcome to today's chemistry lesson. I'm Professor Diya, your AI chemistry instructor. Chemistry explores the composition and behavior of matter, helping us understand reactions that shape our world.`,
      'Biology': `Welcome to today's biology lesson. I'm Professor Diya, your AI biology instructor. Biology studies living organisms and their interactions, revealing the fascinating complexity of life.`,
      'Social Science': `Welcome to today's social science lesson. I'm Professor Diya, your AI social science instructor. Social science helps us understand human societies and our place in the world, and today we'll explore important historical and cultural concepts.`,
      'NEET': `Welcome to today's NEET preparation session. I'm Professor Diya, your AI mentor. We'll connect core ideas from Physics, Chemistry, and Biology, focus on problem-solving strategies, and build exam-ready confidence for "${lessonTitle}".`
    };

    return subjectIntroductions[category] || subjectIntroductions['Mathematics'];
  };

  // Lesson segments
  const lessonSegments = [
    {
      title: "Introduction",
      content: getSubjectIntroduction(course.category, lesson.title),
      duration: 30,
    },
    {
      title: "Core Concepts",
      content: "Let's dive into the fundamental concepts that will build your understanding and prepare you for more advanced topics in this subject.",
      duration: 45,
    },
    {
      title: "Practical Examples",
      content: "Now I'll show you real-world applications of these concepts with practical examples that demonstrate their importance.",
      duration: 40,
    },
    {
      title: "Advanced Applications",
      content: "Let's explore more sophisticated applications and see how these concepts connect to other areas of study.",
      duration: 35,
    },
    {
      title: "Summary & Next Steps",
      content: "Let's review what we've learned today and discuss how you can continue building on these foundations.",
      duration: 25,
    }
  ];

  const currentLessonSegment = lessonSegments[currentSegment];

  const handleStartLesson = () => {
    setIsLessonActive(true);
    setLessonProgress(5);
    setCurrentSpeech(currentLessonSegment.content);

    setWhiteboardContent([
      `${course.title} - ${lesson.title}`,
      "Key Learning Objectives:",
      "• Understand fundamental principles",
      "• Apply concepts to real scenarios",
      "• Develop critical thinking skills",
      "• Connect to practical applications"
    ]);
  };

  const handlePauseLesson = () => {
    setIsLessonActive(false);
    setCurrentSpeech('');
  };

  // Handle questions asked through the Ask Doubt button
  const handleQuestionAsked = (response: string) => {
    // Use the Groq response directly
    setCurrentSpeech(response);
  };

  // Handle Ask Doubt button click
  const handleAskDoubt = () => {
    if (avatarRef.current) {
      // Call the startRecording method from RealisticAvatar
      avatarRef.current.startRecording();
      setIsRecording(true);
      
      // Set a timeout to stop recording after 5 seconds
      setTimeout(() => {
        setIsRecording(false);
      }, 5000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col overflow-hidden">
      {/* Header Bar */}
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

      {/* Main Classroom Interface */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-y-auto">
        {/* Left: Avatar + Controls */}
        <div className="flex-1 bg-gradient-to-br from-slate-800 via-purple-900 to-indigo-900 relative overflow-hidden min-h-[60vh] lg:min-h-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 lg:p-8 pt-16 lg:pt-8">
            <RealisticAvatar
              ref={avatarRef}
              gender={avatarGender}
              isTeaching={isLessonActive}
              currentSpeech={currentSpeech}
              emotion={isLessonActive ? 'teaching' : 'friendly'}
              soundEnabled={soundEnabled}
              onQuestionAsked={handleQuestionAsked}
              onSpeechEnd={handleSpeechEnd}
              onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            />

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
                    <p className="text-sm text-purple-200 truncate">{lessonSegments[currentSegment]?.title}</p>
                    <p className="text-xs text-purple-300 mt-1">
                      Segment {currentSegment + 1} of {lessonSegments.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-2xl px-3 py-2 flex items-center justify-center space-x-2 lg:space-x-3">
                <button
                  onClick={isLessonActive ? handlePauseLesson : handleStartLesson}
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                  title={isLessonActive ? 'Pause Lesson' : 'Start Lesson'}
                >
                  {isLessonActive ? <Pause className="w-5 h-5 lg:w-6 lg:h-6" /> : <Play className="w-5 h-5 lg:w-6 lg:h-6" />}
                </button>

                <button
                  onClick={handleAskDoubt}
                  className={`h-10 lg:h-12 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform px-4 ${
                    isRecording 
                      ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                  title="Ask Doubt"
                >
                  <div className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                    <span className="text-sm font-medium hidden lg:inline">
                      {isRecording ? 'Recording...' : 'Ask Doubt'}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5 lg:w-6 lg:h-6" /> : <VolumeX className="w-5 h-5 lg:w-6 lg:h-6" />}
                </button>

                <button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-white transition-colors ${
                    isChatOpen ? 'bg-green-500' : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }`}
                  title="Open Chat"
                >
                  <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>

                <button
                  onClick={() => setAvatarGender(avatarGender === 'male' ? 'female' : 'male')}
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-colors"
                  title={`Switch to ${avatarGender === 'male' ? 'female' : 'male'} avatar`}
                >
                  <Settings className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>
          </div>

          {isChatOpen && (
            <div className="absolute top-16 lg:top-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-80 h-96 z-20">
              <RealTimeChat
                onQuestionAsked={handleQuestionAsked}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
        </div>

        {/* Right: Whiteboard */}
        <div className="w-full lg:w-96 bg-white border-t lg:border-l border-gray-200 flex flex-col">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between flex-shrink-0">
            <h2 className="font-bold">Smart Whiteboard</h2>
            <div className="flex items-center space-x-2">
              {isLessonActive && (
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              )
              }
              <button className="text-white hover:text-gray-200">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          <DynamicWhiteboard
            content={whiteboardContent}
            lessonTitle={lesson.title}
            currentSegment={lessonSegments[currentSegment]?.title || ''}
            isActive={isLessonActive}
          />
        </div>
      </div>

      {/* Voice Assistant Component */}
      <VoiceAssistant
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        courseCategory={normalizeCategory(course.category)}
        onQuestionAsked={handleQuestionAsked}
      />

      {/* MCQ Popup */}
      <MCQPopup
        isOpen={showMCQ}
        question={mcqQuestions[currentMCQIndex]}
        onAnswerSubmit={handleMCQAnswer}
        onClose={handleMCQClose}
        onNextQuestion={handleNextMCQQuestion}
        onContinueLearning={() => {
          setIsLessonActive(true); // Ensure avatar is in teaching mode
          setTimeout(() => {
            setCurrentSpeech("How were the questions? If you have any doubts, click the 'Ask Doubt' button. I'm here to help and answer all your questions.");
          }, 100); // Small delay to ensure state update
        }}
        subject={course.category}
        currentQuestionIndex={currentMCQIndex}
        totalQuestions={mcqQuestions.length}
        isAnswered={mcqAnswered}
        isQuizComplete={isQuizComplete}
      />
    </div>
  );
};
