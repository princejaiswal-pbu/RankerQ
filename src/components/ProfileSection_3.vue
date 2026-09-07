<template>
  <div class="p-0 pb-10">
    <!-- Header -->
    <div class="bg-gradient-to-b from-ca-600 to-ca-700 p-6 pb-10 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
      <div class="flex items-center gap-4 relative z-10">
        <div class="w-16 h-16 rounded-[18px] bg-white text-ca-700 flex items-center justify-center font-bold text-xl jakarta shadow-lg">{{ user.name[0]?.toUpperCase() }}</div>
        <div class="flex-1">
          <p class="jakarta font-bold text-[18px]">{{ user.name }}</p>
          <p class="text-[12px] opacity-80 mt-0.5">{{ user.level }} • ID: CA{{ user.id }}</p>
          <span class="mt-2 inline-block text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold tracking-widest uppercase">Active Learner • {{ streak }}🔥</span>
        </div>
        <button @click="openEdit" class="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition">✏️</button>
      </div>
    </div>

    <div class="-mt-6 px-5 relative z-10">
      <!-- Stats - now working -->
      <div class="ca-card p-4 grid grid-cols-3 divide-x divide-ca-50 text-center">
        <div><p class="jakarta font-bold text-[18px]">{{ quizzesDone }}</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Quizzes</p></div>
        <div><p class="jakarta font-bold text-[18px]">{{ accuracy }}%</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Accuracy</p></div>
        <div><p class="jakarta font-bold text-[18px]">{{ xp }}</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">XP</p></div>
      </div>

      <!-- Edit Profile Card -->
      <div class="mt-5 ca-card p-4">
        <h3 class="jakarta font-bold text-[14px] text-gray-900">Profile Settings</h3>
        <button @click="openEdit" class="mt-3 w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-ca-50 border border-ca-100 hover:bg-ca-100 transition text-left">
          <span class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-lg bg-ca-600 text-white flex items-center justify-center text-sm">✏️</span>
            <div>
              <p class="text-[13px] font-semibold text-gray-900">Edit Profile</p>
              <p class="text-[11px] text-gray-500">Name & CA Level</p>
            </div>
          </span>
          <span class="text-gray-400">›</span>
        </button>
      </div>

      <!-- Follow us on LinkedIn -->
      <div class="mt-5 ca-card p-4 bg-gradient-to-br from-[#0A66C2]/5 to-[#0A66C2]/10 border-[#0A66C2]/20">
        <h3 class="jakarta font-bold text-[14px] text-gray-900 flex items-center gap-2">
          <span class="w-6 h-6 rounded bg-[#0A66C2] text-white flex items-center justify-center text-[12px] font-bold">in</span>
          Follow us
        </h3>
        <p class="text-[12px] text-gray-600 mt-2 leading-4">Get CA tips, updates & motivation from Prince Jaiswal (CA)</p>
        <a href="https://www.linkedin.com/in/prince-jaiswal-ca" target="_blank" @click="openLinkedIn"
           class="mt-3 w-full h-11 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center gap-2 font-semibold text-[13px] hover:bg-[#004182] transition active:scale-[0.98] shadow-[0_4px_12px_rgba(10,102,194,0.3)]">
          <span>🔗</span> Follow on LinkedIn
        </a>
        <p class="text-[10px] text-gray-400 mt-2 text-center">linkedin.com/in/prince-jaiswal-ca</p>
      </div>

      <!-- Clear Data -->
      <button @click="handleLogout" class="mt-5 w-full h-[44px] rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold text-[13px] hover:bg-red-100 transition">Clear Data & Log out</button>
      <p class="mt-3 text-center text-[11px] text-gray-400">v1.1.0 • Telegram CloudStorage • {{ streak }} day streak</p>
    </div>

    <!-- Edit Profile Modal - WORKING -->
    <div v-if="showEdit" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" @click.self="showEdit = false">
      <div class="w-full max-w-[360px] bg-white rounded-[24px] shadow-2xl overflow-hidden">
        <div class="p-5 border-b border-ca-50 flex justify-between items-center">
          <h3 class="jakarta font-bold text-[16px]">Edit Profile</h3>
          <button @click="showEdit = false" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">✕</button>
        </div>
        <div class="p-5">
          <label class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Full Name</label>
          <input v-model="editForm.name" placeholder="Your name"
            class="mt-2 w-full h-[48px] px-4 rounded-xl bg-[#F9FFFB] border border-[#D1FAE5] focus:border-ca-600 focus:ring-4 focus:ring-ca-100 outline-none text-[15px] font-medium" />
          
          <label class="mt-4 block text-[11px] font-bold tracking-widest uppercase text-gray-400">CA Level</label>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <button @click="editForm.level = 'Foundation'" :class="editForm.level === 'Foundation' ? 'bg-ca-600 text-white border-ca-600' : 'bg-white border-[#E5F7E9] text-gray-700'"
              class="h-12 rounded-xl border font-semibold text-[13px] transition">Foundation</button>
            <button @click="editForm.level = 'Intermediate'" :class="editForm.level === 'Intermediate' ? 'bg-ca-600 text-white border-ca-600' : 'bg-white border-[#E5F7E9] text-gray-700'"
              class="h-12 rounded-xl border font-semibold text-[13px] transition">Intermediate</button>
          </div>

          <button @click="saveEdit" :disabled="!editForm.name.trim()" :class="editForm.name.trim() ? 'bg-ca-600 text-white shadow-green' : 'bg-gray-200 text-gray-400'"
            class="mt-6 w-full h-[48px] rounded-xl font-semibold jakarta text-[14px] transition active:scale-[0.98]">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'

const props = defineProps({ user: Object })
const emit = defineEmits(['logout'])
const store = useUserStore()

const showEdit = ref(false)
const saving = ref(false)
const editForm = reactive({ name: '', level: '' })

const streak = computed(() => store.streak.value)
const quizzesDone = computed(() => store.quizzesDone.value)
const xp = computed(() => store.xp.value)
const accuracy = computed(() => quizzesDone.value > 0 ? Math.min(98, 75 + Math.floor(quizzesDone.value * 1.5)) : 0)

function openEdit() {
  editForm.name = props.user.name
  editForm.level = props.user.level
  showEdit.value = true
}

async function saveEdit() {
  if (!editForm.name.trim()) return
  saving.value = true
  await store.updateUser(editForm.name.trim(), editForm.level)
  // Haptic
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
  }
  saving.value = false
  showEdit.value = false
}

function openLinkedIn(e) {
  // Use Telegram openLink if available
  if (window.Telegram?.WebApp?.openLink) {
    e.preventDefault()
    window.Telegram.WebApp.openLink('https://www.linkedin.com/in/prince-jaiswal-ca')
  }
  // else let default <a> handle
}

function handleLogout() {
  emit('logout')
}
</script>
