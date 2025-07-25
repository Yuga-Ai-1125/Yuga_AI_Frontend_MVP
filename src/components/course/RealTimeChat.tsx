import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, Bot, User, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'question' | 'clarification' | 'general';
}

interface RealTimeChatProps {
  onQuestionAsked: (question: string) => void;
  onClose: () => void;
}

export const RealTimeChat: React.FC<RealTimeChatProps> = ({ onQuestionAsked, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I'm here to help you during the lesson. Feel free to ask any questions about the topic we're covering!",
      sender: 'ai',
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (question: string): string => {
    const questionLower = question.toLowerCase();
    
    // Context-aware responses based on question content
    if (questionLower.includes('what') || questionLower.includes('define')) {
      return "Great question! Let me explain that concept clearly. " + getConceptualResponse(question);
    } else if (questionLower.includes('how') || questionLower.includes('why')) {
      return "Excellent question about the process! " + getProcessResponse(question);
    } else if (questionLower.includes('example') || questionLower.includes('show')) {
      return "Perfect! Let me give you a practical example. " + getExampleResponse(question);
    } else if (questionLower.includes('difference') || questionLower.includes('compare')) {
      return "Good analytical question! Let me break down the differences. " + getComparisonResponse(question);
    } else {
      return "That's an insightful question! " + getGeneralResponse(question);
    }
  };

  const getConceptualResponse = (question: string): string => {
    return "This concept is fundamental to understanding the topic. Think of it as a building block that connects to other ideas we've discussed. The key is to understand the underlying principles first.";
  };

  const getProcessResponse = (question: string): string => {
    return "The process works step by step. First, we establish the foundation, then we build upon it systematically. Each step is crucial for the overall understanding.";
  };

  const getExampleResponse = (question: string): string => {
    return "Here's a real-world example that illustrates this perfectly: Imagine you're solving a practical problem in your daily life. The same principles apply here.";
  };

  const getComparisonResponse = (question: string): string => {
    return "The main differences lie in their approach and application. While they may seem similar on the surface, their underlying mechanisms are quite different.";
  };

  const getGeneralResponse = (question: string): string => {
    return "This relates directly to what we're learning today. It's a common question that shows you're thinking critically about the material. Keep asking such thoughtful questions!";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const messageType = inputText.includes('?') ? 'question' : 'general';
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      type: messageType
    };

    setMessages(prev => [...prev, userMessage]);
    onQuestionAsked(inputText);
    setInputText('');
    setIsTyping(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText),
        sender: 'ai',
        timestamp: new Date(),
        type: 'general'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Can you explain this concept again?",
    "What's a real-world example?",
    "How does this relate to previous topics?",
    "Can you show this on the whiteboard?"
  ];

  return (
    <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-200 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <div>
            <span className="font-medium">AI Assistant</span>
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-purple-200">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Questions */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
        <div className="flex flex-wrap gap-1">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => setInputText(question)}
              className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user' ? 'bg-purple-600' : 'bg-indigo-600'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-white" />
                )}
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'question' && message.sender === 'user' && (
                  <div className="flex items-center space-x-1 mb-1">
                    <HelpCircle className="w-3 h-3" />
                    <span className="text-xs opacity-75">Question</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 opacity-70 ${
                  message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about the lesson..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};