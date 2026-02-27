'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mic, Globe, Zap, Shield, ChevronDown } from 'lucide-react';

const LANGUAGE_CYCLE = [
  { text: 'योजना-सेतु', lang: 'Hindi', sub: 'आपकी आवाज़, आपके अधिकार' },
  { text: 'ಯೋಜನ-ಸೇತು', lang: 'Kannada', sub: 'ನಿಮ್ಮ ಧ್ವನಿ, ನಿಮ್ಮ ಹಕ್ಕುಗಳು' },
  { text: 'யோஜனா-சேது', lang: 'Tamil', sub: 'உங்கள் குரல், உங்கள் உரிமைகள்' },
  { text: 'యోజన-సేతు', lang: 'Telugu', sub: 'మీ స్వరం, మీ హక్కులు' },
  { text: 'Yojna-Setu', lang: 'English', sub: 'Your Voice, Your Rights' },
];

const STATS = [
  { value: '₹1L Cr+', label: 'Unclaimed welfare annually', color: 'text-red-400' },
  { value: '350M', label: 'Rural Indians underserved', color: 'text-amber-400' },
  { value: '1500+', label: 'Govt schemes available', color: 'text-bharat-green' },
  { value: '5', label: 'Indian languages supported', color: 'text-blue-400' },
];

const FEATURES = [
  {
    icon: '🎤',
    title: 'Voice First',
    desc: 'Speak naturally in your dialect — no typing, no forms, no literacy barrier',
  },
  {
    icon: '🧠',
    title: 'AI Matching',
    desc: 'Claude AI understands your full situation and finds every scheme you qualify for',
  },
  {
    icon: '🌐',
    title: 'True Multilingual',
    desc: 'Hindi, Kannada, Tamil, Telugu, English — native language understanding, not just translation',
  },
  {
    icon: '🔊',
    title: 'Audio Responses',
    desc: 'Hears your situation in your language, replies in your language',
  },
  {
    icon: '📋',
    title: 'End-to-End Guidance',
    desc: 'Not just discovery — exact documents needed, how to apply, where to go',
  },
  {
    icon: '⚡',
    title: 'Instant & Free',
    desc: '24/7 available, no agents, no queues, no fees — your rights, directly',
  },
];

const STEPS = [
  { icon: '🎤', label: 'Speak', desc: 'Tell your situation in your language' },
  { icon: '👂', label: 'AI Listens', desc: 'Understands context, extracts profile' },
  { icon: '🎯', label: 'Matches', desc: 'Finds all schemes you qualify for' },
  { icon: '🔊', label: 'Responds', desc: 'Explains in your language with audio' },
  { icon: '✅', label: 'Apply', desc: 'Get exact steps to unlock benefits' },
];

const SAMPLE_QUERIES = [
  { lang: '🇮🇳 Hindi', text: '"मैं राजस्थान से हूँ, किसान हूँ, BPL कार्ड है"', result: 'PM-KISAN ₹6,000 + 3 more schemes' },
  { lang: '🏔️ Kannada', text: '"ನಾನು ವಿಧವೆ, ವಯಸ್ಸು 55, BPL"', result: 'Widow Pension + Ayushman Bharat' },
  { lang: '🌴 Tamil', text: '"நான் கர்ப்பிணி, BPL குடும்பம்"', result: 'PMMVY ₹5,000 + 2 more' },
  { lang: '⭐ Telugu', text: '"నేను వీధి వ్యాపారి"', result: 'PM SVANidhi ₹50,000 loan' },
];

