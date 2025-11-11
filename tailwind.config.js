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
        // Gradient Purple Theme
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',  // Accent purple
          500: '#a855f7',  // Bright purple
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',  // Deep purple
          900: '#581c87',
          950: '#3b0764',
        },
        // Signal colors
        signal: {
          buy: '#10b981',     // Emerald green
          sell: '#ef4444',    // Rose red
          hold: '#f59e0b',    // Amber yellow
          neutral: '#6b7280', // Gray
        },
        // Dark mode backgrounds
        dark: {
          bg: '#0a0a0f',
          card: '#1a1a2e',
          border: '#2d2d44',
        }
      },
      backgroundImage: {
        // Gradient purple backgrounds
        'gradient-primary': 'linear-gradient(to bottom right, #6b21a8, #a855f7, #c084fc)',
        'gradient-dark': 'linear-gradient(to bottom right, #3b0764, #6b21a8, #7e22ce)',
        'gradient-radial': 'radial-gradient(circle at center, #9333ea, #6b21a8)',
        // Subtle gradients for cards
        'gradient-card': 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(107, 33, 168, 0.05))',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-purple-lg': '0 0 40px rgba(168, 85, 247, 0.5)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(168, 85, 247, 0.3), 0 4px 6px -2px rgba(168, 85, 247, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
