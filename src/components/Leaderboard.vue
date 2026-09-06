<template>
  <div class="p-5 pb-10">
    <div class="flex justify-between items-center">
      <div><h2 class="jakarta text-[18px] font-bold">Streak League</h2><p class="text-[10px] text-gray-500 mt-0.5">30 CA students · resets every Monday</p></div>
      <div class="flex bg-ca-50 rounded-full p-1 border border-[#E5F7E9]">
        <button @click="period = 'weekly'" :class="period === 'weekly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'"
          class="px-3 py-1 rounded-full text-[12px] font-semibold transition">Weekly</button>
        <button @click="period = 'monthly'" :class="period === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'"
          class="px-3 py-1 rounded-full text-[12px] font-semibold transition">Monthly</button>
      </div>
    </div>

    <div class="mt-4 p-3 rounded-xl bg-ca-50 border border-ca-100 flex justify-between items-center">
      <div>
        <p class="text-[12px] font-bold text-ca-800">Your Progress</p>
        <p class="text-[11px] text-ca-600 mt-0.5">{{ xp }} XP • {{ quizzesDone }} quizzes • {{ streak }} day streak</p>
      </div>
      <span class="text-[12px] font-bold px-2.5 py-1 rounded-full bg-ca-600 text-white">#{{ userRank }}</span>
    </div>

    <div class="mt-3 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
      <span class="text-xl">🏅</span><p class="text-[11px] leading-4 text-amber-900"><strong>Top 3 win the CA Series Champion badge.</strong><br>Keep your streak alive to climb this week.</p>
    </div>

    <!-- Podium - dynamic based on period -->
    <div class="mt-6 flex items-end justify-center gap-3">
      <div v-for="u in top3" :key="u.rank" :class="u.rank === 1 ? 'order-2 -mt-4' : u.rank === 2 ? 'order-1' : 'order-3'" class="flex flex-col items-center">
        <div class="relative">
          <div :class="u.rank === 1 ? 'w-[64px] h-[64px] border-amber-300' : 'w-[52px] h-[52px] border-white'" class="rounded-full border-[3px] shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center text-lg">{{ u.avatar }}</div>
          <div v-if="u.rank === 1" class="absolute -top-3 left-1/2 -translate-x-1/2 text-[16px]">👑</div>
          <div :class="u.rank === 1 ? 'bg-amber-400' : u.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'"
            class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold">{{ u.rank }}</div>
        </div>
        <p class="mt-3 text-[12px] font-bold text-gray-900">{{ u.name }}</p>
        <p class="text-[11px] text-ca-700 font-semibold">{{ u.xp }} XP</p>
      </div>
    </div>

    <!-- List - includes current user in correct position -->
    <div class="mt-6 ca-card overflow-hidden">
      <div v-for="u in sortedList" :key="u.rank" class="flex items-center justify-between px-4 py-3 border-b last:border-0 border-ca-50 hover:bg-[#F9FFFB] transition" :class="{'bg-ca-600 text-white !border-ca-700': u.isYou}">
        <div class="flex items-center gap-3">
          <span class="w-6 text-[12px] font-bold" :class="u.isYou ? 'text-white/80' : 'text-gray-400'">#{{ u.rank }}</span>
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm" :class="u.isYou ? 'bg-white/20' : 'bg-ca-50'">{{ u.avatar }}</div>
          <p class="text-[13px] font-medium" :class="u.isYou ? 'text-white' : 'text-gray-900'">{{ u.name }}</p>
          <span v-if="u.isYou" class="text-[9px] bg-white text-ca-700 px-1.5 py-0.5 rounded-full font-bold uppercase">You</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[12px] font-semibold" :class="u.isYou ? 'text-white' : 'text-gray-700'">{{ u.xp }} XP</span>
          <span v-if="!u.isYou" :class="u.trend === 'up' ? 'text-green-600' : 'text-red-500'" class="text-[11px]">{{ u.trend === 'up' ? '↑' : '↓' }}</span>
        </div>
      </div>
    </div>

    <!-- Current User Sticky - always visible -->
    <div class="mt-4 p-3 rounded-2xl bg-ca-600 text-white flex items-center justify-between shadow-green sticky bottom-[80px]">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">{{ userInitial }}</div>
        <div>
          <p class="text-[13px] font-bold">You - #{{ userRank }}</p>
          <p class="text-[11px] opacity-80">{{ xp }} XP • {{ quizzesDone }} quizzes • Top {{ rankPercent }}%</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-[11px] bg-white text-ca-700 px-2.5 py-1 rounded-full font-bold">You</p>
        <p class="text-[9px] mt-1 opacity-70">{{ streak }}🔥 streak</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'

