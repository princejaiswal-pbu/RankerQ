<template>
  <div class="p-5 pb-10">
    <h1 class="jakarta text-[20px] font-bold text-gray-900">Hi, {{ user.name.split(' ')[0] }} 👋</h1>
    <p class="text-[13px] text-gray-500 mt-1">Your exam-ready revision plan is waiting.</p>

    <div class="mt-5 grid grid-cols-3 gap-3">
      <button class="ca-card p-3 text-center" @click="showLeague = true"><p class="text-[20px] font-bold jakarta">{{ streak }}🔥</p><p class="metric-label">Streak</p><p class="metric-sub">League week</p></button>
      <div class="ca-card p-3 text-center"><p class="text-[20px] font-bold jakarta">{{ quizzesDone }}</p><p class="metric-label">Quizzes</p><p class="metric-sub">+{{ xp }} XP</p></div>
      <button class="ca-card p-3 text-center" @click="$emit('goLeaderboard')"><p class="text-[20px] font-bold jakarta text-ca-700">#{{ rank }}</p><p class="metric-label">Rank</p><p class="metric-sub">Top {{ rankPercent }}%</p></button>
    </div>

    <div class="mt-5"><QuizCard :quiz="todaysQuiz" @start="showQuiz = true" /></div>

    <section class="mt-5 rounded-[20px] bg-[#123D27] p-5 text-white relative overflow-hidden">
      <div class="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#B8F4C9]/15"></div>
      <div class="flex items-start justify-between relative"><div><p class="text-[11px] font-bold tracking-widest uppercase text-[#B8F4C9]">Mistake Book · Auto-saved</p><h2 class="jakarta mt-1 text-[19px] font-bold">You got {{ mistakes }} mistakes</h2><p class="mt-1 text-[12px] text-white/75">ICAI repeats concepts. Revise before they repeat in your paper.</p></div><span class="text-2xl">📚</span></div>
      <button class="mt-4 h-11 w-full rounded-xl bg-[#D9FFE3] text-[13px] font-bold text-[#14532D] active:scale-[.98]" @click="reviseMistakes">Revise in {{ revisionMinutes }} mins →</button>
    </section>

    <section class="mt-5 ca-card p-5">
      <div class="flex items-start justify-between"><div><p class="text-[11px] font-bold tracking-widest uppercase text-ca-700">PYQ Bank · 2018–2024</p><h2 class="jakarta mt-1 text-[17px] font-bold">ICAI pattern, chapter by chapter</h2></div><span class="text-2xl">🎯</span></div>
      <div class="mt-4 grid grid-cols-2 gap-2"><select v-model="subject" class="filter-select"><option>Foundation Law</option><option>Accounts</option></select><select v-model="chapter" class="filter-select"><option>Contracts</option><option>Sale of Goods</option></select></div>
      <div class="mt-3 flex items-center justify-between rounded-xl bg-[#F6FFF8] px-3 py-3"><div><p class="text-[13px] font-bold text-gray-900">{{ subject }} → {{ chapter }}</p><p class="text-[11px] text-gray-500 mt-0.5">15 PYQs · Exact ICAI marking scheme</p></div><span class="tag">ICAI Asked 3 times</span></div>
      <button class="mt-3 w-full text-center text-[13px] font-bold text-ca-700" @click="showPyqs = true">Open 15 PYQs →</button>
    </section>

    <div v-if="showQuiz" class="modal" @click.self="showQuiz = false"><div class="modal-card"><p class="text-center text-3xl">📝</p><h3 class="jakarta mt-3 text-center text-[18px] font-bold">Quick practice</h3><p class="mt-2 text-center text-[13px] text-gray-500">A contract without consideration is generally:</p><button class="answer" @click="answerQuiz(false)">Void</button><button class="answer" @click="answerQuiz(true)">Valid</button><button class="answer" @click="answerQuiz(false)">Illegal</button><p v-if="quizMessage" class="mt-3 text-center text-[12px] font-semibold" :class="lastAnswerCorrect ? 'text-ca-700' : 'text-orange-600'">{{ quizMessage }}</p></div></div>
    <div v-if="showPyqs" class="modal" @click.self="showPyqs = false"><div class="modal-card"><div class="flex justify-between"><h3 class="jakarta text-[17px] font-bold">{{ chapter }} PYQs</h3><button @click="showPyqs=false">✕</button></div><p class="mt-1 text-[12px] text-gray-500">2018–2024 · Exact ICAI marking scheme</p><div v-for="year in [2024, 2023, 2022]" :key="year" class="mt-3 rounded-xl border border-ca-100 p-3"><div class="flex justify-between gap-2"><p class="text-[12px] font-semibold">{{ year }} · Explain consideration and its exceptions.</p><span class="tag whitespace-nowrap">Asked 3×</span></div><p class="mt-1 text-[11px] text-gray-500">6 marks · ICAI suggested answer included</p></div></div></div>
    <div v-if="showLeague" class="modal" @click.self="showLeague=false"><div class="modal-card text-center"><p class="text-3xl">🏅</p><h3 class="jakarta mt-3 text-[18px] font-bold">CA Streak League</h3><p class="mt-2 text-[13px] text-gray-500">You’re #{{ rank }} in a weekly league of 30 CA students. Top 3 earn the CA Series Champion badge.</p><button class="primary-btn" @click="shareRank">Share my rank on Telegram</button><p v-if="shareMessage" class="mt-3 text-[11px] font-semibold text-ca-700">{{ shareMessage }}</p></div></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'
