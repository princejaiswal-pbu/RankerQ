<template>
  <div class="h-[56px] px-5 flex items-center justify-between bg-white border-b border-[#E5F7E9] shrink-0 sticky top-0 z-20">
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-lg bg-ca-600 flex items-center justify-center text-white font-bold jakarta text-[13px]">CA</div>
      <span class="jakarta font-bold text-[15px] text-gray-900">CA Series</span>
      <span class="text-[10px] px-2 py-0.5 rounded-full bg-ca-50 border border-ca-100 text-ca-700 font-bold uppercase tracking-wide">{{ user.level }}</span>
    </div>
    <button @click="showNotifications = !showNotifications" class="relative w-9 h-9 rounded-full bg-ca-50 flex items-center justify-center text-[16px] hover:bg-ca-100 transition active:scale-95">
      🔔
      <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Notifications Panel -->
    <div v-if="showNotifications" class="fixed inset-0 z-50" @click="showNotifications = false">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      <div class="absolute top-[60px] right-3 left-3 max-w-[360px] ml-auto bg-white rounded-[20px] shadow-2xl border border-[#E5F7E9] overflow-hidden max-h-[70vh] flex flex-col" @click.stop>
        <div class="p-4 border-b border-ca-50 flex justify-between items-center bg-[#F9FFFB]">
          <h3 class="jakarta font-bold text-[15px]">Notifications</h3>
          <div class="flex gap-2">
            <button v-if="unreadCount > 0" @click="markAllRead" class="text-[11px] font-bold text-ca-600 hover:text-ca-700">Mark all read</button>
            <button @click="showNotifications = false" class="w-7 h-7 rounded-full bg-white border flex items-center justify-center text-gray-500 hover:bg-gray-50">✕</button>
          </div>
        </div>
        <div class="overflow-y-auto flex-1">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <p class="text-3xl">🔕</p>
            <p class="text-[13px] text-gray-500 mt-2">No notifications</p>
          </div>
          <div v-for="n in notifications" :key="n.id" @click="readOne(n.id)" class="p-4 border-b last:border-0 border-ca-50 hover:bg-[#F9FFFB] cursor-pointer flex gap-3" :class="{'bg-ca-50/50': !n.read}">
            <div class="w-9 h-9 rounded-full bg-white border border-ca-100 flex items-center justify-center text-sm shrink-0">{{ n.icon }}</div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between gap-2">
                <p class="text-[13px] font-semibold text-gray-900 leading-4">{{ n.title }}</p>
                <span v-if="!n.read" class="w-2 h-2 bg-ca-600 rounded-full shrink-0 mt-1"></span>
              </div>
              <p class="text-[12px] text-gray-500 mt-1 leading-4">{{ n.desc }}</p>
              <p class="text-[10px] text-gray-400 mt-1">{{ n.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/useUserStore.js'

defineProps({ user: Object })
const store = useUserStore()
const showNotifications = ref(false)

const notifications = computed(() => store.notifications.value)
const unreadCount = computed(() => store.unreadCount.value)

function markAllRead() {
  store.markAllNotificationsRead()
}

function readOne(id) {
  store.markNotificationRead(id)
}
</script>
