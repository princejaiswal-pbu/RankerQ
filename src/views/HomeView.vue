<template>
  <div class="home-view p-4 pb-28 bg-gradient-to-b from-indigo-50/50 to-white min-h-full">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="jakarta text-[22px] font-black text-gray-900 tracking-tight">Hi, {{ firstName }} 👋</h1>
        <p class="text-[13px] text-gray-500 mt-1 font-medium">Ready to level up? Lvl {{ currentLevel }} • {{ xp }} XP</p>
      </div>
      <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black shadow">⚡</div>
    </div>

    <div class="mt-5 grid grid-cols-3 gap-3">
      <div class="bg-white rounded-[16px] border border-indigo-100 p-3 text-center shadow-sm cursor-pointer" @click="showStreakInfo=true">
        <p class="text-[22px] font-black jakarta text-gray-900">{{ streak }}🔥</p>
        <p class="text-[9px] uppercase tracking-widest text-gray-400 font-black mt-1">Streak</p>
        <p class="text-[9px] text-orange-600 font-bold mt-1">{{ streakText }}</p>
      </div>
      <div class="bg-white rounded-[16px] border border-indigo-100 p-3 text-center shadow-sm">
        <p class="text-[22px] font-black jakarta text-indigo-600">{{ quizzesDone }}</p>
        <p class="text-[9px] uppercase tracking-widest text-gray-400 font-black mt-1">Quizzes</p>
        <p class="text-[9px] text-indigo-600 font-bold mt-1">+{{ xp }} XP</p>
      </div>
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[16px] p-3 text-center shadow-sm cursor-pointer text-white" @click="$emit('goLeague')">
        <p class="text-[22px] font-black jakarta">#{{ rank }}</p>
        <p class="text-[9px] uppercase tracking-widest text-white/60 font-black mt-1">Rank</p>
        <p class="text-[9px] text-white/70 font-bold mt-1">Top {{ rankPercent }}%</p>
      </div>
    </div>

    <div class="mt-4 bg-white rounded-[16px] border border-indigo-100 p-3 shadow-sm flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-black text-[14px]">{{ currentLevel }}</div>
      <div class="flex-1 min-w-0">
        <div class="flex justify-between text-[11px] font-black">
          <span class="text-gray-700">Level {{ currentLevel }}</span>
          <span class="text-indigo-600">{{ xp % 1000 }}/1000 XP</span>
        </div>
        <div class="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-yellow-400 rounded-full transition-all" :style="{width: levelProgress+'%'}"></div>
        </div>
      </div>
      <span class="text-[18px]">🎯</span>
    </div>

    <!-- Daily Quest removed intentionally -->

    <div class="mt-5 rounded-[22px] bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-[1.5px] cursor-pointer" @click="$emit('goAIQuiz')">
      <div class="rounded-[21px] bg-white p-4 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16"></div>
        <div class="flex justify-between items-start relative z-10">
          <div class="flex gap-3">
            <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xl shadow">✨</div>
            <div>
              <p class="text-[11px] font-black tracking-widest uppercase text-indigo-600">AI Quest Generator</p>
              <h3 class="jakarta font-black text-[16px] text-gray-900 mt-0.5">Build a quiz from any topic</h3>
              <p class="text-[11px] text-gray-500 mt-1">Better questions • real options • clear explanations</p>
            </div>
          </div>
          <span class="text-[10px] font-black px-2 py-1 rounded-full bg-yellow-400 text-black">AI</span>
        </div>
        <div class="mt-3 grid grid-cols-3 gap-2 text-[10px] relative z-10">
          <div class="p-2 rounded-lg bg-indigo-50 text-center"><b class="text-indigo-700">5/10/15 Q</b><p class="text-gray-500 mt-0.5">Choose size</p></div>
          <div class="p-2 rounded-lg bg-purple-50 text-center"><b class="text-purple-700">30/60/90s</b><p class="text-gray-500 mt-0.5">Timer</p></div>
          <div class="p-2 rounded-lg bg-amber-50 text-center"><b class="text-amber-700">Explain</b><p class="text-gray-500 mt-0.5">After answer</p></div>
        </div>
        <div class="mt-3 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center text-[12px] font-black">🚀 Create AI Quiz →</div>
      </div>
    </div>

    <div class="mt-5 rounded-[20px] border border-indigo-100 bg-white p-4 shadow-sm cursor-pointer" @click="$emit('goResources')">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-xl">📚</div>
          <div>
            <p class="text-[10px] font-black tracking-widest uppercase text-amber-600">ICAI Resource Hub</p>
            <h3 class="jakarta font-black text-[15px] text-gray-900 mt-0.5">PYQ • RTP • MTP • Suggested Answers</h3>
            <p class="text-[11px] text-gray-500 mt-0.5">Foundation, Intermediate & Final • all attempts</p>
          </div>
        </div>
        <span class="text-gray-400 font-black text-xl">›</span>
      </div>
    </div>

    <div v-if="bookmarkCount>0" class="mt-5 rounded-[20px] border border-amber-200 bg-white p-4 cursor-pointer shadow-sm" @click="$emit('goBookmarks')">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[10px] font-black tracking-widest uppercase text-amber-600">Saved for Revision</p>
          <h3 class="jakarta font-black text-[14px] text-gray-900 mt-1">{{ bookmarkCount }} bookmarked questions</h3>
        </div>
        <span class="text-gray-400 font-black">›</span>
      </div>
    </div>

    <div class="mt-5 rounded-2xl bg-gradient-to-r from-gray-900 via-indigo-900 to-gray-900 p-4 text-white cursor-pointer shadow" @click="$emit('goLeague')">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-[10px] font-black tracking-widest uppercase opacity-60">Gold League</p>
          <p class="jakarta font-black text-[14px] mt-1">You are #{{ rank }} • {{ streak }}🔥 • Lvl {{ currentLevel }}</p>
          <p class="text-[11px] opacity-70 mt-0.5">{{ xp }} XP • Top {{ rankPercent }}%</p>
        </div>
        <span class="text-2xl">🏆</span>
      </div>
    </div>

    <div v-if="showStreakInfo" class="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4" @click.self="showStreakInfo=false">
      <div class="w-full max-w-[360px] bg-white rounded-[22px] p-5">
        <h3 class="jakarta font-black text-lg">Your streak 🔥</h3>
        <p class="text-sm text-gray-600 mt-2">Complete quizzes regularly to keep your streak alive.</p>
        <button @click="showStreakInfo=false" class="mt-4 w-full h-11 rounded-xl bg-gray-900 text-white font-black">Got it</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'

const props = defineProps({ user:Object })
defineEmits(['goLeague','goBookmarks','goAIQuiz','goResources'])
const store = useUserStore()
const showStreakInfo = ref(false)
const firstName = computed(() => (props.user?.name || 'Student').split(' ')[0])
const streak = computed(() => store.streak.value)
const quizzesDone = computed(() => store.quizzesDone.value)
const xp = computed(() => store.xp.value)
const rank = computed(() => store.currentRank.value)
const bookmarkCount = computed(() => store.bookmarkCount.value)
const currentLevel = computed(() => store.currentLevel.value)
const levelProgress = computed(() => store.levelProgress.value)
const rankPercent = computed(() => Math.max(1, Math.min(99, Math.floor((rank.value / 50) * 100))))
const streakText = computed(() => streak.value === 0 ? 'Start today' : streak.value === 1 ? 'Day 1' : streak.value < 7 ? `${streak.value} days` : 'On fire! 🔥')
</script>
