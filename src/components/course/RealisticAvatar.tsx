import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, VolumeX, MessageCircle, User, Users } from 'lucide-react';
// Import the video file as a module
import avatarVideo from '../../assets/avatar.mp4';

/**
 * Interface defining the props for the RealisticAvatar component
 * This component renders an AI avatar with video, speech synthesis, and interactive features
 */
interface RealisticAvatarProps {
  /** Gender of the avatar - affects voice selection and visual styling */
  gender: 'male' | 'female';
  /** Whether the avatar is currently in teaching mode */
  isTeaching: boolean;
  /** Current text being spoken by the avatar */
  currentSpeech: string;
  /** Emotional state of the avatar affecting visual presentation */
  emotion: 'friendly' | 'teaching' | 'explaining' | 'encouraging';
  /** Whether sound/speech synthesis is enabled */
  soundEnabled: boolean;
  /** Callback function triggered when user asks a question */
  onQuestionAsked: (question: string) => void;
}

/**
 * RealisticAvatar Component
 * 
 * A sophisticated AI avatar component that displays an MP4 video, provides speech synthesis,
 * and includes interactive features for educational applications. The component handles
 * video playback, speech synthesis, visual effects, and user interactions.
 * 
 * Key Features:
 * - MP4 video avatar with synchronized speech
 * - Text-to-speech synthesis with gender-appropriate voices
 * - Visual indicators for teaching and speaking states
 * - Gesture animations and visual effects
 * - Interactive question asking functionality
 * - Non-overlapping transcript display positioned above the video
 */
