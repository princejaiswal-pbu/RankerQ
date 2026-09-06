/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{vue,js}"],
  theme: {
    extend: {
      colors: {
        ca: { 50:'#F0FDF4',100:'#DCFCE7',200:'#BBF7D0',600:'#16A34A',700:'#15803D' }
      }
    }
  },
  plugins: []
}
