<template>
  <div class="p-0">
    <!-- Header -->
    <div class="bg-gradient-to-b from-ca-600 to-ca-700 p-6 pb-10 text-white">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-[18px] bg-white text-ca-700 flex items-center justify-center font-bold text-xl jakarta shadow-lg">{{ user.name[0] }}</div>
        <div>
          <p class="jakarta font-bold text-[18px]">{{ user.name }}</p>
          <p class="text-[12px] opacity-80 mt-0.5">{{ user.level }} • ID: CA{{ user.id }}</p>
          <span class="mt-2 inline-block text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold tracking-widest uppercase">Active Learner</span>
        </div>
      </div>
    </div>

    <div class="-mt-6 px-5">
      <!-- Stats -->
      <div class="ca-card p-4 grid grid-cols-3 divide-x divide-ca-50 text-center">
        <div><p class="jakarta font-bold text-[18px]">42</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Quizzes</p></div>
        <div><p class="jakarta font-bold text-[18px]">87%</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Accuracy</p></div>
        <div><p class="jakarta font-bold text-[18px]">12</p><p class="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Doubts</p></div>
      </div>

      <!-- Menu -->
      <div class="mt-5 ca-card overflow-hidden">
        <button v-for="item in menu" :key="item.label" class="w-full flex items-center justify-between px-4 py-3.5 border-b last:border-0 border-ca-50 hover:bg-[#F9FFFB] transition">
          <span class="flex items-center gap-3">
            <span class="w-8 h-8 rounded-lg bg-ca-50 flex items-center justify-center text-sm">{{ item.icon }}</span>
            <span class="text-[13px] font-medium text-gray-900">{{ item.label }}</span>
          </span>
          <span class="text-gray-400">›</span>
        </button>
      </div>

      <button class="mt-5 w-full h-[44px] rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold text-[13px] hover:bg-red-100 transition">Log out</button>
      <p class="mt-3 text-center text-[11px] text-gray-400">v1.0.0 • Telegram Mini App</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ user: Object })
const menu = [
  { label: 'Edit Profile', icon: '✏️' },
  { label: 'Study Material', icon: '📚' },
  { label: 'Notifications', icon: '🔔' },
  { label: 'Certificate', icon: '🎖️' },
  { label: 'About CA Series', icon: 'ℹ️' },
]
</script>
