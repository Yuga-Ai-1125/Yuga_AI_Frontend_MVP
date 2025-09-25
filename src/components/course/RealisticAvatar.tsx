import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { User } from 'lucide-react';
import avatarVideo from '../../assets/avatar.mp4';

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
}

export interface RealisticAvatarHandle {
  startRecording: () => void;
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
  onOpenVoiceAssistant
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

  // Expose the startRecording method to parent component
  useImperativeHandle(ref, () => ({
    startRecording: () => {
      startRecording();
    }
  }));

  const startRecording = async () => {
    try {
      setErrorMessage('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
        }
      }, 5000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setErrorMessage('Microphone access denied. Please check permissions.');
      if (onOpenVoiceAssistant) {
        onOpenVoiceAssistant();
      }
    }
  };

  const playAudioFromBase64 = (base64Audio: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Create audio element from base64 data
      const audioBlob = new Blob([
        Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))
      ], { type: 'audio/mp3' });

      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      audioRef.current = audioElement;

      // Play the video when audio starts
      const video = videoRef.current;
      if (video && isTeaching) {
        video.play().catch(error => {
          console.error('Error playing avatar video:', error);
        });
      }

      audioElement.onplay = () => {
        setIsSpeaking(true);
        // Reset the pause flag when new audio starts (including doubt responses)
        setHasPausedAfterContinueLearning(false);
        // Ensure video is playing
        if (video && video.paused) {
          video.play().catch(error => {
            console.error('Error playing avatar video:', error);
          });
        }
      };

      audioElement.onended = () => {
        setIsSpeaking(false);
        // Pause the avatar video when audio ends for synchronization
        const video = videoRef.current;
        if (video) {
          video.pause();
        }
        if (onSpeechEnd) {
          onSpeechEnd();
        }
      };

      audioElement.onerror = () => {
        setIsSpeaking(false);
        console.error('Error playing audio response');
        // Fallback to text-to-speech if audio playback fails
        if (currentSpeech) {
          speakText(currentSpeech);
        }
      };

      audioElement.play();
    } catch (err) {
      console.error('Error playing audio:', err);
      // Fallback to text-to-speech
      if (currentSpeech) {
        speakText(currentSpeech);
      }
    }
  };

  const sendAudioToBackend = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
      const reader = new FileReader();

      reader.onload = async () => {
        const audioData = reader.result as string;
        const base64Audio = audioData.split(',')[1];

        try {
          const response = await fetch('http://localhost:5000/api/voice/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audio: base64Audio,
              messages: [],
              courseCategory: 'NEET'
            })
          });

          if (response.ok) {
            const data = await response.json();

            console.log('User said:', data.transcription);
            console.log('Assistant replied:', data.response);

            // Use the Groq API response for the avatar's speech
            if (data.response) {
              onQuestionAsked(data.response);

              // Play the audio response if available
              if (data.audio) {
                playAudioFromBase64(data.audio);
              } else {
                // Fallback to text-to-speech
                speakText(data.response);
              }
            } else if (data.transcription) {
              onQuestionAsked(data.transcription);
            }
          } else {
            const errorData = await response.json();
            console.error('Failed to process audio:', errorData);
            setErrorMessage('Failed to process audio. Please try again.');
            onQuestionAsked("Can you explain this concept in more detail?");
          }
        } catch (err) {
          console.error('Error calling voice API:', err);
          setErrorMessage('Network error. Please check if the backend server is running.');
          onQuestionAsked("Can you explain this concept in more detail?");
        }
      };

      reader.readAsDataURL(audioBlob);
    } catch (err) {
      console.error('Error processing audio:', err);
      setErrorMessage('Error processing audio. Please try again.');
      onQuestionAsked("Can you explain this concept in more detail?");
    }
  };

  useEffect(() => {
    setCurrentExpression(emotion);
  }, [emotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    // If we've paused after the "Continue Learning" speech, keep the video paused
    // unless we're starting a new speech or changing teaching mode
    if (hasPausedAfterContinueLearning && !currentSpeech) {
      video.pause();
      return;
    }

    if (isTeaching && !shouldPauseAfterSpeech && !hasPausedAfterContinueLearning) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing avatar video:', error);
          document.addEventListener('click', () => {
            video.play().catch(e => console.error('Still cannot play video:', e));
          }, { once: true });
        });
      }
    } else if (!isTeaching || shouldPauseAfterSpeech || hasPausedAfterContinueLearning) {
      video.pause();
      if (shouldPauseAfterSpeech) {
        setShouldPauseAfterSpeech(false);
      }
    }
  }, [isTeaching, videoLoaded, shouldPauseAfterSpeech, hasPausedAfterContinueLearning, currentSpeech]);

  const selectFemaleVoice = (): SpeechSynthesisVoice | undefined => {
    const voices = speechSynthesis.getVoices();
    const femaleVoiceNames = [
      'zira', 'samantha', 'helena', 'eva', 'katie', 'serena', 'tessa', 'google us english female', 'google uk english female'
    ];
    const femaleVoices = voices.filter(voice => {
      const name = voice.name.toLowerCase();
      return femaleVoiceNames.some(femaleName => name.includes(femaleName));
    });
    return femaleVoices.length > 0 ? femaleVoices[0] : undefined;
  };

  const speakText = (text: string, onEndCallback?: () => void) => {
    if (!text || !soundEnabled || !isTeaching) {
      return;
    }

    // Check if this is the "Continue Learning" speech that should pause the video
    const isContinueLearningSpeech = text.includes("How were the questions?") &&
                                   text.includes("Ask Doubt") &&
                                   text.includes("I'm here to help");

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    speechSynthesis.cancel();

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
      // Reset the pause flag when new speech starts (including doubt responses)
      setHasPausedAfterContinueLearning(false);
      // Ensure video is playing
      const video = videoRef.current;
      if (video && video.paused && isTeaching) {
        video.play().catch(error => {
          console.error('Error playing avatar video:', error);
        });
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);

      // For the "Continue Learning" speech, pause the video and set the flag
      if (isContinueLearningSpeech) {
        setShouldPauseAfterSpeech(true);
        setHasPausedAfterContinueLearning(true);
        const video = videoRef.current;
        if (video) {
          video.pause();
        }
      } else {
        // For all other speeches (including doubt responses), pause the video
        // This ensures the video stops after clearing doubts asked after the quiz
        const video = videoRef.current;
        if (video) {
          video.pause();
        }
      }

      if (onEndCallback) {
        onEndCallback();
      }
      if (onSpeechEnd) {
        onSpeechEnd();
      }
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      if (onEndCallback) {
        onEndCallback();
      }
      if (onSpeechEnd) {
        onSpeechEnd();
      }
    };

    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (introText) {
      speakText(introText);
    }
  }, [introText, soundEnabled, isTeaching]);

  useEffect(() => {
    if (currentSpeech) {
      // Reset the flag when a new speech starts (unless it's the Continue Learning speech)
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

  // Reset the flag when teaching mode changes or lesson is paused
  useEffect(() => {
    if (!isTeaching) {
      setHasPausedAfterContinueLearning(false);
    }
  }, [isTeaching]);

  const handleVideoLoadedData = () => {
    setVideoLoaded(true);
  };

  const handleVideoEnded = () => {
    const video = videoRef.current;
    if (video && isTeaching) {
      video.currentTime = 0;
      video.play().catch(error => {
        console.error('Error restarting avatar video:', error);
      });
    }
  };

  const handleVideoError = (error: any) => {
    console.error('Avatar video error:', error);
    setVideoLoaded(false);
  };

  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
  };

  return (
    <div className="relative flex flex-col items-center">
      {isRecording && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2 z-40">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Recording...</span>
        </div>
      )}

      {errorMessage && (
        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm z-50">
          {errorMessage}
        </div>
      )}

      <div className="relative transition-all duration-500 rotate-0">
        {isTeaching && (
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 rounded-3xl opacity-30 animate-pulse blur-xl"></div>
        )}

        <div className="relative w-80 h-56 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
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
            <source src={avatarVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

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

        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-white">{config.name}</h3>
          <p className="text-purple-200 text-sm">AI Learning Specialist</p>
        </div>
      </div>

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
    </div>
  );
});

RealisticAvatar.displayName = 'RealisticAvatar';
