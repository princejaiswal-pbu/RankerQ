<template>
  <div class="p-4 pb-28 min-h-full bg-gradient-to-b from-indigo-50/50 to-white">
    <div class="flex justify-between items-center gap-3">
      <div>
        <h2 class="jakarta text-[20px] font-black tracking-tight">ICAI Resource Hub 📚</h2>
        <p class="text-[11px] text-gray-500 mt-1">One place for official ICAI exam resources</p>
      </div>
      <span class="text-[10px] font-black px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">OFFICIAL</span>
    </div>

    <div class="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-[11px] text-indigo-800 leading-4">
      ICAI's BoS Knowledge Portal hosts study material, RTPs, MTPs, suggested answers and previous-attempt question papers. This hub gives students one-tap access instead of making them hunt across the web.
    </div>

    <div class="mt-4 grid grid-cols-3 gap-2">
      <button v-for="level in levels" :key="level" @click="selectedLevel=level"
        :class="selectedLevel===level ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200'"
        class="h-10 rounded-xl text-[11px] font-black">{{ level }}</button>
    </div>

    <div class="mt-4 space-y-3">
      <div v-for="item in filteredResources" :key="item.id" class="bg-white rounded-[18px] border border-indigo-100 p-4 shadow-sm">
        <div class="flex gap-3">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center text-xl" :class="item.bg">{{ item.icon }}</div>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] font-black uppercase tracking-widest" :class="item.color">{{ item.type }}</p>
            <h3 class="jakarta text-[14px] font-black text-gray-900 mt-0.5">{{ item.title }}</h3>
            <p class="text-[11px] text-gray-500 mt-1 leading-4">{{ item.description }}</p>
            <button @click="openOfficial(item.url)" class="mt-3 h-10 px-4 rounded-xl bg-gray-900 text-white text-[11px] font-black">
              Open Official ICAI ↗
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-5 rounded-[18px] bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white">
      <p class="text-[10px] font-black tracking-widest uppercase text-white/70">Latest coverage</p>
      <h3 class="jakarta font-black text-[15px] mt-1">September / November 2026</h3>
      <p class="text-[11px] text-white/80 mt-1 leading-4">The official ICAI portal is the source of truth for newly published RTPs, MTPs, papers and suggested answers.</p>
      <button @click="openOfficial('https://boslive.icai.org/')" class="mt-3 h-10 px-4 rounded-xl bg-white text-indigo-700 text-[11px] font-black">Open BoS Knowledge Portal ↗</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const levels = ['All','Foundation','Intermediate','Final']
const selectedLevel = ref('All')
const resources = [
  {id:'pyq',type:'PYQ',title:'Previous Year Question Papers',description:'Foundation, Intermediate and Final question papers from previous attempts.',icon:'📝',bg:'bg-indigo-50',color:'text-indigo-700',level:'All',url:'https://www.icai.org/post/question-papers-new-scheme-of-education-and-training'},
  {id:'rtp-f',type:'RTP',title:'Revision Test Papers',description:'Official ICAI RTP repository. Filter by course, paper and attempt on the portal.',icon:'📚',bg:'bg-amber-50',color:'text-amber-700',level:'Foundation',url:'https://boslive.icai.org/'},
  {id:'rtp-i',type:'RTP',title:'Revision Test Papers',description:'Official ICAI RTP repository for Intermediate papers and attempts.',icon:'📚',bg:'bg-amber-50',color:'text-amber-700',level:'Intermediate',url:'https://boslive.icai.org/'},
  {id:'rtp-fn',type:'RTP',title:'Revision Test Papers',description:'Official ICAI RTP repository for Final papers and attempts.',icon:'📚',bg:'bg-amber-50',color:'text-amber-700',level:'Final',url:'https://boslive.icai.org/'},
  {id:'mtp',type:'MTP',title:'Mock Test Papers',description:'Official ICAI mock-test papers and series for exam preparation.',icon:'🎯',bg:'bg-purple-50',color:'text-purple-700',level:'All',url:'https://boslive.icai.org/'},
  {id:'answers',type:'Answers',title:'Suggested Answers',description:'Official suggested answers for checking and learning ICAI presentation.',icon:'✅',bg:'bg-green-50',color:'text-green-700',level:'All',url:'https://boslive.icai.org/'},
  {id:'study',type:'Study Material',title:'Study Material & Amendments',description:'Official ICAI study material, amendments and related student resources.',icon:'📖',bg:'bg-blue-50',color:'text-blue-700',level:'All',url:'https://boslive.icai.org/'}
]
const filteredResources = computed(() => selectedLevel.value === 'All' ? resources : resources.filter(r => r.level === 'All' || r.level === selectedLevel.value))
function openOfficial(url) {
  if (window.Telegram?.WebApp?.openLink) window.Telegram.WebApp.openLink(url)
  else window.open(url, '_blank', 'noopener,noreferrer')
}
</script>
