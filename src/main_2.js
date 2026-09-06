import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'

const app = createApp(App)
app.mount('#app')

// Telegram WebApp init + CloudStorage check
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()
  tg.setHeaderColor('#ffffff')
  tg.setBackgroundColor('#F0FDF4')
  
  // Check CloudStorage availability
  if (tg.CloudStorage) {
    console.log('✅ Telegram CloudStorage available')
    // Test storage
    tg.CloudStorage.getKeys((err, keys) => {
      if (!err) console.log('Stored keys:', keys)
    })
  } else {
    console.warn('CloudStorage not available - using localStorage fallback')
  }
  
  // Enable closing confirmation if user has unsaved data
  // tg.enableClosingConfirmation()
} else {
  console.log('Running outside Telegram - using localStorage fallback')
}
