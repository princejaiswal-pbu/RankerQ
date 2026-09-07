<template>
  <div class="p-5">
    <div class="flex justify-between items-center">
      <h2 class="jakarta text-[18px] font-bold text-gray-900">Doubts</h2>
      <div class="flex bg-ca-50 rounded-full p-1 border border-[#E5F7E9]">
        <button v-for="f in filters" :key="f" @click="filter = f"
          :class="filter === f ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'"
          class="px-3 py-1 rounded-full text-[12px] font-semibold transition">{{ f }}</button>
      </div>
    </div>

    <!-- Ask Box -->
    <div class="mt-5 h-[48px] rounded-xl bg-[#F9FFFB] border-2 border-dashed border-[#BBF7D0] flex items-center gap-3 px-4 cursor-pointer hover:bg-ca-50 transition">
      <span class="w-7 h-7 rounded-full bg-ca-600 text-white flex items-center justify-center text-sm">?</span>
      <span class="text-[13px] text-gray-400">Ask your doubt in Law, Accounts...</span>
    </div>

    <div class="mt-4 space-y-3">
      <div v-for="d in filtered" :key="d.id" class="ca-card p-4 hover:shadow-card-hover transition">
        <p class="text-[13px] font-medium leading-5 text-gray-900">{{ d.q }}</p>
        <div class="mt-3 flex justify-between items-center">
          <span class="text-[11px] text-gray-500">{{ d.subject }} • {{ d.time }}</span>
          <span :class="d.status === 'Solved' ? 'bg-ca-50 text-ca-700 border-ca-200' : 'bg-amber-50 text-amber-700 border-amber-200'"
            class="text-[10px] font-bold px-2 py-1 rounded-full border">{{ d.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const filter = ref('All')
const filters = ['All', 'Pending', 'Solved']

const doubts = ref([
  { id: 1, q: 'Difference between void and voidable contract with example?', subject: 'Law', status: 'Solved', time: '2h ago' },
  { id: 2, q: 'How to calculate goodwill under super profit method?', subject: 'Accounts', status: 'Pending', time: '5h ago' },
  { id: 3, q: 'Section 10 of Contract Act exceptions?', subject: 'Law', status: 'Solved', time: '1d ago' },
  { id: 4, q: 'Treatment of discount on issue of debentures?', subject: 'Accounts', status: 'Pending', time: '2d ago' },
])

const filtered = computed(() => filter.value === 'All' ? doubts.value : doubts.value.filter(d => d.status === filter.value))
</script>
