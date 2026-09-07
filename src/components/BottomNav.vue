<template>
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[72px] bg-white/95 backdrop-blur-xl border-t border-[#E5F7E9] flex items-center justify-around px-1 z-30 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
    <button v-for="t in tabs" :key="t.id" @click="$emit('change',t.id)" class="flex flex-col items-center gap-1 py-2 px-2 rounded-xl transition active:scale-95 relative" :class="active===t.id?'text-ca-700 bg-ca-50':'text-gray-400 hover:text-gray-600'">
      <span class="text-[18px] transition relative" :class="active===t.id?'scale-110':''">
        {{ t.icon }}
        <span v-if="t.badge" class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">{{ t.badge }}</span>
        <span v-if="t.id==='ai-quiz'" class="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
      </span>
      <span class="text-[9px] font-bold tracking-widest uppercase leading-none" :class="active===t.id?'text-ca-700':''">{{ t.label }}</span>
      <div v-if="active===t.id" class="w-1 h-1 rounded-full bg-ca-600 mt-0.5"></div>
    </button>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
defineProps({ active:String })
defineEmits(['change'])
const store=useUserStore()
const tabs=computed(()=>[
  { id:'home', label:'Home', icon:'🏠' },
  { id:'resources', label:'Resources', icon:'📚' },
  { id:'ai-quiz', label:'AI Quiz', icon:'✨' },
  { id:'bookmarks', label:'Saved', icon:'🔖', badge: store.mistakeCount.value>0?store.mistakeCount.value:null },
  { id:'profile', label:'You', icon:'👤' },
])
</script>
