<template>
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] h-[78px] bg-white/95 backdrop-blur-xl border-t border-indigo-100 flex items-center justify-around px-1 z-30 shadow-[0_-8px_32px_rgba(79,70,229,0.12)]">
    <button v-for="t in tabs" :key="t.id" @click="$emit('change',t.id)" class="flex flex-col items-center gap-1 py-2 px-2.5 rounded-xl transition active:scale-95 relative" :class="active===t.id?'text-indigo-600 bg-gradient-to-b from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm':'text-gray-400 hover:text-gray-600'">
      <span class="text-[20px] transition relative" :class="active===t.id?'scale-110':''">
        {{ t.icon }}
        <span v-if="t.badge" class="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow">{{ t.badge }}</span>
      </span>
      <span class="text-[9px] font-black tracking-widest uppercase leading-none" :class="active===t.id?'text-indigo-700':''">{{ t.label }}</span>
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
  { id:'home', label:'Home', icon:'🎮' },
  { id:'resources', label:'Resources', icon:'📦' },
  { id:'ai-quiz', label:'AI Quiz', icon:'✨' },
  { id:'bookmarks', label:'Saved', icon:'🔖', badge: store.bookmarkCount.value>0?store.bookmarkCount.value:null },
  { id:'profile', label:'You', icon:'👤' },
])
</script>
