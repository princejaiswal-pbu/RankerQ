import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'

const app = createApp(App)
app.mount('#app')

// Telegram WebApp init
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()
  tg.setHeaderColor('#ffffff')
  tg.setBackgroundColor('#F0FDF4')
}
