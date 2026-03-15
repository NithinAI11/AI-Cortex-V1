// ===== File: frontend/tailwind.config.js =====
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // THIS IS CRITICAL FOR THE THEME TOGGLE
  content:[
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins:[],
}