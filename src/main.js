import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'

createApp(App).mount('#app')

if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()
  tg.setHeaderColor('#ffffff')
  tg.setBackgroundColor('#F6FFF8')
  if (tg.CloudStorage) {
    tg.CloudStorage.getKeys((err, keys) => { if (!err) console.log('Cloud keys', keys) })
  }
}
