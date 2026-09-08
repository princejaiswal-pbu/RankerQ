<template>
  <div class="tg-app">
    <div v-if="loading" class="flex flex-col items-center justify-center bg-[#6C5CE7] min-h-screen p-8">
      <div class="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-[#6C5CE7] font-black text-2xl">RQ</div>
      <p class="mt-5 jakarta font-black text-white text-[15px]">RankerQ by PP</p>
      <p class="mt-2 text-[11px] text-white/70 font-bold uppercase">Game CA Prep</p>
    </div>
    <template v-else>
      <SplashScreen v-if="screen==='splash'" @finished="screen='main'" />
      <UserForm v-if="screen==='form'" @complete="handleComplete" />
      <div v-if="screen==='main'" class="flex-1 flex flex-col bg-[#F8F9FF] min-h-screen">
        <AppHeader :user="currentUser" />
        <main class="flex-1 overflow-y-auto" style="padding-bottom:90px;">
          <HomeView v-if="tab==='home'" :user="currentUser" @goLeague="tab='league'" @goBookmarks="tab='bookmarks'" @goResources="tab='resources'" @goAIQuiz="tab='ai-quiz'" @goPYQ="tab='pyq'" />
          <ResourcesHub v-if="tab==='resources'" />
          <PYQBank v-if="tab==='pyq'" />
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
import PYQBank from './components/PYQBank.vue'
import AIQuizzes from './components/AIQuizzes.vue'
import Bookmarks from './components/Bookmarks.vue'
import StreakLeague from './components/StreakLeague.vue'
import ProfileSection from './components/ProfileSection.vue'
const store=useUserStore()
const tab=ref('home')
const screen=ref('splash')
const loading=ref(true)
const currentUser=computed(()=>({ name:store.name.value||'Player One', level:store.level.value||'Foundation' }))
async function handleComplete({ name, level, apiKey }){ await store.setUser(name,level,apiKey); screen.value='main' }
async function handleLogout(){ await store.clearUserStorage(); tab.value='home'; screen.value='form' }
onMounted(async()=>{
  // DREAM APP FIX: Only 2 lines added - force never stuck, rest is your original dream app design
  setTimeout(()=>{ loading.value=false }, 800)
  setTimeout(()=>{ if(screen.value==='splash') screen.value='main' }, 2600)
  try{ await store.loadUserFromTelegramStorage() }catch(e){}
  loading.value=false
})
</script>
