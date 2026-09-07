<template>
  <div class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" @click.self="$emit('close')">
    <section class="w-full max-w-[380px] max-h-[90vh] overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl">
      <div class="flex items-center justify-between"><button class="text-[12px] font-semibold text-gray-500" @click="$emit('close')">← Exit</button><span class="rounded-full bg-ca-50 px-3 py-1 text-[11px] font-bold text-ca-700">{{ index + 1 }} / {{ questions.length }}</span></div>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"><div class="h-full rounded-full bg-ca-600 transition-all" :style="{ width: `${((index + 1) / questions.length) * 100}%` }" /></div>
      <p class="mt-5 text-[10px] font-bold uppercase tracking-widest text-ca-600">{{ question.subject }} • {{ question.marks }} marks</p>
      <h2 class="jakarta mt-2 text-[17px] font-bold leading-6 text-gray-900">{{ question.question }}</h2>
      <div class="mt-5 space-y-2">
        <button v-for="(option, optionIndex) in question.options" :key="option" :disabled="answered" @click="answer(optionIndex)" :class="optionClass(optionIndex)" class="w-full rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition">
          {{ String.fromCharCode(65 + optionIndex) }}. {{ option }}
        </button>
      </div>
      <div v-if="answered" class="mt-4 rounded-xl border border-ca-100 bg-ca-50 p-3 text-[12px] leading-5 text-gray-700"><b class="text-ca-700">Explanation:</b> {{ question.explanation }}</div>
      <button :disabled="!answered" @click="next" :class="answered ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'" class="mt-5 h-11 w-full rounded-xl text-[13px] font-semibold">{{ index + 1 === questions.length ? 'Finish quiz →' : 'Next question →' }}</button>
    </section>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
const props = defineProps({ questions: { type: Array, required: true } })
const emit = defineEmits(['complete', 'close'])
const index = ref(0), selected = ref(null), answered = ref(false), score = ref(0), wrongAnswers = ref([])
const question = computed(() => props.questions[index.value])
function answer(optionIndex) {
  if (answered.value) return
  selected.value = optionIndex; answered.value = true
  if (optionIndex === question.value.correct) score.value++
  else wrongAnswers.value.push({ ...question.value, yourAnswer: question.value.options[optionIndex], correctAnswer: question.value.options[question.value.correct] })
}
function next() {
  if (index.value + 1 < props.questions.length) { index.value++; selected.value = null; answered.value = false; return }
  emit('complete', { score: score.value, wrongAnswers: wrongAnswers.value })
}
function optionClass(optionIndex) {
  if (!answered.value) return 'border-[#E5F7E9] bg-white hover:border-ca-300'
  if (optionIndex === question.value.correct) return 'border-green-300 bg-green-50 text-green-800'
  if (optionIndex === selected.value) return 'border-red-300 bg-red-50 text-red-800'
  return 'border-gray-100 text-gray-400'
}
</script>
