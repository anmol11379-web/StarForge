/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#030712',
        foreground: '#f8fafc',
        card: {
          DEFAULT: '#080f1d',
          foreground: '#f8fafc',
        },
        popover: {
          DEFAULT: '#080f1d',
          foreground: '#f8fafc',
        },
        primary: {
          DEFAULT: '#0ea5e9',
          foreground: '#030712',
        },
        secondary: {
          DEFAULT: '#0f172a',
          foreground: '#f8fafc',
        },
        muted: {
          DEFAULT: '#0f172a',
          foreground: '#94a3b8',
        },
        accent: {
          DEFAULT: '#14b8a6',
          foreground: '#030712',
        },
        signal: {
          DEFAULT: '#38bdf8',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#f8fafc',
        },
        border: '#1e293b',
        input: '#1e293b',
        ring: '#0ea5e9',
        chart: {
          1: '#38bdf8',
          2: '#818cf8',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '9999px',
      }
    },
  },
  plugins: [],
}
