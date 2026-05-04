/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        periwinkle: {
          50: '#e5e8ff',
          100: '#ccd1ff',
          200: '#99a3ff',
          300: '#6675ff',
          400: '#3347ff',
          500: '#0019ff',
          600: '#0014cc',
          700: '#000f99',
          800: '#000a66',
          900: '#000533',
          950: '#000424',
        },
        navy: {
          950: '#01030d', // Deity dark level
          900: '#03071e',
          800: '#0a0f2b',
          700: '#151b40',
          600: '#1e2554',
          500: '#2c3575',
        },
        primary: {
          DEFAULT: '#0019ff',
          foreground: '#ffffff',
          hover: '#0014cc',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        'blob-drift-1': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(40px, -40px)' },
        },
        'blob-drift-2': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-40px, 40px)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        'chip-appear': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'score-popup': {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '15%': { transform: 'translateY(0)', opacity: '1' },
          '80%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '0' },
        },
        'rank-entrance': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.01)' },
        },
        'leaderboard-row': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'dot-pulse': {
          '0%, 80%, 100%': { opacity: '0' },
          '40%': { opacity: '1' },
        },
      },
      animation: {
        'blob-1': 'blob-drift-1 12s ease-in-out infinite',
        'blob-2': 'blob-drift-2 12s ease-in-out infinite',
        'confetti': 'confetti-fall var(--confetti-duration, 4s) linear var(--confetti-delay, 0s) both',
        'chip-appear': 'chip-appear 300ms ease-out',
        'score-popup': 'score-popup 2.5s ease-out',
        'rank-entrance': 'rank-entrance 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'leaderboard-row': 'leaderboard-row 400ms ease-out',
        'dot-pulse': 'dot-pulse 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
