import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'

const app = createApp(App)
app.mount('#app')

if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()
  tg.setHeaderColor('#ffffff')
  tg.setBackgroundColor('#F0FDF4')
  
  if (tg.CloudStorage) {
    console.log('✅ Telegram CloudStorage available')
    tg.CloudStorage.getKeys((err, keys) => {
      if (!err) console.log('Stored keys:', keys)
    })
  }
} else {
  console.log('Running outside Telegram - using localStorage')
}
