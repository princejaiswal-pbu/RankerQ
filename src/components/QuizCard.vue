<template>
  <div class="bg-white rounded-[20px] border border-indigo-100 shadow-[0_8px_24px_rgba(79,70,229,0.08)] p-5 relative overflow-hidden group hover:shadow-[0_12px_32px_rgba(79,70,229,0.12)] transition-all">
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-500 to-yellow-400"></div>
    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition"></div>
    <div class="flex justify-between items-start relative z-10">
      <div><p class="text-[10px] font-black tracking-widest uppercase text-indigo-600 flex items-center gap-1">🎯 Daily Quest • {{ quiz.meta }}</p><h3 class="jakarta font-black text-[16px] mt-1.5 text-gray-900 tracking-tight">{{ quiz.title }}</h3><p class="text-[11px] text-gray-500 mt-1">Lvl {{ Math.floor(Math.random()*3)+1 }} • Timer • Bookmark</p></div>
      <span class="text-[11px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow">+{{ quiz.xp }} XP</span>
    </div>
    <div class="mt-4 h-2.5 bg-gray-100 rounded-full overflow-hidden p-1 flex gap-1 relative z-10"><div class="flex-1 h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" :style="{width:quiz.progress+'%'}"></div><div class="flex-1 h-full bg-gray-200 rounded-full"></div></div>
    <div class="mt-1 flex justify-between text-[10px] font-bold text-gray-400"><span>{{ quiz.progress }}% • Game Mode</span><span>⏱️ 60s/Q • 🔖 Save</span></div>
    <button @click="$emit('start')" class="mt-4 w-full h-11 rounded-xl bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 text-white font-black text-[13px] hover:from-black hover:to-indigo-900 transition relative z-10 shadow-[0_4px_16px_rgba(0,0,0,0.2)] tracking-wide">▶️ Play Quest → +{{ quiz.xp }} XP</button>
  </div>
</template>
<script setup> defineProps({ quiz:Object }); defineEmits(['start']) </script>
