<template>
  <div class="tg-app">
    <div v-if="!store.isLoaded.value" class="flex-1 flex flex-col items-center justify-center bg-[#F0FDF4] min-h-screen p-8">
      <div class="w-12 h-12 rounded-full border-4 border-ca-100 border-t-ca-600 animate-spin"></div>
      <p class="mt-4 text-[13px] text-gray-500 font-medium">Loading your data from Telegram...</p>
    </div>
    <template v-else>
      <SplashScreen v-if="store.screen.value==='splash'" @finished="handleSplashFinish" />
      <UserForm v-if="store.screen.value==='form'" @complete="handleComplete" />
      <div v-if="store.screen.value==='main'" class="flex-1 flex flex-col bg-[#F6FFF8] min-h-screen relative">
        <AppHeader :user="currentUser" />
        <main class="flex-1 overflow-y-auto scrollbar-hide" style="padding-bottom:88px;">
          <HomeView v-if="tab==='home'" :user="currentUser" @goLeague="tab='league'" @goMistakes="tab='bookmarks'" @goAIQuiz="tab='ai-quiz'" />
          <PYQBank v-if="tab==='resources'" />
          <AIQuizzes v-if="tab==='ai-quiz'" />
          <MistakeBook v-if="tab==='bookmarks'" />
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
import MistakeBook from './components/MistakeBook.vue'
import StreakLeague from './components/StreakLeague.vue'
import ProfileSection from './components/ProfileSection.vue'

const store=useUserStore()
const tab=ref('home')
const currentUser=computed(()=>({ name:store.name.value||'Ananya Sharma', level:store.level.value||'Foundation', id:'8472' }))
function handleTabChange(t){ tab.value=t; if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.selectionChanged() }
function handleSplashFinish(){ if(store.name.value) store.screen.value='main'; else store.screen.value='form' }
async function handleComplete({ name, level, geminiKey }){ await store.setUser(name,level,geminiKey) }
async function handleLogout(){
  const doClear=async()=>{ await store.clearUserStorage(); tab.value='home' }
  if(window.Telegram?.WebApp?.showConfirm){ window.Telegram.WebApp.showConfirm('Clear saved data?', async(c)=>{ if(c) await doClear() }) } else { if(confirm('Clear saved data?')) await doClear() }
}
onMounted(async()=>{ await store.loadUserFromTelegramStorage() })
</script>
