<template>
  <div class="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center p-8 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-64 h-64 bg-ca-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
    <div class="absolute bottom-0 left-0 w-80 h-80 bg-ca-100 rounded-full -ml-40 -mb-40 opacity-30"></div>
    <div class="w-20 h-20 rounded-[20px] bg-ca-600 flex items-center justify-center text-white font-bold text-2xl shadow-green jakarta relative z-10 animate-pulse">CA</div>
    <h1 class="jakarta font-bold text-[24px] mt-6 text-gray-900 relative z-10">CA Series</h1>
    <p class="text-[13px] text-gray-500 mt-2 relative z-10">Crack CA with AI + PYQ + Streaks</p>
    <div class="mt-10 w-8 h-8 border-4 border-ca-100 border-t-ca-600 rounded-full animate-spin"></div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
const emit=defineEmits(['finished'])
onMounted(()=>{ setTimeout(()=>emit('finished'),2500) })
</script>
