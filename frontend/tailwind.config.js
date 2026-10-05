/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          50: '#faf6fa',
          100: '#f4eaf4',
          200: '#ebd7eb',
          300: '#dcbfdc',
          400: '#c498c3',
          500: '#a46da2',
          600: '#80497D', // Exact User Color 1 (Purple/Plum)
          700: '#683965',
          800: '#552e53',
          900: '#422240',
          950: '#2a1429',
        },
        coral: {
          50: '#fdf7f5',
          100: '#fbeee9',
          200: '#f6d6cc',
          300: '#eeb7a7',
          400: '#e2917c',
          500: '#C35B3F', // Exact User Color 2 (Terracotta/Rust Coral)
          600: '#b04c31',
          700: '#913e27',
          800: '#773421',
          900: '#622d1d',
          950: '#36160d',
        },
        gold: {
          50: '#fdfbf2',
          100: '#faf4e0',
          200: '#f5e7bf',
          300: '#eed694',
          400: '#e7c268',
          500: '#e7b84b',
          600: '#d49e32',
          700: '#b17b25',
          800: '#906223',
          900: '#765120',
          950: '#432b0e',
        },
        lavender: {
          50: '#faf8fd',
          100: '#f3f0fb',
          200: '#e8e2f7',
          300: '#d6cbf0',
          400: '#b9a7d8',
          500: '#9d87c2',
          600: '#826ba8',
          700: '#6c568d',
          800: '#594774',
          900: '#4a3c60',
          950: '#2d233c',
        },
        ivory: {
          50: '#ffffff',
          100: '#fffdfa',
          200: '#fff9f2',
          300: '#faf3e8',
          400: '#f4ebd9',
          500: '#eae0cb',
          600: '#d9cdb4',
          700: '#b8a98f',
          800: '#968870',
          900: '#7a6d59',
          950: '#423b2e',
        },
        brand: {
          50: '#faf6fa',
          100: '#f4eaf4',
          200: '#ebd7eb',
          300: '#dcbfdc',
          400: '#c498c3',
          500: '#a46da2',
          600: '#80497D', // Exact User Color 1
          700: '#683965',
          800: '#552e53',
          900: '#422240',
          950: '#2a1429',
        },
        pastel: {
          purple: '#c498c3',
          lavender: '#ebd7eb',
          coral: '#eeb7a7',
          gold: '#eed694',
          amber: '#f5e7bf',
          bg: '#fdf7f5',
          pill: '#f4eaf4',
          border: '#ebd7eb'
        },
        slate: {
          850: '#1e1622',
          950: '#110b14'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 14px -4px rgba(128, 73, 125, 0.08)',
        'card-hover': '0 12px 28px -6px rgba(128, 73, 125, 0.14), 0 8px 12px -6px rgba(195, 91, 63, 0.10)',
        'glow-gold': '0 0 20px -3px rgba(231, 184, 75, 0.35)',
        'glow-plum': '0 0 20px -3px rgba(128, 73, 125, 0.35)',
      }
    },
  },
  plugins: [],
}
