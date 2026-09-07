<template>
  <div class="h-[62px] px-4 flex items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 border-b border-indigo-500/30 shrink-0 sticky top-0 z-20 shadow-[0_4px_20px_rgba(79,70,229,0.3)]">
    <div class="flex items-center gap-2.5">
      <div class="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-indigo-600 font-black jakarta text-[14px] shadow-lg">RQ</div>
      <div>
        <span class="jakarta font-black text-[15px] text-white tracking-tight">RankerQ</span><span class="jakarta font-bold text-[11px] text-white/70 ml-1">by PP</span>
        <div class="flex items-center gap-1.5 -mt-0.5"><span class="text-[9px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-bold uppercase tracking-widest">Lvl {{ currentLevel }}</span><div class="w-12 h-1 bg-white/20 rounded-full overflow-hidden"><div class="h-full bg-yellow-300 rounded-full" :style="{width: levelProgress+'%'}"></div></div></div>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div class="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold"><span>⚡</span>{{ xp }} XP</div>
      <button @click="showNotifications=!showNotifications" class="relative w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-[16px] hover:bg-white/25 transition active:scale-95 backdrop-blur">
        🔔
        <span v-if="unreadCount>0" class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[10px] font-black rounded-full flex items-center justify-center border-2 border-indigo-600 animate-pulse">{{ unreadCount>9?'9+':unreadCount }}</span>
      </button>
    </div>

    <div v-if="showNotifications" class="fixed inset-0 z-50" @click="showNotifications=false">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div class="absolute top-[68px] right-3 left-3 max-w-[360px] ml-auto bg-white rounded-[20px] shadow-2xl border border-indigo-100 overflow-hidden max-h-[70vh] flex flex-col" @click.stop>
        <div class="p-4 border-b border-indigo-50 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 class="jakarta font-black text-[15px]">Quests 🎮</h3>
          <div class="flex gap-2"><button v-if="unreadCount>0" @click="markAllRead" class="text-[11px] font-bold text-indigo-600">Mark read</button><button @click="showNotifications=false" class="w-7 h-7 rounded-full bg-white border flex items-center justify-center">✕</button></div>
        </div>
        <div class="overflow-y-auto flex-1"><div v-for="n in notifications" :key="n.id" @click="readOne(n.id)" class="p-4 border-b last:border-0 hover:bg-indigo-50/50 cursor-pointer flex gap-3" :class="{'bg-indigo-50':!n.read}"><div class="w-9 h-9 rounded-full bg-white border flex items-center justify-center text-sm shrink-0">{{ n.icon }}</div><div class="flex-1"><p class="text-[13px] font-bold">{{ n.title }}</p><p class="text-[12px] text-gray-500 mt-1">{{ n.desc }}</p><p class="text-[10px] text-gray-400 mt-1">{{ n.time }}</p></div></div></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
defineProps({ user:Object })
const store=useUserStore()
const showNotifications=ref(false)
const notifications=computed(()=>store.notifications.value)
const unreadCount=computed(()=>store.unreadCount.value)
const xp=computed(()=>store.xp.value)
const currentLevel=computed(()=>store.currentLevel.value)
const levelProgress=computed(()=>store.levelProgress.value)
function markAllRead(){ store.markAllNotificationsRead() }
function readOne(id){ store.markNotificationRead(id) }
</script>
