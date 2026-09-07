<template>
  <div class="p-4 pb-28 bg-gradient-to-b from-indigo-50/50 to-white min-h-screen">
    <div class="flex justify-between items-center">
      <div><h2 class="jakarta text-[20px] font-black tracking-tight">Resources Hub 📦</h2><p class="text-[11px] text-gray-500 font-medium mt-0.5">RTP • MTP • PYQ • All Attempts • Auto</p></div>
      <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow">● Live</span>
    </div>

    <div class="mt-4 bg-white rounded-[16px] border border-indigo-100 p-3 flex items-center justify-between shadow-sm">
      <div class="flex gap-3"><div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black">📚</div><div><p class="text-[13px] font-black">1,248 Papers • All Subjects</p><p class="text-[10px] text-gray-500">Updated Today 6:12 AM • ICAI Official</p></div></div>
      <span class="text-[10px] font-black px-2 py-1 rounded-full bg-green-50 text-green-700 border">✓ Verified</span>
    </div>

    <div class="mt-5 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button v-for="type in types" :key="type.id" @click="selectedType=type.id" :class="selectedType===type.id?'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow border-indigo-600':'bg-white border border-indigo-100 text-gray-600'" class="whitespace-nowrap px-4 py-2.5 rounded-full text-[12px] font-black border flex items-center gap-1.5">
        {{ type.icon }} {{ type.label }} <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">{{ type.count }}</span>
      </button>
    </div>

    <div class="mt-4 bg-white rounded-[16px] border border-indigo-100 p-3 shadow-sm">
      <div class="grid grid-cols-3 gap-2">
        <select v-model="filters.level" class="h-9 px-2.5 rounded-lg bg-[#F8F9FF] border border-indigo-100 text-[11px] font-bold"><option value="all">All Levels</option><option value="Foundation">Foundation</option><option value="Intermediate">Intermediate</option><option value="Final">Final</option></select>
        <select v-model="filters.subject" class="h-9 px-2.5 rounded-lg bg-[#F8F9FF] border border-indigo-100 text-[11px] font-bold"><option value="all">All Subjects</option><option v-for="s in subjects" :key="s" :value="s">{{ s }}</option></select>
        <select v-model="filters.attempt" class="h-9 px-2.5 rounded-lg bg-[#F8F9FF] border border-indigo-100 text-[11px] font-bold"><option value="all">All Attempts</option><option v-for="a in attempts" :key="a" :value="a">{{ a }}</option></select>
      </div>
      <div class="mt-3 flex gap-2"><div class="flex-1 relative"><span class="absolute left-3 top-[9px] text-gray-400 text-[12px]">🔍</span><input v-model="search" placeholder="Search: Law May 2024 RTP..." class="w-full h-9 pl-8 pr-3 rounded-lg bg-[#F8F9FF] border border-indigo-100 text-[11px] font-medium" /></div><button @click="filters={level:'all',subject:'all',attempt:'all'};search=''" class="h-9 px-3 rounded-lg bg-gray-100 border text-[11px] font-bold">Reset</button></div>
    </div>

    <div class="mt-4 p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center"><div class="flex gap-2.5 items-center"><div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">🤖</div><div><p class="text-[12px] font-black">Auto-Sync Active • Gemini AI</p><p class="text-[10px] opacity-80">Scrapes ICAI daily • Telegram alert</p></div></div><span class="text-[10px] font-black px-2 py-1 rounded-full bg-white text-indigo-600">LIVE</span></div>

    <div class="mt-5 space-y-3">
      <div v-for="res in filteredResources" :key="res.id" class="bg-white rounded-[16px] border border-indigo-100 shadow-sm p-4">
        <div class="flex justify-between gap-2"><div class="flex gap-2.5 flex-1"><div class="w-11 h-11 rounded-xl flex items-center justify-center text-[20px] border" :class="res.type==='PYQ'?'bg-green-50 border-green-100':res.type==='RTP'?'bg-blue-50 border-blue-100':'bg-purple-50 border-purple-100'">{{ res.type==='PYQ'?'📝':res.type==='RTP'?'📘':'📙' }}</div><div class="flex-1"><div class="flex gap-1.5 flex-wrap"><span class="text-[10px] font-black px-2 py-0.5 rounded-full text-white" :class="res.type==='PYQ'?'bg-green-600':res.type==='RTP'?'bg-blue-600':'bg-purple-600'">{{ res.type }}</span><span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-900 text-white">{{ res.attempt }}</span><span v-if="res.isLatest" class="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-yellow-400 text-black">NEW</span></div><h3 class="text-[13px] font-bold mt-1.5 leading-4">{{ res.title }}</h3><p class="text-[11px] text-gray-500 mt-1">{{ res.subject }} • {{ res.level }} • {{ res.pages?res.pages+' Pages':res.marks+' Marks' }}</p></div></div><button @click="toggleBookmarkRes(res)" :class="isBookmarked(res.id)?'bg-yellow-400 text-black':'bg-white border'" class="w-8 h-8 rounded-full border flex items-center justify-center">{{ isBookmarked(res.id)?'⭐':'☆' }}</button></div>
        <div class="mt-3 flex gap-2"><button @click="viewPdf(res)" class="flex-1 h-9 rounded-xl bg-gray-900 text-white font-bold text-[11px]">👁️ View</button><button @click="downloadPdf(res)" class="flex-1 h-9 rounded-xl bg-white border-2 border-indigo-100 text-indigo-700 font-bold text-[11px]">⬇️ Download</button></div>
      </div>
    </div>

    <div v-if="selectedPdf" class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="selectedPdf=null">
      <div class="w-full max-w-[380px] bg-white rounded-[20px] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"><div class="p-4 border-b flex justify-between"><p class="text-[13px] font-black">{{ selectedPdf.title }}</p><button @click="selectedPdf=null" class="w-8 h-8 rounded-full bg-gray-100">✕</button></div><div class="flex-1 bg-gray-50 p-4 text-center"><div class="w-full h-[300px] bg-white border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6"><div class="text-3xl">📄</div><p class="mt-2 font-bold">PDF Preview</p><a :href="selectedPdf.pdfUrl" target="_blank" class="mt-3 px-4 py-2 rounded-full bg-indigo-600 text-white text-[12px] font-bold">Open Official PDF →</a></div></div></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const store=useUserStore()
