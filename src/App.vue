<template>
  <div class="tg-app">
    <!-- Initial Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center bg-indigo-600 min-h-screen p-8">
      <div class="w-14 h-14 rounded-[20px] bg-white flex items-center justify-center text-indigo-600 font-black text-xl">RQ</div>
      <p class="mt-4 text-[13px] text-white/80 font-bold uppercase">RankerQ by PP • Loading...</p>
    </div>
    
    <template v-else>
      <!-- Listen to the splash screen and dynamically handle navigation -->
      <SplashScreen v-if="screen==='splash'" @finished="handleSplashFinished" />
      <UserForm v-if="screen==='form'" @complete="handleComplete" />
      
      <div v-if="screen==='main'" class="flex-1 flex flex-col bg-[#F8F9FF] min-h-screen">
        <AppHeader :user="currentUser" />
        <main class="flex-1 overflow-y-auto" style="padding-bottom:90px;">
          <HomeView v-if="tab==='home'" :user="currentUser" @goLeague="tab='league'" @goBookmarks="tab='bookmarks'" @goResources="tab='resources'" @goAIQuiz="tab='ai-quiz'" />
          <div v-if="tab==='resources'"><ResourcesHub /></div>
          <AIQuizzes v-if="tab==='ai-quiz'" />
          <Bookmarks v-if="tab==='bookmarks'" />
          <StreakLeague v-if="tab==='league'" />
          <ProfileSection v-if="tab==='profile'" :user="currentUser" @logout="handleLogout" />
        </main>
        <BottomNav :active="tab" @change="tab=$event" />
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
import ResourcesHub from './components/ResourcesHub.vue'
import AIQuizzes from './components/AIQuizzes.vue'
import Bookmarks from './components/Bookmarks.vue'
import StreakLeague from './components/StreakLeague.vue'
import ProfileSection from './components/ProfileSection.vue'

const store = useUserStore()
const tab = ref('home')
const screen = ref('splash')
const loading = ref(true)

// Added a fallback check to prevent undefined errors 
// depending on whether the store uses Pinia or raw Composition API refs
const currentUser = computed(() => ({ 
  name: store.name?.value || store.name || 'Player One', 
  level: store.level?.value || store.level || 'Foundation' 
}))

async function handleComplete({ name, level, apiKey }){ 
  await store.setUser(name, level, apiKey)
  screen.value = 'main' 
}

async function handleLogout(){ 
  await store.clearUserStorage()
  tab.value = 'home'
  screen.value = 'form' 
}

// Replaces the conflicting timer and correctly handles the @finished event
function handleSplashFinished() {
  const hasName = store.name?.value || store.name
  screen.value = hasName ? 'main' : 'form'
}

onMounted(async () => { 
  try {
    await store.loadUserFromTelegramStorage()
  } catch (error) {
    console.error('Failed to load user data:', error)
  } finally {
    // Ensuring this always runs so the app doesn't freeze on the loading screen
    loading.value = false 
  }
})
</script>