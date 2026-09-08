<template>
  <div class="p-4 pb-10 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
    <div class="flex justify-between items-center"><div><h1 class="jakarta text-[22px] font-black text-gray-900">Hi, {{ user.name.split(' ')[0] }} 🎮</h1><p class="text-[13px] text-gray-500 mt-1 font-medium">Ready for your next challenge? Lvl {{ currentLevel }} • {{ xp }} XP</p></div><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow">⚡</div></div>
    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="stat"><p class="value">{{ streak }}🔥</p><p class="label">Streak</p><p class="hint">{{ streakText }}</p></div>
      <div class="stat"><p class="value text-indigo-600">{{ quizzesDone }}</p><p class="label">Quests</p><p class="hint text-indigo-600">+{{ xp }} XP</p></div>
      <div class="stat dark" @click="$emit('goLeague')"><p class="value text-white">#{{ rank }}</p><p class="label text-white/60">Rank</p><p class="hint text-white/70">Top {{ rankPercent }}%</p></div>
    </div>
    <div class="mt-4 bg-white rounded-[16px] border border-indigo-100 p-3 shadow-sm flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black text-[14px]">{{ currentLevel }}</div><div class="flex-1"><div class="flex justify-between text-[11px] font-black"><span>Level {{ currentLevel }}</span><span class="text-indigo-600">{{ xp % 1000 }}/1000 XP</span></div><div class="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-yellow-400 rounded-full" :style="{width: levelProgress+'%'}"></div></div></div><span>🎯</span></div>
    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-[1.5px] cursor-pointer" @click="$emit('goAIQuiz')"><div class="rounded-[19px] bg-white p-4"><div class="flex gap-3 items-center"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl">✨</div><div><p class="text-[11px] font-black uppercase tracking-widest text-indigo-600">AI Quests</p><h3 class="jakarta font-black text-[15px]">Generate a fresh CA quiz</h3><p class="text-[11px] text-gray-500">Realistic questions • 4 options • explanations</p></div></div><div class="mt-3 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center text-[12px] font-black">🎮 Start AI Quest →</div></div></div>
    <div class="mt-4 rounded-[20px] bg-white border border-indigo-100 p-4 cursor-pointer shadow-sm" @click="$emit('goResources')"><div class="flex items-center gap-3"><div class="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">📚</div><div class="flex-1"><p class="text-[11px] font-black uppercase tracking-widest text-indigo-600">ICAI Library</p><h3 class="jakarta font-black text-[15px]">PYQ • RTP • MTP • Suggested Answers</h3><p class="text-[11px] text-gray-500">All attempts, subjects and official PDF downloads</p></div><span class="text-indigo-600 font-black">→</span></div></div>
    <div class="mt-5 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 p-4 text-white cursor-pointer" @click="$emit('goLeague')"><div class="flex justify-between items-center"><div><p class="text-[11px] font-black tracking-widest uppercase opacity-60">Gold League • 30 Players 🎮</p><p class="jakarta font-black text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥 • Lvl {{ currentLevel }}</p><p class="text-[11px] opacity-70 mt-0.5">{{ xp }} XP • Top {{ rankPercent }}%</p></div><span class="text-2xl">🏆</span></div></div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
defineProps({ user:Object })
const store=useUserStore()
defineEmits(['goLeague','goBookmarks','goAIQuiz','goResources'])
const streak=computed(()=>store.streak.value), quizzesDone=computed(()=>store.quizzesDone.value), xp=computed(()=>store.xp.value), rank=computed(()=>store.currentRank.value), currentLevel=computed(()=>store.currentLevel.value), levelProgress=computed(()=>store.levelProgress.value)
const rankPercent=computed(()=>Math.max(1,Math.min(99,Math.floor((rank.value/50)*100))))
const streakText=computed(()=>streak.value===0?'Start today':streak.value===1?'Day 1':streak.value<7?`${streak.value} days`:'On fire! 🔥')
</script>
<style scoped>.stat{background:white;border:1px solid #e0e7ff;border-radius:16px;padding:12px;text-align:center;box-shadow:0 1px 2px rgba(0,0,0,.03)}.stat.dark{background:#1f2937;border-color:#1f2937}.value{font-size:22px;font-weight:900}.label{font-size:9px;text-transform:uppercase;letter-spacing:.14em;color:#9ca3af;font-weight:900;margin-top:4px}.hint{font-size:9px;color:#ea580c;font-weight:800;margin-top:4px}</style>
