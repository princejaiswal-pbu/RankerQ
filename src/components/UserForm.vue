<template>
  <div class="flex-1 flex flex-col bg-ca-50 min-h-screen">
    <div class="px-6 pt-6 pb-4 bg-white border-b border-[#E5F7E9]">
      <div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-ca-50 border border-ca-100 flex items-center justify-center text-ca-700 font-bold text-sm">1</div><div class="h-[2px] flex-1 bg-[#E5F7E9] rounded-full"><div class="h-full w-1/2 bg-ca-600 rounded-full"></div></div><div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">2</div></div>
      <p class="mt-3 text-[11px] font-bold tracking-widest uppercase text-gray-400">Step 1 of 2 • Saved in Telegram Cloud</p>
    </div>
    <div class="flex-1 px-6 py-8 overflow-y-auto">
      <h2 class="jakarta text-[22px] font-bold text-gray-900 leading-tight">Welcome to RankerQ by PP 👋</h2>
      <p class="mt-2 text-[14px] text-gray-500 leading-5">Your name & level will be securely saved in Telegram's cloud storage.</p>
      <div class="mt-8 ca-card p-5">
        <label class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Full Name</label>
        <div class="mt-2 relative"><span class="absolute left-3.5 top-[13px] text-gray-400">👤</span><input v-model="form.name" placeholder="e.g. Ananya Sharma" class="w-full h-[48px] pl-10 pr-4 rounded-xl bg-[#F9FFFB] border border-[#D1FAE5] focus:border-ca-600 focus:ring-4 focus:ring-ca-100 outline-none text-[15px] font-medium transition" /></div>
        <label class="mt-6 block text-[11px] font-bold tracking-widest uppercase text-gray-400">CA Level</label>
        <div class="mt-2 grid grid-cols-2 gap-2">
          <button @click="form.level='Foundation'" :class="form.level==='Foundation'?'bg-ca-600 text-white border-ca-600':'bg-white border-[#E5F7E9] text-gray-700'" class="h-12 rounded-xl border font-semibold text-[13px] transition">Foundation</button>
          <button @click="form.level='Intermediate'" :class="form.level==='Intermediate'?'bg-ca-600 text-white border-ca-600':'bg-white border-[#E5F7E9] text-gray-700'" class="h-12 rounded-xl border font-semibold text-[13px] transition">Intermediate</button>
        </div>
        <label class="mt-6 block text-[11px] font-bold tracking-widest uppercase text-gray-400">Gemini API Key <span class="normal-case text-gray-300">(optional)</span></label>
        <input v-model="form.geminiKey" type="password" placeholder="AIza..." class="mt-2 w-full h-[48px] px-4 rounded-xl bg-[#F9FFFB] border border-[#D1FAE5] focus:border-ca-600 focus:ring-4 focus:ring-ca-100 outline-none text-[14px] font-medium" />
        <p class="mt-2 text-[10px] leading-4 text-gray-400">Used only to generate fresh quizzes. You can add or change it later in Profile.</p>
      </div>
      <button @click="submit" :disabled="!canContinue" :class="canContinue?'bg-ca-600 shadow-green text-white':'bg-gray-200 text-gray-400'" class="mt-6 w-full h-[52px] rounded-[14px] font-semibold jakarta text-[15px] transition active:scale-[0.98]">{{ saving?'Saving to Telegram...':'Save & Continue →' }}</button>
      <p class="mt-3 text-center text-[11px] text-gray-400">🔐 Stored in Telegram CloudStorage • No server needed</p>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
const emit=defineEmits(['complete'])
const form=reactive({ name:'', level:'', geminiKey:'' })
const saving=ref(false)
const canContinue=computed(()=>form.name.trim().length>2&&form.level)
async function submit(){ if(!canContinue.value) return; saving.value=true; await new Promise(r=>setTimeout(r,600)); emit('complete',{...form}); saving.value=false }
</script>
