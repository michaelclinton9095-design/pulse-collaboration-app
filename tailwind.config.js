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
        chat: {
          bg: '#0f172a',
          sidebar: '#1e293b',
          bubble: '#0284c7',
          received: '#334155',
        }
      }
    },
  },
  plugins: [],
}
