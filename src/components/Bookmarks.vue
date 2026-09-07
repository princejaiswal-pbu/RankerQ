<template>
  <div class="p-4 pb-28 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
    <div class="flex justify-between items-center"><h2 class="jakarta text-[20px] font-black tracking-tight">Saved Quests 🔖</h2><span class="text-[11px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black">{{ bookmarks.length }} saved</span></div>

    <div v-if="bookmarks.length>0" class="mt-5 rounded-[20px] bg-gradient-to-br from-amber-400 to-orange-500 p-[1.5px] shadow-[0_8px_24px_rgba(251,146,60,0.2)]"><div class="rounded-[19px] bg-white p-5"><div class="flex justify-between items-center"><div><p class="text-[11px] font-black tracking-widest uppercase text-amber-600">Game Boost • Revision</p><h3 class="jakarta font-black text-[18px] mt-1">{{ bookmarks.length }} bookmarked</h3><p class="text-[13px] text-gray-600 mt-1">Revise in {{ Math.ceil(bookmarks.length*0.5) }} mins • +{{ bookmarks.length*10 }} XP bonus</p></div><div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl text-white shadow">⭐</div></div><div class="mt-4 grid grid-cols-2 gap-2"><button @click="reviseAll" class="h-11 rounded-xl bg-gray-900 text-white font-black text-[13px]">Revise All →</button><button @click="clearAll" class="h-11 rounded-xl bg-white border-2 border-gray-200 text-gray-700 font-bold text-[13px]">Clear All</button></div></div></div>

    <div v-else class="mt-12 text-center"><div class="w-20 h-20 rounded-[20px] bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center mx-auto text-3xl">🔖</div><h3 class="jakarta font-black text-[18px] mt-4">No saved quests yet!</h3><p class="text-[13px] text-gray-500 mt-2 leading-5">Tap ⭐ on any question during quiz<br/>to save for later revision + XP bonus</p><div class="mt-5 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-left max-w-[300px] mx-auto"><p class="text-[11px] font-black text-indigo-700">💡 Pro Tip</p><p class="text-[11px] text-gray-600 mt-1">Bookmark tough questions → revise daily → level up faster! Game mode rewards revision.</p></div></div>

    <div class="mt-5 space-y-3">
      <div v-for="b in bookmarks" :key="b.id" class="bg-white rounded-[16px] border border-indigo-100 shadow-sm p-4 hover:shadow-md transition">
        <div class="flex justify-between gap-2"><span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-gray-900 text-white">{{ b.subject || 'Gemini' }} • {{ b.chapter || b.topic?.slice(0,15) || 'General' }}</span><span class="text-[10px] font-black px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">⭐ Saved</span></div>
        <p class="text-[13px] font-bold text-gray-900 mt-3 leading-5">{{ b.question }}</p>
        <div v-if="b.options" class="mt-3 space-y-1.5"><div v-for="(opt,i) in b.options.slice(0,2)" :key="i" class="text-[11px] p-2 rounded-lg bg-gray-50 border text-gray-600">{{ String.fromCharCode(65+i) }}. {{ opt.slice(0,60) }}...</div></div>
        <div class="mt-3 flex gap-2"><button @click="remove(b.id)" class="flex-1 h-9 rounded-lg bg-white border-2 border-gray-200 text-gray-600 font-bold text-[11px]">Remove 🗑️</button><button @click="share(b)" class="flex-1 h-9 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-[11px]">Share ↗️</button></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const store=useUserStore()
const bookmarks=computed(()=>store.bookmarks.value)
function remove(id){ store.removeBookmark(id) }
function clearAll(){ if(confirm('Clear all bookmarks?')){ store.bookmarks.value.forEach(b=>store.removeBookmark(b.id)) } }
function reviseAll(){ alert(`Revising ${bookmarks.value.length} saved quests - Starting game!`) }
function share(b){ const text=`🔖 Saved Quest: ${b.question.slice(0,60)}... - RankerQ by PP`; if(navigator.clipboard) navigator.clipboard.writeText(text); alert('Copied!') }
</script>
