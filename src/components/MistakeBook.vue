<template>
  <div class="p-5 pb-24">
    <div class="flex justify-between items-center"><h2 class="jakarta text-[18px] font-bold">Mistake Book</h2><span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">{{ mistakes.length }} mistakes</span></div>
    <div v-if="mistakes.length>0" class="mt-5 rounded-[20px] bg-gradient-to-br from-red-500 to-orange-500 p-[1px]"><div class="rounded-[19px] bg-white p-5"><div class="flex justify-between"><div><p class="text-[11px] font-bold tracking-widest uppercase text-red-600">Auto-Saved</p><h3 class="jakarta font-bold text-[18px] mt-1">You got {{ mistakes.length }} mistakes</h3><p class="text-[13px] text-gray-600 mt-1">Revise in {{ revisionTime }} mins • ICAI repeats 60%</p></div><div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">📚</div></div><div class="mt-4 grid grid-cols-2 gap-2"><button @click="reviseAll" class="h-11 rounded-xl bg-gray-900 text-white font-semibold text-[13px]">Revise All →</button><button @click="clearAll" class="h-11 rounded-xl bg-white border text-[13px]">Clear Mastered</button></div></div></div>
    <div v-else class="mt-10 text-center"><div class="w-20 h-20 rounded-[20px] bg-ca-50 border flex items-center justify-center mx-auto text-3xl">✨</div><h3 class="jakarta font-bold text-[16px] mt-4">No mistakes yet!</h3><p class="text-[13px] text-gray-500 mt-1">Wrong answers auto-save here.</p></div>
    <div class="mt-4 space-y-3"><div v-for="m in mistakes" :key="m.id" class="ca-card p-4"><div class="flex justify-between gap-2"><span class="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-900 text-white">{{ m.subject }} • {{ m.chapter }}</span><span v-if="m.timesAsked>1" class="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">ICAI ×{{ m.timesAsked }}</span></div><p class="text-[13px] font-medium mt-3">{{ m.question }}</p><div class="mt-3 p-3 rounded-xl bg-red-50 border border-red-100"><p class="text-[11px] font-bold text-red-600 uppercase">Your Answer</p><p class="text-[12px] text-red-800 mt-1 line-through">{{ m.yourAnswer }}</p></div><div class="mt-2 p-3 rounded-xl bg-ca-50 border border-ca-100"><p class="text-[11px] font-bold text-ca-700 uppercase">Correct</p><p class="text-[12px] text-ca-800 mt-1 font-medium">{{ m.correctAnswer }}</p></div><div class="mt-3 flex gap-2"><button @click="markRevised(m.id)" :class="m.revised?'bg-ca-600 text-white':'bg-white border'" class="flex-1 h-9 rounded-lg text-[12px] font-semibold">{{ m.revised?'✓ Mastered':'Mark Mastered' }}</button><button @click="remove(m.id)" class="w-9 h-9 rounded-lg bg-gray-50 border">🗑️</button></div></div></div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const store=useUserStore()
const mistakes=computed(()=>store.mistakes.value), revisionTime=computed(()=>store.revisionTime.value)
function markRevised(id){ const m=store.mistakes.value.find(m=>m.id===id); if(m){ m.revised=!m.revised; store.saveUserToTelegramStorage(store.name.value,store.level.value) } }
function remove(id){ store.removeMistake(id) }
function clearAll(){ store.mistakes.value.filter(m=>m.revised).forEach(m=>store.removeMistake(m.id)) }
function reviseAll(){ alert(`Revising ${mistakes.value.length} mistakes`) }
</script>
