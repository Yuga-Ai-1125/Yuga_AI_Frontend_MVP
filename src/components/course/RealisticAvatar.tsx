import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, VolumeX, MessageCircle, User, Users } from 'lucide-react';

interface RealisticAvatarProps {
  gender: 'male' | 'female';
  isTeaching: boolean;
  currentSpeech: string;
  emotion: 'friendly' | 'teaching' | 'explaining' | 'encouraging';
  soundEnabled: boolean;
  onQuestionAsked: (question: string) => void;
}

export const RealisticAvatar: React.FC<RealisticAvatarProps> = ({
  gender,
  isTeaching,
  currentSpeech,
  emotion,
  soundEnabled,
  onQuestionAsked
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(emotion);
  const [gesturePhase, setGesturePhase] = useState(0);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Avatar appearance based on gender
  const avatarConfig = {
    male: {
      name: 'Professor Alex',
      hairColor: 'from-amber-800 to-amber-900',
      skinTone: 'from-amber-100 to-amber-200',
      clothing: 'from-blue-600 to-blue-800',
      voice: 'male'
    },
    female: {
      name: 'Professor Sarah',
      hairColor: 'from-amber-700 to-amber-800',
      skinTone: 'from-rose-100 to-rose-200',
      clothing: 'from-purple-600 to-purple-800',
      voice: 'female'
    }
  };

  const config = avatarConfig[gender];

  useEffect(() => {
    setCurrentExpression(emotion);
  }, [emotion]);

  useEffect(() => {
    if (currentSpeech && soundEnabled && isTeaching) {
      setIsSpeaking(true);
      
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(currentSpeech);
      utterance.rate = 0.85;
      utterance.pitch = gender === 'female' ? 1.1 : 0.9;
      utterance.volume = 0.8;

      // Wait for voices to load
      const setVoice = () => {
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => {
          const voiceName = voice.name.toLowerCase();
          if (gender === 'female') {
            return voiceName.includes('female') || voiceName.includes('samantha') || voiceName.includes('zira') || voiceName.includes('susan');
          } else {
            return voiceName.includes('male') || voiceName.includes('david') || voiceName.includes('mark') || voiceName.includes('alex');
          }
        });
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };

      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
      } else {
        setVoice();
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      speechSynthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    }
  }, [currentSpeech, soundEnabled, isTeaching, gender]);

  // Gesture animation
  useEffect(() => {
    if (isTeaching && isSpeaking) {
      const interval = setInterval(() => {
        setGesturePhase(prev => (prev + 1) % 4);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isTeaching, isSpeaking]);

  const getEyeExpression = () => {
    switch (currentExpression) {
      case 'teaching':
        return 'animate-pulse';
      case 'explaining':
        return 'animate-bounce';
      case 'encouraging':
        return '';
      default:
        return '';
    }
  };

  const getMouthShape = () => {
    if (isSpeaking) {
      return 'w-6 h-4 rounded-full animate-pulse';
    }
    switch (currentExpression) {
      case 'friendly':
        return 'w-4 h-2 rounded-full';
      case 'teaching':
        return 'w-5 h-3 rounded-full';
      default:
        return 'w-4 h-2 rounded-full';
    }
  };

  const getGestureTransform = () => {
    if (!isTeaching || !isSpeaking) return 'rotate-0';
    
    switch (gesturePhase) {
      case 0: return 'rotate-2 translate-x-1';
      case 1: return 'rotate-0 translate-x-0';
      case 2: return '-rotate-2 -translate-x-1';
      case 3: return 'rotate-0 translate-x-0';
      default: return 'rotate-0';
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar Container */}
      <div className={`relative transition-all duration-500 ${getGestureTransform()}`}>
        {/* Glow Effect */}
        {isTeaching && (
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 rounded-full opacity-30 animate-pulse blur-xl"></div>
        )}
        
        {/* Main Avatar */}
        <div className="relative w-64 h-80 bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-indigo-100"></div>
          
          {/* Body/Clothing */}
          <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-gradient-to-b ${config.clothing} rounded-t-3xl`}>
            {/* Collar */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-white rounded-b-lg"></div>
          </div>
          
          {/* Head */}
          <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-gradient-to-b ${config.skinTone} rounded-3xl`}>
            {/* Hair */}
            <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-36 h-24 bg-gradient-to-b ${config.hairColor} rounded-3xl`}></div>
            
            {/* Eyes */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <div className={`w-4 h-4 bg-white rounded-full flex items-center justify-center ${getEyeExpression()}`}>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <div className={`w-4 h-4 bg-white rounded-full flex items-center justify-center ${getEyeExpression()}`}>
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            
            {/* Nose */}
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-gradient-to-b from-rose-200 to-rose-300 rounded-full"></div>
            
            {/* Mouth */}
            <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 bg-rose-400 ${getMouthShape()}`}></div>
            
            {/* Eyebrows */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex space-x-6">
              <div className={`w-6 h-1 bg-gradient-to-r ${config.hairColor} rounded-full`}></div>
              <div className={`w-6 h-1 bg-gradient-to-r ${config.hairColor} rounded-full`}></div>
            </div>
          </div>
          
          {/* Arms with Gestures */}
          <div className="absolute bottom-16 left-4 w-8 h-16 bg-gradient-to-b from-rose-100 to-rose-200 rounded-full transform rotate-12 transition-transform duration-500"></div>
          <div className="absolute bottom-16 right-4 w-8 h-16 bg-gradient-to-b from-rose-100 to-rose-200 rounded-full transform -rotate-12 transition-transform duration-500"></div>
        </div>
      </div>

      {/* Name Tag */}
      <div className="mt-6 bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900">{config.name}</h3>
        <p className="text-purple-600 text-sm">AI Learning Specialist</p>
        <div className="flex items-center justify-center space-x-2 mt-2">
          {isSpeaking && (
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-1 h-4 bg-green-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse delay-150"></div>
            </div>
          )}
        </div>
      </div>

      {/* Speech Indicator */}
      {isSpeaking && currentSpeech && (
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 max-w-md z-10">
          <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-purple-200">
            <p className="text-gray-800 text-sm text-center">
              {currentSpeech.length > 100 ? `${currentSpeech.substring(0, 100)}...` : currentSpeech}
            </p>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {isSpeaking && (
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        )}
        {isTeaching && (
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
        )}
        {soundEnabled && (
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        )}
      </div>

      {/* Floating Particles */}
      {isTeaching && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-bounce opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};