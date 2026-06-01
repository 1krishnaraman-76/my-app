/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable toggling dark mode via className
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2545',       // Deep Government Blue
          blue: '#134074',       // Primary Blue
          light: '#8da9c4',      // Soft Slate Blue
          softBg: '#f4f6f9',     // Premium Light Grey Canvas
          ashokaGold: '#d4af37', // Official Emblem Gold Accent
          orange: '#ff671f',     // Saffron / Orange
          green: '#046a38',      // Forest Green
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
