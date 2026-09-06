<template>
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[72px] bg-white/95 backdrop-blur-xl border-t border-[#E5F7E9] flex items-center justify-around px-2 z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
    <button v-for="t in tabs" :key="t.id" @click="$emit('change', t.id)"
      class="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition active:scale-95"
      :class="active === t.id ? 'text-ca-700 bg-ca-50' : 'text-gray-400 hover:text-gray-600'">
      <span class="text-[18px] transition" :class="active === t.id ? 'scale-110' : ''">{{ t.icon }}</span>
      <span class="text-[10px] font-bold tracking-widest uppercase" :class="active === t.id ? 'text-ca-700' : ''">{{ t.label }}</span>
      <div v-if="active === t.id" class="w-1 h-1 rounded-full bg-ca-600 mt-0.5"></div>
    </button>
  </div>
</template>

<script setup>
defineProps({ active: String })
defineEmits(['change'])
const tabs = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'leaderboard', label: 'Rank', icon: '🏆' },
  { id: 'profile', label: 'You', icon: '👤' },
]
</script>
