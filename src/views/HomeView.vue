<template>
  <div class="p-4 pb-10 bg-[#F8F9FF] min-h-screen">
    <!-- Header Pehlee Jaisa -->
    <div class="flex justify-between items-start">
      <div>
        <h1 class="jakarta text-[24px] font-black leading-tight">Hi, {{ userName }} 🎮</h1>
        <p class="text-[13px] text-gray-500 mt-1 font-medium">Lvl {{ level }} • {{ xp }} XP • {{ streak }}🔥</p>
      </div>
      <div class="w-12 h-12 rounded-[14px] bg-[#6C5CE7] flex items-center justify-center text-white font-black text-[16px] shadow">RQ</div>
    </div>

    <!-- Stats Pehlee Jaisa - 3 cards -->
    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="bg-white rounded-[18px] border border-gray-100 p-3.5 text-center shadow-sm"><p class="text-[22px] font-black jakarta">{{ streak }}🔥</p><p class="text-[10px] font-black uppercase tracking-wider text-gray-400 mt-1">Streak</p></div>
      <div class="bg-white rounded-[18px] border border-gray-100 p-3.5 text-center shadow-sm"><p class="text-[22px] font-black jakarta text-[#6C5CE7]">{{ quizzes }}</p><p class="text-[10px] font-black uppercase tracking-wider text-gray-400 mt-1">Quests</p></div>
      <div class="bg-[#1A1A1A] rounded-[18px] p-3.5 text-center shadow-sm"><p class="text-[22px] font-black jakarta text-white">#{{ rank }}</p><p class="text-[10px] font-black uppercase tracking-wider text-white/50 mt-1">Rank</p></div>
    </div>

    <!-- Level Progress Pehlee Jaisa -->
    <div class="mt-4 bg-white rounded-[18px] border border-gray-100 p-4 flex items-center gap-3.5 shadow-sm">
      <div class="w-12 h-12 rounded-full bg-[#FFD93D] flex items-center justify-center font-black text-[14px] shadow">{{ level }}</div>
      <div class="flex-1">
        <div class="flex justify-between text-[12px] font-black jakarta"><span>Level {{ level }}</span><span class="text-gray-400">{{ xpProgress }}/1000 XP</span></div>
        <div class="mt-2 h-2.5 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-[#6C5CE7] rounded-full transition-all" :style="{width: progress + '%'}"></div></div>
      </div>
    </div>

    <!-- Daily Quest Card PEHLEE JAISA - FIXED but same design -->
    <div class="mt-5 rounded-[22px] bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] p-[1.5px] shadow-sm">
      <div class="rounded-[20.5px] bg-white p-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2.5"><div class="w-9 h-9 rounded-[12px] bg-[#6C5CE7] flex items-center justify-center text-white text-[16px]">🎯</div><div><p class="text-[11px] font-black uppercase tracking-wider text-[#6C5CE7]">Daily Quest</p><p class="jakarta font-black text-[14px]">Business Laws</p></div></div>
          <span class="text-[10px] font-black bg-[#6C5CE7]/10 text-[#6C5CE7] px-2.5 py-1 rounded-full">3 Qs • 450 XP</span>
        </div>
        <p class="text-[12px] text-gray-500 mt-3 leading-relaxed">Complete 3 CA questions • Void agreements, consideration, essential contracts</p>
        <div class="mt-3.5 h-11 rounded-[14px] bg-[#1A1A1A] text-white flex items-center justify-center font-black text-[13px] jakarta">▶ Start Daily Quest</div>
      </div>
    </div>

    <!-- Resources Hub Pehlee Jaisa Design but Auto Feature -->
    <div class="mt-5 rounded-[22px] bg-gradient-to-br from-emerald-500 to-teal-500 p-[1.5px] shadow-sm" @click="$emit('goResources')">
      <div class="rounded-[20.5px] bg-white p-4">
        <div class="flex gap-3">
          <div class="w-11 h-11 rounded-[14px] bg-emerald-600 flex items-center justify-center text-white text-[18px]">📦</div>
          <div class="flex-1"><p class="text-[11px] font-black uppercase tracking-wider text-emerald-600">Auto Resources • 1,248 Papers • Live</p><h3 class="jakarta font-black text-[15px] mt-0.5">RTP • MTP • PYQ • All Attempts</h3><p class="text-[11px] text-gray-500 mt-1">All subjects • Latest + Previous • Auto updated daily 6 AM</p></div>
        </div>
        <div class="mt-3.5 grid grid-cols-3 gap-2 text-[10px]"><div class="p-2.5 rounded-[12px] bg-green-50 border border-green-100 text-center"><p class="font-black text-green-700">RTP 312</p></div><div class="p-2.5 rounded-[12px] bg-blue-50 border border-blue-100 text-center"><p class="font-black text-blue-700">MTP 294</p></div><div class="p-2.5 rounded-[12px] bg-purple-50 border border-purple-100 text-center"><p class="font-black text-purple-700">PYQ 642</p></div></div>
        <div class="mt-3.5 h-11 rounded-[14px] bg-emerald-600 text-white flex items-center justify-center font-black text-[13px] jakarta">📚 Open Auto Hub → All ICAI Papers</div>
      </div>
    </div>

    <!-- Saved Pehlee Jaisa -->
    <div v-if="savedCount>0" class="mt-5 rounded-[22px] bg-gradient-to-br from-amber-400 to-orange-400 p-[1.5px] shadow-sm" @click="$emit('goBookmarks')">
      <div class="rounded-[20.5px] bg-white p-4 flex justify-between items-center">
        <div class="flex gap-3 items-center"><div class="w-11 h-11 rounded-[14px] bg-amber-500 flex items-center justify-center text-white">🔖</div><div><p class="text-[11px] font-black uppercase tracking-wider text-amber-600">Saved</p><h3 class="jakarta font-black text-[14px]">{{ savedCount }} bookmarked</h3></div></div>
        <span class="text-gray-400">›</span>
      </div>
    </div>

    <!-- AI Quiz Pehlee Jaisa -->
    <div class="mt-5 rounded-[22px] bg-gradient-to-br from-[#6C5CE7] to-purple-600 p-[1.5px] shadow-sm" @click="$emit('goAIQuiz')">
      <div class="rounded-[20.5px] bg-white p-4">
        <div class="flex gap-3"><div class="w-11 h-11 rounded-[14px] bg-[#6C5CE7] flex items-center justify-center text-white text-[18px]">✨</div><div><p class="text-[11px] font-black uppercase tracking-wider text-[#6C5CE7]">AI Quests • Gemini AI • Fixed</p><h3 class="jakarta font-black text-[15px]">Generate Fresh Quest</h3><p class="text-[11px] text-gray-500 mt-1">Any topic → timer + bookmark + result • Fixed explanations</p></div></div>
        <div class="mt-3.5 h-11 rounded-[14px] bg-[#6C5CE7] text-white flex items-center justify-center font-black text-[13px] jakarta">🎮 Start with Gemini → Fixed</div>
      </div>
    </div>

    <!-- League Pehlee Jaisa -->
    <div class="mt-5 rounded-[18px] bg-[#1A1A1A] p-4 text-white shadow-sm" @click="$emit('goLeague')">
      <p class="text-[10px] font-black uppercase tracking-widest opacity-50">Gold League</p>
      <p class="jakarta font-black text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥 • Lvl {{ level }}</p>
      <p class="text-[11px] opacity-60 mt-1">Top 3 get 500 XP bonus</p>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const props=defineProps({ user:Object })
defineEmits(['goLeague','goBookmarks','goAIQuiz','goResources','goPYQ'])
const store=useUserStore()
// Safe fallbacks - pehlee jaisa design but never crash, never disappear
const userName=computed(()=>{ try{ return props.user?.name?.split(' ')[0]||store.name.value?.split(' ')[0]||'Player' }catch(e){ return 'Player' } })
const streak=computed(()=>{ try{ return store.streak.value||1 }catch(e){ return 1 } })
const quizzes=computed(()=>{ try{ return store.quizzesDone.value||0 }catch(e){ return 0 } })
const xp=computed(()=>{ try{ return store.xp.value||0 }catch(e){ return 0 } })
const xpProgress=computed(()=> xp.value % 1000)
const progress=computed(()=> xpProgress.value / 10)
const rank=computed(()=>{ try{ return store.currentRank.value||42 }catch(e){ return 42 } })
const level=computed(()=>{ try{ return store.currentLevel.value||1 }catch(e){ return 1 } })
const savedCount=computed(()=>{ try{ return store.bookmarkCount.value||0 }catch(e){ return 0 } })
</script>
