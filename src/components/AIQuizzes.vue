<template>
  <div class="p-5 pb-24">
    <div class="flex justify-between items-center">
      <h2 class="jakarta text-[18px] font-bold text-gray-900">AI Quizzes</h2>
      <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Meta AI • Llama 3</span>
    </div>

    <!-- Generator Card -->
    <div v-if="!activeQuiz" class="mt-5 rounded-[20px] bg-gradient-to-br from-blue-600 to-indigo-700 p-[1px]">
      <div class="rounded-[19px] bg-white p-5">
        <div class="flex gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl shadow-lg">✨</div>
          <div>
            <h3 class="jakarta font-bold text-[15px]">AI Quiz Generator</h3>
            <p class="text-[12px] text-gray-500 mt-1">Personalized quizzes by Meta AI based on your weak areas</p>
          </div>
        </div>

        <div class="mt-5 space-y-4">
          <div>
            <label class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Subject</label>
            <div class="mt-2 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button v-for="s in subjects" :key="s" @click="form.subject = s" :class="form.subject === s ? 'bg-blue-600 text-white shadow' : 'bg-white border border-[#E5F7E9] text-gray-600'" class="whitespace-nowrap px-4 py-2 rounded-full text-[12px] font-semibold transition">{{ s }}</button>
            </div>
          </div>

          <div>
            <label class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Chapter</label>
            <select v-model="form.chapter" class="mt-2 w-full h-11 px-4 rounded-xl bg-[#F9FFFB] border border-[#D1FAE5] text-[13px] font-medium outline-none focus:border-blue-500">
              <option v-for="c in chapters[form.subject]" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Difficulty</label>
              <div class="mt-2 flex bg-gray-100 rounded-xl p-1">
                <button v-for="d in ['Easy','Medium','Hard']" :key="d" @click="form.difficulty = d" :class="form.difficulty === d ? 'bg-white shadow text-gray-900' : 'text-gray-500'" class="flex-1 py-2 rounded-lg text-[11px] font-bold transition">{{ d }}</button>
              </div>
            </div>
            <div>
              <label class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Questions</label>
              <div class="mt-2 flex bg-gray-100 rounded-xl p-1">
                <button v-for="n in [5,10,15]" :key="n" @click="form.count = n" :class="form.count === n ? 'bg-white shadow text-gray-900' : 'text-gray-500'" class="flex-1 py-2 rounded-lg text-[11px] font-bold transition">{{ n }}</button>
              </div>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-blue-50 border border-blue-100 flex gap-2">
            <span class="text-blue-600">💡</span>
            <p class="text-[11px] text-blue-800 leading-4">AI analyzes your {{ mistakeCount }} mistakes & PYQ pattern to create this quiz. Focus: {{ form.chapter }}</p>
          </div>

          <button @click="generateQuiz" :disabled="generating" :class="generating ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)]'" class="w-full h-[48px] rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 transition active:scale-[0.98]">
            <span v-if="generating" class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
            {{ generating ? 'Meta AI is creating...' : `✨ Generate ${form.count}Q Quiz with Meta AI` }}
          </button>
          <p class="text-[10px] text-gray-400 text-center">Powered by Llama 3 • Takes ~3 seconds</p>
        </div>
      </div>
    </div>

    <!-- Quick AI Quiz Suggestions -->
    <div v-if="!activeQuiz" class="mt-6">
      <h3 class="text-[13px] font-bold text-gray-900">Suggested for You • Based on Mistakes</h3>
      <div class="mt-3 grid gap-2">
        <div v-for="s in suggestions" :key="s.id" @click="form.subject = s.subject; form.chapter = s.chapter; generateQuiz()" class="p-3 rounded-xl bg-white border border-[#E5F7E9] flex justify-between items-center cursor-pointer hover:shadow-card-hover transition">
          <div class="flex gap-3">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border flex items-center justify-center">🤖</div>
            <div>
              <p class="text-[13px] font-semibold">{{ s.subject }} • {{ s.chapter }}</p>
              <p class="text-[11px] text-gray-500">{{ s.reason }} • {{ s.qs }} Qs • {{ s.difficulty }}</p>
            </div>
          </div>
          <span class="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700">AI</span>
        </div>
      </div>
    </div>

    <!-- Active Quiz Player -->
    <div v-if="activeQuiz" class="mt-5">
      <div class="flex justify-between items-center">
        <button @click="activeQuiz = null" class="text-[12px] font-semibold text-gray-600 flex items-center gap-1">← Back</button>
        <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border">{{ currentIndex + 1 }} / {{ activeQuiz.questions.length }}</span>
      </div>

      <div class="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500" :style="{ width: ((currentIndex + 1) / activeQuiz.questions.length * 100) + '%' }"></div>
      </div>

      <div class="mt-5 ca-card p-5">
        <div class="flex justify-between items-start gap-2">
          <span class="text-[10px] font-bold px-2 py-1 rounded-full bg-gray-900 text-white">{{ activeQuiz.questions[currentIndex].subject }} • {{ activeQuiz.questions[currentIndex].marks }} Marks</span>
          <span v-if="activeQuiz.questions[currentIndex].timesAsked > 1" class="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">ICAI ×{{ activeQuiz.questions[currentIndex].timesAsked }}</span>
        </div>
        <p class="text-[15px] font-semibold text-gray-900 mt-4 leading-6">{{ activeQuiz.questions[currentIndex].question }}</p>

        <div class="mt-5 space-y-2">
          <button v-for="(opt, idx) in activeQuiz.questions[currentIndex].options" :key="idx" @click="selectAnswer(idx)" :disabled="answered" :class="getOptionClass(idx)" class="w-full text-left px-4 py-3 rounded-xl border text-[13px] font-medium transition flex justify-between items-center">
            <span>{{ String.fromCharCode(65+idx) }}. {{ opt }}</span>
            <span v-if="answered && idx === activeQuiz.questions[currentIndex].correct" class="text-green-600">✓</span>
            <span v-if="answered && idx === selectedAnswer && idx !== activeQuiz.questions[currentIndex].correct" class="text-red-600">✗</span>
          </button>
        </div>

        <div v-if="answered" class="mt-4 p-4 rounded-xl bg-[#F9FFFB] border border-[#E5F7E9]">
          <p class="text-[11px] font-bold tracking-widest uppercase text-gray-400">Meta AI Explanation</p>
          <p class="text-[12px] font-bold text-blue-700 mt-2">Simple:</p>
          <p class="text-[13px] text-gray-700 mt-1 leading-5">{{ activeQuiz.questions[currentIndex].explanation.simple }}</p>
          <p class="text-[12px] font-bold text-gray-900 mt-3">ICAI Format:</p>
          <p class="text-[12px] text-gray-600 mt-1 leading-5 whitespace-pre-line">{{ activeQuiz.questions[currentIndex].explanation.icai }}</p>
        </div>

        <button v-if="answered" @click="nextQuestion" class="mt-5 w-full h-11 rounded-xl bg-gray-900 text-white font-semibold text-[13px]">
          {{ currentIndex + 1 === activeQuiz.questions.length ? 'Finish Quiz →' : 'Next Question →' }}
        </button>
      </div>

      <div class="mt-4 flex justify-center gap-2 text-[10px] text-gray-400">
        <span>🤖 Generated by Meta AI</span>
        <span>•</span>
        <span>Verified by CA Prince</span>
      </div>
    </div>

    <!-- Result -->
    <div v-if="showResult" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="w-full max-w-[360px] bg-white rounded-[24px] p-6 shadow-2xl text-center">
        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto text-2xl text-white">🎉</div>
        <h3 class="jakarta font-bold text-[20px] mt-4">AI Quiz Completed!</h3>
        <p class="text-[13px] text-gray-500 mt-1">{{ form.subject }} • {{ form.chapter }}</p>
        
        <div class="mt-5 grid grid-cols-3 gap-3">
          <div class="p-3 rounded-xl bg-gray-50"><p class="text-[18px] font-bold">{{ score }}/{{ activeQuiz.questions.length }}</p><p class="text-[10px] text-gray-500 uppercase font-bold">Score</p></div>
          <div class="p-3 rounded-xl bg-blue-50"><p class="text-[18px] font-bold text-blue-700">+{{ earnedXP }}</p><p class="text-[10px] text-gray-500 uppercase font-bold">XP</p></div>
          <div class="p-3 rounded-xl bg-red-50"><p class="text-[18px] font-bold text-red-600">{{ wrongCount }}</p><p class="text-[10px] text-gray-500 uppercase font-bold">Mistakes</p></div>
        </div>

        <div v-if="wrongCount > 0" class="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-left">
          <p class="text-[11px] font-bold text-amber-800">📚 {{ wrongCount }} added to Mistake Book → Revise in {{ Math.ceil(wrongCount * 0.5) }} mins</p>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-2">
          <button @click="showResult = false; activeQuiz = null" class="h-11 rounded-xl bg-white border border-gray-200 font-semibold text-[13px]">Close</button>
          <button @click="shareResult" class="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-[13px]">Share Result ↗️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'

