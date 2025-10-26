// NEET2MCQBox.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, HelpCircle, Volume2, VolumeX, ArrowRight, RotateCcw } from 'lucide-react';

interface NEET2MCQBoxProps {
  question: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  };
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswerSelect: (selectedAnswer: string, isCorrect: boolean) => void;
  onExplanationRequest: (question: any) => void;
  onNextQuestion: () => void;
  onTryAgain: () => void;
  explanationText: string;
  isExplaining: boolean;
  showClarityPopup: boolean;
  onClarityResponse: (isClear: boolean) => void;
  userAnswer: string;
  isCorrect: boolean;
  isAudioPlaying?: boolean;
  highlightedText?: string;
}

export const NEET2MCQBox: React.FC<NEET2MCQBoxProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswerSelect,
  onExplanationRequest,
  onNextQuestion,
  onTryAgain,
  explanationText,
  isExplaining,
  showClarityPopup,
  onClarityResponse,
  userAnswer,
  isCorrect,
  isAudioPlaying = false,
  highlightedText
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showExplanationPopup, setShowExplanationPopup] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    setShowExplanationPopup(false);
    setCurrentHighlightIndex(0);
    setHighlightedWords([]);
  }, [question.id]);

  // Handle text highlighting during audio playback - 2x SLOWER SPEED (480ms per word)
  useEffect(() => {
    if (highlightedText && isAudioPlaying) {
      const words = highlightedText.split(' ');
      setHighlightedWords(words);
      setCurrentHighlightIndex(0);

      const interval = setInterval(() => {
        setCurrentHighlightIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 360); // 2x slower speed: 480ms per word

      return () => clearInterval(interval);
    } else {
      setHighlightedWords([]);
      setCurrentHighlightIndex(0);
    }
  }, [highlightedText, isAudioPlaying]);

  const handleAnswerSelect = (answer: string) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === question.correctAnswer;
    setIsSubmitted(true);
    onAnswerSelect(selectedAnswer, correct);

    if (correct) {
      setShowExplanationPopup(true);
    }
    // For incorrect answers, explanation will be automatically triggered by parent
  };

  const handleExplanationResponse = (wantsExplanation: boolean) => {
    setShowExplanationPopup(false);
    if (wantsExplanation) {
      onExplanationRequest(question);
    } else {
      onNextQuestion();
    }
  };

  const handleTryAgainClick = () => {
    setSelectedAnswer('');
    setIsSubmitted(false);
    setShowExplanationPopup(false);
    onTryAgain();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Question Section - Fixed height with scroll */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Text - Always visible */}
        <div className="mb-6">
          <p className="text-lg leading-relaxed font-medium text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-200">
            {question.question}
          </p>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.correctAnswer;
            const showCorrect = isSubmitted && isCorrectOption;
            const showIncorrect = isSubmitted && isSelected && !isCorrectOption;
            const isDisabled = isSubmitted && !isSelected && !isCorrectOption;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isSubmitted}
                className={`
                  relative p-4 rounded-xl text-left transition-all duration-300
                  border-2
                  ${isSelected ? 'ring-4 ring-purple-200 bg-purple-50 border-purple-300' : 'bg-white border-gray-200 hover:border-purple-300'}
                  ${showCorrect ? 'ring-4 ring-green-200 bg-green-50 border-green-400' : ''}
                  ${showIncorrect ? 'ring-4 ring-red-200 bg-red-50 border-red-400' : ''}
                  ${isDisabled ? 'opacity-50' : ''}
                  transform hover:scale-105 active:scale-95
                  disabled:cursor-not-allowed
                `}
              >
                {/* Option Letter */}
                <div className={`
                  absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center
                  font-bold text-sm border-2
                  ${isSelected ? 'bg-purple-500 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300'}
                  ${showCorrect ? 'bg-green-500 text-white border-green-600' : ''}
                  ${showIncorrect ? 'bg-red-500 text-white border-red-600' : ''}
                `}>
                  {String.fromCharCode(65 + index)}
                </div>

                {/* Option Text */}
                <span className="font-medium text-gray-800 block">
                  {option}
                </span>

                {/* Status Icons */}
                {showCorrect && (
                  <CheckCircle className="absolute -top-2 -right-2 w-8 h-8 text-green-500 bg-white rounded-full p-1 border-2 border-green-500" />
                )}
                {showIncorrect && (
                  <XCircle className="absolute -top-2 -right-2 w-8 h-8 text-red-500 bg-white rounded-full p-1 border-2 border-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center
                ${selectedAnswer
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                transform active:scale-95
              `}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleTryAgainClick}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 hover:scale-105 transition-all duration-300 flex items-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}

          {/* Always show Next Question button when submitted, regardless of explanation state */}
          {isSubmitted && (
            <button
              onClick={onNextQuestion}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 hover:scale-105 transition-all duration-300 flex items-center"
            >
              Next Question
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Explanation Section - Only appears when there's explanation */}
      {explanationText && (
        <div className="border-t border-gray-200 p-4 bg-gray-50 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center">
              <HelpCircle className="w-4 h-4 mr-2 text-purple-600" />
              Explanation
              {isAudioPlaying && (
                <div className="ml-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              )}
            </h3>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-600 hover:text-purple-600 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
          <div className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm transition-all duration-300 ${
            isAudioPlaying ? 'bg-purple-50 border-purple-200' : ''
          }`}>
            {isAudioPlaying && highlightedWords.length > 0 ? (
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {highlightedWords.map((word, index) => (
                  <span
                    key={index}
                    className={index <= currentHighlightIndex ? 
                      'bg-purple-200 text-purple-800 px-1 rounded transition-colors duration-300' : 
                      'text-gray-700'
                    }
                  >
                    {word}{' '}
                  </span>
                ))}
              </p>
            ) : (
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {explanationText}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Explanation Popup - Only for correct answers */}
      {showExplanationPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border border-gray-200">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Correct Answer!
              </h3>
              <p className="text-gray-600 mb-6">
                Do you want a detailed explanation?
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => handleExplanationResponse(true)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleExplanationResponse(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clarity Popup - Must show after explanation */}
      {showClarityPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border border-gray-200">
            <div className="text-center">
              <HelpCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Explanation Complete
              </h3>
              <p className="text-gray-600 mb-6">
                Is the explanation clear?
              </p>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={() => onClarityResponse(true)}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => onClarityResponse(false)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};