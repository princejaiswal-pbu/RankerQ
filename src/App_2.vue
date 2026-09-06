<template>
  <div class="tg-app">
    <!-- Loading state while checking Telegram Storage -->
    <div v-if="!store.isLoaded.value" class="flex-1 flex flex-col items-center justify-center bg-[#F0FDF4] min-h-screen p-8">
      <div class="w-12 h-12 rounded-full border-4 border-ca-100 border-t-ca-600 animate-spin"></div>
      <p class="mt-4 text-[13px] text-gray-500 font-medium">Loading your data...</p>
    </div>

    <template v-else>
      <SplashScreen v-if="store.screen.value === 'splash'" @finished="handleSplashFinish" />
      <UserForm v-if="store.screen.value === 'form'" @complete="handleComplete" />
      <div v-if="store.screen.value === 'main'" class="flex-1 flex flex-col bg-[#F6FFF8] min-h-screen">
        <AppHeader :user="currentUser" />
        <main class="flex-1 overflow-y-auto scrollbar-hide pb-[84px]">
          <HomeView v-if="tab === 'home'" :user="currentUser" />
          <Leaderboard v-if="tab === 'leaderboard'" :current-rank="12" />
          <DoubtsView v-if="tab === 'doubts'" />
          <ProfileSection v-if="tab === 'profile'" :user="currentUser" @logout="handleLogout" />
        </main>
        <BottomNav :active="tab" @change="tab = $event" />
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
import Leaderboard from './components/Leaderboard.vue'
import DoubtsView from './components/DoubtsCard.vue'
import ProfileSection from './components/ProfileSection.vue'

const store = useUserStore()
const tab = ref('home')

const currentUser = computed(() => ({
  name: store.name.value || 'Guest',
  level: store.level.value || 'Foundation',
  id: '8472'
}))

function handleSplashFinish() {
  // If user already exists in Telegram Storage, isLoaded already set screen to 'main'
  // So only go to form if no data
  if (!store.name.value) {
    store.screen.value = 'form'
  }
}

async function handleComplete({ name, level }) {
  await store.setUser(name, level)
  // Haptic feedback in Telegram
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
  }
}

async function handleLogout() {
  if (window.Telegram?.WebApp?.showConfirm) {
    window.Telegram.WebApp.showConfirm('Clear your saved name & level?', async (confirmed) => {
      if (confirmed) {
        await store.clearUserStorage()
      }
    })
  } else {
    await store.clearUserStorage()
  }
}

onMounted(async () => {
  // IMPORTANT: Load from Telegram CloudStorage on app start
  await store.loadUserFromTelegramStorage()
  
  // If no user data, show splash, else it auto goes to main via store
  if (!store.name.value && store.screen.value !== 'splash') {
    store.screen.value = 'splash'
  }
})
</script>
