<template>
  <div class="p-5 pb-10">
    <h1 class="jakarta text-[20px] font-bold text-gray-900">Hi, {{ user.name.split(' ')[0] }} 👋</h1>
    <p class="text-[13px] text-gray-500 mt-1">Ready to crack today's target?</p>

    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="ca-card p-3 text-center cursor-pointer hover:shadow-card-hover transition" @click="showStreakInfo=true">
        <p class="text-[20px] font-bold jakarta text-gray-900 flex items-center justify-center gap-1">{{ streak }}<span class="text-[16px]">🔥</span></p>
        <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Streak</p>
        <p class="text-[9px] text-orange-600 font-semibold mt-1">{{ streakText }}</p>
      </div>
      <div class="ca-card p-3 text-center"><p class="text-[20px] font-bold jakarta text-gray-900">{{ quizzesDone }}</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Quizzes</p><p class="text-[9px] text-ca-600 font-semibold mt-1">+{{ xp }} XP</p></div>
      <div class="ca-card p-3 text-center cursor-pointer" @click="$emit('goLeague')"><p class="text-[20px] font-bold jakarta text-ca-700">#{{ rank }}</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Rank</p><p class="text-[9px] text-gray-500 font-semibold mt-1">Top {{ rankPercent }}%</p></div>
    </div>

    <div class="mt-5"><QuizCard :quiz="todaysQuiz" @start="startQuiz" /></div>

    <div v-if="mistakeCount>0" class="mt-5 rounded-[20px] bg-gradient-to-br from-red-500 to-orange-500 p-[1px] cursor-pointer hover:shadow-lg transition" @click="$emit('goMistakes')">
      <div class="rounded-[19px] bg-white p-4 flex items-center justify-between"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xl">📚</div><div><p class="text-[11px] font-bold tracking-widest uppercase text-red-600">Mistake Book • Auto-Saved</p><h3 class="jakarta font-bold text-[14px] text-gray-900 mt-0.5">You got {{ mistakeCount }} mistakes</h3><p class="text-[11px] text-gray-500 mt-0.5">Revise in {{ revisionTime }} mins →</p></div></div><span class="text-gray-400">›</span></div>
    </div>

    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-blue-600 to-indigo-700 p-[1px] cursor-pointer hover:shadow-lg transition" @click="$emit('goAIQuiz')">
      <div class="rounded-[19px] bg-white p-4"><div class="flex justify-between items-start"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow">✨</div><div><p class="text-[11px] font-bold tracking-widest uppercase text-blue-700">AI Quizzes • Meta AI • Llama 3</p><h3 class="jakarta font-bold text-[14px] text-gray-900 mt-0.5">Personalized AI Quiz</h3><p class="text-[11px] text-gray-500 mt-0.5">Based on {{ mistakeCount }} mistakes & weak areas</p></div></div><span class="text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white animate-pulse">New</span></div><div class="mt-3 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2 text-[12px] font-semibold">✨ Generate Quiz with Meta AI →</div></div>
    </div>

    <div class="mt-5 ca-card p-4 cursor-pointer hover:shadow-card-hover transition" @click="$emit('goPYQ')">
      <div class="flex justify-between items-center"><h3 class="jakarta font-bold text-[14px]">PYQ Bank • ICAI Pattern</h3><span class="text-[11px] font-bold px-2 py-1 rounded-full bg-ca-50 text-ca-700 border border-ca-100">2018-2024</span></div>
      <div class="mt-3 grid grid-cols-2 gap-2"><div class="p-3 rounded-xl bg-[#F6FFF8] border border-ca-50"><p class="text-[11px] font-bold text-gray-500">Law</p><p class="text-[13px] font-bold mt-1">Contracts • 15 PYQs</p><p class="text-[10px] text-amber-600 font-bold mt-1">ICAI Asked 3× 🔥</p></div><div class="p-3 rounded-xl bg-[#F6FFF8] border border-ca-50"><p class="text-[11px] font-bold text-gray-500">Accounts</p><p class="text-[13px] font-bold mt-1">Final A/c • 20 PYQs</p><p class="text-[10px] text-amber-600 font-bold mt-1">ICAI Asked 5× 🔥</p></div></div>
    </div>

    <div class="mt-5 rounded-2xl bg-gray-900 p-4 text-white relative overflow-hidden cursor-pointer" @click="$emit('goLeague')"><div class="flex justify-between items-center relative z-10"><div><p class="text-[11px] font-bold tracking-widest uppercase opacity-60">Gold League • 30 Students</p><p class="jakarta font-bold text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥 streak</p></div><span class="text-xl">🏆</span></div></div>

    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" @click.self="showModal=false">
      <div class="w-full max-w-[360px] bg-white rounded-[20px] p-6 shadow-2xl">
        <div class="w-12 h-12 rounded-full bg-ca-50 flex items-center justify-center mx-auto text-xl">🚀</div>
        <h3 class="jakarta text-center font-bold text-[18px] mt-4">{{ quizCompleted?'Quiz Completed! 🎉':'Starting Quiz' }}</h3>
        <p class="text-center text-[13px] text-gray-500 mt-2">{{ todaysQuiz.title }} • {{ todaysQuiz.meta }}</p>
        <div v-if="!quizCompleted" class="mt-4 space-y-2"><p class="text-[12px] font-semibold">Q1: What is void contract?</p><button v-for="(opt,idx) in mockOptions" :key="idx" @click="selectedOption=idx" :class="selectedOption===idx?'bg-ca-50 border-ca-300':'bg-gray-50 border-gray-200'" class="w-full text-left px-3 py-2 rounded-lg border text-[12px] transition">{{ opt }}</button></div>
        <div v-if="quizCompleted" class="mt-4 p-3 rounded-xl bg-ca-50 border border-ca-100 text-center"><p class="text-[14px] font-bold text-ca-800">+{{ todaysQuiz.xp }} XP Earned!</p><p v-if="lastWrong.length>0" class="text-[11px] text-red-600 mt-1">{{ lastWrong.length }} wrong → Added to Mistake Book 📚</p></div>
        <button @click="completeQuiz" class="mt-5 w-full h-[44px] rounded-xl bg-ca-600 text-white font-semibold hover:bg-ca-700 transition">{{ quizCompleted?'Awesome! Close':selectedOption!==null?'Submit Answer →':'Select an option' }}</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
