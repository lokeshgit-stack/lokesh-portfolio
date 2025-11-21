/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A192F',
          light: '#112240',
          dark: '#020c1b',
        },
        accent: {
          DEFAULT: '#64FFDA',
          hover: '#4DFFCC',
        },
        text: {
          primary: '#CCD6F6',
          secondary: '#8892B0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { textShadow: '0 0 10px #64FFDA, 0 0 20px #64FFDA' },
          to: { textShadow: '0 0 20px #64FFDA, 0 0 30px #64FFDA' },
        },
      },
    },
  },
  plugins: [],
};
