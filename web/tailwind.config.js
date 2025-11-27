import { theme } from 'tailwindcss/defaultConfig'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xl': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        'lg': ['18px', { lineHeight: '24px', fontWeight: '700' }],
        'md': ['14px', { lineHeight: '18px', fontWeight: '400' }],
        'sm': ['12px', { lineHeight: '16px', fontWeight: '100' }],
        'xs': ['10px', { lineHeight: '14px', fontWeight: '100', transform: 'uppercase' }]
      },
      colors: {
        blue: {
          'base': '#2C46B1',
          'dark': '#2C4091',
        },
        gray: {
          100: '#F9F9FB',
          200: '#E4E6EC',
          300: '#CDCFD5',
          400: '#74798B',
          500: '#4D505C',
          600: '#1F2025',
        },
        feedback: {
          'danger': '#B12C4D',
        }
      },
      fontFamily: {
        sans: ['"Open Sans"', ...theme.fontFamily.sans]
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

