<template>
  <div class="p-0 pb-10">
    <div class="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-6 pb-10 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-xl"></div>
      <div class="absolute bottom-0 left-0 w-60 h-60 bg-purple-400/20 rounded-full -ml-32 -mb-32 blur-2xl"></div>
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-16 h-16 rounded-[18px] bg-white text-indigo-600 flex items-center justify-center font-black text-xl jakarta shadow-[0_8px_24px_rgba(0,0,0,0.2)]">{{ user.name[0]?.toUpperCase() }}</div>
        <div class="flex-1"><p class="jakarta font-black text-[18px] tracking-tight">{{ user.name }}</p><p class="text-[12px] opacity-80 mt-0.5">{{ user.level }} • ID: RQ{{ user.id }}</p><div class="mt-2 flex items-center gap-2"><span class="text-[10px] bg-white/20 px-2 py-1 rounded-full font-black tracking-widest uppercase backdrop-blur">Lvl {{ currentLevel }} • {{ xp }} XP</span><div class="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full" :style="{width: levelProgress+'%'}"></div></div></div></div>
        <button @click="openEdit" class="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition border border-white/20">✏️</button>
      </div>
    </div>
    <div class="-mt-6 px-5 relative z-10">
      <div class="bg-white rounded-[20px] border border-indigo-100 shadow-[0_8px_32px_rgba(79,70,229,0.12)] p-4 grid grid-cols-3 divide-x divide-indigo-50 text-center">
        <div><p class="jakarta font-black text-[18px]">{{ quizzesDone }}</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-black mt-1">Quests</p></div>
        <div><p class="jakarta font-black text-[18px]">{{ accuracy }}%</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-black mt-1">Win Rate</p></div>
        <div><p class="jakarta font-black text-[18px]">{{ bookmarks }}</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-black mt-1">Saved</p></div>
      </div>

      <div class="mt-5 bg-white rounded-[20px] border border-indigo-100 shadow-sm p-4">
        <h3 class="jakarta font-black text-[14px] text-gray-900 flex items-center gap-2">⚙️ Settings</h3>
        <button @click="openEdit" class="mt-3 w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:from-indigo-100 hover:to-purple-100 transition text-left">
          <span class="flex items-center gap-3"><span class="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center text-sm">✏️</span><div><p class="text-[13px] font-bold text-gray-900">Edit Profile</p><p class="text-[11px] text-gray-500">Name, Level & API Key</p></div></span><span class="text-gray-400">›</span>
        </button>
        <button @click="openApiKeyEdit" class="mt-2 w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-white border border-indigo-100 hover:bg-indigo-50 transition text-left">
          <span class="flex items-center gap-3"><span class="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm">🔑</span><div><p class="text-[13px] font-bold text-gray-900">Gemini API Key</p><p class="text-[11px] text-gray-500">{{ hasApiKey ? '✓ Configured • Fresh quizzes enabled' : 'Not set • Using mock quizzes' }}</p></div></span><span class="text-gray-400">›</span>
        </button>
      </div>

      <div class="mt-5 bg-white rounded-[20px] border border-indigo-100 p-4 bg-gradient-to-br from-[#0A66C2]/5 to-[#0A66C2]/10">
        <h3 class="jakarta font-black text-[14px] text-gray-900 flex items-center gap-2"><span class="w-6 h-6 rounded bg-[#0A66C2] text-white flex items-center justify-center text-[12px] font-black">in</span>Follow Creator</h3>
        <p class="text-[12px] text-gray-600 mt-2 leading-4">Get CA tips from PP • RankerQ creator</p>
        <a href="https://www.linkedin.com/in/prince-jaiswal-ca" target="_blank" @click="openLinkedIn" class="mt-3 w-full h-11 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center gap-2 font-bold text-[13px] hover:bg-[#004182] transition shadow">🔗 Follow on LinkedIn</a>
      </div>

      <div class="mt-5 bg-white rounded-[20px] border border-indigo-100 p-4">
        <h3 class="jakarta font-black text-[14px]">Streak League • Gold 🎮</h3>
        <div class="mt-3 p-3 rounded-xl bg-gray-900 text-white flex justify-between items-center"><div><p class="text-[13px] font-bold">You • #{{ rank }} • {{ streak }}🔥 • Lvl {{ currentLevel }}</p><p class="text-[11px] opacity-70">{{ xp }} XP • Top {{ rankPercent }}%</p></div><span class="text-[10px] bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-2 py-1 rounded-full font-black">CHAMPION</span></div>
      </div>

      <button @click="handleLogout" class="mt-5 w-full h-[44px] rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-[13px] hover:bg-red-100 transition">Clear Data & Reset Game</button>
      <p class="mt-3 text-center text-[11px] text-gray-400">RankerQ by PP v2.0 • {{ streak }} day streak • Gemini AI • Level {{ currentLevel }}</p>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEdit" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" @click.self="showEdit=false">
      <div class="w-full max-w-[360px] bg-white rounded-[24px] shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        <div class="p-5 border-b border-indigo-50 flex justify-between items-center sticky top-0 bg-white"><h3 class="jakarta font-black text-[16px]">Edit Profile 🎮</h3><button @click="showEdit=false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✕</button></div>
        <div class="p-5">
          <label class="text-[11px] font-black tracking-widest uppercase text-gray-400">Full Name</label>
          <input v-model="editForm.name" placeholder="Your name" class="mt-2 w-full h-[48px] px-4 rounded-xl bg-[#F8F9FF] border border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-[15px] font-medium" />
          <label class="mt-4 block text-[11px] font-black tracking-widest uppercase text-gray-400">CA Level</label>
          <div class="mt-2 grid grid-cols-2 gap-2"><button @click="editForm.level='Foundation'" :class="editForm.level==='Foundation'?'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600':'bg-white border-indigo-100 text-gray-700'" class="h-12 rounded-xl border font-bold text-[13px] transition">Foundation</button><button @click="editForm.level='Intermediate'" :class="editForm.level==='Intermediate'?'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600':'bg-white border-indigo-100 text-gray-700'" class="h-12 rounded-xl border font-bold text-[13px] transition">Intermediate</button></div>
          
          <label class="mt-5 block text-[11px] font-black tracking-widest uppercase text-gray-400">Gemini API Key 🔑</label>
          <div class="mt-2 relative">
            <input v-model="editForm.apiKey" :type="showApiKey?'text':'password'" placeholder="AIza... get from aistudio.google.com" class="w-full h-[48px] px-4 pr-10 rounded-xl bg-[#F8F9FF] border border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-[12px] font-medium" />
            <button @click="showApiKey=!showApiKey" class="absolute right-3 top-[14px] text-gray-400 text-[12px]">{{ showApiKey?'🙈':'👁️' }}</button>
          </div>
          <p class="mt-2 text-[10px] text-gray-400">Free key from <a href='https://aistudio.google.com/app/apikey' target='_blank' class='text-indigo-600 font-bold underline'>aistudio.google.com</a> enables fresh AI quizzes every time.</p>

          <button @click="saveEdit" :disabled="!editForm.name.trim()" :class="editForm.name.trim()?'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_8px_24px_rgba(79,70,229,0.3)]':'bg-gray-200 text-gray-400'" class="mt-6 w-full h-[48px] rounded-xl font-black jakarta text-[14px] transition active:scale-[0.98]">{{ saving?'Saving...':'Save Changes ✓' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
const props=defineProps({ user:Object })
const emit=defineEmits(['logout'])
const store=useUserStore()
const showEdit=ref(false), saving=ref(false), showApiKey=ref(false)
const editForm=reactive({ name:'', level:'', apiKey:'' })
const streak=computed(()=>store.streak.value), quizzesDone=computed(()=>store.quizzesDone.value), xp=computed(()=>store.xp.value), bookmarks=computed(()=>store.bookmarkCount.value)
const rank=computed(()=>store.currentRank.value), rankPercent=computed(()=>Math.max(1,Math.min(99,Math.floor((rank.value/50)*100))))
const currentLevel=computed(()=>store.currentLevel.value), levelProgress=computed(()=>store.levelProgress.value)
const accuracy=computed(()=>quizzesDone.value>0?Math.min(98,75+Math.floor(quizzesDone.value*1.5)):0)
const hasApiKey=computed(()=>!!store.geminiApiKey.value)
function openEdit(){ editForm.name=props.user.name; editForm.level=props.user.level; editForm.apiKey=store.geminiApiKey.value||''; showEdit.value=true }
function openApiKeyEdit(){ openEdit() }
async function saveEdit(){ if(!editForm.name.trim()) return; saving.value=true; await store.updateUser(editForm.name.trim(),editForm.level,editForm.apiKey); saving.value=false; showEdit.value=false }
function openLinkedIn(e){ if(window.Telegram?.WebApp?.openLink){ e.preventDefault(); window.Telegram.WebApp.openLink('https://www.linkedin.com/in/prince-jaiswal-ca') } }
function handleLogout(){ emit('logout') }
</script>
