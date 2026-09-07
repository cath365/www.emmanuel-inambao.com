import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#000B26',
          sky: '#7CA7EB',
          camel: '#CFB18F',
          chocolate: '#402924',
          cream: '#F7F3EC',
        },
        // Retained for compatibility with existing routes/components.
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#7CA7EB',
          500: '#6A96DB',
          600: '#4E79BD',
          700: '#365D9B',
          800: '#234478',
          900: '#142E55',
        },
        accent: {
          50: '#fbf8f3',
          100: '#f3eadf',
          200: '#e7d8c6',
          300: '#d9c4a7',
          400: '#CFB18F',
          500: '#b79a73',
          600: '#9a7e5f',
          700: '#7a624b',
          800: '#5f493a',
          900: '#402924',
        },
        dark: {
          50: '#F7F3EC',
          100: '#ede8df',
          200: '#d8d1c6',
          300: '#b6aa9e',
          400: '#8a7a71',
          500: '#66554f',
          600: '#4f3b36',
          700: '#402924',
          800: '#1c1b26',
          900: '#0a132c',
          950: '#000B26',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        editorial: '0 24px 70px rgba(0, 11, 38, 0.10)',
        'editorial-sm': '0 12px 32px rgba(0, 11, 38, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
