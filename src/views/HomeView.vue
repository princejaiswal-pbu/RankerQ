<template>
  <div class="p-5 pb-10">
    <h1 class="jakarta text-[20px] font-bold text-gray-900">Hi, {{ user.name.split(' ')[0] }} 👋</h1>
    <p class="text-[13px] text-gray-500 mt-1">Ready to crack today's target?</p>

    <!-- Stats Row - NOW WORKING -->
    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="ca-card p-3 text-center relative overflow-hidden group hover:shadow-card-hover transition cursor-pointer" @click="showStreakInfo = true">
        <div class="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
        <p class="text-[20px] font-bold jakarta text-gray-900 relative z-10 flex items-center justify-center gap-1">{{ streak }}<span class="text-[16px]">🔥</span></p>
        <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1 relative z-10">Streak</p>
        <p class="text-[9px] text-orange-600 font-semibold mt-1 relative z-10">{{ streakText }}</p>
      </div>
      <div class="ca-card p-3 text-center hover:shadow-card-hover transition">
        <p class="text-[20px] font-bold jakarta text-gray-900">{{ quizzesDone }}</p>
        <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Quizzes</p>
        <p class="text-[9px] text-ca-600 font-semibold mt-1">+{{ xp }} XP</p>
      </div>
      <div class="ca-card p-3 text-center hover:shadow-card-hover transition cursor-pointer" @click="$emit('goLeaderboard')">
        <p class="text-[20px] font-bold jakarta text-ca-700">#{{ rank }}</p>
        <p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Rank</p>
        <p class="text-[9px] text-gray-500 font-semibold mt-1">Top {{ rankPercent }}%</p>
      </div>
    </div>

    <!-- Quiz Card Component -->
    <div class="mt-5">
      <QuizCard :quiz="todaysQuiz" @start="startQuiz" />
    </div>

    <!-- Doubts Preview Card -->
    <div class="mt-5 ca-card p-5">
      <div class="flex justify-between items-center">
        <h3 class="jakarta font-bold text-[15px] text-gray-900">Doubts Card</h3>
        <span class="text-[11px] font-bold px-2 py-1 rounded-full bg-ca-50 text-ca-700 border border-ca-100">{{ doubts.length }} active</span>
      </div>
      <div class="mt-4 h-[44px] rounded-xl bg-[#F9FFFB] border border-dashed border-[#BBF7D0] flex items-center gap-3 px-4 cursor-pointer hover:bg-ca-50 transition" @click="$emit('goDoubts')">
        <span class="w-7 h-7 rounded-full bg-ca-600 text-white flex items-center justify-center text-sm">?</span>
        <span class="text-[13px] text-gray-400">Ask your doubt in Law, Accounts...</span>
      </div>
      <div class="mt-4 space-y-3">
        <div v-for="d in doubts.slice(0,2)" :key="d.id" class="flex gap-3 p-3 rounded-xl bg-[#F6FFF8] border border-ca-50">
          <div class="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-[12px]">🎓</div>
          <div class="flex-1">
            <p class="text-[13px] font-medium text-gray-900 leading-4">{{ d.q }}</p>
            <p class="text-[11px] text-gray-500 mt-1">{{ d.status }} • {{ d.time }}</p>
          </div>
          <span :class="d.status === 'Solved' ? 'bg-ca-50 text-ca-700 border-ca-200' : 'bg-amber-50 text-amber-700 border-amber-200'" class="h-fit text-[10px] font-bold px-2 py-1 rounded-full border">{{ d.status }}</span>
        </div>
      </div>
    </div>

    <div class="mt-5 grid grid-cols-2 gap-3">
      <div class="rounded-2xl bg-[#14532D] p-4 text-white relative overflow-hidden">
        <div class="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <p class="text-[12px] opacity-80 relative z-10">PYQ Bank</p>
        <p class="jakarta font-bold mt-1 relative z-10">500+ Solved</p>
        <p class="text-[11px] mt-2 opacity-70 relative z-10">Foundation + Inter</p>
      </div>
      <div class="rounded-2xl bg-white border border-[#E5F7E9] p-4 hover:shadow-card transition cursor-pointer" @click="$emit('goLeaderboard')">
        <p class="text-[12px] text-gray-500">Your Rank</p>
        <p class="jakarta font-bold mt-1 text-gray-900">#{{ rank }} • {{ xp }} XP</p>
        <p class="text-[11px] mt-2 text-ca-600 font-semibold">View leaderboard →</p>
      </div>
    </div>

    <!-- Quiz Modal - Now actually completes quiz -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" @click.self="showModal = false">
      <div class="w-full max-w-[360px] bg-white rounded-[20px] p-6 shadow-2xl">
        <div class="w-12 h-12 rounded-full bg-ca-50 flex items-center justify-center mx-auto text-xl">🚀</div>
        <h3 class="jakarta text-center font-bold text-[18px] mt-4">{{ quizCompleted ? 'Quiz Completed! 🎉' : 'Starting Quiz' }}</h3>
        <p class="text-center text-[13px] text-gray-500 mt-2">{{ todaysQuiz.title }} • {{ todaysQuiz.meta }}</p>
        
        <div v-if="quizCompleted" class="mt-4 p-3 rounded-xl bg-ca-50 border border-ca-100 text-center">
          <p class="text-[14px] font-bold text-ca-800">+{{ todaysQuiz.xp }} XP Earned!</p>
          <p class="text-[11px] text-ca-600 mt-1">Streak: {{ streak }} days • Total: {{ quizzesDone }} quizzes</p>
        </div>

        <button @click="completeQuiz" class="mt-5 w-full h-[44px] rounded-xl bg-ca-600 text-white font-semibold hover:bg-ca-700 transition">
          {{ quizCompleted ? 'Awesome! Close' : 'Start Now →' }}
        </button>
      </div>
    </div>

    <!-- Streak Info Modal -->
    <div v-if="showStreakInfo" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" @click.self="showStreakInfo = false">
      <div class="w-full max-w-[320px] bg-white rounded-[20px] p-6 shadow-2xl text-center">
        <div class="text-4xl">🔥</div>
        <h3 class="jakarta font-bold text-[18px] mt-3">{{ streak }}-Day Streak!</h3>
        <p class="text-[13px] text-gray-500 mt-2 leading-5">You have studied for {{ streak }} consecutive days. Keep going to build your streak!</p>
        <div class="mt-4 flex justify-center gap-1">
          <div v-for="i in 7" :key="i" :class="i <= streak ? 'bg-ca-600' : 'bg-gray-200'" class="w-8 h-2 rounded-full"></div>
        </div>
        <button @click="showStreakInfo = false" class="mt-5 w-full h-10 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
