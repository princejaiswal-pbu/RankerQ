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
      <div class="rounded-[19px] bg-white p-4 flex items-center justify-between"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-xl">📚</div><div><p class="text-[11px] font-bold tracking-widest uppercase text-red-600">Saved Questions • Auto-Saved</p><h3 class="jakarta font-bold text-[14px] text-gray-900 mt-0.5">You saved {{ mistakeCount }} questions</h3><p class="text-[11px] text-gray-500 mt-0.5">Revise in {{ revisionTime }} mins →</p></div></div><span class="text-gray-400">›</span></div>
    </div>

    <div class="mt-5 rounded-[20px] bg-gradient-to-br from-blue-600 to-indigo-700 p-[1px] cursor-pointer hover:shadow-lg transition" @click="$emit('goAIQuiz')">
      <div class="rounded-[19px] bg-white p-4"><div class="flex justify-between items-start"><div class="flex gap-3"><div class="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow">✨</div><div><p class="text-[11px] font-bold tracking-widest uppercase text-blue-700">AI Quizzes • Gemini</p><h3 class="jakarta font-bold text-[14px] text-gray-900 mt-0.5">Personalized AI Quiz</h3><p class="text-[11px] text-gray-500 mt-0.5">Based on {{ mistakeCount }} mistakes & weak areas</p></div></div><span class="text-[10px] font-bold px-2 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white animate-pulse">New</span></div><div class="mt-3 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center gap-2 text-[12px] font-semibold">✨ Generate fresh quiz with Gemini →</div></div>
    </div>



    <div class="mt-5 rounded-2xl bg-gray-900 p-4 text-white relative overflow-hidden cursor-pointer" @click="$emit('goLeague')"><div class="flex justify-between items-center relative z-10"><div><p class="text-[11px] font-bold tracking-widest uppercase opacity-60">Gold League • 30 Students</p><p class="jakarta font-bold text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥 streak</p></div><span class="text-xl">🏆</span></div></div>

    <QuizPlayer v-if="showModal" :questions="questions" @close="showModal=false" @bookmark="bookmark" @complete="finishQuiz" />
    <div v-if="result" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"><div class="w-full max-w-[340px] rounded-3xl bg-white p-6 text-center shadow-2xl"><div class="text-5xl">🏆</div><h2 class="jakarta mt-3 text-xl font-bold">Quiz complete!</h2><p class="mt-2 text-sm text-gray-500">You scored {{ result.score }}/{{ questions.length }} and earned {{ result.score * 50 }} XP.</p><p v-if="result.wrongAnswers.length" class="mt-3 rounded-xl bg-amber-50 p-3 text-xs font-semibold text-amber-800">{{ result.wrongAnswers.length }} answer(s) saved for revision.</p><button class="mt-5 h-11 w-full rounded-xl bg-ca-600 text-sm font-semibold text-white" @click="result=null">Continue playing</button></div></div>
    <div v-if="showStreakInfo" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5" @click.self="showStreakInfo=false"><div class="w-full max-w-[340px] rounded-3xl bg-white p-6 text-center shadow-2xl"><div class="text-4xl">🔥</div><h2 class="jakarta mt-3 text-lg font-bold">{{ streak }}-day streak</h2><p class="mt-2 text-sm text-gray-500">Complete one quiz each day to keep your streak growing.</p><button class="mt-5 h-11 w-full rounded-xl bg-ca-600 text-sm font-semibold text-white" @click="showStreakInfo=false">Got it</button></div></div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
import QuizCard from '../components/QuizCard.vue'
import QuizPlayer from '../components/QuizPlayer.vue'
const props=defineProps({ user:Object })
const emit=defineEmits(['goLeague','goMistakes','goPYQ','goAIQuiz'])
const store=useUserStore()
const showModal=ref(false), showStreakInfo=ref(false), result=ref(null)
const streak=computed(()=>store.streak.value), quizzesDone=computed(()=>store.quizzesDone.value), xp=computed(()=>store.xp.value), rank=computed(()=>store.currentRank.value)
const mistakeCount=computed(()=>store.mistakeCount.value), revisionTime=computed(()=>store.revisionTime.value)
const rankPercent=computed(()=>Math.max(1,Math.min(99,Math.floor((rank.value/50)*100))))
const streakText=computed(()=>{ if(streak.value===0) return 'Start today'; if(streak.value===1) return 'Day 1'; if(streak.value<7) return `${streak.value} days`; return 'On fire!' })
const todaysQuiz=ref({ title:'Business Laws - Contracts', meta:'3 Qs • 5 mins', xp:150, progress:60 })
const questions=[
  { id:'daily-1', subject:'Law', chapter:'Contracts', marks:2, question:'Which agreement is void from the beginning under the Indian Contract Act?', options:['An agreement with a minor','A contract induced by fraud','A voidable contract','A contract with free consent'], correct:0, explanation:'A minor is not competent to contract, so an agreement with a minor is void ab initio.' },
  { id:'daily-2', subject:'Law', chapter:'Contracts', marks:2, question:'Consideration may move from:', options:['Promisee only','Promisor only','Promisee or any other person','A stranger only'], correct:2, explanation:'Under Indian law, consideration may move from the promisee or any other person.' },
  { id:'daily-3', subject:'Law', chapter:'Contracts', marks:2, question:'A contract caused by coercion is:', options:['Void','Voidable at the option of the aggrieved party','Illegal','Unenforceable'], correct:1, explanation:'Coercion makes a contract voidable at the option of the party whose consent was caused by coercion.' }
]
function startQuiz(){ showModal.value=true }
function finishQuiz(outcome) { store.completeQuiz(outcome.score * 50, outcome.wrongAnswers); showModal.value=false; result.value=outcome }
function bookmark(question) { store.addMistake({ ...question, id:`saved-${question.id}`, yourAnswer:'Saved for later', correctAnswer:question.options[question.correct], revised:false }) }

</script>
