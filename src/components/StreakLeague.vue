<template>
  <div class="p-5 pb-24">
    <div class="flex justify-between items-center"><h2 class="jakarta text-[18px] font-bold">Streak League</h2><span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white">🔥 Weekly</span></div>
    <div class="mt-5 p-4 rounded-2xl bg-gray-900 text-white flex justify-between items-center"><div class="flex gap-3"><div class="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center font-bold">{{ userInitial }}</div><div><p class="text-[13px] font-bold">You • #{{ rank }} • {{ streak }}🔥</p><p class="text-[11px] opacity-70">{{ xp }} XP • Top {{ rankPercent }}%</p></div></div><button @click="shareRank" class="w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center">↗️</button></div>
    <div class="mt-5 ca-card p-4">
      <div class="flex items-center justify-between"><h3 class="jakarta text-[14px] font-bold">Your XP this week</h3><span class="text-[11px] font-bold text-ca-700">{{ weeklyXP }} XP</span></div>
      <div class="mt-4 flex h-20 items-end justify-between gap-2"><div v-for="day in activity" :key="day.label" class="flex flex-1 flex-col items-center gap-1"><div class="w-full max-w-7 rounded-t-md bg-ca-600 transition-all" :class="day.value ? '' : 'bg-ca-100'" :style="{ height: `${Math.max(8, day.value)}%` }"></div><span class="text-[9px] text-gray-400">{{ day.label }}</span></div></div>
    </div>
    <div class="mt-6 flex items-end justify-center gap-3">
      <div class="flex flex-col items-center order-1"><div class="w-[56px] h-[56px] rounded-full border-2 border-white shadow bg-gray-100 flex items-center justify-center">👩</div><p class="mt-2 text-[12px] font-bold">Riya M.</p><p class="text-[11px] text-ca-700">3420 XP</p></div>
      <div class="flex flex-col items-center order-2 -mt-4"><div class="w-[68px] h-[68px] rounded-full border-2 border-amber-300 shadow bg-gray-100 flex items-center justify-center relative">🧑<span class="absolute -top-3 left-1/2 -translate-x-1/2">👑</span></div><p class="mt-2 text-[12px] font-bold">Aman K.</p><p class="text-[11px] text-ca-700">3890 XP</p></div>
      <div class="flex flex-col items-center order-3"><div class="w-[56px] h-[56px] rounded-full border-2 border-white shadow bg-gray-100 flex items-center justify-center">👨</div><p class="mt-2 text-[12px] font-bold">Sahil P.</p><p class="text-[11px] text-ca-700">3210 XP</p></div>
    </div>
    <div class="mt-6 ca-card overflow-hidden"><div v-for="u in list" :key="u.rank" class="flex justify-between px-4 py-3 border-b last:border-0" :class="{'bg-gray-900 text-white':u.isYou}"><div class="flex gap-3 items-center"><span class="w-6 text-[12px] font-bold">#{{ u.rank }}</span><span>{{ u.avatar }}</span><span class="text-[13px]">{{ u.name }}</span></div><span class="text-[12px] font-bold">{{ u.xp }} XP</span></div></div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const store=useUserStore()
const rank=computed(()=>store.currentRank.value), xp=computed(()=>store.xp.value), streak=computed(()=>store.streak.value)
const userInitial=computed(()=>(store.name.value||'U')[0].toUpperCase())
const rankPercent=computed(()=>Math.max(1,Math.min(99,Math.floor((rank.value/50)*100))))
const weeklyXP=computed(()=>xp.value)
const activity=computed(()=>{ const base=[28,42,22,55,36,68,0]; const earned=Math.min(100, Math.round(xp.value/8)); base[6]=earned; return base.map((value,index)=>({ value, label:['M','T','W','T','F','S','S'][index] })) })
const list=computed(()=>[
  { rank:4, name:'Kunal S.', xp:2980, avatar:'👦' },
  { rank:5, name:'Priya J.', xp:2870, avatar:'👧' },
  { rank:rank.value, name:store.name.value||'You', xp:xp.value||1240, avatar:'👤', isYou:true },
])
function shareRank(){ const text=`I'm #${rank.value} in CA Series Gold League with ${streak.value}🔥!`; if(window.Telegram?.WebApp?.openTelegramLink){ window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/yourbot')}&text=${encodeURIComponent(text)}`) } else alert(text) }
</script>
