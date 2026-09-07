<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex flex-col items-center justify-center p-8 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/20 rounded-full -ml-40 -mb-40 blur-3xl"></div>
    <div class="w-24 h-24 rounded-[24px] bg-white flex items-center justify-center text-indigo-600 font-black text-3xl shadow-[0_12px_32px_rgba(0,0,0,0.2)] jakarta relative z-10 animate-bounce">RQ</div>
    <h1 class="jakarta font-black text-[28px] mt-6 text-white relative z-10 tracking-tight">RankerQ <span class="font-bold text-white/80 text-[18px]">by PP</span></h1>
    <p class="text-[13px] text-white/70 mt-2 relative z-10 font-medium tracking-widest uppercase">Level Up Your Rank 🎮</p>
    <div class="mt-8 flex gap-2"><div class="w-2 h-2 rounded-full bg-white/50 animate-pulse"></div><div class="w-2 h-2 rounded-full bg-white/80 animate-pulse delay-150"></div><div class="w-2 h-2 rounded-full bg-white animate-pulse delay-300"></div></div>
    <p class="mt-10 text-[11px] text-white/50 font-bold tracking-widest uppercase">Powered by Gemini AI</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
const emit=defineEmits(['finished'])
onMounted(()=>{ setTimeout(()=>emit('finished'),2200) })
</script>
