/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'football-green': '#228B22',
        'football-gold': '#FFD700',
        'pitch-dark': '#1a472a',
        'pitch-light': '#32CD32',
      }
    },
  },
  plugins: [],
}