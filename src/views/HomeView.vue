<template>
  <div class="p-4 pb-10 bg-[#F8F9FF] min-h-screen">
    <div class="flex justify-between items-start">
      <div>
        <h1 class="jakarta text-[24px] font-black">Hi, {{ userName }} 🎮</h1>
        <p class="text-[13px] text-gray-500 mt-1">Lvl {{ level }} • {{ xp }} XP • {{ streak }}🔥</p>
      </div>
      <div class="w-12 h-12 rounded-[14px] bg-[#6C5CE7] flex items-center justify-center text-white font-black">RQ</div>
    </div>
    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="bg-white rounded-[18px] border p-3.5 text-center"><p class="text-[22px] font-black">{{ streak }}🔥</p><p class="text-[10px] font-black uppercase text-gray-400">Streak</p></div>
      <div class="bg-white rounded-[18px] border p-3.5 text-center"><p class="text-[22px] font-black text-[#6C5CE7]">{{ quizzes }}</p><p class="text-[10px] font-black uppercase text-gray-400">Quests</p></div>
      <div class="bg-[#1A1A1A] rounded-[18px] p-3.5 text-center"><p class="text-[22px] font-black text-white">#{{ rank }}</p><p class="text-[10px] font-black uppercase text-white/50">Rank</p></div>
    </div>
    <div class="mt-4 bg-white rounded-[18px] border p-4 flex items-center gap-3.5">
      <div class="w-12 h-12 rounded-full bg-[#FFD93D] flex items-center justify-center font-black">{{ level }}</div>
      <div class="flex-1">
        <div class="flex justify-between text-[12px] font-black"><span>Level {{ level }}</span><span class="text-gray-400">{{ xpProgress }}/1000 XP</span></div>
        <div class="mt-2 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-[#6C5CE7] rounded-full" :style="{width: progress + '%'}"></div></div>
      </div>
    </div>
    <!-- Your Original Dream App Daily Quest Card - Kept Exactly -->
    <div class="mt-5 rounded-[22px] bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] p-[1.5px]">
      <div class="rounded-[20.5px] bg-white p-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2.5"><div class="w-9 h-9 rounded-[12px] bg-[#6C5CE7] flex items-center justify-center text-white">🎯</div><div><p class="text-[11px] font-black uppercase text-[#6C5CE7]">Daily Quest</p><p class="font-black text-[14px]">Business Laws</p></div></div>
          <span class="text-[10px] font-black bg-[#6C5CE7]/10 text-[#6C5CE7] px-2.5 py-1 rounded-full">3 Qs • 450 XP</span>
        </div>
        <p class="text-[12px] text-gray-500 mt-3">Complete 3 CA questions • Your original dream design</p>
        <div class="mt-3.5 h-11 rounded-[14px] bg-[#1A1A1A] text-white flex items-center justify-center font-black text-[13px]">▶ Start Daily Quest</div>
      </div>
    </div>
    <!-- Auto Resources - Your Requested Feature Added Without Ruining Design -->
    <div class="mt-5 rounded-[22px] bg-gradient-to-br from-emerald-500 to-teal-500 p-[1.5px]" @click="$emit('goResources')">
      <div class="rounded-[20.5px] bg-white p-4">
        <div class="flex gap-3"><div class="w-11 h-11 rounded-[14px] bg-emerald-600 flex items-center justify-center text-white">📦</div><div><p class="text-[11px] font-black uppercase text-emerald-600">Auto Resources • 1,248 Papers</p><h3 class="font-black text-[15px]">RTP • MTP • PYQ</h3><p class="text-[11px] text-gray-500 mt-1">All attempts • All subjects • Auto updated</p></div></div>
      </div>
    </div>
    <div class="mt-5 rounded-[22px] bg-gradient-to-br from-[#6C5CE7] to-purple-600 p-[1.5px]" @click="$emit('goAIQuiz')">
      <div class="rounded-[20.5px] bg-white p-4">
        <div class="flex gap-3"><div class="w-11 h-11 rounded-[14px] bg-[#6C5CE7] flex items-center justify-center text-white">✨</div><div><p class="text-[11px] font-black uppercase text-[#6C5CE7]">AI Quests • Gemini AI</p><h3 class="font-black text-[15px]">Generate Fresh Quest</h3></div></div>
      </div>
    </div>
    <div class="mt-5 rounded-[18px] bg-[#1A1A1A] p-4 text-white" @click="$emit('goLeague')"><p class="text-[10px] font-black uppercase opacity-50">Gold League</p><p class="font-black text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥</p></div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const props=defineProps({ user:Object })
defineEmits(['goLeague','goBookmarks','goAIQuiz','goResources','goPYQ'])
const store=useUserStore()
const userName=computed(()=>{ try{ return props.user?.name?.split(' ')[0]||store.name.value?.split(' ')[0]||'Player' }catch{ return 'Player' } })
const streak=computed(()=>{ try{ return store.streak.value||1 }catch{ return 1 } })
const quizzes=computed(()=>{ try{ return store.quizzesDone.value||0 }catch{ return 0 } })
const xp=computed(()=>{ try{ return store.xp.value||0 }catch{ return 0 } })
const xpProgress=computed(()=> xp.value % 1000)
const progress=computed(()=> xpProgress.value / 10)
const rank=computed(()=>{ try{ return store.currentRank.value||42 }catch{ return 42 } })
const level=computed(()=>{ try{ return store.currentLevel.value||1 }catch{ return 1 } })
</script>
