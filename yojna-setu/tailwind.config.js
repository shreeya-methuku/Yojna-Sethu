/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bharat: {
          green: "#7CB342",
          darkgreen: "#558B2F",
          bg: "#0A0E1A",
          card: "#111827",
          border: "#1F2937",
          muted: "#374151",
        },
      },
      animation: {
        pulse2: "pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave 1.2s linear infinite",
        ripple: "ripple 1.5s linear infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "scaleY(0.5)" },
          "50%": { transform: "scaleY(1.5)" },
        },
        ripple: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      fontFamily: {
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
        kannada: ["Noto Sans Kannada", "sans-serif"],
        tamil: ["Noto Sans Tamil", "sans-serif"],
        telugu: ["Noto Sans Telugu", "sans-serif"],
      },
    },
  },
  plugins: [],
};
