<template>
  <div class="p-5 pb-24">
    <div class="flex justify-between items-center"><h2 class="jakarta text-[18px] font-bold">PYQ Bank</h2><span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-ca-50 text-ca-700 border">2018-2024 • ICAI</span></div>
    <div class="mt-5 flex gap-2 overflow-x-auto scrollbar-hide"><button v-for="s in subjects" :key="s" @click="selectedSubject=s" :class="selectedSubject===s?'bg-ca-600 text-white':'bg-white border'" class="whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-semibold">{{ s }}</button></div>
    <div class="mt-4 space-y-3">
      <div v-for="pyq in filtered" :key="pyq.id" class="ca-card p-4"><div class="flex justify-between"><span class="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-900 text-white">{{ pyq.year }} • {{ pyq.marks }} Marks</span><span v-if="pyq.timesAsked>1" class="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border">ICAI ×{{ pyq.timesAsked }} 🔥</span></div><p class="text-[13px] font-medium mt-3">{{ pyq.question }}</p><button v-if="!pyq.attempted" @click="attempt(pyq)" class="mt-3 w-full h-9 rounded-lg bg-ca-600 text-white text-[12px] font-semibold">Attempt • {{ pyq.marks }} Marks</button><div v-else class="mt-3 p-2 rounded-lg text-[12px] font-bold" :class="pyq.correct?'bg-ca-50 text-ca-700':'bg-red-50 text-red-700'">{{ pyq.correct?'✓ Correct':'✗ Wrong → Added to Mistake Book' }}</div></div>
    </div>
    <div v-if="active" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" @click.self="active=null"><div class="w-full max-w-[360px] rounded-3xl bg-white p-5 shadow-2xl"><button class="text-[12px] font-semibold text-gray-500" @click="active=null">← Back</button><p class="mt-4 text-[15px] font-bold leading-6">{{ active.question }}</p><div class="mt-4 space-y-2"><button v-for="(option, index) in active.options" :key="option" @click="submit(index)" class="w-full rounded-xl border border-ca-100 p-3 text-left text-[12px] font-medium hover:border-ca-400">{{ String.fromCharCode(65 + index) }}. {{ option }}</button></div></div></div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const store=useUserStore()
const subjects=['Law','Accounts','Maths','Economics'], selectedSubject=ref('Law')
const pyqs=ref([
  { id:1, subject:'Law', year:'2024', marks:4, timesAsked:3, question:'An agreement with a minor is:', options:['Void ab initio','Voidable','Valid after majority','Illegal'], answer:0, attempted:false, correct:false },
  { id:2, subject:'Law', year:'2023', marks:3, timesAsked:2, question:'A contract induced by fraud is:', options:['Void','Voidable at aggrieved party option','Illegal','Always enforceable'], answer:1, attempted:false, correct:false },
  { id:3, subject:'Accounts', year:'2024', marks:10, timesAsked:5, question:'Depreciation under WDV is calculated on:', options:['Original cost every year','Written down value','Market value','Salvage value only'], answer:1, attempted:false, correct:false },
])
const filtered=computed(()=>pyqs.value.filter(p=>p.subject===selectedSubject.value))
const active=ref(null)
function attempt(pyq){ active.value=pyq }
function submit(answer){ const pyq=active.value; const isCorrect=answer===pyq.answer; pyq.attempted=true; pyq.correct=isCorrect; if(!isCorrect) store.addMistake({ id:`pyq-${pyq.id}`, question:pyq.question, yourAnswer:pyq.options[answer], correctAnswer:pyq.options[pyq.answer], subject:pyq.subject, chapter:'General', year:pyq.year, marks:pyq.marks, timesAsked:pyq.timesAsked }); else store.completeQuiz(pyq.marks*10,[]); active.value=null }
</script>