import QuizCard from '../components/QuizCard.vue'
const props=defineProps({ user:Object })
const emit=defineEmits(['goLeague','goMistakes','goPYQ','goAIQuiz'])
const store=useUserStore()
const showModal=ref(false), showStreakInfo=ref(false), quizCompleted=ref(false), selectedOption=ref(null), lastWrong=ref([])
const streak=computed(()=>store.streak.value), quizzesDone=computed(()=>store.quizzesDone.value), xp=computed(()=>store.xp.value), rank=computed(()=>store.currentRank.value)
const mistakeCount=computed(()=>store.mistakeCount.value), revisionTime=computed(()=>store.revisionTime.value)
const rankPercent=computed(()=>Math.max(1,Math.min(99,Math.floor((rank.value/50)*100))))
const streakText=computed(()=>{ if(streak.value===0) return 'Start today'; if(streak.value===1) return 'Day 1'; if(streak.value<7) return `${streak.value} days`; return 'On fire!' })
const todaysQuiz=ref({ title:'Business Laws - Contracts', meta:'15 Qs • 20 mins', xp:150, progress:60 })
const mockOptions=['Void is void-ab-initio','Both are same','Voidable is void','None of above']
function startQuiz(){ quizCompleted.value=false; selectedOption.value=null; lastWrong.value=[]; showModal.value=true }
function completeQuiz(){
  if(!quizCompleted.value){
    if(selectedOption.value===null) return
    const isWrong=selectedOption.value!==0
    if(isWrong){ lastWrong.value=[{ id:`quiz-${Date.now()}`, question:'What is void contract?', yourAnswer:mockOptions[selectedOption.value], correctAnswer:mockOptions[0], subject:'Law', chapter:'Contracts', year:'2024', marks:2, timesAsked:3 }]; store.completeQuiz(50,lastWrong.value) } else store.completeQuiz(todaysQuiz.value.xp,[])
    quizCompleted.value=true
  } else { showModal.value=false; quizCompleted.value=false }
}
</script>
