import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Tag, Clock, CheckCircle, HelpCircle, X } from 'lucide-react';
import { Doubt, ChatMessage } from '../../types';
import { AIAvatar } from '../AIAvatar';

interface DoubtSolverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoubtSolver: React.FC<DoubtSolverProps> = ({ isOpen, onClose }) => {
  const [doubts, setDoubts] = useState<Doubt[]>([
    {
      id: '1',
      question: 'What is the difference between machine learning and deep learning?',
      subject: 'Technology',
      course: 'Introduction to Machine Learning',
      answer: 'Machine learning is a broader field that includes various algorithms for pattern recognition, while deep learning is a subset that uses neural networks with multiple layers.',
      status: 'answered',
      timestamp: new Date(Date.now() - 3600000),
      tags: ['ML', 'Deep Learning', 'AI'],
      difficulty: 'medium'
    }
  ]);
  
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ask' | 'history'>('ask');

  const subjects = ['Technology', 'Business', 'Science', 'Mathematics', 'Programming', 'Design'];
  const commonTags = ['Beginner', 'Advanced', 'Concept', 'Practice', 'Theory', 'Application'];

  const handleSubmitDoubt = async () => {
    if (!currentQuestion.trim() || !selectedSubject) return;

    setIsProcessing(true);
    
    const newDoubt: Doubt = {
      id: Date.now().toString(),
      question: currentQuestion,
      subject: selectedSubject,
      status: 'pending',
      timestamp: new Date(),
      tags: selectedTags,
      difficulty: 'medium'
    };

    setDoubts(prev => [newDoubt, ...prev]);

    // Simulate AI processing
    setTimeout(() => {
      const aiAnswer = generateAIAnswer(currentQuestion);
      setDoubts(prev => prev.map(doubt => 
        doubt.id === newDoubt.id 
          ? { ...doubt, answer: aiAnswer, status: 'answered' }
          : doubt
      ));
      setIsProcessing(false);
      setCurrentQuestion('');
      setSelectedTags([]);
      setActiveTab('history');
    }, 2000);
  };

  const generateAIAnswer = (question: string): string => {
    const responses = [
      "Great question! Let me break this down for you step by step...",
      "This is a fundamental concept. Here's how I'd explain it...",
      "I can see why this might be confusing. Let me clarify...",
      "Excellent question! This relates to several key principles...",
      "That's a thoughtful question. Here's a comprehensive explanation..."
    ];
    return responses[Math.floor(Math.random() * responses.length)] + " [AI would provide detailed explanation here based on the specific question asked]";
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Voice recognition would be implemented here
    if (!isRecording) {
      setTimeout(() => {
        setCurrentQuestion("What is the difference between supervised and unsupervised learning?");
        setIsRecording(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 p-4 sm:p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AIAvatar size="medium" emotion="explaining" isActive />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">YUGA AI Doubt Solver</h2>
                <p className="text-purple-100 text-sm sm:text-base">Get instant answers to your questions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('ask')}
              className={`px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                activeTab === 'ask' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              Ask Question
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                activeTab === 'history' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-200 hover:text-white'
              }`}
            >
              My Doubts ({doubts.length})
            </button>
          </div>
        </div>

        {/* Content - Now with proper scrolling */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'ask' ? (
            <div className="h-full overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Subject
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {subjects.map(subject => (
                      <button
                        key={subject}
                        onClick={() => setSelectedSubject(subject)}
                        className={`p-2 sm:p-3 rounded-lg border transition-colors text-sm ${
                          selectedSubject === subject
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        {subject}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Question
                  </label>
                  <div className="relative">
                    <textarea
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      placeholder="Type your question here... or use voice input"
                      className="w-full h-32 sm:h-40 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleVoiceInput}
                      className={`absolute bottom-3 right-3 p-2 rounded-lg transition-colors ${
                        isRecording 
                          ? 'bg-red-500 text-white animate-pulse' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs sm:text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSubmitDoubt}
                    disabled={!currentQuestion.trim() || !selectedSubject || isProcessing}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Ask YUGA AI
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {doubts.map(doubt => (
                    <div key={doubt.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base break-words">{doubt.question}</h3>
                          <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-600">
                            <span className="flex items-center">
                              <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {doubt.subject}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {doubt.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className={`flex items-center px-2 py-1 rounded-full text-xs flex-shrink-0 ml-2 ${
                          doubt.status === 'answered' 
                            ? 'bg-green-100 text-green-700'
                            : doubt.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {doubt.status === 'answered' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {doubt.status === 'pending' && <HelpCircle className="w-3 h-3 mr-1" />}
                          {doubt.status}
                        </div>
                      </div>

                      {doubt.answer && (
                        <div className="bg-white rounded-lg p-3 border-l-4 border-purple-500">
                          <div className="flex items-start space-x-2">
                            <AIAvatar size="small" emotion="explaining" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-gray-700 break-words leading-relaxed">{doubt.answer}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {doubt.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {doubt.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};