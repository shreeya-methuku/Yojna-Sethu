'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';

// Language code mapping for Web Speech API
const SPEECH_LANG_MAP = {
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  en: 'en-IN',
};

export default function VoiceButton({ language, onTranscript, onListeningChange, disabled }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      setSupported(!!SpeechRecognition);
    }
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG_MAP[language] || 'hi-IN';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      onListeningChange?.(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t + ' ';
        } else {
          interimTranscript += t;
        }
      }
      setTranscript((finalTranscript + interimTranscript).trim());
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      onListeningChange?.(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      onListeningChange?.(false);
      if (finalTranscript.trim()) {
        onTranscript?.(finalTranscript.trim());
        setTranscript('');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleClick = () => {
    if (disabled) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!supported) {
    return (
      <div className="text-center">
        <div className="text-amber-400 text-sm bg-amber-400/10 border border-amber-400/20 rounded-lg p-3">
          ⚠️ Voice input requires Chrome browser. Please use Chrome for the best experience.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main voice button with ripple effect */}
      <div className="relative">
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-bharat-green/30 animate-ping" style={{ animationDuration: '1.5s' }} />
            <div className="absolute inset-[-8px] rounded-full bg-bharat-green/20 animate-ping" style={{ animationDuration: '2s' }} />
          </>
        )}
        <button
          onClick={handleClick}
          disabled={disabled}
          className={`
            relative z-10 w-24 h-24 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-2xl
            ${disabled
              ? 'bg-gray-700 cursor-not-allowed opacity-50'
              : isListening
                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/40 scale-110'
                : 'bg-bharat-green hover:bg-bharat-darkgreen shadow-bharat-green/40 hover:scale-105'
            }
          `}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <div className="flex items-end gap-0.5 h-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-white rounded-full"
                  style={{
                    animation: `wave 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                    height: '100%',
                  }}
                />
              ))}
            </div>
          ) : (
            <Mic size={36} className="text-white" />
          )}
        </button>
      </div>

      {/* Status text */}
      <div className="text-center min-h-[24px]">
        {isListening ? (
          <p className="text-red-400 text-sm font-medium animate-pulse">
            🔴 Listening... (tap to stop)
          </p>
        ) : (
          <p className="text-gray-400 text-sm">
            {disabled ? 'Processing...' : 'Tap to speak'}
          </p>
        )}
      </div>

      {/* Live transcript preview */}
      {transcript && (
        <div className="w-full max-w-sm bg-bharat-card/80 border border-bharat-border rounded-xl p-3">
          <p className="text-gray-300 text-sm italic">"{transcript}"</p>
        </div>
      )}
    </div>
  );
}
