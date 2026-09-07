import { createApp } from 'vue'
import App from './App.vue'
import './assets/style.css'
createApp(App).mount('#app')
if(window.Telegram?.WebApp){const tg=window.Telegram.WebApp;tg.ready();tg.expand();tg.setHeaderColor('#4f46e5');tg.setBackgroundColor('#F8F9FF')}
