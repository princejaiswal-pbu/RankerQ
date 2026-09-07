<template>
  <div class="p-4 pb-10 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
    <div class="flex justify-between items-center">
      <div><h1 class="jakarta text-[22px] font-black text-gray-900 tracking-tight">Hi, {{ displayName }} 🎮</h1><p class="text-[13px] text-gray-500 mt-1 font-medium">Lvl {{ currentLevel }} • {{ xp }} XP • {{ streak }}🔥 streak</p></div>
      <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow">⚡</div>
    </div>

    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="bg-white rounded-[16px] border border-indigo-100 p-3 text-center shadow-sm"><p class="text-[22px] font-black jakarta text-gray-900">{{ streak }}🔥</p><p class="text-[9px] uppercase tracking-widest text-gray-400 font-black mt-1">Streak</p></div>
      <div class="bg-white rounded-[16px] border border-indigo-100 p-3 text-center shadow-sm"><p class="text-[22px] font-black jakarta text-indigo-600">{{ quizzesDone }}</p><p class="text-[9px] uppercase tracking-widest text-gray-400 font-black mt-1">Quests</p></div>
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[16px] p-3 text-center shadow-sm cursor-pointer text-white" @click="$emit('goLeague')"><p class="text-[22px] font-black jakarta text-white">#{{ rank }}</p><p class="text-[9px] uppercase tracking-widest text-white/60 font-black mt-1">Rank</p></div>
    </div>

    <div class="mt-4 bg-white rounded-[16px] border border-indigo-100 p-3 shadow-sm flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black text-[14px]">{{ currentLevel }}</div>
      <div class="flex-1"><div class="flex justify-between text-[11px] font-black"><span>Level {{ currentLevel }}</span><span class="text-indigo-600">{{ xp % 1000 }}/1000 XP</span></div><div class="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-indigo-600 to-yellow-400 rounded-full" :style="{width: levelProgress+'%'}"></div></div></div>
      <span>🎯</span>
    </div>

    <!-- NO DAILY QUEST CARD - REMOVED AS REQUESTED -->

    <!-- Resources Hub Promo - Main Feature: Auto RTP/MTP/PYQ -->
    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-[1.5px] cursor-pointer shadow-[0_8px_24px_rgba(16,185,129,0.2)]" @click="$emit('goResources')">
      <div class="rounded-[19px] bg-white p-4 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full -mr-16 -mt-16"></div>
        <div class="flex justify-between items-start relative z-10">
          <div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white text-xl shadow">📦</div><div><p class="text-[11px] font-black tracking-widest uppercase text-emerald-600">Auto Resources • 1,248 Papers • Live</p><h3 class="jakarta font-black text-[15px] mt-0.5">RTP • MTP • PYQ • All Attempts</h3><p class="text-[11px] text-gray-500 mt-0.5">All subjects • Latest + Previous • No roaming</p></div></div><span class="text-[10px] font-black px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">AUTO</span>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-2 text-[10px] relative z-10">
          <div class="p-2 rounded-lg bg-green-50 border border-green-100 text-center"><p class="font-black text-green-700">RTP 312</p><p class="text-gray-600">Revision</p></div>
          <div class="p-2 rounded-lg bg-blue-50 border border-blue-100 text-center"><p class="font-black text-blue-700">MTP 294</p><p class="text-gray-600">Mock Tests</p></div>
          <div class="p-2 rounded-lg bg-purple-50 border border-purple-100 text-center"><p class="font-black text-purple-700">PYQ 642</p><p class="text-gray-600">Past Qs</p></div>
        </div>
        <div class="mt-3 h-10 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center gap-2 text-[12px] font-black">📚 Open Resources Hub → All ICAI Papers</div>
      </div>
    </div>

    <div v-if="bookmarkCount>0" class="mt-5 rounded-[20px] bg-gradient-to-br from-amber-400 to-orange-500 p-[1.5px] cursor-pointer" @click="$emit('goBookmarks')">
      <div class="rounded-[19px] bg-white p-4 flex items-center justify-between"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">🔖</div><div><p class="text-[11px] font-black uppercase text-amber-600">Saved</p><h3 class="jakarta font-black text-[14px] mt-0.5">{{ bookmarkCount }} bookmarked</h3><p class="text-[11px] text-gray-500">Revise → +XP</p></div></div><span>›</span></div>
    </div>

    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-[1.5px] cursor-pointer" @click="$emit('goAIQuiz')">
      <div class="rounded-[19px] bg-white p-4"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl">✨</div><div><p class="text-[11px] font-black uppercase text-indigo-600">AI Quests • Gemini AI • Fresh</p><h3 class="jakarta font-black text-[15px] mt-0.5">Generate New Quest</h3><p class="text-[11px] text-gray-500">Type any topic → instant fresh quiz</p></div></div><div class="mt-3 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center gap-2 text-[12px] font-black">🎮 Start with Gemini →</div></div>
    </div>

    <div class="mt-5 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 p-4 text-white cursor-pointer" @click="$emit('goLeague')"><p class="text-[11px] font-black uppercase opacity-60">Gold League • 30 Players</p><p class="jakarta font-black text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥 • Lvl {{ currentLevel }}</p></div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const props=defineProps({ user:Object })
const emit=defineEmits(['goLeague','goBookmarks','goAIQuiz','goResources'])
const store=useUserStore()
const streak=computed(()=>store.streak.value), quizzesDone=computed(()=>store.quizzesDone.value), xp=computed(()=>store.xp.value), rank=computed(()=>store.currentRank.value), bookmarkCount=computed(()=>store.bookmarkCount.value), currentLevel=computed(()=>store.currentLevel.value), levelProgress=computed(()=>store.levelProgress.value)
const displayName=computed(()=>props.user?.name?.split(' ')[0]||'Player')
</script>
