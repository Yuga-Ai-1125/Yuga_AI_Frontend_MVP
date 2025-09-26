import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { User, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import avatarVideo from '../../assets/avatar.mp4';
import { apiRequest } from '../../utils/api';

interface RealisticAvatarProps {
  gender: 'male' | 'female';
  isTeaching: boolean;
  currentSpeech: string;
  emotion: 'friendly' | 'teaching' | 'explaining' | 'encouraging';
  soundEnabled: boolean;
  onQuestionAsked: (question: string) => void;
  onSpeechEnd?: () => void;
  introText?: string;
  onOpenVoiceAssistant?: () => void;
  courseCategory?: string;
}

export interface RealisticAvatarHandle {
  startRecording: () => void;
  stopRecording: () => void;
  speakText: (text: string) => void;
}

export const RealisticAvatar = forwardRef<RealisticAvatarHandle, RealisticAvatarProps>(({
  gender,
  isTeaching,
  currentSpeech,
  emotion,
  soundEnabled,
  onQuestionAsked,
  onSpeechEnd,
  introText = '',
  onOpenVoiceAssistant,
  courseCategory = 'NEET'
}, ref) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(emotion);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldPauseAfterSpeech, setShouldPauseAfterSpeech] = useState(false);
  const [hasPausedAfterContinueLearning, setHasPausedAfterContinueLearning] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const avatarConfig = {
    name: 'Diya',
    voice: 'female'
  };

  const config = avatarConfig;

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    startRecording: () => {
      startRecording();
    },
    stopRecording: () => {
      stopRecording();
    },
    speakText: (text: string) => {
      speakText(text);
    }
  }));

  /**
   * Start audio recording for voice queries
   */
  const startRecording = async () => {
    try {
      setErrorMessage('');
      setErrorMessage(''); // Clear previous errors
      
      // Check microphone permissions
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = sendAudioToBackend;
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setErrorMessage('Recording error occurred');
        setIsRecording(false);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Auto-stop after 10 seconds for safety
      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          stopRecording();
        }
      }, 10000);

    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setErrorMessage(`Microphone access denied: ${err.message}`);
      if (onOpenVoiceAssistant) {
        onOpenVoiceAssistant();
      }
    }
  };

  /**
   * Stop audio recording
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => {
          track.stop();
          track.enabled = false;
        });
        setIsRecording(false);
      } catch (err) {
        console.error('Error stopping recording:', err);
      }
    }
  };

  /**
   * Play audio from base64 string
   */
  const playAudioFromBase64 = (base64Audio: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Convert base64 to audio blob
      const audioBlob = new Blob([
        Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))
      ], { type: 'audio/mp3' });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioRef.current = audioElement;

      // Play video when audio starts
      const video = videoRef.current;
      if (video && isTeaching) {
        video.play().catch(error => {
          console.warn('Video play failed:', error);
        });
      }

      audioElement.onplay = () => {
        setIsSpeaking(true);
        setHasPausedAfterContinueLearning(false);
        
        if (video && video.paused) {
          video.play().catch(error => {
            console.warn('Video play on audio start failed:', error);
          });
        }
      };

      audioElement.onended = () => {
        setIsSpeaking(false);
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
        if (onSpeechEnd) {
          onSpeechEnd();
        }
        
        // Clean up URL object
        URL.revokeObjectURL(audioUrl);
      };

      audioElement.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsSpeaking(false);
        // Fallback to text-to-speech
        if (currentSpeech) {
          speakText(currentSpeech);
        }
      };

      audioElement.play().catch(error => {
        console.error('Audio play failed:', error);
        // Fallback to text-to-speech
        if (currentSpeech) {
          speakText(currentSpeech);
        }
      });

    } catch (err) {
      console.error('Error playing audio:', err);
      // Fallback to text-to-speech
      if (currentSpeech) {
        speakText(currentSpeech);
      }
    }
  };

  /**
   * Send audio to backend for processing
   */
  const sendAudioToBackend = async () => {
    if (audioChunksRef.current.length === 0) {
      setErrorMessage('No audio recorded');
      return;
    }

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const audioData = reader.result as string;
          const base64Audio = audioData.split(',')[1];

          const response = await apiRequest('/voice/query', 'POST', {
            audio: base64Audio,
            messages: [],
            courseCategory: courseCategory
          });

          if (response.ok) {
            const data = await response.json();

            console.log('✅ Voice query successful:', {
              transcription: data.transcription,
              responseLength: data.response?.length
            });

            if (data.response) {
              onQuestionAsked(data.response);

              // Play audio response if available
              if (data.audio) {
                playAudioFromBase64(data.audio);
              } else {
                // Fallback to text-to-speech
                speakText(data.response);
              }
            }
          } else {
            const errorData = await response.json();
            console.error('Backend error:', errorData);
            setErrorMessage('Failed to process audio. Please try again.');
            onQuestionAsked("I'm having trouble processing your question. Please try again or type your question instead.");
          }
        } catch (err: any) {
          console.error('Error processing voice response:', err);
          setErrorMessage('Network error. Please check your connection.');
          onQuestionAsked("I'm having connection issues. Please check your internet connection and try again.");
        }
      };

      reader.onerror = () => {
        setErrorMessage('Error reading audio file');
      };

      reader.readAsDataURL(audioBlob);

    } catch (err: any) {
      console.error('Error sending audio to backend:', err);
      setErrorMessage(`Connection error: ${err.message}`);
      onQuestionAsked("Can you explain this concept in more detail?");
    }
  };

  // Update expression when emotion prop changes
  useEffect(() => {
    setCurrentExpression(emotion);
  }, [emotion]);

  // Handle video playback based on teaching state
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    if (hasPausedAfterContinueLearning && !currentSpeech) {
      video.pause();
      return;
    }

    if (isTeaching && !shouldPauseAfterSpeech && !hasPausedAfterContinueLearning) {
      video.play().catch(error => {
        console.warn('Auto-play failed, waiting for user interaction:', error);
      });
    } else if (!isTeaching || shouldPauseAfterSpeech || hasPausedAfterContinueLearning) {
      video.pause();
      if (shouldPauseAfterSpeech) {
        setShouldPauseAfterSpeech(false);
      }
    }
  }, [isTeaching, videoLoaded, shouldPauseAfterSpeech, hasPausedAfterContinueLearning, currentSpeech]);

  /**
   * Select appropriate female voice for speech synthesis
   */
  const selectFemaleVoice = (): SpeechSynthesisVoice | undefined => {
    const voices = speechSynthesis.getVoices();
    const femaleVoiceNames = [
      'zira', 'samantha', 'helena', 'eva', 'katie', 'serena', 'tessa', 
      'google us english female', 'google uk english female', 'female'
    ];
    
    const femaleVoices = voices.filter(voice => {
      const name = voice.name.toLowerCase();
      return femaleVoiceNames.some(femaleName => name.includes(femaleName)) || 
             voice.lang.includes('en') && !voice.name.toLowerCase().includes('male');
    });
    
    return femaleVoices.length > 0 ? femaleVoices[0] : voices[0];
  };

  /**
   * Speak text using browser's speech synthesis
   */
  const speakText = (text: string, onEndCallback?: () => void) => {
    if (!text || !soundEnabled || !isTeaching) {
      if (onEndCallback) onEndCallback();
      return;
    }

    // Check for special speech patterns
    const isContinueLearningSpeech = text.includes("How were the questions?") &&
                                   text.includes("Ask Doubt") &&
                                   text.includes("I'm here to help");

    // Stop any current speech
    speechSynthesis.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    const voice = selectFemaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setHasPausedAfterContinueLearning(false);
      
      const video = videoRef.current;
      if (video && video.paused && isTeaching) {
        video.play().catch(error => {
          console.warn('Video play on speech start failed:', error);
        });
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);

      if (isContinueLearningSpeech) {
        setShouldPauseAfterSpeech(true);
        setHasPausedAfterContinueLearning(true);
        const video = videoRef.current;
        if (video) {
          video.pause();
        }
      } else {
        const video = videoRef.current;
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }

      if (onEndCallback) onEndCallback();
      if (onSpeechEnd) onSpeechEnd();
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      if (onEndCallback) onEndCallback();
      if (onSpeechEnd) onSpeechEnd();
    };

    speechSynthesisRef.current = utterance;
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      if (onEndCallback) onEndCallback();
    }
  };

  // Handle intro text
  useEffect(() => {
    if (introText && isTeaching) {
      speakText(introText);
    }
  }, [introText, soundEnabled, isTeaching]);

  // Handle current speech changes
  useEffect(() => {
    if (currentSpeech) {
      const isContinueLearningSpeech = currentSpeech.includes("How were the questions?") &&
                                     currentSpeech.includes("Ask Doubt") &&
                                     currentSpeech.includes("I'm here to help");

      if (!isContinueLearningSpeech) {
        setHasPausedAfterContinueLearning(false);
      }

      speakText(currentSpeech);
    } else {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentSpeech, soundEnabled, isTeaching]);

  // Reset flags when teaching mode changes
  useEffect(() => {
    if (!isTeaching) {
      setHasPausedAfterContinueLearning(false);
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isTeaching]);

  // Video event handlers
  const handleVideoLoadedData = () => {
    setVideoLoaded(true);
  };

  const handleVideoEnded = () => {
    const video = videoRef.current;
    if (video && isTeaching && isSpeaking) {
      video.currentTime = 0;
      video.play().catch(error => {
        console.warn('Video restart failed:', error);
      });
    }
  };

  const handleVideoError = (error: any) => {
    console.error('Avatar video error:', error);
    setVideoLoaded(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2 z-40 animate-pulse">
          <MicOff className="w-3 h-3" />
          <span>Recording... (10s max)</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm z-50 max-w-xs text-center">
          {errorMessage}
        </div>
      )}

      {/* Avatar Container */}
      <div className="relative transition-all duration-500 rotate-0">
        {/* Animated Background Glow */}
        {isTeaching && (
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 rounded-3xl opacity-30 animate-pulse blur-xl"></div>
        )}

        {/* Video Avatar */}
        <div className="relative w-80 h-56 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={handleVideoLoadedData}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            style={{
              filter: isTeaching ? 'brightness(1.1) contrast(1.05)' : 'brightness(0.9) contrast(0.95)'
            }}
          >
            <source src={avatarVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Loading State */}
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

          {/* Status Overlays */}
          <div className="absolute inset-0 pointer-events-none">
            {isSpeaking && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-cyan-500/20 animate-pulse"></div>
            )}

            {isTeaching && videoLoaded && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
            )}
          </div>
        </div>

        {/* Avatar Info */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-white">{config.name}</h3>
          <p className="text-purple-200 text-sm">AI Learning Specialist</p>
          <p className="text-purple-300 text-xs mt-1">{courseCategory} Expert</p>
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
        {isRecording && (
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title="Recording"></div>
        )}
      </div>
    </div>
  );
});

RealisticAvatar.displayName = 'RealisticAvatar';
