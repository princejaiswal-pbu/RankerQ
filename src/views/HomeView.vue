<template>
  <div class="p-4 pb-10 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
    <div class="flex justify-between items-center"><div><h1 class="jakarta text-[22px] font-black text-gray-900 tracking-tight">Hi, {{ user.name.split(' ')[0] }} 🎮</h1><p class="text-[13px] text-gray-500 mt-1 font-medium">Ready for next quest? Lvl {{ currentLevel }} • {{ xp }} XP</p></div><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow">⚡</div></div>

    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="bg-white rounded-[16px] border border-indigo-100 p-3 text-center shadow-sm cursor-pointer hover:shadow-md transition" @click="showStreakInfo=true">
        <p class="text-[22px] font-black jakarta text-gray-900 flex items-center justify-center gap-1">{{ streak }}<span class="text-[16px]">🔥</span></p>
        <p class="text-[9px] uppercase tracking-widest text-gray-400 font-black mt-1">Streak</p>
        <p class="text-[9px] text-orange-600 font-bold mt-1">{{ streakText }}</p>
      </div>
      <div class="bg-white rounded-[16px] border border-indigo-100 p-3 text-center shadow-sm"><p class="text-[22px] font-black jakarta text-indigo-600">{{ quizzesDone }}</p><p class="text-[9px] uppercase tracking-widest text-gray-400 font-black mt-1">Quests</p><p class="text-[9px] text-indigo-600 font-bold mt-1">+{{ xp }} XP</p></div>
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[16px] p-3 text-center shadow-sm cursor-pointer text-white" @click="$emit('goLeague')"><p class="text-[22px] font-black jakarta text-white">#{{ rank }}</p><p class="text-[9px] uppercase tracking-widest text-white/60 font-black mt-1">Rank</p><p class="text-[9px] text-white/70 font-bold mt-1">Top {{ rankPercent }}%</p></div>
    </div>

    <!-- Level Progress - Game UI -->
    <div class="mt-4 bg-white rounded-[16px] border border-indigo-100 p-3 shadow-sm flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black text-[14px]">{{ currentLevel }}</div>
      <div class="flex-1"><div class="flex justify-between text-[11px] font-black"><span class="text-gray-700">Level {{ currentLevel }}</span><span class="text-indigo-600">{{ xp % 1000 }}/1000 XP</span></div><div class="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-yellow-400 rounded-full transition-all duration-500" :style="{width: levelProgress+'%'}"></div></div></div>
      <span class="text-[18px]">🎯</span>
    </div>

    <div class="mt-5"><QuizCard :quiz="todaysQuiz" @start="startQuiz" /></div>

    <div v-if="bookmarkCount>0" class="mt-5 rounded-[20px] bg-gradient-to-br from-amber-400 to-orange-500 p-[1.5px] cursor-pointer hover:shadow-lg transition" @click="$emit('goBookmarks')">
      <div class="rounded-[19px] bg-white p-4 flex items-center justify-between"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl text-white shadow">🔖</div><div><p class="text-[11px] font-black tracking-widest uppercase text-amber-600">Saved • Game Boost</p><h3 class="jakarta font-black text-[14px] text-gray-900 mt-0.5">{{ bookmarkCount }} bookmarked quests</h3><p class="text-[11px] text-gray-500 mt-0.5">Revise in {{ Math.ceil(bookmarkCount*0.5) }} mins → +XP</p></div></div><span class="text-gray-400 font-black">›</span></div>
    </div>

    <!-- Gemini Quest Card - replaces PYQ bank on homepage -->
    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-[1.5px] cursor-pointer hover:shadow-[0_8px_32px_rgba(79,70,229,0.25)] transition" @click="$emit('goAIQuiz')">
      <div class="rounded-[19px] bg-white p-4 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full -mr-16 -mt-16"></div>
        <div class="flex justify-between items-start relative z-10"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl shadow animate-pulse">✨</div><div><p class="text-[11px] font-black tracking-widest uppercase text-indigo-600">AI Quests • Gemini AI • Fresh</p><h3 class="jakarta font-black text-[15px] text-gray-900 mt-0.5 tracking-tight">Generate New Quest</h3><p class="text-[11px] text-gray-500 mt-0.5">Type any topic → instant fresh quiz</p></div></div><span class="text-[10px] font-black px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black animate-pulse">NEW</span></div>
        <div class="mt-3 grid grid-cols-3 gap-2 text-[11px] relative z-10"><div class="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-center"><p class="font-black text-indigo-700">Timer</p><p class="text-[10px] text-gray-600">30s/60s/90s</p></div><div class="p-2 rounded-lg bg-purple-50 border border-purple-100 text-center"><p class="font-black text-purple-700">Bookmark</p><p class="text-[10px] text-gray-600">Save Qs</p></div><div class="p-2 rounded-lg bg-amber-50 border border-amber-100 text-center"><p class="font-black text-amber-700">XP + Lvl</p><p class="text-[10px] text-gray-600">Game UI</p></div></div>
        <div class="mt-3 h-10 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center gap-2 text-[12px] font-black tracking-wide">🎮 Start New Quest with Gemini →</div>
      </div>
    </div>

    <div class="mt-5 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 p-4 text-white relative overflow-hidden cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.2)]" @click="$emit('goLeague')"><div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl"></div><div class="flex justify-between items-center relative z-10"><div><p class="text-[11px] font-black tracking-widest uppercase opacity-60">Gold League • 30 Players 🎮</p><p class="jakarta font-black text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥 • Lvl {{ currentLevel }}</p><p class="text-[11px] opacity-70 mt-0.5">{{ xp }} XP • Top {{ rankPercent }}% • Game On!</p></div><span class="text-2xl animate-bounce">🏆</span></div></div>

    <!-- Mock quiz modal with finish + result -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" @click.self="showModal=false">
      <div class="w-full max-w-[360px] bg-white rounded-[24px] shadow-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b border-indigo-50 flex justify-between items-center sticky top-0 bg-white rounded-t-[24px]">
          <div class="flex items-center gap-2"><span class="text-[11px] font-black px-2 py-1 rounded-full bg-gray-900 text-white">{{ currentQ+1 }}/{{ demoQs.length }}</span><span class="text-[11px] font-black px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">⏱️ {{ demoTimer }}s</span></div>
          <button @click="showModal=false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✕</button>
        </div>
        <div class="p-5">
          <div v-if="!showDemoResult">
            <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden flex gap-1"><div v-for="(q,i) in demoQs" :key="i" class="flex-1 h-full rounded-full" :class="i<currentQ?'bg-green-500':i===currentQ?'bg-indigo-600 animate-pulse':'bg-gray-200'"></div></div>
            <h3 class="jakarta font-bold text-[16px] mt-4 leading-5">{{ demoQs[currentQ].q }}</h3>
            <div class="mt-4 space-y-2"><button v-for="(opt,idx) in demoQs[currentQ].opts" :key="idx" @click="selectDemo(idx)" :class="selectedDemo===idx?'bg-indigo-50 border-indigo-400 text-indigo-800':'bg-gray-50 border-gray-200'" class="w-full text-left px-3 py-3 rounded-xl border-2 text-[13px] font-medium flex justify-between"><span>{{ opt }}</span><span v-if="selectedDemo===idx" class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">✓</span></button></div>
            <div class="mt-5 grid grid-cols-3 gap-2"><button @click="toggleDemoBookmark" :class="demoBookmarked?'bg-yellow-400 text-black':'bg-white border'" class="h-11 rounded-xl text-[12px] font-bold">{{ demoBookmarked?'⭐ Saved':'🔖 Save' }}</button><button v-if="currentQ<demoQs.length-1" @click="nextDemo" :disabled="selectedDemo===null" :class="selectedDemo!==null?'bg-gray-900 text-white':'bg-gray-100 text-gray-400'" class="col-span-2 h-11 rounded-xl font-black text-[13px]">{{ selectedDemo!==null?'Next →':'Select' }}</button><button v-else @click="finishDemo" :disabled="selectedDemo===null" :class="selectedDemo!==null?'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow':'bg-gray-100 text-gray-400'" class="col-span-2 h-11 rounded-xl font-black text-[13px]">🏁 Finish • Result</button></div>
          </div>
          <div v-else class="text-center">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto text-2xl">🏆</div>
            <h3 class="jakarta font-black text-[20px] mt-4">Quest Done! 🎉</h3>
            <div class="mt-4 grid grid-cols-3 gap-2"><div class="p-2.5 rounded-xl bg-indigo-50 border"><p class="text-[18px] font-black text-indigo-700">{{ demoScore }}/{{ demoQs.length }}</p><p class="text-[9px] uppercase font-black">Score</p></div><div class="p-2.5 rounded-xl bg-amber-50 border"><p class="text-[18px] font-black text-amber-600">+150</p><p class="text-[9px] uppercase font-black">XP</p></div><div class="p-2.5 rounded-xl bg-green-50 border"><p class="text-[18px] font-black text-green-600">Lvl {{ currentLevel }}</p><p class="text-[9px] uppercase font-black">Up!</p></div></div>
            <button @click="showModal=false; showDemoResult=false; currentQ=0; selectedDemo=null" class="mt-5 w-full h-11 rounded-xl bg-gray-900 text-white font-black text-[13px]">Awesome! Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
