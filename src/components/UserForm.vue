<template>
  <div class="flex-1 flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
    <div class="px-6 pt-6 pb-4 bg-white/80 backdrop-blur border-b border-indigo-100">
      <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">1</div><div class="h-[2px] flex-1 bg-indigo-100 rounded-full"><div class="h-full w-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div></div><div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">2</div></div>
      <p class="mt-3 text-[11px] font-black tracking-widest uppercase text-gray-400">RankerQ by PP • Saved in Telegram Cloud</p>
    </div>
    <div class="flex-1 px-6 py-8 overflow-y-auto">
      <h2 class="jakarta text-[24px] font-black text-gray-900 leading-tight tracking-tight">Welcome to RankerQ 🎮</h2>
      <p class="mt-2 text-[14px] text-gray-500 leading-5">Game-style CA prep with Gemini AI quizzes.</p>
      
      <div class="mt-8 bg-white rounded-[20px] border border-indigo-100 shadow-[0_8px_32px_rgba(79,70,229,0.08)] p-5">
        <label class="text-[11px] font-black tracking-widest uppercase text-gray-400">Full Name</label>
        <div class="mt-2 relative"><span class="absolute left-3.5 top-[13px] text-gray-400">👤</span><input v-model="form.name" placeholder="e.g. Ananya Sharma" class="w-full h-[48px] pl-10 pr-4 rounded-xl bg-[#F8F9FF] border border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-[15px] font-medium transition" /></div>
        
        <label class="mt-5 block text-[11px] font-black tracking-widest uppercase text-gray-400">CA Level</label>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <button @click="form.level='Foundation'" :class="form.level==='Foundation'?'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow':'bg-white border-indigo-100 text-gray-700'" class="h-12 rounded-xl border font-bold text-[13px] transition">Foundation</button>
          <button @click="form.level='Intermediate'" :class="form.level==='Intermediate'?'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow':'bg-white border-indigo-100 text-gray-700'" class="h-12 rounded-xl border font-bold text-[13px] transition">Intermediate</button>
        </div>

        <label class="mt-5 block text-[11px] font-black tracking-widest uppercase text-gray-400 flex items-center gap-2">Gemini API Key <span class="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">Optional but Recommended</span></label>
        <div class="mt-2 relative">
          <span class="absolute left-3.5 top-[13px] text-gray-400">🔑</span>
          <input v-model="form.apiKey" :type="showKey?'text':'password'" placeholder="AIza... (from aistudio.google.com)" class="w-full h-[48px] pl-10 pr-10 rounded-xl bg-[#F8F9FF] border border-indigo-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-[13px] font-medium transition" />
          <button @click="showKey=!showKey" class="absolute right-3 top-[14px] text-gray-400 text-[12px]">{{ showKey?'🙈':'👁️' }}</button>
        </div>
        <p class="mt-2 text-[10px] text-gray-400 leading-4">Get free key from <a href='https://aistudio.google.com/app/apikey' target='_blank' class='text-indigo-600 font-bold underline'>aistudio.google.com</a> — enables fresh Gemini quizzes. You can also add later in profile.</p>

        <div class="mt-4 p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
          <p class="text-[11px] font-bold text-indigo-700">🎮 Game Mode: On</p>
          <p class="text-[11px] text-gray-600 mt-1">Earn XP, level up, maintain streaks, unlock ranks!</p>
        </div>
      </div>

      <button @click="submit" :disabled="!canContinue" :class="canContinue?'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 shadow-[0_8px_24px_rgba(79,70,229,0.3)] text-white':'bg-gray-200 text-gray-400'" class="mt-6 w-full h-[52px] rounded-[14px] font-black jakarta text-[15px] transition active:scale-[0.98]">{{ saving?'Saving to Cloud...':'Start Quest → 🚀' }}</button>
      <p class="mt-3 text-center text-[11px] text-gray-400">🔐 Stored in Telegram CloudStorage • XP & Level saved</p>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
const emit=defineEmits(['complete'])
const form=reactive({ name:'', level:'', apiKey:'' })
const showKey=ref(false)
const saving=ref(false)
const canContinue=computed(()=>form.name.trim().length>2&&form.level)
async function submit(){ if(!canContinue.value) return; saving.value=true; await new Promise(r=>setTimeout(r,600)); emit('complete',{...form}); saving.value=false }
</script>
