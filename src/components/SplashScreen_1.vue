<template>
  <div class="flex-1 flex flex-col items-center justify-between bg-gradient-to-b from-ca-50 to-white p-8 min-h-screen cursor-pointer" @click="$emit('finished')">
    <div class="flex-1 flex flex-col items-center justify-center">
      <!-- Logo -->
      <div class="w-24 h-24 rounded-[22px] bg-ca-600 shadow-green flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <span class="jakarta text-white font-bold text-[36px] tracking-tight relative z-10">CA</span>
      </div>
      <h1 class="jakarta mt-6 text-[26px] font-bold text-ca-800 tracking-tight">CA Series</h1>
      <p class="mt-2 text-[13px] font-medium text-ca-700/70 tracking-[0.2em] uppercase">Crack CA with Confidence</p>
      
      <!-- Loader -->
      <div class="mt-10 flex gap-2">
        <span class="w-2 h-2 rounded-full bg-ca-600 animate-bounce"></span>
        <span class="w-2 h-2 rounded-full bg-ca-600 animate-bounce [animation-delay:0.15s]"></span>
        <span class="w-2 h-2 rounded-full bg-ca-600 animate-bounce [animation-delay:0.3s]"></span>
      </div>
      <p class="mt-6 text-[12px] text-gray-400">Tap to continue</p>
    </div>
    <p class="text-[11px] text-gray-400 font-medium tracking-wide">Powered by ICAI Aspirants • Telegram Mini App</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
const emit = defineEmits(['finished'])
onMounted(() => {
  setTimeout(() => emit('finished'), 2500)
})
</script>