const store = useUserStore()

const subjects = ['Law', 'Accounts', 'Maths', 'Economics']
const chapters = {
  Law: ['Contracts', 'Sale of Goods', 'Partnership', 'Companies Act', 'Negotiable Instruments'],
  Accounts: ['Final Accounts', 'Partnership', 'Company Accounts', 'Hire Purchase'],
  Maths: ['Ratio', 'Equations', 'Calculus', 'Statistics'],
  Economics: ['Demand', 'Market', 'National Income', 'Money Market']
}

const form = reactive({
  subject: 'Law',
  chapter: 'Contracts',
  difficulty: 'Medium',
  count: 10
})

const generating = ref(false)
const activeQuiz = ref(null)
const currentIndex = ref(0)
const selectedAnswer = ref(null)
const answered = ref(false)
const showResult = ref(false)
const score = ref(0)
const earnedXP = ref(0)
const wrongAnswers = ref([])

const mistakeCount = computed(() => store.mistakeCount.value)

const suggestions = ref([
  { id: 1, subject: 'Law', chapter: 'Contracts', reason: '3 mistakes in this chapter', qs: 10, difficulty: 'Medium' },
  { id: 2, subject: 'Accounts', chapter: 'Final Accounts', reason: 'ICAI asked 5×, you got 1 wrong', qs: 5, difficulty: 'Hard' },
  { id: 3, subject: 'Law', chapter: 'Companies Act', reason: 'Weak area • 45% accuracy', qs: 10, difficulty: 'Easy' },
])

