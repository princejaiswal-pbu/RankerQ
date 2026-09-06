<template>
  <div class="tg-app">
    <SplashScreen v-if="store.screen.value === 'splash'" @finished="store.screen.value = 'form'" />
    <UserForm v-if="store.screen.value === 'form'" @complete="handleComplete" />
    <div v-if="store.screen.value === 'main'" class="flex-1 flex flex-col bg-[#F6FFF8] min-h-screen">
      <AppHeader :user="currentUser" />
      <main class="flex-1 overflow-y-auto scrollbar-hide pb-[84px]">
        <HomeView v-if="tab === 'home'" :user="currentUser" />
        <Leaderboard v-if="tab === 'leaderboard'" :current-rank="12" />
        <DoubtsView v-if="tab === 'doubts'" />
        <ProfileSection v-if="tab === 'profile'" :user="currentUser" />
      </main>
      <BottomNav :active="tab" @change="tab = $event" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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

function handleComplete({ name, level }) {
  store.setUser(name, level)
}
</script>
