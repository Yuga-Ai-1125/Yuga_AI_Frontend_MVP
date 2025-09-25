import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, VolumeX, X } from 'lucide-react';
import { apiRequest } from '../../utils/api';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  courseCategory?: string;
  onQuestionAsked?: (question: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  isOpen,
  onClose,
  courseCategory = 'NEET',
  onQuestionAsked
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcription, setTranscription] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      stopSpeaking();
      setMessages([]);
      setTranscription('');
      setError('');
    }
  }, [isOpen]);

  const startListening = async () => {
    try {
      setError('');
      setIsProcessing(false);
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
      setIsListening(true);
      
      // Auto-stop after 5 seconds
      setTimeout(() => {
        if (isListening) {
          stopListening();
        }
      }, 5000);
    } catch (err) {
      setError('Could not access microphone. Please check permissions.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  };

  const sendAudioToBackend = async () => {
    try {
      setIsProcessing(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
      const reader = new FileReader();
      
      reader.onload = async () => {
        const audioData = reader.result as string;
        const base64Audio = audioData.split(',')[1];
        
        // Call the voice API endpoint with the audio data
        try {
          const response = await apiRequest('/voice/query', 'POST', {
            audio: base64Audio,
            messages,
            courseCategory
          });
          
          if (response.ok) {
            const data = await response.json();
            
            // Log the transcription and response for debugging
            console.log('User said:', data.transcription);
            console.log('Assistant replied:', data.response);
            
            setMessages(prev => [
              ...prev,
              { role: 'user', content: data.transcription },
              { role: 'assistant', content: data.response }
            ]);
            
            setTranscription(data.transcription);
            
            // Send the response to the parent component for the avatar to speak
            if (onQuestionAsked && data.response) {
              onQuestionAsked(data.response);
            }
            
            // Play the audio response
            if (data.audio) {
              const audioBlob = new Blob([
                Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))
              ], { type: 'audio/mp3' });
              
              const audioUrl = URL.createObjectURL(audioBlob);
              const audioElement = new Audio(audioUrl);
              audioRef.current = audioElement;
              
              audioElement.onplay = () => setIsSpeaking(true);
              audioElement.onended = () => setIsSpeaking(false);
              audioElement.onpause = () => setIsSpeaking(false);
              
              audioElement.play();
            }
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to process audio. Please try again.');
            console.error('Backend error:', errorData);
          }
        } catch (err) {
          setError('Failed to connect to the server. Please try again.');
          console.error('API request error:', err);
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (err) {
      setError('Error processing your request. Please try again.');
      console.error('Error sending audio to backend:', err);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
          <h3 className="font-semibold">NEET Voice Assistant</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto p-3 bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-16">
              <p>Ask me anything about {courseCategory}</p>
              <p className="text-sm mt-2">Click the microphone to start</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div
                  className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                    message.role === 'user'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="p-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking || isProcessing}
              className={`p-2 rounded-full ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${(isSpeaking || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Mic className="w-5 h-5" />
            </button>
            
            <button
              onClick={stopSpeaking}
              disabled={!isSpeaking}
              className={`p-2 rounded-full ${
                isSpeaking
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          
          {isProcessing && (
            <div className="text-xs text-gray-500">
              Processing...
            </div>
          )}
          
          {transcription && !isProcessing && (
            <div className="text-xs text-gray-500 truncate max-w-xs">
              Heard: "{transcription}"
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="px-3 pb-3">
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
