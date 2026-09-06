<template>
  <div class="flex-1 flex flex-col bg-ca-50 min-h-screen">
    <!-- Progress Header -->
    <div class="px-6 pt-6 pb-4 bg-white border-b border-[#E5F7E9]">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-ca-50 border border-ca-100 flex items-center justify-center text-ca-700 font-bold text-sm">1</div>
        <div class="h-[2px] flex-1 bg-[#E5F7E9] rounded-full overflow-hidden">
          <div class="h-full w-1/2 bg-ca-600 rounded-full"></div>
        </div>
        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">2</div>
      </div>
      <p class="mt-3 text-[11px] font-bold tracking-widest uppercase text-gray-400">Step 1 of 2 • Saved in Telegram Cloud</p>
    </div>

    <div class="flex-1 px-6 py-8 overflow-y-auto">
      <h2 class="jakarta text-[22px] font-bold text-gray-900 leading-tight">Welcome to CA Series 👋</h2>
      <p class="mt-2 text-[14px] text-gray-500 leading-5">Your name & level will be securely saved in Telegram's cloud storage.</p>

      <div class="mt-8 ca-card p-5">
        <label class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Full Name</label>
        <div class="mt-2 relative">
          <span class="absolute left-3.5 top-[13px] text-gray-400">👤</span>
          <input v-model="form.name" placeholder="e.g. Ananya Sharma"
            class="w-full h-[48px] pl-10 pr-4 rounded-xl bg-[#F9FFFB] border border-[#D1FAE5] focus:border-ca-600 focus:ring-4 focus:ring-ca-100 outline-none text-[15px] font-medium transition" />
        </div>

        <label class="mt-6 block text-[11px] font-bold tracking-widest uppercase text-gray-400">CA Level</label>
        <div class="mt-2 relative">
          <button @click="showLevel = !showLevel"
            class="w-full h-[48px] px-4 rounded-xl bg-[#F9FFFB] border border-[#D1FAE5] flex items-center justify-between text-left">
            <span :class="form.level ? 'text-gray-900 font-medium' : 'text-gray-400'" class="text-[15px]">{{ form.level || 'Select your level' }}</span>
            <span class="text-gray-400 text-xs transition" :class="{'rotate-180': showLevel}">▼</span>
          </button>

          <div v-if="showLevel" class="absolute z-10 mt-2 w-full bg-white rounded-xl border border-[#E5F7E9] shadow-xl overflow-hidden">
            <button @click="selectLevel('Foundation')" class="w-full px-4 py-3.5 text-left hover:bg-ca-50 flex justify-between items-center">
              <div>
                <p class="font-semibold text-[14px] text-gray-900">Foundation</p>
                <p class="text-[11px] text-gray-500">Class 12 + CA entry level</p>
              </div>
              <span v-if="form.level === 'Foundation'" class="text-ca-600">✓</span>
            </button>
            <div class="h-[1px] bg-ca-50"></div>
            <button @click="selectLevel('Intermediate')" class="w-full px-4 py-3.5 text-left hover:bg-ca-50 flex justify-between items-center">
              <div>
                <p class="font-semibold text-[14px] text-gray-900">Intermediate</p>
                <p class="text-[11px] text-gray-500">After Foundation / Direct Entry</p>
              </div>
              <span v-if="form.level === 'Intermediate'" class="text-ca-600">✓</span>
            </button>
          </div>
        </div>

        <div v-if="form.level" class="mt-4 p-3 rounded-xl bg-ca-50 border border-ca-100 flex gap-2">
          <span class="text-ca-600 text-sm">🔒</span>
          <p class="text-[12px] text-ca-800 leading-4">{{ levelInfo }} Will be saved securely in Telegram Cloud.</p>
        </div>
      </div>

      <button @click="submit" :disabled="!canContinue || saving"
        :class="canContinue && !saving ? 'bg-ca-600 shadow-green text-white' : 'bg-gray-200 text-gray-400'"
        class="mt-6 w-full h-[52px] rounded-[14px] font-semibold jakarta text-[15px] transition active:scale-[0.98] flex items-center justify-center gap-2">
        <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        {{ saving ? 'Saving to Telegram...' : 'Save & Continue →' }}
      </button>
      <p class="mt-3 text-center text-[11px] text-gray-400">🔐 Stored in Telegram CloudStorage • No server needed</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
const emit = defineEmits(['complete'])

const form = reactive({ name: '', level: '' })
const showLevel = ref(false)
const saving = ref(false)

const canContinue = computed(() => form.name.trim().length > 2 && form.level)
const levelInfo = computed(() => form.level === 'Foundation'
  ? 'You will get Business Laws, Accounts, Maths & Economics quizzes.'
  : 'You will get Advanced Accounting, Audit, Law & Taxation quizzes.'
)

function selectLevel(l) { form.level = l; showLevel.value = false }

async function submit() { 
  if (!canContinue.value) return
  saving.value = true
  // Small delay for UX
  await new Promise(r => setTimeout(r, 600))
  emit('complete', { ...form })
  saving.value = false
}
</script>