export const RealisticAvatar: React.FC<RealisticAvatarProps> = ({
  gender,
  isTeaching,
  currentSpeech,
  emotion,
  soundEnabled,
  onQuestionAsked
}) => {
  // State management for avatar behavior and visual effects
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(emotion);
  const [gesturePhase, setGesturePhase] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Refs for video and speech synthesis management
  const videoRef = useRef<HTMLVideoElement>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  /**
   * Avatar configuration object for male avatar Alex
   * Only male configuration since avatar is specifically male
   */
  const avatarConfig = {
    name: 'Alex',
    voice: 'male'
  };

  // Get avatar configuration for male avatar Alex
  const config = avatarConfig;

  /**
   * Effect to update avatar expression when emotion prop changes
   * Ensures visual consistency with the current emotional state
   */
  useEffect(() => {
    setCurrentExpression(emotion);
  }, [emotion]);

  /**
   * Effect to handle video playback based on teaching state
   * Automatically starts/stops video when teaching begins/ends
   * Includes error handling for autoplay restrictions
   */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    if (isTeaching) {
      // Start playing the video when teaching begins
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing avatar video:', error);
          // Fallback: Try to play with user interaction
          document.addEventListener('click', () => {
            video.play().catch(e => console.error('Still cannot play video:', e));
          }, { once: true });
        });
      }
    } else {
      // Pause the video when teaching stops
      video.pause();
    }
  }, [isTeaching, videoLoaded]);

  /**
   * Effect to handle speech synthesis
   * Converts text to speech using Web Speech API with gender-appropriate voice selection
   * Manages speaking state and provides error handling
   */
  useEffect(() => {
    if (currentSpeech && soundEnabled && isTeaching) {
      setIsSpeaking(true);
      
      // Cancel any ongoing speech to prevent overlapping
      speechSynthesis.cancel();

      // Create new speech synthesis utterance with male voice settings
      const utterance = new SpeechSynthesisUtterance(currentSpeech);
      utterance.rate = 0.85; // Slightly slower for better comprehension
      utterance.pitch = 0.9; // Male voice pitch setting
      utterance.volume = 0.8; // Comfortable volume level

      /**
       * Voice selection function to find male voices only for Alex
       * Completely eliminates female voices and focuses on male voice options
       */
      const setVoice = () => {
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => {
          const voiceName = voice.name.toLowerCase();
          // Only search for male voices - no female voice options
          return voiceName.includes('male') || voiceName.includes('david') || 
                 voiceName.includes('mark') || voiceName.includes('alex') || 
                 voiceName.includes('daniel') || voiceName.includes('nathan') ||
                 voiceName.includes('tom') || voiceName.includes('james');
        });
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };

      // Handle voice loading - voices may not be immediately available
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true });
      } else {
        setVoice();
      }

      // Set up speech synthesis event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        console.error('Speech synthesis error occurred');
      };

      // Store reference and start speech
      speechSynthesisRef.current = utterance;
      speechSynthesis.speak(utterance);
    } else {
      // Stop speaking and cancel any ongoing speech
      setIsSpeaking(false);
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    }
  }, [currentSpeech, soundEnabled, isTeaching]);

  /**
   * Effect to handle gesture animation during teaching and speaking
   * DISABLED: Gesture animations removed for stable video presentation
   * Keeping this effect disabled to prevent video shaking
   */
  useEffect(() => {
    // Gesture animations disabled to keep video steady
    // if (isTeaching && isSpeaking) {
    //   const interval = setInterval(() => {
    //     setGesturePhase(prev => (prev + 1) % 4);
    //   }, 2000); // Change gesture every 2 seconds
    //   return () => clearInterval(interval);
    // }
  }, [isTeaching, isSpeaking]);

  /**
   * Video event handlers for managing video loading and playback states
   */
  
  // Handle successful video data loading
  const handleVideoLoadedData = () => {
    setVideoLoaded(true);
    console.log('Avatar video loaded successfully');
  };

  // Handle video end - restart for looping during teaching
  const handleVideoEnded = () => {
    const video = videoRef.current;
    if (video && isTeaching) {
      // Restart the video for continuous looping
      video.currentTime = 0;
      video.play().catch(error => {
        console.error('Error restarting avatar video:', error);
      });
    }
  };

  // Handle video loading errors
  const handleVideoError = (error: any) => {
    console.error('Avatar video error:', error);
    setVideoLoaded(false);
  };

  // Handle video ready to play state
  const handleVideoCanPlay = () => {
    console.log('Avatar video can play');
    setVideoLoaded(true);
  };

  /**
   * Calculate gesture transform for subtle avatar movement during teaching
   * DISABLED: Gesture animations removed to keep video steady and professional
   * Returns no transform to maintain stable video presentation
   */
  const getGestureTransform = () => {
    // Removed gesture animations to prevent video shaking
    // Keeping video steady for better user experience
    return 'rotate-0';
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* 
        TRANSCRIPT BUBBLE - TEMPORARILY HIDDEN
        Positioned between header and video in the safe visible zone
        Shows complete transcript content in wide bubble without header overlap
        Currently hidden as requested
      */}
      {false && isSpeaking && currentSpeech && (
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 w-[600px] max-w-[90vw] mx-4 z-30">
          <div className="text-sm text-gray-800 text-center leading-relaxed">
            {currentSpeech}
          </div>
          {/* Triangle pointer pointing down to the avatar */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-white"></div>
          </div>
        </div>
      )}

      {/* Avatar Container - Stable positioning without gesture animations */}
      <div className={`relative transition-all duration-500 ${getGestureTransform()}`}>
        {/* Glow Effect when teaching - creates ambient lighting effect */}
        {isTeaching && (
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 rounded-3xl opacity-30 animate-pulse blur-xl"></div>
        )}
        
        {/* 
          Video Avatar Container 
          Maintains 1280x720 aspect ratio but scaled down for optimal display
          Professional video presentation with rounded corners and shadow
        */}
        <div className="relative w-80 h-56 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900">
          {/* MP4 Video Avatar Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted // Video audio is muted, we handle audio through speech synthesis
            loop
            playsInline
            preload="metadata"
            onLoadedData={handleVideoLoadedData}
            onCanPlay={handleVideoCanPlay}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            style={{
              filter: isTeaching ? 'brightness(1.1) contrast(1.05)' : 'brightness(0.9) contrast(0.95)'
            }}
          >
            {/* Main video source - avatar.mp4 file */}
            <source src={avatarVideo} type="video/mp4" />
            
            {/* Fallback content for browsers that don't support the video tag */}
            Your browser does not support the video tag.
          </video>

          {/* Loading state while video is loading */}
          {!videoLoaded && (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                  <User className="w-8 h-8" />
                </div>
                <p className="text-sm">Loading Avatar...</p>
              </div>
            </div>
          )}

          {/* Overlay effects for enhanced visual feedback */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Speaking indicator overlay - subtle visual feedback when speaking */}
            {isSpeaking && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20 animate-pulse"></div>
            )}
            
            {/* Teaching state indicator - shows active teaching status */}
            {isTeaching && videoLoaded && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
            )}
          </div>
        </div>

        {/* Professor name display */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-white">{config.name}</h3>
          <p className="text-purple-200 text-sm">AI Learning Specialist</p>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {isSpeaking && (
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Speaking"></div>
        )}
        {isTeaching && (
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" title="Teaching"></div>
        )}
        {soundEnabled && (
          <div className="w-3 h-3 bg-blue-500 rounded-full" title="Sound Enabled"></div>
        )}
        {videoLoaded && (
          <div className="w-3 h-3 bg-green-400 rounded-full" title="Video Ready"></div>
        )}
      </div>

      {/* Floating Particles Effect when teaching - adds dynamic visual interest */}
      {isTeaching && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-bounce opacity-60"
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

      {/* Interactive Elements */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-3">
        <button
          onClick={() => onQuestionAsked("I have a question about this topic")}
          className="bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
          title="Ask a Question"
        >
          <MessageCircle className="w-4 h-4 text-purple-600" />
        </button>
      </div>
    </div>
  );
};
