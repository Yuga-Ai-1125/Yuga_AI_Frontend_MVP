import React, { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { QuizQuestion } from '../types';
import { AIAvatar } from './AIAvatar';

interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return;
    
    setSelectedAnswer(answerIndex);
    setAnswered(true);
    setShowExplanation(true);
    
    if (answerIndex === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(score);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswered(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <AIAvatar 
            size="small" 
            emotion={showExplanation ? (isCorrect ? 'encouraging' : 'explaining') : 'thinking'} 
            isActive={answered}
          />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {question.question}
        </h3>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ";
          
          if (!answered) {
            buttonClass += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer";
          } else {
            if (index === question.correctAnswer) {
              buttonClass += "border-green-500 bg-green-50 text-green-800";
            } else if (index === selectedAnswer && index !== question.correctAnswer) {
              buttonClass += "border-red-500 bg-red-50 text-red-800";
            } else {
              buttonClass += "border-gray-200 bg-gray-50 text-gray-600";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={answered}
              className={buttonClass}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {answered && index === question.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {answered && index === selectedAnswer && index !== question.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={`p-4 rounded-lg mb-6 ${
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start space-x-2">
            <Lightbulb className={`w-5 h-5 mt-0.5 ${
              isCorrect ? 'text-green-600' : 'text-blue-600'
            }`} />
            <div>
              <h4 className={`font-medium mb-1 ${
                isCorrect ? 'text-green-800' : 'text-blue-800'
              }`}>
                {isCorrect ? 'Correct!' : 'Good try!'}
              </h4>
              <p className={`text-sm ${
                isCorrect ? 'text-green-700' : 'text-blue-700'
              }`}>
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
        >
          <span>{isLastQuestion ? 'Complete Quiz' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};