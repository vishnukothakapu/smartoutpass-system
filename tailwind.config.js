/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scanLine: {
          '0%,100%': { top: '0%' },
          '50%':     { top: 'calc(100% - 3px)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        pulseBeat: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.4' },
        },
      },
      animation: {
        'fade-slide-up':  'fadeSlideUp 0.3s ease-out both',
        'scan-line':      'scanLine 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.25s cubic-bezier(0.32,0.72,0,1)',
        'fade-in':        'fadeIn 0.2s ease',
        'pulse-beat':     'pulseBeat 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
