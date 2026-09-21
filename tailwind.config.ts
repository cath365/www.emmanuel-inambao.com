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
        // Diplomatic blue: restrained, institutional, internationally legible
        primary: {
          50: '#f3f6f9',
          100: '#e3ebf2',
          200: '#c7d6e3',
          300: '#a3bbcf',
          400: '#7f9fb8',
          500: '#607f9b',
          600: '#496983',
          700: '#3b566d',
          800: '#31475a',
          900: '#2b3d4c',
        },
        // Muted ceremonial gold
        accent: {
          50: '#fbf8f1',
          100: '#f4ecd9',
          200: '#e8d9b5',
          300: '#dbc28c',
          400: '#c9aa6d',
          500: '#b58f4f',
          600: '#98743f',
          700: '#795a35',
          800: '#62492f',
          900: '#523d2b',
        },
        // Deep navy surfaces
        dark: {
          50: '#f7f8fa',
          100: '#eef1f5',
          200: '#d9e0e8',
          300: '#bdc8d4',
          400: '#96a5b5',
          500: '#6f8092',
          600: '#4b5f75',
          700: '#2e435c',
          800: '#17283f',
          900: '#0d1a2b',
          950: '#07111f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
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
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.25)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
