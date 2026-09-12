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
        space: {
          950: '#07090E',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#141E33',
          700: '#1E2D4A',
          600: '#2A3F66',
        },
        alert: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#F59E0B',
          low: '#10B981',
          uncertain: '#6B7280'
        },
        cyanGlow: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          dim: 'rgba(6, 182, 212, 0.15)'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
