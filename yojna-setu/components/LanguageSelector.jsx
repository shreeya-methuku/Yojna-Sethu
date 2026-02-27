'use client';

const LANGUAGES = [
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🏔️' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🌴' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '⭐' },
  { code: 'en', name: 'English', native: 'English', flag: '🔤' },
];

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            transition-all duration-200 border
            ${selected === lang.code
              ? 'bg-bharat-green text-white border-bharat-green shadow-lg shadow-bharat-green/30'
              : 'bg-bharat-card text-gray-300 border-bharat-border hover:border-bharat-green/50 hover:text-white'
            }
          `}
        >
          <span className="text-base">{lang.flag}</span>
          <span>{lang.native}</span>
        </button>
      ))}
    </div>
  );
}

export { LANGUAGES };