const props = defineProps({ currentRank: { type: Number, default: 12 } })
const store = useUserStore()
const period = ref('weekly')

const xp = computed(() => store.xp.value)
const quizzesDone = computed(() => store.quizzesDone.value)
const streak = computed(() => store.streak.value)
const userRank = computed(() => store.currentRank.value)
const userInitial = computed(() => (store.name.value || 'U')[0].toUpperCase())
const rankPercent = computed(() => Math.max(1, Math.min(99, Math.floor((userRank.value / 50) * 100))))

const baseTop3 = {
  weekly: [
    { rank: 2, name: 'Riya M.', xp: 3420, avatar: '👩' },
    { rank: 1, name: 'Aman K.', xp: 3890, avatar: '🧑' },
    { rank: 3, name: 'Sahil P.', xp: 3210, avatar: '👨' },
  ],
  monthly: [
    { rank: 2, name: 'Priya J.', xp: 12420, avatar: '👩' },
    { rank: 1, name: 'Aman K.', xp: 13890, avatar: '🧑' },
    { rank: 3, name: 'Riya M.', xp: 11420, avatar: '👩' },
  ]
}

const baseList = {
  weekly: [
    { rank: 4, name: 'Kunal S.', xp: 2980, avatar: '👦', trend: 'up' },
    { rank: 5, name: 'Priya J.', xp: 2870, avatar: '👧', trend: 'up' },
    { rank: 6, name: 'Dev L.', xp: 2760, avatar: '🧒', trend: 'down' },
    { rank: 7, name: 'Neha R.', xp: 2650, avatar: '👩‍🎓', trend: 'up' },
    { rank: 8, name: 'Rohit V.', xp: 2540, avatar: '👨‍🎓', trend: 'up' },
  ],
  monthly: [
    { rank: 4, name: 'Kunal S.', xp: 10980, avatar: '👦', trend: 'up' },
    { rank: 5, name: 'Sahil P.', xp: 10870, avatar: '👨', trend: 'up' },
    { rank: 6, name: 'Dev L.', xp: 9760, avatar: '🧒', trend: 'down' },
    { rank: 7, name: 'Neha R.', xp: 8650, avatar: '👩‍🎓', trend: 'up' },
    { rank: 8, name: 'Rohit V.', xp: 7540, avatar: '👨‍🎓', trend: 'up' },
  ]
}

const top3 = computed(() => baseTop3[period.value])

const sortedList = computed(() => {
  const list = [...baseList[period.value]]
  // Inject current user into list based on rank
  const userEntry = {
    rank: userRank.value,
    name: store.name.value || 'You',
    xp: xp.value || 1240,
    avatar: '👤',
    trend: 'up',
    isYou: true
  }
  
  // If user rank is within 4-8, replace that position, otherwise add user entry sorted by XP
  if (userRank.value >= 4 && userRank.value <= 8) {
    const idx = list.findIndex(u => u.rank === userRank.value)
    if (idx !== -1) list[idx] = userEntry
  } else {
    // Add user at correct position by XP
    list.push(userEntry)
    list.sort((a, b) => b.xp - a.xp)
    // Re-rank
    list.forEach((u, i) => u.rank = 4 + i)
  }
  
  return list
})
</script>
