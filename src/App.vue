<template>
  <div class="tg-app">
    <div v-if="!store.isLoaded.value" class="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 min-h-screen p-8">
      <div class="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center text-indigo-600 font-black text-xl shadow-xl animate-pulse">RQ</div>
      <p class="mt-4 text-[13px] text-white/80 font-bold tracking-widest uppercase">RankerQ by PP • Loading Game...</p>
      <div class="mt-4 w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
    <template v-else>
      <SplashScreen v-if="store.screen.value==='splash'" @finished="handleSplashFinish" />
      <UserForm v-if="store.screen.value==='form'" @complete="handleComplete" />
      <div v-if="store.screen.value==='main'" class="flex-1 flex flex-col bg-[#F8F9FF] min-h-screen relative">
        <AppHeader :user="currentUser" />
        <main class="flex-1 overflow-y-auto scrollbar-hide" style="padding-bottom:90px;">
          <HomeView v-if="tab==='home'" :user="currentUser" @goLeague="tab='league'" @goBookmarks="tab='bookmarks'" @goAIQuiz="tab='ai-quiz'" />
          <PYQBank v-if="tab==='resources'" />
          <AIQuizzes v-if="tab==='ai-quiz'" />
          <Bookmarks v-if="tab==='bookmarks'" />
          <StreakLeague v-if="tab==='league'" />
          <ProfileSection v-if="tab==='profile'" :user="currentUser" @logout="handleLogout" />
        </main>
        <BottomNav :active="tab" @change="handleTabChange" />
      </div>
    </template>
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
onMounted(async()=>{ await store.loadUserFromTelegramStorage() })
</script>
