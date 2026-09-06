<template>
  <div class="ca-card p-5 relative overflow-hidden">
    <div class="absolute top-0 right-0 w-24 h-24 bg-ca-50 rounded-full -mr-12 -mt-12"></div>
    <div class="flex justify-between items-start relative z-10">
      <div><p class="text-[11px] font-bold tracking-widest uppercase text-ca-600">Today's Quiz • {{ quiz.meta }}</p><h3 class="jakarta font-bold text-[16px] mt-1 text-gray-900">{{ quiz.title }}</h3></div>
      <span class="text-[11px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">+{{ quiz.xp }} XP</span>
    </div>
    <div class="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden relative z-10"><div class="h-full bg-ca-600 rounded-full" :style="{width:quiz.progress+'%'}"></div></div>
    <button @click="$emit('start')" class="mt-4 w-full h-11 rounded-xl bg-gray-900 text-white font-semibold text-[13px] hover:bg-black transition relative z-10">Start Quiz →</button>
  </div>
</template>
<script setup> defineProps({ quiz:Object }); defineEmits(['start']) </script>
