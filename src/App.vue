<template>
  <div class="tg-app">
    <SplashScreen v-if="store.screen.value==='splash'" @finished="handleSplashFinish" />
      <UserForm v-if="store.screen.value==='form'" @complete="handleComplete" />
      <div v-if="store.screen.value==='main'" class="flex-1 flex flex-col bg-[#F8F9FF] min-h-screen relative">
        <AppHeader :user="currentUser" />
        <main class="flex-1 overflow-y-auto scrollbar-hide" style="padding-bottom:90px;">
          <HomeView v-if="tab==='home'" :user="currentUser" @goLeague="tab='league'" @goBookmarks="tab='bookmarks'" @goAIQuiz="tab='ai-quiz'" @goResources="tab='resources'" />
          <PYQBank v-if="tab==='resources'" />
          <AIQuizzes v-if="tab==='ai-quiz'" />
          <Bookmarks v-if="tab==='bookmarks'" />
          <StreakLeague v-if="tab==='league'" />
          <ProfileSection v-if="tab==='profile'" :user="currentUser" @logout="handleLogout" />
        </main>
        <BottomNav :active="tab" @change="handleTabChange" />
      </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from './stores/useUserStore.js'
import SplashScreen from './components/SplashScreen.vue'
import UserForm from './components/UserForm.vue'
import AppHeader from './components/AppHeader.vue'
import BottomNav from './components/BottomNav.vue'
import HomeView from './views/HomeView.vue'
import PYQBank from './components/PYQBank.vue'
import AIQuizzes from './components/AIQuizzes.vue'
import Bookmarks from './components/Bookmarks.vue'
import StreakLeague from './components/StreakLeague.vue'
import ProfileSection from './components/ProfileSection.vue'

const store=useUserStore()
const tab=ref('home')
const currentUser=computed(()=>({ name:store.name.value||'Player One', level:store.level.value||'Foundation', id:'8472' }))
function handleTabChange(t){ tab.value=t; if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.selectionChanged() }
function handleSplashFinish(){ if(store.name.value) store.screen.value='main'; else store.screen.value='form' }
async function handleComplete({ name, level, apiKey }){ await store.setUser(name,level,apiKey) }
async function handleLogout(){
  const doClear=async()=>{ await store.clearUserStorage(); tab.value='home' }
  if(window.Telegram?.WebApp?.showConfirm){ window.Telegram.WebApp.showConfirm('Reset game? All XP, levels, bookmarks lost!', async(c)=>{ if(c) await doClear() }) } else { if(confirm('Reset game?')) await doClear() }
}
onMounted(()=>{
  // Never block the UI on Telegram CloudStorage. Local data is loaded immediately,
  // while CloudStorage is allowed to hydrate in the background.
  store.loadUserFromTelegramStorage({ timeoutMs: 1800 })
})
</script>