const wrongCount = computed(() => wrongAnswers.value.length)

async function generateQuiz() {
  generating.value = true
  
  // TODO: Replace with real backend call:
  // const res = await fetch('/api/ai/generate-quiz', {
  //   method: 'POST',
  //   body: JSON.stringify({ ...form, level: store.level.value, mistakes: store.mistakes.value })
  // })
  // const data = await res.json()

  await new Promise(r => setTimeout(r, 1800))

  // Mock AI-generated quiz based on form
  const mockQuestions = Array.from({ length: form.count }, (_, i) => ({
    id: `ai-${Date.now()}-${i}`,
    subject: form.subject,
    chapter: form.chapter,
    marks: form.difficulty === 'Hard' ? 5 : form.difficulty === 'Medium' ? 3 : 2,
    timesAsked: Math.floor(Math.random() * 4) + 1,
    question: `${form.subject} - ${form.chapter} [${form.difficulty}] Q${i+1}: ${getMockQuestion(form.subject, form.chapter, i)}`,
    options: getMockOptions(form.subject, i),
    correct: i % 4,
    explanation: {
      simple: `This is about ${form.chapter}. The key concept is that in ${form.subject}, this particular provision means... Think of it like a simple example where...`,
      icai: `As per ${form.subject} provisions:\n1. Section XYZ states...\n2. Case law ABC vs XYZ (2023) held...\n3. Therefore, correct answer is option ${String.fromCharCode(65 + (i % 4))} as per ICAI module.`
    }
  }))

  activeQuiz.value = { questions: mockQuestions, meta: { subject: form.subject, chapter: form.chapter, difficulty: form.difficulty } }
  currentIndex.value = 0
  selectedAnswer.value = null
  answered.value = false
  score.value = 0
  wrongAnswers.value = []
  generating.value = false

  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
  }
}

