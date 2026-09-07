<template>
  <div class="absolute bottom-0 left-0 right-0 h-[72px] bg-white/95 backdrop-blur-xl border-t border-[#E5F7E9] flex items-center justify-around px-2 z-30">
    <button v-for="t in tabs" :key="t.id" @click="$emit('change', t.id)"
      class="flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition"
      :class="active === t.id ? 'text-ca-700' : 'text-gray-400'">
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
  { id: 'doubts', label: 'Doubts', icon: '💬' },
  { id: 'profile', label: 'You', icon: '👤' },
]
</script>
