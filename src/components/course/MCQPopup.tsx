// MCQPopup.tsx
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Clock } from 'lucide-react';

/**
 * Interface for MCQ question structure
 */
interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  subject: string;
}

/**
 * Props interface for MCQPopup component
 */
interface MCQPopupProps {
  /** Whether the popup is currently visible */
  isOpen: boolean;
  /** MCQ question data to display */
  question: MCQQuestion | null;
  /** Callback function when user selects an answer */
  onAnswerSubmit: (selectedAnswer: string, isCorrect: boolean) => void;
  /** Callback function to close the popup */
  onClose: () => void;
  /** Callback function to advance to the next question */
  onNextQuestion?: () => void; // NEW PROP ADDED
  /** Callback function when Continue Learning button is clicked */
  onContinueLearning?: () => void; // NEW PROP FOR AVATAR SPEECH
  /** Subject for styling theme */
  subject: string;
  /** Current question index (for multiple questions) */
  currentQuestionIndex: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Whether the current question has been answered */
  isAnswered: boolean;
  /** Whether the entire quiz is complete */
  isQuizComplete: boolean;
}

/**
 * MCQPopup Component
 *
 * A modern, animated popup component that displays multiple choice questions
 * with dynamic styling based on subject and interactive answer selection
 */
export const MCQPopup: React.FC<MCQPopupProps> = ({
  isOpen,
  question,
  onAnswerSubmit,
  onClose,
  onNextQuestion, // NEW PROP USED
  onContinueLearning, // NEW PROP FOR AVATAR SPEECH
  subject,
  currentQuestionIndex,
  totalQuestions,
  isAnswered,
  isQuizComplete
}) => {
  // Component state for user interaction
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 second timer

  /**
   * Get subject-specific color theme for styling
   * Returns appropriate gradient classes based on subject
   */
  const getSubjectTheme = (subjectName: string) => {
    const themes: Record<string, { gradient: string; accent: string; ring: string }> = {
      'Mathematics': {
        gradient: 'from-purple-600 via-blue-600 to-indigo-600',
        accent: 'bg-purple-500',
        ring: 'ring-purple-300'
      },
      'Science': {
        gradient: 'from-green-600 via-emerald-600 to-teal-600',
        accent: 'bg-green-500',
        ring: 'ring-green-300'
      },
      'Social Science': {
        gradient: 'from-orange-600 via-red-600 to-pink-600',
        accent: 'bg-orange-500',
        ring: 'ring-orange-300'
      },
      'English': {
        gradient: 'from-blue-600 via-cyan-600 to-sky-600',
        accent: 'bg-blue-500',
        ring: 'ring-blue-300'
      },
      'NEET': {
        gradient: 'from-red-600 via-pink-600 to-rose-600',
        accent: 'bg-red-500',
        ring: 'ring-red-300'
      }
    };
    return themes[subjectName] || themes['Mathematics'];
  };

  const theme = getSubjectTheme(subject);

  /**
   * Reset component state when question changes or popup opens
   */
  useEffect(() => {
    if (isOpen && question) {
      setSelectedAnswer('');
      setIsSubmitted(false);
      setIsCorrect(false);
      setTimeLeft(60);
    }
  }, [isOpen, question, currentQuestionIndex]);

  /**
   * Handle countdown timer for question answering
   */
  useEffect(() => {
    if (isOpen && !isSubmitted && timeLeft > 0 && !isAnswered) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitted && !isAnswered) {
      // Auto-submit when time runs out
      handleSubmit();
    }
  }, [isOpen, isSubmitted, timeLeft, isAnswered]);

  /**
   * Handle answer selection by user
   * Updates selected answer state and provides visual feedback
   */
  const handleAnswerSelect = (answer: string) => {
    if (!isSubmitted && !isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  /**
   * Handle answer submission and validation
   * Checks if answer is correct and triggers callback
   */
  const handleSubmit = () => {
    if (!question || isSubmitted || isAnswered) return;

    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    // Trigger callback to parent component
    onAnswerSubmit(selectedAnswer, correct);
  };

  /**
   * Handle popup close with proper cleanup
   */
  const handleClose = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    setIsCorrect(false);
    setTimeLeft(60);
    onClose();
  };

  /**
   * Handle "Continue" button click
   * Decides whether to close the quiz or advance to the next question
   */
  const handleContinueClick = () => {
    // Only call the avatar speech for the final "Continue Learning" after quiz completion
    if (isQuizComplete) {
      // Call the callback to make the avatar speak before continuing
      if (onContinueLearning) {
        onContinueLearning();
      }
      handleClose(); // Close the popup if the quiz is complete
    } else if (onNextQuestion) {
      onNextQuestion(); // Advance to the next question if available
    } else {
      handleClose(); // Fallback to close if no next question handler
    }
  };

  // Don't render if not open or no question data
  if (!isOpen || !question) return null;

  const isLastNEETQuestion = subject === 'NEET' && currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      {/* Popup Container with Animation */}
      <div className={`
        relative bg-gradient-to-br ${theme.gradient}
        rounded-3xl shadow-2xl border border-white/20
        max-w-2xl w-full mx-4 p-8
        transform transition-all duration-500 ease-out
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}>
        {/* Modern Glass Effect Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>

        {/* Content Container */}
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${theme.accent} animate-pulse`}></div>
              <h2 className="text-xl font-bold text-white">
                {subject} Question {totalQuestions > 1 ? `(${currentQuestionIndex + 1}/${totalQuestions})` : ''}
              </h2>
            </div>

            {/* Timer Display - Only show if question is not answered */}
            {!isAnswered && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className={`text-white font-bold ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : ''}`}>
                    {timeLeft}s
                  </span>
                </div>

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Close Question"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Question Text */}
          <div className="mb-8">
            <p className="text-lg text-white leading-relaxed font-medium">
              {question.question}
            </p>
          </div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctAnswer;
              const showCorrect = isSubmitted && isCorrectOption;
              const showIncorrect = isSubmitted && isSelected && !isCorrectOption;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isSubmitted || isAnswered}
                  className={`
                    relative p-6 rounded-2xl text-left transition-all duration-300
                    border-2 border-white/20
                    ${isSelected ? `${theme.ring} ring-4 bg-white/20` : 'bg-white/10 hover:bg-white/20'}
                    ${showCorrect ? 'ring-4 ring-green-300 bg-green-500/30 border-green-400' : ''}
                    ${showIncorrect ? 'ring-4 ring-red-300 bg-red-500/30 border-red-400' : ''}
                    ${(isSubmitted || isAnswered) && !isSelected && !isCorrectOption ? 'opacity-70' : ''}
                    transform hover:scale-105 active:scale-95
                    disabled:cursor-not-allowed
                  `}
                >
                  {/* Option Letter Indicator */}
                  <div className={`
                    absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center
                    font-bold text-sm
                    ${isSelected ? 'bg-white text-gray-800' : 'bg-white/20 text-white'}
                    ${showCorrect ? 'bg-green-500 text-white' : ''}
                    ${showIncorrect ? 'bg-red-500 text-white' : ''}
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>

                  {/* Option Text */}
                  <span className="text-white font-medium block">
                    {option}
                  </span>

                  {/* Status Icons */}
                  {showCorrect && (
                    <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-green-300 bg-green-700 rounded-full p-1" />
                  )}
                  {showIncorrect && (
                    <XCircle className="absolute -top-2 -right-2 w-8 h-8 text-red-300 bg-red-700 rounded-full p-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              {totalQuestions > 1 && (
                <div className="flex space-x-1">
                  {Array.from({ length: totalQuestions }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentQuestionIndex
                          ? 'bg-white w-4'
                          : index < currentQuestionIndex
                            ? 'bg-green-400'
                            : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {/* Submit Button - Only show if not answered */}
              {!isAnswered && (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer || isSubmitted}
                  className={`
                    px-8 py-3 rounded-full font-semibold transition-all duration-300
                    ${selectedAnswer
                      ? 'bg-white text-gray-800 hover:bg-gray-100 hover:scale-105'
                      : 'bg-white/30 text-white/70 cursor-not-allowed'
                    }
                    transform active:scale-95
                  `}
                >
                  Submit Answer
                </button>
              )}

              {/* Continue Button - Show when answered or quiz complete */}
              {(isAnswered || isQuizComplete) && (
                <button
                  onClick={handleContinueClick} // CALL NEW HANDLER
                  className="px-8 py-3 bg-white text-gray-800 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 transform active:scale-95"
                >
                  {isQuizComplete ? 'Continue Learning' : 'Next Question'}
                </button>
              )}
            </div>
          </div>

          {/* Explanation Section - Show after submission */}
          {isSubmitted && question.explanation && (
            <div className="mt-8 p-6 bg-white/10 rounded-2xl border border-white/20">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                Explanation
              </h3>
              <p className="text-white/90 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