const selectedType=ref('all'), search=ref(''), selectedPdf=ref(null)
const filters=ref({ level:'all', subject:'all', attempt:'all' })
const types=ref([{ id:'all', label:'All', icon:'📦', count:1248 },{ id:'PYQ', label:'PYQ', icon:'📝', count:642 },{ id:'RTP', label:'RTP', icon:'📘', count:312 },{ id:'MTP', label:'MTP', icon:'📙', count:294 }])
const subjects=['Business Laws','Accounting','Business Mathematics','Business Economics']
const attempts=['May 2025','Jan 2025','Nov 2024','May 2024','Nov 2023','May 2023']
const resources=ref([
  { id:1, type:'RTP', level:'Foundation', subject:'Business Laws', title:'RTP May 2025 - Business Laws (Latest)', attempt:'May 2025', pages:'42', isLatest:true, isOfficial:true, pdfUrl:'https://www.icai.org/post/rtp-may-2025-foundation-law', timesAsked:0 },
  { id:2, type:'MTP', level:'Foundation', subject:'Business Laws', title:'MTP Series II May 2025 - Business Laws - With Answers', attempt:'May 2025', pages:'38', isLatest:true, isOfficial:true, pdfUrl:'https://boslive.icai.org/', timesAsked:0 },
  { id:3, type:'PYQ', level:'Foundation', subject:'Business Laws', title:'PYQ Nov 2024 - Contracts - Void vs Voidable (4 Marks)', attempt:'Nov 2024', marks:4, isLatest:false, isOfficial:true, pdfUrl:'https://www.icai.org/post/pyq-nov-2024', timesAsked:3 },
  { id:4, type:'RTP', level:'Intermediate', subject:'Corporate Laws', title:'RTP May 2025 - Corporate Laws', attempt:'May 2025', pages:'56', isLatest:true, isOfficial:true, pdfUrl:'https://www.icai.org/post/rtp-may-2025-inter', timesAsked:0 },
  { id:5, type:'PYQ', level:'Foundation', subject:'Accounting', title:'PYQ May 2024 - Final Accounts (10 Marks) - Repeated 5x', attempt:'May 2024', marks:10, isLatest:false, isOfficial:true, pdfUrl:'https://www.icai.org/post/pyq-may-2024', timesAsked:5 },
])
const filteredResources=computed(()=>resources.value.filter(r=>{
  if(selectedType.value!=='all' && r.type!==selectedType.value) return false
  if(filters.value.level!=='all' && r.level!==filters.value.level) return false
  if(filters.value.subject!=='all' && r.subject!==filters.value.subject) return false
  if(filters.value.attempt!=='all' && r.attempt!==filters.value.attempt) return false
  if(search.value && !`${r.title} ${r.subject} ${r.attempt}`.toLowerCase().includes(search.value.toLowerCase())) return false
  return true
}))
function isBookmarked(id){ return store.bookmarks.value.some(b=>b.id===`res-${id}`) }
function toggleBookmarkRes(res){ const id=`res-${res.id}`; if(isBookmarked(res.id)) store.removeBookmark(id); else store.addBookmark({ id, question:res.title, subject:res.subject, type:res.type, attempt:res.attempt, pdfUrl:res.pdfUrl }) }
function viewPdf(res){ selectedPdf.value=res }
function downloadPdf(res){ if(window.Telegram?.WebApp?.openLink) window.Telegram.WebApp.openLink(res.pdfUrl); else window.open(res.pdfUrl,'_blank') }
</script>
