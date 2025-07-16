/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sage Green - Ana yeşil tonları
        sage: {
          50: '#f6f7f6',
          100: '#e1e8e1',
          200: '#c3d1c3',
          300: '#9bb49b',
          400: '#7a9a7a',
          500: '#5d7f5d',
          600: '#4a6b4a',
          700: '#3d563d',
          800: '#344634',
          900: '#2d3b2d',
        },
        // Ocean Blue - Deniz mavisi tonları
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Warmth Orange - Sıcak turuncu tonlar
        warmth: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Cream - Krem tonları
        cream: {
          50: '#fefdf9',
          100: '#fef9f1',
          200: '#fdf2e1',
          300: '#fbe8c8',
          400: '#f7d9aa',
          500: '#f2c48b',
          600: '#e8a567',
          700: '#d3834a',
          800: '#b06d3e',
          900: '#8f5a35',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};