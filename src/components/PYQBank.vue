<template>
  <div class="p-4 pb-24 min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
    <div class="flex justify-between items-start gap-3">
      <div><h2 class="jakarta text-[21px] font-black tracking-tight text-gray-900">ICAI Library 📚</h2><p class="text-[11px] text-gray-500 mt-1">PYQ • RTP • MTP • Suggested Answers — direct from ICAI</p></div>
      <button @click="load" class="w-10 h-10 rounded-xl bg-white border border-indigo-100 text-indigo-700 font-black shadow-sm">↻</button>
    </div>

    <div class="mt-5 bg-white rounded-2xl border border-indigo-100 p-3 shadow-sm space-y-2">
      <input v-model="search" @keyup.enter="load" placeholder="Search subject, attempt, paper..." class="w-full h-11 rounded-xl bg-gray-50 border border-gray-200 px-3 text-[13px] outline-none focus:border-indigo-400" />
      <div class="grid grid-cols-2 gap-2">
        <select v-model="level" @change="load" class="h-10 rounded-xl bg-gray-50 border border-gray-200 px-2 text-[12px] font-bold"><option>All</option><option>Foundation</option><option>Intermediate</option><option>Final</option></select>
        <select v-model="type" @change="load" class="h-10 rounded-xl bg-gray-50 border border-gray-200 px-2 text-[12px] font-bold"><option>All</option><option>PYQ</option><option>RTP</option><option>MTP</option><option>Suggested Answer</option><option>Study Material</option></select>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between"><p class="text-[11px] font-black text-gray-500 uppercase tracking-widest">{{ loading ? 'Fetching ICAI…' : `${items.length} resources` }}</p><span class="text-[9px] font-black px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">OFFICIAL ICAI</span></div>

    <div v-if="error" class="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-[12px] text-red-700 font-semibold">{{ error }}</div>
    <div v-else-if="loading" class="mt-4 space-y-2"><div v-for="i in 5" :key="i" class="h-20 rounded-2xl bg-white border border-gray-100 animate-pulse"></div></div>
    <div v-else-if="!items.length" class="mt-4 p-7 rounded-2xl bg-white border border-gray-100 text-center"><div class="text-3xl">📭</div><p class="font-black mt-2">No matching ICAI files found</p><p class="text-[11px] text-gray-500 mt-1">Try another subject or remove a filter.</p></div>

    <div v-else class="mt-4 space-y-2">
      <article v-for="item in items" :key="item.url" class="bg-white rounded-2xl border border-indigo-100 p-3 shadow-sm">
        <div class="flex gap-3 items-start"><div class="w-10 h-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-lg">{{ icon(item.type) }}</div><div class="min-w-0 flex-1"><p class="text-[12px] font-black text-gray-900 leading-4">{{ item.title }}</p><div class="flex flex-wrap gap-1 mt-2"><span class="tag">{{ item.level }}</span><span class="tag">{{ item.type }}</span><span v-if="item.attempt!=='All attempts'" class="tag">{{ item.attempt }}</span></div></div></div>
        <div class="mt-3 flex gap-2"><a :href="item.url" target="_blank" rel="noopener" class="flex-1 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center text-[11px] font-black">📥 Download PDF</a><a v-if="item.sourcePage" :href="item.sourcePage" target="_blank" rel="noopener" class="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center">↗</a></div>
      </article>
    </div>

    <p class="mt-5 text-[9px] text-gray-400 leading-4">Resources are indexed from ICAI's public website and official resource.cdn.icai.org PDF links. RankerQ does not claim ownership of ICAI material.</p>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const items=ref([]), loading=ref(false), error=ref(''), search=ref(''), level=ref('All'), type=ref('All')
const icon=t=>t==='PYQ'?'📄':t==='RTP'?'🔁':t==='MTP'?'📝':t==='Suggested Answer'?'✅':'📚'
async function load(){
  loading.value=true; error.value=''
  try{ const p=new URLSearchParams({q:search.value,level:level.value,type:type.value}); const r=await fetch(`/api/icai-library?${p}`); const d=await r.json(); if(!r.ok||!d.ok) throw new Error(d.error||'Could not load ICAI resources'); items.value=d.items||[] }
  catch(e){error.value=e.message;items.value=[]} finally{loading.value=false}
}
onMounted(load)
</script>
<style scoped>.tag{font-size:9px;font-weight:800;padding:3px 6px;border-radius:999px;background:#f3f4f6;color:#6b7280;border:1px solid #e5e7eb}</style>
