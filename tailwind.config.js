/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b0d17',
        surface: '#16182c',
        primary: '#ff1801',
        accent: '#ffd700',
      },
    },
  },
  plugins: [],
}

