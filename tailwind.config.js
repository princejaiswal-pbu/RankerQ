/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        ca: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#14532D',
          900: '#052E16'
        }
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(22,163,74,0.12)',
        'green': '0 8px 20px rgba(22,163,74,0.3)'
      }
    }
  },
  plugins: []
}
