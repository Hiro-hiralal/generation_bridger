import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dadi: {
          bg: '#fdf4ff',
          primary: '#7c3aed',
          'primary-dark': '#5b21b6',
          accent: '#f59e0b',
          correct: '#16a34a',
          incorrect: '#dc2626',
          text: '#1a1a1a',
          muted: '#6b7280',
          border: '#e9d5ff',
        },
        child: {
          bg: '#fff7ed',
          primary: '#ea580c',
          'primary-dark': '#c2410c',
          accent: '#16a34a',
          star: '#fbbf24',
          text: '#1a1a1a',
          muted: '#6b7280',
          border: '#fed7aa',
        },
      },
      fontFamily: {
        dadi: ['"Noto Serif"', 'Georgia', 'serif'],
        child: ['"Nunito"', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      fontSize: {
        'dadi-sm': ['1.1rem', { lineHeight: '1.75rem' }],
        'dadi-base': ['1.25rem', { lineHeight: '2rem' }],
        'dadi-lg': ['1.5rem', { lineHeight: '2.25rem' }],
        'dadi-xl': ['2rem', { lineHeight: '2.75rem' }],
        'dadi-2xl': ['2.5rem', { lineHeight: '3.25rem' }],
      },
      animation: {
        'star-pop': 'starPop 0.4s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        wiggle: 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        starPop: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '70%': { transform: 'scale(1.3) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