function getMockQuestion(subject, chapter, idx) {
  const bank = {
    Law: [
      'What constitutes valid consideration under Indian Contract Act?',
      'Distinguish between void and voidable agreement with case law.',
      'What are essentials of a valid contract?',
      'Explain doctrine of supervening impossibility.',
    ],
    Accounts: [
      'How to treat goodwill on admission of partner?',
      'Calculate depreciation under WDV vs SLM with example.',
      'What is the treatment of debenture discount?',
      'Prepare P&L with 10% provision for bad debts.',
    ]
  }
  const list = bank[subject] || bank.Law
  return list[idx % list.length]
}

function getMockOptions(subject, idx) {
  return [
    'Option A: Correct as per ICAI module',
    'Option B: Incorrect interpretation',
    'Option C: Partially correct but not complete',
    'Option D: Opposite of correct provision'
  ]
}

function selectAnswer(idx) {
  if (answered.value) return
  selectedAnswer.value = idx
  answered.value = true
  
  const q = activeQuiz.value.questions[currentIndex.value]
  if (idx === q.correct) {
    score.value++
    earnedXP.value += q.marks * 10
  } else {
    wrongAnswers.value.push({
      id: q.id,
      question: q.question,
      yourAnswer: q.options[idx],
      correctAnswer: q.options[q.correct],
      subject: q.subject,
      chapter: form.chapter,
      year: '2024-AI',
      marks: q.marks,
      timesAsked: q.timesAsked,
      explanation: q.explanation.simple
    })
  }

  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred(idx === q.correct ? 'success' : 'error')
  }
}

function nextQuestion() {
  if (currentIndex.value + 1 < activeQuiz.value.questions.length) {
    currentIndex.value++
    selectedAnswer.value = null
    answered.value = false
  } else {
    // Finish quiz
    earnedXP.value = score.value * 20 + (activeQuiz.value.questions.length - wrongAnswers.value.length) * 5
    store.completeQuiz(earnedXP.value, wrongAnswers.value)
    showResult.value = true
  }
}

function getOptionClass(idx) {
  if (!answered.value) {
    return selectedAnswer.value === idx ? 'bg-blue-50 border-blue-300 text-blue-800' : 'bg-white border-[#E5F7E9] hover:border-blue-200'
  }
  const q = activeQuiz.value.questions[currentIndex.value]
  if (idx === q.correct) return 'bg-green-50 border-green-300 text-green-800 font-semibold'
  if (idx === selectedAnswer.value && idx !== q.correct) return 'bg-red-50 border-red-300 text-red-800'
  return 'bg-white border-gray-100 text-gray-400'
}

function shareResult() {
  const text = `🤖 I scored ${score.value}/${activeQuiz.value.questions.length} in AI Quiz (${form.subject} - ${form.chapter}) by Meta AI! ${earnedXP.value} XP earned. Try: https://t.me/yourbot`
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent('https://t.me/yourbot')}&text=${encodeURIComponent(text)}`)
  } else {
    navigator.clipboard.writeText(text)
    alert('Result copied!')
  }
}
</script>