import QuizCard from '../components/QuizCard.vue'
const props=defineProps({ user:Object })
const emit=defineEmits(['goLeague','goBookmarks','goAIQuiz'])
const store=useUserStore()
const showModal=ref(false), currentQ=ref(0), selectedDemo=ref(null), demoBookmarked=ref(false), showDemoResult=ref(false), demoScore=ref(0), demoTimer=ref(60)
const streak=computed(()=>store.streak.value), quizzesDone=computed(()=>store.quizzesDone.value), xp=computed(()=>store.xp.value), rank=computed(()=>store.currentRank.value), bookmarkCount=computed(()=>store.bookmarkCount.value), currentLevel=computed(()=>store.currentLevel.value), levelProgress=computed(()=>store.levelProgress.value)
const rankPercent=computed(()=>Math.max(1,Math.min(99,Math.floor((rank.value/50)*100))))
const streakText=computed(()=>{ if(streak.value===0) return 'Start today'; if(streak.value===1) return 'Day 1'; if(streak.value<7) return `${streak.value} days`; return 'On fire! 🔥' })
const todaysQuiz=ref({ title:'Daily Quest - Contracts', meta:'10 Qs • 60s each', xp:150, progress:60 })
const demoQs=ref([{ q:'What is valid consideration under Contract Act?', opts:['Something in return, lawful','Only money','Only goods','Nothing'] },{ q:'Void vs voidable?', opts:['Void is void-ab-initio, voidable optional','Same','Opposite','None'] }])
function startQuiz(){ currentQ.value=0; selectedDemo.value=null; showDemoResult.value=false; demoScore.value=0; demoTimer.value=60; showModal.value=true }
function selectDemo(i){ selectedDemo.value=i; if(i===0) demoScore.value++ }
function nextDemo(){ if(currentQ.value<demoQs.value.length-1){ currentQ.value++; selectedDemo.value=null; demoBookmarked.value=false } }
function finishDemo(){ showDemoResult.value=true; store.completeQuiz(150,[]) }
function toggleDemoBookmark(){ demoBookmarked.value=!demoBookmarked.value; if(demoBookmarked.value) store.addBookmark({ id:`demo-${Date.now()}`, question:demoQs.value[currentQ.value].q, subject:'Law', topic:'Contracts' }) }
</script>