export default function LandingPage() {
  const router = useRouter();
  const [langIdx, setLangIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Cycle through languages
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setLangIdx(i => (i + 1) % LANGUAGE_CYCLE.length);
        setVisible(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const current = LANGUAGE_CYCLE[langIdx];

  return (
    <div className="min-h-screen bg-bharat-bg text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-bharat-bg/95 backdrop-blur-xl border-b border-bharat-border shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏛️</span>
            <span className="font-bold text-white text-lg">Yojna-Setu</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-gray-400">AI for Bharat Hackathon 2026</span>
            <button
              onClick={() => router.push('/chat')}
              className="flex items-center gap-2 bg-bharat-green hover:bg-bharat-darkgreen text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-bharat-green/30"
            >
              Open App <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bharat-green/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-bharat-green/4 rounded-full blur-3xl" />
        </div>

        {/* Badge */}
        <div className="relative z-10 mb-6 flex items-center gap-2 bg-bharat-green/10 border border-bharat-green/25 rounded-full px-4 py-1.5">
          <span className="w-2 h-2 rounded-full bg-bharat-green animate-pulse" />
          <span className="text-bharat-green text-xs font-medium">AI for Bharat Hackathon 2026 · PS03</span>
        </div>

        {/* Animated title */}
        <div className="relative z-10 text-center mb-6" style={{ minHeight: '160px' }}>
          <div className={`transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight mb-2" style={{
              background: 'linear-gradient(135deg, #7CB342 0%, #A5D6A7 40%, #ffffff 70%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {current.text}
            </h1>
            <p className="text-gray-300 text-xl sm:text-2xl font-light">{current.sub}</p>
            <p className="text-bharat-green/60 text-sm mt-1 font-medium">{current.lang}</p>
          </div>
        </div>

        {/* Subtitle */}
        <p className="relative z-10 text-center text-gray-400 text-lg max-w-2xl leading-relaxed mb-10">
          Voice-first AI assistant that helps <span className="text-white font-semibold">350 million rural Indians</span> discover government welfare schemes — in their native language, instantly, for free.
        </p>

        {/* CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-3 mb-16">
          <button
            onClick={() => router.push('/chat')}
            className="group flex items-center gap-3 bg-bharat-green hover:bg-bharat-darkgreen text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-2xl hover:shadow-bharat-green/40 hover:scale-105"
          >
            <Mic size={20} />
            Start Speaking
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 border border-bharat-border text-gray-300 hover:text-white hover:border-gray-500 font-medium px-8 py-4 rounded-2xl text-lg transition-all"
          >
            How it works
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Stats row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-3xl">
          {STATS.map((s, i) => (
            <div key={i} className="bg-bharat-card/80 border border-bharat-border rounded-2xl p-4 text-center backdrop-blur-sm">
              <p className={`text-2xl sm:text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-xs mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={20} className="text-gray-600" />
        </div>
      </section>

      {/* ── The Problem ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-bharat-green text-sm font-semibold uppercase tracking-widest">The Problem</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">India's Welfare Paradox</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: '🏛️', num: '₹2.7L Cr', desc: 'Government allocates annually for welfare schemes', color: 'border-bharat-green/30 bg-bharat-green/5' },
              { icon: '📉', num: '40–60%', desc: 'Actually reaches beneficiaries. Rest is unclaimed.', color: 'border-red-500/30 bg-red-500/5' },
              { icon: '❓', num: 'Why?', desc: "Language barriers, digital illiteracy, no awareness — people don't know they qualify", color: 'border-amber-500/30 bg-amber-500/5' },
            ].map((item, i) => (
              <div key={i} className={`border rounded-2xl p-6 text-center ${item.color}`}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <p className="text-white text-3xl font-black mb-2">{item.num}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-6 bg-bharat-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-bharat-green text-sm font-semibold uppercase tracking-widest">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">5 Steps to Unlock Your Benefits</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-bharat-green/30 to-transparent" />
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10 flex-1">
                <div className="w-20 h-20 rounded-2xl bg-bharat-card border border-bharat-border flex items-center justify-center text-3xl mb-3 hover:border-bharat-green/50 transition-colors shadow-xl">
                  {step.icon}
                </div>
                <div className="text-bharat-green text-xs font-bold uppercase tracking-wider mb-1">{step.label}</div>
                <p className="text-gray-400 text-xs leading-relaxed max-w-[100px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sample Conversations ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-bharat-green text-sm font-semibold uppercase tracking-widest">See It In Action</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Real Conversations, Real Benefits</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE_QUERIES.map((q, i) => (
              <div key={i} className="bg-bharat-card border border-bharat-border rounded-2xl p-5 hover:border-bharat-green/30 transition-all group">
                <div className="text-xs text-bharat-green font-semibold mb-3">{q.lang}</div>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-lg">👤</span>
                  <p className="text-gray-200 text-sm italic leading-relaxed">{q.text}</p>
                </div>
                <div className="flex items-start gap-3 pl-1">
                  <span className="text-lg">🤖</span>
                  <p className="text-bharat-green text-sm font-medium">→ {q.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 px-6 bg-bharat-card/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-bharat-green text-sm font-semibold uppercase tracking-widest">Features</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Built Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-bharat-card border border-bharat-border rounded-2xl p-5 hover:border-bharat-green/30 hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Languages ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-bharat-green text-sm font-semibold uppercase tracking-widest">Languages</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-12">Bharat Speaks Many Tongues</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { flag: '🇮🇳', lang: 'Hindi', native: 'हिंदी', speakers: '600M speakers' },
              { flag: '🏔️', lang: 'Kannada', native: 'ಕನ್ನಡ', speakers: '45M speakers' },
              { flag: '🌴', lang: 'Tamil', native: 'தமிழ்', speakers: '75M speakers' },
              { flag: '⭐', lang: 'Telugu', native: 'తెలుగు', speakers: '85M speakers' },
              { flag: '🔤', lang: 'English', native: 'English', speakers: 'Fallback' },
            ].map((l, i) => (
              <div key={i} className="bg-bharat-card border border-bharat-border rounded-2xl px-5 py-4 text-center hover:border-bharat-green/40 transition-all">
                <div className="text-3xl mb-2">{l.flag}</div>
                <div className="text-white font-bold text-lg">{l.native}</div>
                <div className="text-gray-500 text-xs">{l.speakers}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bharat-green/5 to-transparent" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Your rights are waiting.
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Speak in your language. Get what you deserve.
          </p>
          <button
            onClick={() => router.push('/chat')}
            className="group inline-flex items-center gap-3 bg-bharat-green hover:bg-bharat-darkgreen text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all hover:shadow-2xl hover:shadow-bharat-green/40 hover:scale-105"
          >
            <Mic size={24} />
            Start Now — It's Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-gray-600 text-sm mt-4">No sign-up · No fees · Works in 5 languages</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-bharat-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <span className="text-gray-400 text-sm">Yojna-Setu · Team NON-NEGOTIATORS</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>AI for Bharat Hackathon 2026</span>
            <span>·</span>
            <span>Powered by Claude AI + AWS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
