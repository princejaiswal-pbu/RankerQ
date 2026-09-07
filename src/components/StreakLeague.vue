<template>
  <div class="p-4 pb-28 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
    <div class="flex justify-between items-center"><h2 class="jakarta text-[20px] font-black tracking-tight">Streak League 🎮</h2><span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black">Weekly • Game</span></div>
    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-[1.5px]"><div class="rounded-[19px] bg-gray-900 p-4 text-white flex justify-between items-center"><div class="flex gap-3"><div class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-black">{{ userInitial }}</div><div><p class="text-[13px] font-black">#{{ rank }} • {{ streak }}🔥 • Lvl {{ currentLevel }}</p><p class="text-[11px] opacity-70">{{ xp }} XP • Top {{ rankPercent }}%</p></div></div><button @click="shareRank" class="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center">↗️</button></div></div>
    <div class="mt-6 flex items-end justify-center gap-3"><div class="flex flex-col items-center"><div class="w-[56px] h-[56px] rounded-full bg-white border-2 shadow flex items-center justify-center">👩</div><p class="text-[12px] font-bold mt-2">Riya</p></div><div class="flex flex-col items-center -mt-4"><div class="w-[68px] h-[68px] rounded-full bg-white border-2 border-amber-300 shadow flex items-center justify-center relative">🧑<span class="absolute -top-3 left-1/2 -translate-x-1/2">👑</span></div><p class="text-[12px] font-bold mt-2">Aman</p></div><div class="flex flex-col items-center"><div class="w-[56px] h-[56px] rounded-full bg-white border-2 shadow flex items-center justify-center">👨</div><p class="text-[12px] font-bold mt-2">Sahil</p></div></div>
    <div class="mt-6 bg-white rounded-[16px] border"><div v-for="u in list" :key="u.rank" class="flex justify-between px-4 py-3 border-b last:border-0" :class="{'bg-gray-900 text-white':u.isYou}"><span>#{{ u.rank }} {{ u.name }}</span><span class="font-bold">{{ u.xp }} XP</span></div></div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const store=useUserStore()
const rank=computed(()=>store.currentRank.value), xp=computed(()=>store.xp.value), streak=computed(()=>store.streak.value), currentLevel=computed(()=>store.currentLevel.value)
const userInitial=computed(()=>(store.name.value||'U')[0].toUpperCase())
const rankPercent=computed(()=>Math.max(1,Math.min(99,Math.floor((rank.value/50)*100))))
const list=computed(()=>[{ rank:4, name:'Kunal', xp:2980 },{ rank:rank.value, name:store.name.value||'You', xp:xp.value||1240, isYou:true }])
function shareRank(){ alert('Share RankerQ by PP') }
</script>
