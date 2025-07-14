import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Sparkles, Brain, Heart, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

interface AIAvatarProps {
  isActive?: boolean;
  emotion?: 'happy' | 'thinking' | 'explaining' | 'encouraging' | 'teaching';
  size?: 'small' | 'medium' | 'large' | 'xl';
  isSpeaking?: boolean;
  onToggleSound?: () => void;
  onMicrophoneToggle?: (isListening: boolean) => void;
  onChatOpen?: () => void;
  speechText?: string;
  enableInteraction?: boolean;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ 
  isActive = false, 
  emotion = 'happy',
  size = 'medium',
  isSpeaking = false,
  onToggleSound,
  onMicrophoneToggle,
  onChatOpen,
  speechText = '',
  enableInteraction = false
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(emotion);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }

    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        // You can handle the speech input here
        setIsListening(false);
        onMicrophoneToggle?.(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        onMicrophoneToggle?.(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        onMicrophoneToggle?.(false);
      };
    }

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onMicrophoneToggle]);

  useEffect(() => {
    setCurrentExpression(emotion);
    if (isActive) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [emotion, isActive]);

  useEffect(() => {
    // Handle text-to-speech
    if (speechText && soundEnabled && speechSupported && isSpeaking) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;

      // Try to use a more natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Alex') ||
        voice.name.includes('Samantha')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        console.log('AI Avatar started speaking');
      };

      utterance.onend = () => {
        console.log('AI Avatar finished speaking');
      };

      speechSynthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  }, [speechText, soundEnabled, speechSupported, isSpeaking]);

  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const getAvatarColor = () => {
    switch (currentExpression) {
      case 'thinking': return 'from-purple-400 via-indigo-500 to-purple-600';
      case 'explaining': return 'from-blue-400 via-cyan-500 to-blue-600';
      case 'encouraging': return 'from-emerald-400 via-green-500 to-emerald-600';
      case 'teaching': return 'from-orange-400 via-amber-500 to-orange-600';
      default: return 'from-purple-400 via-indigo-500 to-cyan-500';
    }
  };

  const getEyeIcon = () => {
    switch (currentExpression) {
      case 'thinking': return <Brain className="w-3 h-3 text-white" />;
      case 'explaining': return <MessageCircle className="w-3 h-3 text-white" />;
      case 'encouraging': return <Heart className="w-3 h-3 text-white" />;
      case 'teaching': return <Sparkles className="w-3 h-3 text-white" />;
      default: return <Sparkles className="w-3 h-3 text-white" />;
    }
  };

  const handleSoundToggle = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    
    if (!newSoundState) {
      speechSynthesis.cancel();
    }
    
    onToggleSound?.();
  };

  const handleMicrophoneToggle = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      onMicrophoneToggle?.(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        onMicrophoneToggle?.(true);
      } catch (error) {
        console.error('Speech recognition error:', error);
      }
    }
  };

  return (
    <div className="relative">
      <div
        className={`
          ${sizeClasses[size]} rounded-full bg-gradient-to-br ${getAvatarColor()}
          flex items-center justify-center relative overflow-hidden
          transition-all duration-500 ease-in-out
          ${isActive ? 'scale-110 shadow-xl shadow-purple-200' : 'shadow-lg'}
          ${isAnimating ? 'animate-pulse' : ''}
          ${isSpeaking ? 'animate-bounce' : ''}
        `}
      >
        {/* Avatar Face */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Eyes */}
          <div className="flex space-x-1 mb-1">
            <div className={`
              w-2 h-2 bg-white rounded-full flex items-center justify-center
              ${isSpeaking ? 'animate-pulse' : ''}
            `}>
              {getEyeIcon()}
            </div>
            <div className={`
              w-2 h-2 bg-white rounded-full flex items-center justify-center
              ${isSpeaking ? 'animate-pulse' : ''}
            `}>
              {getEyeIcon()}
            </div>
          </div>
          
          {/* Mouth - changes based on emotion and speaking */}
          <div className={`
            absolute bottom-2 bg-white rounded-full transition-all duration-300
            ${isSpeaking ? 'w-4 h-3 animate-pulse' : 'w-3 h-1.5'}
            ${currentExpression === 'happy' ? 'rounded-t-none' : ''}
            ${currentExpression === 'thinking' ? 'w-2 h-2 rounded-full' : ''}
          `} />
        </div>

        {/* Active indicator */}
        {isActive && (
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-indigo-500 to-cyan-500 rounded-full animate-spin opacity-75">
            <div className="w-full h-full bg-white rounded-full opacity-20" />
          </div>
        )}

        {/* Speaking indicator */}
        {isSpeaking && (
          <div className="absolute -inset-2 border-2 border-purple-400 rounded-full animate-ping opacity-75" />
        )}

        {/* Listening indicator */}
        {isListening && (
          <div className="absolute -inset-3 border-2 border-green-400 rounded-full animate-pulse opacity-75" />
        )}
      </div>

      {/* Interactive Controls for larger avatars */}
      {(size === 'large' || size === 'xl') && enableInteraction && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {/* Sound control */}
          {speechSupported && (
            <button
              onClick={handleSoundToggle}
              className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
              title={soundEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-purple-600" />
              ) : (
                <VolumeX className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}

          {/* Microphone control */}
          {recognitionRef.current && (
            <button
              onClick={handleMicrophoneToggle}
              className={`shadow-lg rounded-full p-2 transition-colors ${
                isListening 
                  ? 'bg-green-500 text-white animate-pulse' 
                  : 'bg-white text-purple-600 hover:bg-gray-50'
              }`}
              title={isListening ? 'Stop Listening' : 'Start Voice Input'}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Chat control */}
          {onChatOpen && (
            <button
              onClick={onChatOpen}
              className="bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
              title="Open Chat"
            >
              <MessageCircle className="w-4 h-4 text-purple-600" />
            </button>
          )}
        </div>
      )}

      {/* Floating particles for large sizes */}
      {(size === 'large' || size === 'xl') && isActive && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-bounce
                ${i % 2 === 0 ? 'animate-delay-200' : 'animate-delay-500'}
              `}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Name tag for teaching mode */}
      {currentExpression === 'teaching' && (size === 'large' || size === 'xl') && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full px-3 py-1">
          <span className="text-xs font-medium text-purple-600">YUGA AI</span>
        </div>
      )}

      {/* Speech bubble for speaking */}
      {isSpeaking && speechText && (size === 'large' || size === 'xl') && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg px-3 py-2 max-w-xs">
          <div className="text-xs text-gray-700 text-center">
            {speechText.length > 50 ? `${speechText.substring(0, 50)}...` : speechText}
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          </div>
        </div>
      )}
    </div>
  );
};