import QuizCard from '../components/QuizCard.vue'

const props = defineProps({ user: Object })
const emit = defineEmits(['goLeaderboard', 'goDoubts'])

const store = useUserStore()
const showModal = ref(false)
const showStreakInfo = ref(false)
const quizCompleted = ref(false)

const streak = computed(() => store.streak.value)
const quizzesDone = computed(() => store.quizzesDone.value)
const xp = computed(() => store.xp.value)
const rank = computed(() => store.currentRank.value)
const rankPercent = computed(() => Math.max(1, Math.min(99, Math.floor((rank.value / 50) * 100))))
const streakText = computed(() => {
  if (streak.value === 0) return 'Start today'
  if (streak.value === 1) return 'Day 1'
  if (streak.value < 7) return `${streak.value} days`
  if (streak.value < 30) return 'On fire!'
  return 'Legendary!'
})

const todaysQuiz = ref({ title: 'Business Laws - Contracts', meta: '15 Qs • 20 mins', xp: 150, progress: 60 })
const doubts = ref([
  { id: 1, q: 'Difference between void and voidable contract with example?', status: 'Solved', time: '2h ago' },
  { id: 2, q: 'How to calculate goodwill under super profit method?', status: 'Pending', time: '5h ago' },
])

function startQuiz() {
  quizCompleted.value = false
  showModal.value = true
}

function completeQuiz() {
  if (!quizCompleted.value) {
    // First click = complete quiz
    store.completeQuiz(todaysQuiz.value.xp)
    quizCompleted.value = true
    // Add confetti haptic
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
    }
  } else {
    showModal.value = false
    quizCompleted.value = false
  }
}
</script>
