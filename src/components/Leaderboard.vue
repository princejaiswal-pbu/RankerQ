<template>
  <div class="p-5">
    <div class="flex justify-between items-center">
      <h2 class="jakarta text-[18px] font-bold">Leaderboard</h2>
      <div class="flex bg-ca-50 rounded-full p-1 border border-[#E5F7E9]">
        <button @click="period = 'weekly'" :class="period === 'weekly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'"
          class="px-3 py-1 rounded-full text-[12px] font-semibold transition">Weekly</button>
        <button @click="period = 'monthly'" :class="period === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'"
          class="px-3 py-1 rounded-full text-[12px] font-semibold transition">Monthly</button>
      </div>
    </div>

    <!-- Podium -->
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

    <!-- List -->
    <div class="mt-6 ca-card overflow-hidden">
      <div v-for="u in list" :key="u.rank" class="flex items-center justify-between px-4 py-3 border-b last:border-0 border-ca-50 hover:bg-[#F9FFFB] transition">
        <div class="flex items-center gap-3">
          <span class="w-6 text-[12px] font-bold text-gray-400">#{{ u.rank }}</span>
          <div class="w-8 h-8 rounded-full bg-ca-50 flex items-center justify-center text-sm">{{ u.avatar }}</div>
          <p class="text-[13px] font-medium text-gray-900">{{ u.name }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-[12px] font-semibold text-gray-700">{{ u.xp }} XP</span>
          <span :class="u.trend === 'up' ? 'text-green-600' : 'text-red-500'" class="text-[11px]">{{ u.trend === 'up' ? '↑' : '↓' }}</span>
        </div>
      </div>
    </div>

    <!-- Current User Sticky -->
    <div class="mt-4 p-3 rounded-2xl bg-ca-600 text-white flex items-center justify-between shadow-green">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">👤</div>
        <div>
          <p class="text-[13px] font-bold">You - #{{ currentRank }}</p>
          <p class="text-[11px] opacity-80">1,240 XP • Top 8%</p>
        </div>
      </div>
      <span class="text-[11px] bg-white text-ca-700 px-2.5 py-1 rounded-full font-bold">You</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ currentRank: { type: Number, default: 12 } })

const period = ref('weekly')
const top3 = [
  { rank: 2, name: 'Riya M.', xp: 3420, avatar: '👩' },
  { rank: 1, name: 'Aman K.', xp: 3890, avatar: '🧑' },
  { rank: 3, name: 'Sahil P.', xp: 3210, avatar: '👨' },
]
const list = [
  { rank: 4, name: 'Kunal S.', xp: 2980, avatar: '👦', trend: 'up' },
  { rank: 5, name: 'Priya J.', xp: 2870, avatar: '👧', trend: 'up' },
  { rank: 6, name: 'Dev L.', xp: 2760, avatar: '🧒', trend: 'down' },
  { rank: 7, name: 'Neha R.', xp: 2650, avatar: '👩‍🎓', trend: 'up' },
  { rank: 8, name: 'Rohit V.', xp: 2540, avatar: '👨‍🎓', trend: 'up' },
]
</script>
