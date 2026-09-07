<template>
  <div class="h-[56px] px-5 flex items-center justify-between bg-white border-b border-[#E5F7E9] shrink-0 sticky top-0 z-20">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-lg bg-ca-600 flex items-center justify-center text-white font-bold jakarta text-[13px]">CA</div>
      <span class="jakarta font-bold text-[15px] text-gray-900">CA Series</span>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-ca-50 border border-ca-100 text-ca-700 font-bold uppercase tracking-wide">{{ user.level }}</span>
    </div>
    <button class="w-8 h-8 rounded-full bg-ca-50 flex items-center justify-center text-sm hover:bg-ca-100 transition">🔔</button>
  </div>
</template>

<script setup>
defineProps({ user: Object })
</script>
