'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Send, RefreshCw, ArrowLeft, Mic, Volume2, VolumeX, ChevronDown, ChevronUp, Sparkles, Info, MessageSquare } from 'lucide-react';
import LanguageSelector from '../../components/LanguageSelector';
import VoiceButton from '../../components/VoiceButton';
import SchemeCard from '../../components/SchemeCard';
import SamplePrompts from '../../components/SamplePrompts';
import { allSchemes } from '../../lib/schemes';

const UI_STRINGS = {
  hi: {
    placeholder: 'अपनी स्थिति बताएं... (राज्य, काम, परिवार)',
    matched: 'आपके लिए योजनाएँ',
    noMatch: 'अभी कोई योजना नहीं',
    reset: 'नई बातचीत',
    schemeCount: 'योजनाएँ',
    welcome: 'नमस्ते! मैं योजना-सेतु हूँ 🙏\n\nबस अपनी स्थिति बताएं — राज्य, काम, परिवार — और मैं आपके लिए सरकारी योजनाएँ खोजूँगा।',
  },
  kn: {
    placeholder: 'ನಿಮ್ಮ ಪರಿಸ್ಥಿತಿ ಹೇಳಿ...',
    matched: 'ನಿಮಗೆ ಸೂಕ್ತ ಯೋಜನೆಗಳು',
    noMatch: 'ಇನ್ನೂ ಯೋಜನೆಗಳಿಲ್ಲ',
    reset: 'ಹೊಸ ಸಂಭಾಷಣೆ',
    schemeCount: 'ಯೋಜನೆಗಳು',
    welcome: 'ನಮಸ್ಕಾರ! ನಾನು ಯೋಜನ-ಸೇತು 🙏\n\nನಿಮ್ಮ ರಾಜ್ಯ, ವೃತ್ತಿ, ಕುಟುಂಬದ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
  },
  ta: {
    placeholder: 'உங்கள் நிலையை சொல்லுங்கள்...',
    matched: 'உங்களுக்கு பொருத்தமான திட்டங்கள்',
    noMatch: 'இன்னும் திட்டங்கள் இல்லை',
    reset: 'புதிய உரையாடல்',
    schemeCount: 'திட்டங்கள்',
    welcome: 'வணக்கம்! நான் யோஜனா-சேது 🙏\n\nஉங்கள் மாநிலம், தொழில், குடும்பம் பற்றி சொல்லுங்கள்.',
  },
  te: {
    placeholder: 'మీ పరిస్థితి చెప్పండి...',
    matched: 'మీకు సరిపడ పథకాలు',
    noMatch: 'ఇంకా పథకాలు లేవు',
    reset: 'కొత్త సంభాషణ',
    schemeCount: 'పథకాలు',
    welcome: 'నమస్కారం! నేను యోజన-సేతు 🙏\n\nమీ రాష్ట్రం, వృత్తి, కుటుంబం గురించి చెప్పండి.',
  },
  en: {
    placeholder: 'Describe yourself — state, occupation, family...',
    matched: 'Schemes matched for you',
    noMatch: 'No schemes yet',
    reset: 'New Chat',
    schemeCount: 'Schemes',
    welcome: "Hello! I'm Yojna-Setu 🙏\n\nTell me about yourself — your state, what you do, your family — and I'll find every government scheme you qualify for.",
  },
};

