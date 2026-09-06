<template>
  <div class="p-5">
    <h1 class="jakarta text-[20px] font-bold text-gray-900">Hi, {{ user.name.split(' ')[0] }} 👋</h1>
    <p class="text-[13px] text-gray-500 mt-1">Ready to crack today's target?</p>

    <!-- Stats Row -->
    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="ca-card p-3 text-center"><p class="text-[18px] font-bold jakarta text-gray-900">{{ streak }}🔥</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Streak</p></div>
      <div class="ca-card p-3 text-center"><p class="text-[18px] font-bold jakarta text-gray-900">{{ quizzesDone }}</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Quizzes</p></div>
      <div class="ca-card p-3 text-center"><p class="text-[18px] font-bold jakarta text-ca-700">#{{ rank }}</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Rank</p></div>
    </div>

    <!-- Quiz Card Component -->
    <div class="mt-5">
      <QuizCard :quiz="todaysQuiz" @start="showModal = true" />
    </div>

    <!-- Doubts Preview Card -->
    <div class="mt-5 ca-card p-5">
      <div class="flex justify-between items-center">
        <h3 class="jakarta font-bold text-[15px] text-gray-900">Doubts Card</h3>
        <span class="text-[11px] font-bold px-2 py-1 rounded-full bg-ca-50 text-ca-700 border border-ca-100">{{ doubts.length }} active</span>
      </div>
      <div class="mt-4 h-[44px] rounded-xl bg-[#F9FFFB] border border-dashed border-[#BBF7D0] flex items-center gap-3 px-4 cursor-pointer hover:bg-ca-50 transition">
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
      <div class="rounded-2xl bg-[#14532D] p-4 text-white"><p class="text-[12px] opacity-80">PYQ Bank</p><p class="jakarta font-bold mt-1">500+ Solved</p><p class="text-[11px] mt-2 opacity-70">Foundation + Inter</p></div>
      <div class="rounded-2xl bg-white border border-[#E5F7E9] p-4"><p class="text-[12px] text-gray-500">Revision</p><p class="jakarta font-bold mt-1 text-gray-900">Notes</p><p class="text-[11px] mt-2 text-gray-400">Quick sheets</p></div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" @click.self="showModal = false">
      <div class="w-full max-w-[360px] bg-white rounded-[20px] p-6 shadow-2xl">
        <div class="w-12 h-12 rounded-full bg-ca-50 flex items-center justify-center mx-auto text-xl">🚀</div>
        <h3 class="jakarta text-center font-bold text-[18px] mt-4">Starting Quiz</h3>
        <p class="text-center text-[13px] text-gray-500 mt-2">{{ todaysQuiz.title }} • {{ todaysQuiz.meta }}</p>
        <button @click="showModal = false" class="mt-5 w-full h-[44px] rounded-xl bg-ca-600 text-white font-semibold">Let's Go</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QuizCard from '../components/QuizCard.vue'

defineProps({ user: Object })

const streak = ref(7)
const quizzesDone = ref(12)
const rank = ref(12)
const showModal = ref(false)

const todaysQuiz = ref({ title: 'Business Laws - Contracts', meta: '15 Qs • 20 mins', xp: 150, progress: 60 })
const doubts = ref([
  { id: 1, q: 'Difference between void and voidable contract with example?', status: 'Solved', time: '2h ago' },
  { id: 2, q: 'How to calculate goodwill under super profit method?', status: 'Pending', time: '5h ago' },
])
</script>
