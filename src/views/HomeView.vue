<template>
  <div class="p-4 pb-10 bg-[#F8F9FF] min-h-screen">
    <div class="flex justify-between items-center"><div><h1 class="jakarta text-[22px] font-black">Hi, {{ userName }} 🎮</h1><p class="text-[13px] text-gray-500 mt-1">Lvl {{ level }} • {{ xp }} XP • {{ streak }}🔥</p></div><div class="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">RQ</div></div>
    <div class="mt-5 grid grid-cols-3 gap-3"><div class="bg-white rounded-[16px] border p-3 text-center"><p class="text-[20px] font-black">{{ streak }}🔥</p><p class="text-[9px] font-black uppercase text-gray-400">Streak</p></div><div class="bg-white rounded-[16px] border p-3 text-center"><p class="text-[20px] font-black text-indigo-600">{{ quizzes }}</p><p class="text-[9px] font-black uppercase text-gray-400">Quests</p></div><div class="bg-gray-900 rounded-[16px] p-3 text-center text-white"><p class="text-[20px] font-black">#{{ rank }}</p><p class="text-[9px] font-black uppercase text-white/60">Rank</p></div></div>
    <div class="mt-4 bg-white rounded-[16px] border p-3 flex items-center gap-3"><div class="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center font-black">{{ level }}</div><div class="flex-1"><div class="flex justify-between text-[11px] font-black"><span>Level {{ level }}</span><span>{{ xp % 1000 }}/1000 XP</span></div><div class="mt-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-indigo-600 rounded-full" :style="{width: (xp%1000)/10 + '%'}"></div></div></div></div>
    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-emerald-600 to-teal-600 p-[1.5px]" @click="$emit('goResources')"><div class="rounded-[19px] bg-white p-4"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white">📦</div><div class="flex-1"><p class="text-[11px] font-black uppercase text-emerald-600">Auto Resources • 1,248 Papers</p><h3 class="font-black text-[15px] mt-1">RTP • MTP • PYQ • All Attempts</h3><p class="text-[11px] text-gray-500 mt-1">All subjects • No roaming</p></div></div><div class="mt-3 grid grid-cols-3 gap-2 text-[10px]"><div class="p-2 rounded-lg bg-green-50 border text-center"><p class="font-black text-green-700">RTP 312</p></div><div class="p-2 rounded-lg bg-blue-50 border text-center"><p class="font-black text-blue-700">MTP 294</p></div><div class="p-2 rounded-lg bg-purple-50 border text-center"><p class="font-black text-purple-700">PYQ 642</p></div></div><div class="mt-3 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-[12px]">📚 Open Auto Resources Hub →</div></div></div>
    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-indigo-600 to-purple-600 p-[1.5px]" @click="$emit('goAIQuiz')"><div class="rounded-[19px] bg-white p-4"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white">✨</div><div><p class="text-[11px] font-black uppercase text-indigo-600">AI Quests • Gemini AI</p><h3 class="font-black text-[15px]">Generate Fresh Quest</h3></div></div><div class="mt-3 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-[12px]">🎮 Start with Gemini →</div></div></div>
    <div class="mt-5 rounded-2xl bg-gray-900 p-4 text-white" @click="$emit('goLeague')"><p class="text-[11px] font-black uppercase opacity-60">Gold League</p><p class="font-black text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥 • Lvl {{ level }}</p></div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const props=defineProps({ user:Object })
defineEmits(['goLeague','goBookmarks','goAIQuiz','goResources'])
const store=useUserStore()
const userName=computed(()=>props.user?.name?.split(' ')[0]||store.name.value?.split(' ')[0]||'Player')
const streak=computed(()=>store.streak.value||1)
const quizzes=computed(()=>store.quizzesDone.value||0)
const xp=computed(()=>store.xp.value||0)
const rank=computed(()=>store.currentRank.value||42)
const level=computed(()=>store.currentLevel.value||1)
const savedCount=computed(()=>store.bookmarkCount.value||0)
</script>