// Simple markdown bold renderer
function renderMessage(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function MessageBubble({ message, onSpeak, isSpeaking }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end group`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1
        ${isUser ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' : 'bg-bharat-green/20 border border-bharat-green/30 text-bharat-green'}`}>
        {isUser ? '👤' : '🏛️'}
      </div>

      <div className={`max-w-[78%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? 'bg-blue-600/20 border border-blue-500/20 text-gray-100 rounded-br-sm'
            : 'bg-bharat-card border border-bharat-border text-gray-200 rounded-bl-sm'
          }`}>
          <p className="whitespace-pre-wrap">
            {message.displayText ? renderMessage(message.displayText) : message.content}
          </p>
        </div>

        {/* Actions row */}
        <div className={`flex items-center gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'flex-row-reverse' : ''}`}>
          {!isUser && onSpeak && message.displayText && (
            <button
              onClick={() => onSpeak(message.displayText, message.language)}
              className={`flex items-center gap-1 text-xs transition-colors
                ${isSpeaking ? 'text-bharat-green' : 'text-gray-600 hover:text-bharat-green'}`}
            >
              {isSpeaking ? <VolumeX size={11} /> : <Volume2 size={11} />}
              <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>
          )}
          <span className="text-gray-700 text-xs">
            {new Date(message.timestamp || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-7 h-7 rounded-full bg-bharat-green/20 border border-bharat-green/30 flex items-center justify-center text-xs">🏛️</div>
      <div className="bg-bharat-card border border-bharat-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-bharat-green/60"
              style={{ animation: 'pulse 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('hi');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [showSchemes, setShowSchemes] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'schemes'

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const strings = UI_STRINGS[language] || UI_STRINGS.en;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!hasStarted) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: strings.welcome,
        displayText: strings.welcome,
        language,
        timestamp: Date.now(),
      }]);
    }
  }, [language]);

  const speakText = useCallback(async (text, lang) => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }
    try {
      const res = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang || language }),
      });
      const data = await res.json();

      if (data.source === 'polly' && data.audioData) {
        const audioBlob = new Blob([Uint8Array.from(atob(data.audioData), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
        const audio = new Audio(URL.createObjectURL(audioBlob));
        setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.play();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = data.browserLang || 'hi-IN';
        utterance.rate = 0.9;
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang === utterance.lang) || voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
        if (voice) utterance.voice = voice;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : 'en-IN';
        window.speechSynthesis.speak(u);
      }
    }
  }, [language, isSpeaking]);

  const sendMessage = async (text, forceLang) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const effectiveLang = forceLang || language;
    setHasStarted(true);
    setInputText('');

    const userMsg = { id: Date.now(), role: 'user', content: trimmed, timestamp: Date.now() };
    setMessages(prev => [...prev.filter(m => m.id !== 'welcome'), userMsg]);
    setIsLoading(true);

    const newHistory = [...conversationHistory, { role: 'user', content: trimmed }];

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory, language: effectiveLang }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Failed');

      const aiData = result.data;
      const detectedLang = aiData.detected_language || effectiveLang;
      if (['hi', 'kn', 'ta', 'te', 'en'].includes(detectedLang)) setLanguage(detectedLang);

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiData.message,
        displayText: aiData.message,
        language: detectedLang,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setConversationHistory([...newHistory, { role: 'assistant', content: aiData.message }]);

      if (aiData.matched_scheme_ids?.length > 0) {
        const schemes = aiData.matched_scheme_ids.map(id => allSchemes.find(s => s.id === id)).filter(Boolean);
        setMatchedSchemes(schemes);
        setShowSchemes(true);
        setActiveTab('schemes');
        setTimeout(() => setActiveTab('chat'), 1500);
      }

      if (aiData.message) setTimeout(() => speakText(aiData.message, detectedLang), 600);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'assistant',
        content: error.message?.includes('API key') ? '⚠️ Please add ANTHROPIC_API_KEY to .env.local' : 'Sorry, something went wrong. Please try again.',
        displayText: 'Sorry, something went wrong. Please try again.',
        language: effectiveLang, timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setConversationHistory([]);
    setMatchedSchemes([]);
    setHasStarted(false);
    setInputText('');
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setActiveTab('chat');
  };

  return (
    <div className="h-screen bg-bharat-bg flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="flex-shrink-0 bg-bharat-bg/95 backdrop-blur-xl border-b border-bharat-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Home</span>
            </button>
            <div className="w-px h-5 bg-bharat-border" />
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              <div>
                <span className="font-bold text-white text-base">Yojna-Setu</span>
                <span className="hidden sm:inline text-gray-500 text-xs ml-2">· AI Scheme Assistant</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-bharat-green bg-bharat-green/10 border border-bharat-green/20 px-2.5 py-1 rounded-full">
              <Sparkles size={10} /> Claude AI + AWS
            </span>
            <button onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-bharat-card border border-bharat-border hover:border-gray-600 px-3 py-1.5 rounded-lg transition-all">
              <RefreshCw size={12} />
              <span className="hidden sm:inline">{strings.reset}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Language Selector ── */}
      <div className="flex-shrink-0 border-b border-bharat-border px-4 py-2 bg-bharat-card/40">
        <div className="max-w-6xl mx-auto">
          <LanguageSelector selected={language} onChange={setLanguage} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 overflow-hidden max-w-6xl w-full mx-auto flex gap-0 lg:gap-5 px-4 py-4">

        {/* LEFT: Chat */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Mobile tab switcher */}
          <div className="lg:hidden flex mb-3 bg-bharat-card border border-bharat-border rounded-xl p-1">
            <button onClick={() => setActiveTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'chat' ? 'bg-bharat-green text-white' : 'text-gray-400 hover:text-white'}`}>
              <MessageSquare size={14} /> Chat
            </button>
            <button onClick={() => setActiveTab('schemes')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'schemes' ? 'bg-bharat-green text-white' : 'text-gray-400 hover:text-white'}`}>
              🏆 Schemes
              {matchedSchemes.length > 0 && (
                <span className="bg-white text-bharat-green text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {matchedSchemes.length}
                </span>
              )}
            </button>
          </div>

          {/* Chat messages area */}
          <div className={`flex-1 overflow-y-auto space-y-4 pr-1 mb-3 ${activeTab === 'schemes' ? 'hidden lg:block' : ''}`}
            style={{ scrollbarWidth: 'thin' }}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} onSpeak={speakText} isSpeaking={isSpeaking} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Sample prompts (before first message) */}
          {!hasStarted && activeTab === 'chat' && (
            <div className="mb-3">
              <SamplePrompts
                onSelect={(text, lang) => { setLanguage(lang); setTimeout(() => sendMessage(text, lang), 50); }}
                language={language}
              />
            </div>
          )}

          {/* Input row */}
          <div className={`flex-shrink-0 ${activeTab === 'schemes' ? 'hidden lg:flex' : 'flex'} flex-col gap-2`}>
            {/* Voice button row */}
            <div className="flex items-center justify-center gap-3">
              <VoiceButton
                language={language}
                onTranscript={t => sendMessage(t)}
                onListeningChange={setIsListening}
                disabled={isLoading}
              />
            </div>

            {/* Text input row */}
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(inputText); } }}
                placeholder={strings.placeholder}
                disabled={isLoading || isListening}
                rows={2}
                className={`flex-1 bg-bharat-card border border-bharat-border rounded-xl px-3 py-2.5 text-sm text-gray-200
                  placeholder-gray-600 resize-none focus:outline-none focus:border-bharat-green/50 focus:ring-1 focus:ring-bharat-green/20
                  disabled:opacity-50 transition-all lang-${language}`}
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="self-end bg-bharat-green hover:bg-bharat-darkgreen disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Schemes Panel (desktop only, or mobile when tab=schemes) */}
        <div className={`
          lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-3 overflow-y-auto
          ${activeTab === 'schemes' ? 'flex' : 'hidden lg:flex'}
        `} style={{ scrollbarWidth: 'thin' }}>

          {/* Schemes header */}
          <div className="bg-bharat-card border border-bharat-border rounded-2xl p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <p className="text-white font-bold text-sm">
                    {matchedSchemes.length > 0 ? strings.matched : strings.noMatch}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {matchedSchemes.length > 0 ? `${matchedSchemes.length} ${strings.schemeCount}` : 'Describe yourself to find schemes'}
                  </p>
                </div>
              </div>
              {matchedSchemes.length > 0 && (
                <span className="bg-bharat-green text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {matchedSchemes.length}
                </span>
              )}
            </div>
          </div>

          {/* Matched scheme cards */}
          {matchedSchemes.length > 0 ? (
            matchedSchemes.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} language={language} />
            ))
          ) : (
            /* Empty state */
            <div className="bg-bharat-card border border-bharat-border rounded-2xl p-5">
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Popular Schemes</p>
              <div className="space-y-3">
                {allSchemes.slice(0, 5).map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-bharat-muted/20 transition-colors">
                    <span className="text-xl flex-shrink-0">
                      {s.category === 'agriculture' ? '🌾' : s.category === 'health' ? '🏥' : s.category === 'housing' ? '🏠' : s.category === 'pension' ? '👴' : s.category === 'employment' ? '⚒️' : '✅'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-semibold truncate">{s.name}</p>
                      <p className="text-gray-500 text-xs">{s.benefit.type === 'cash' || s.benefit.type === 'pension' ? `₹${s.benefit.amount?.toLocaleString('en-IN')}` : s.benefit.type}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-bharat-border">
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Info size={12} className="flex-shrink-0 mt-0.5 text-bharat-green" />
                  <span>Speak or type to get AI-matched schemes for YOUR profile</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="fixed bottom-4 right-4 z-50 bg-bharat-green text-white text-xs px-3 py-2 rounded-full flex items-center gap-2 shadow-xl shadow-bharat-green/30">
          <div className="flex items-end gap-0.5 h-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-0.5 bg-white rounded-full" style={{ animation: 'wave 0.8s ease-in-out infinite', animationDelay: `${i * 0.1}s`, height: '100%' }} />
            ))}
          </div>
          Speaking...
        </div>
      )}
    </div>
  );
}
