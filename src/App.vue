<template>
  <div class="tg-app">
    <SplashScreen v-if="store.screen.value === 'splash'" @finished="handleSplashFinish" />
    <UserForm v-if="store.screen.value === 'form'" @complete="handleComplete" />
    <div v-if="store.screen.value === 'main'" class="flex-1 flex flex-col bg-[#F6FFF8] min-h-screen relative">
      <AppHeader :user="currentUser" />
      <main class="flex-1 overflow-y-auto scrollbar-hide" style="padding-bottom: 88px;">
        <HomeView v-if="tab === 'home'" :user="currentUser" @goLeaderboard="tab='leaderboard'" @goDoubts="tab='doubts'" />
        <Leaderboard v-if="tab === 'leaderboard'" :current-rank="store.currentRank.value" />
        <DoubtsView v-if="tab === 'doubts'" />
        <ProfileSection v-if="tab === 'profile'" :user="currentUser" @logout="handleLogout" />
      </main>
      <BottomNav :active="tab" @change="tab = $event" />
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
import Leaderboard from './components/Leaderboard.vue'
import DoubtsView from './components/DoubtsCard.vue'
import ProfileSection from './components/ProfileSection.vue'

const store = useUserStore()
const tab = ref('home')

const currentUser = computed(() => ({
  name: store.name.value || 'Ananya Sharma',
  level: store.level.value || 'Foundation',
  id: '8472'
}))

function handleSplashFinish() {
  if (store.name.value) {
    store.screen.value = 'main'
  } else {
    store.screen.value = 'form'
  }
}

async function handleComplete({ name, level }) {
  await store.setUser(name, level)
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
  }
}

async function handleLogout() {
  const doClear = async () => {
    await store.clearUserStorage()
    tab.value = 'home'
  }

  if (window.Telegram?.WebApp?.showConfirm) {
    window.Telegram.WebApp.showConfirm('Clear your saved name & level?', async (confirmed) => {
      if (confirmed) await doClear()
    })
  } else {
    if (confirm('Clear your saved data?')) await doClear()
  }
}

onMounted(async () => {
  await store.loadUserFromTelegramStorage()
  // If no user after load, stay on splash -> form flow handled by store
})
</script>

<style>
/* Ensure fixed navbar doesn't overlap */
.tg-app {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