import QuizCard from '../components/QuizCard.vue'
const props = defineProps({ user: Object }); defineEmits(['goLeaderboard'])
const store = useUserStore(); const showQuiz = ref(false); const showPyqs = ref(false); const showLeague = ref(false); const subject = ref('Foundation Law'); const chapter = ref('Contracts'); const quizMessage = ref(''); const lastAnswerCorrect = ref(false); const shareMessage = ref('')
const streak = computed(() => store.streak.value); const quizzesDone = computed(() => store.quizzesDone.value); const xp = computed(() => store.xp.value); const mistakes = computed(() => store.mistakes.value); const rank = computed(() => store.currentRank.value); const rankPercent = computed(() => Math.max(1, Math.min(99, Math.floor(rank.value / 50 * 100)))); const revisionMinutes = computed(() => Math.max(1, Math.ceil(mistakes.value / 2)))
const todaysQuiz = { title: 'Business Laws – Contracts', meta: '15 Qs • 20 mins', xp: 150, progress: 60 }
function answerQuiz(correct) { lastAnswerCorrect.value = correct; quizMessage.value = correct ? 'Correct! +150 XP added.' : 'Saved to your Mistake Book. Revise it before the exam.'; if (correct) store.completeQuiz(todaysQuiz.xp); else store.saveMistake(); setTimeout(() => { showQuiz.value = false; quizMessage.value = '' }, 1200) }
function reviseMistakes() { store.reviseMistakes() }
function shareRank() { const text = `I’m #${rank.value} in this week’s CA Streak League! Can you beat me?`; if (window.Telegram?.WebApp?.share) window.Telegram.WebApp.share({ text }); else if (navigator.share) navigator.share({ text }).catch(() => {}); else shareMessage.value = 'Rank ready to share in Telegram.'; if (window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light') }
</script>

<style scoped>
.metric-label { @apply text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1; } .metric-sub { @apply text-[9px] text-ca-600 font-semibold mt-1; } .filter-select { @apply h-10 min-w-0 rounded-xl border border-ca-100 bg-white px-2 text-[12px] font-semibold text-gray-700 outline-none; } .tag { @apply rounded-full border border-ca-100 bg-ca-50 px-2 py-1 text-[9px] font-bold text-ca-700; } .modal { @apply fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center; } .modal-card { @apply w-full max-w-[360px] rounded-[20px] bg-white p-6 shadow-2xl; } .answer { @apply mt-3 h-11 w-full rounded-xl border border-ca-100 bg-[#F9FFFB] text-left px-4 text-[13px] font-medium text-gray-800 transition hover:bg-ca-50; } .primary-btn { @apply mt-5 h-11 w-full rounded-xl bg-ca-600 text-[13px] font-bold text-white; }
</style>
