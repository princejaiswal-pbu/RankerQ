<template>
  <div class="ca-card overflow-hidden hover:shadow-card-hover transition-all duration-300">
    <div class="h-1 w-full bg-gradient-to-r from-ca-500 to-ca-700"></div>
    <div class="p-5">
      <div class="flex justify-between items-start">
        <div class="flex gap-3">
          <div class="w-11 h-11 rounded-xl bg-ca-50 border border-ca-100 flex items-center justify-center text-lg">📝</div>
          <div>
            <p class="text-[11px] font-bold tracking-widest uppercase text-ca-700">Today's Quiz • Live</p>
            <h3 class="jakarta font-bold text-[16px] text-gray-900 mt-0.5">{{ quiz.title }}</h3>
            <p class="text-[12px] text-gray-500 mt-1">{{ quiz.meta }}</p>
          </div>
        </div>
        <span class="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">+{{ quiz.xp }} XP</span>
      </div>

      <div class="mt-4">
        <div class="flex justify-between text-[11px] font-semibold text-gray-500 mb-1.5">
          <span>Progress</span><span class="text-ca-700">60% completed</span>
        </div>
        <div class="h-2 rounded-full bg-ca-50 overflow-hidden">
          <div class="h-full w-[60%] bg-ca-600 rounded-full transition-all duration-700"></div>
        </div>
      </div>

      <button @click="$emit('start')" class="mt-4 w-full h-[44px] rounded-xl bg-ca-600 text-white font-semibold text-[14px] jakarta shadow-green active:scale-[0.98] transition">
        {{ quiz.progress > 0 ? 'Continue Quiz →' : 'Start Now →' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  quiz: {
    type: Object,
    default: () => ({ title: 'Business Laws - Contracts', meta: '15 Qs • 20 mins', xp: 150, progress: 60 })
  }
})
defineEmits(['start'])
</script>
