import { ref, computed } from 'vue'

const name = ref('')
const level = ref('')
const screen = ref('splash')
const isLoaded = ref(false)
const streak = ref(0)
const quizzesDone = ref(0)
const xp = ref(0)
const lastLogin = ref('')
const notifications = ref([
  { id: 1, title: 'New Quiz Live!', desc: 'Business Law - Contracts is now live. +150 XP', time: '2h ago', read: false, icon: '📝' },
  { id: 2, title: 'Streak Reminder', desc: 'Complete a quiz today to keep your 7-day streak!', time: '5h ago', read: false, icon: '🔥' },
  { id: 3, title: 'Doubt Solved', desc: 'Your doubt on void vs voidable contract is solved', time: '1d ago', read: true, icon: '✅' },
])

function getCloudStorage() {
  return window.Telegram?.WebApp?.CloudStorage || null
}

function getTodayString() {
  return new Date().toISOString().split('T')[0]
}

function getYesterdayString() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

// Save single item to both storages
function saveItem(key, value) {
  const cloud = getCloudStorage()
  const strValue = String(value)
  localStorage.setItem(key, strValue)
  if (cloud) {
    cloud.setItem(key, strValue, (err) => {
      if (err) console.error(`CloudStorage save ${key} error:`, err)
    })
  }
}

function getItemLocal(key) {
  return localStorage.getItem(key)
}

// Calculate streak logic
function calculateStreak() {
  const today = getTodayString()
  const yesterday = getYesterdayString()
  const last = lastLogin.value || getItemLocal('ca_last_login')

  if (!last) {
    // First ever login
    streak.value = 1
    lastLogin.value = today
    saveItem('ca_streak', '1')
    saveItem('ca_last_login', today)
    return
  }

  if (last === today) {
    // Already logged today, keep streak
    return
  } else if (last === yesterday) {
    // Consecutive day - increase streak
    streak.value = (parseInt(getItemLocal('ca_streak') || '0') || streak.value) + 1
    lastLogin.value = today
    saveItem('ca_streak', String(streak.value))
    saveItem('ca_last_login', today)
    
    // Add streak notification
    notifications.value.unshift({
      id: Date.now(),
      title: `🔥 ${streak.value}-Day Streak!`,
      desc: `Amazing! You're on a ${streak.value}-day learning streak`,
      time: 'Just now',
      read: false,
      icon: '🔥'
    })
  } else {
    // Streak broken - reset to 1
    streak.value = 1
    lastLogin.value = today
    saveItem('ca_streak', '1')
    saveItem('ca_last_login', today)
  }
}

export async function saveUserToTelegramStorage(userName, userLevel) {
  const cloud = getCloudStorage()
  const data = {
    name: userName,
    level: userLevel,
    timestamp: Date.now(),
    streak: streak.value,
    quizzes: quizzesDone.value,
    xp: xp.value
  }
  
  // Always save to localStorage as backup
  localStorage.setItem('ca_name', userName)
  localStorage.setItem('ca_level', userLevel)
  localStorage.setItem('ca_user', JSON.stringify(data))
  localStorage.setItem('ca_streak', String(streak.value))
  localStorage.setItem('ca_quizzes', String(quizzesDone.value))
  localStorage.setItem('ca_xp', String(xp.value))

  if (!cloud) {
    console.log('[LocalStorage] Saved:', data)
    return true
  }

  return new Promise((resolve) => {
    cloud.setItem('ca_name', userName, () => {})
    cloud.setItem('ca_level', userLevel, () => {})
    cloud.setItem('ca_user', JSON.stringify(data), (err) => {
      if (err) {
        console.error('CloudStorage save error:', err)
        resolve(false)
      } else {
        console.log('[Telegram CloudStorage] Saved:', data)
        resolve(true)
      }
    })
    cloud.setItem('ca_streak', String(streak.value), () => {})
    cloud.setItem('ca_last_login', lastLogin.value || getTodayString(), () => {})
    cloud.setItem('ca_quizzes', String(quizzesDone.value), () => {})
    cloud.setItem('ca_xp', String(xp.value), () => {})
  })
}

export async function loadUserFromTelegramStorage() {
  const cloud = getCloudStorage()

  // Load local data first for instant UI
  const localName = localStorage.getItem('ca_name')
  const localLevel = localStorage.getItem('ca_level')
  const localStreak = parseInt(localStorage.getItem('ca_streak') || '0')
  const localQuizzes = parseInt(localStorage.getItem('ca_quizzes') || '0')
  const localXp = parseInt(localStorage.getItem('ca_xp') || '0')
  const localLastLogin = localStorage.getItem('ca_last_login')

  if (localStreak) streak.value = localStreak
  if (localQuizzes) quizzesDone.value = localQuizzes
  if (localXp) xp.value = localXp
  if (localLastLogin) lastLogin.value = localLastLogin

  if (!cloud) {
    if (localName && localLevel) {
      name.value = localName
      level.value = localLevel
      screen.value = 'main'
      calculateStreak()
    } else {
      screen.value = 'splash'
    }
    isLoaded.value = true
    return { name: name.value, level: level.value }
  }

  return new Promise((resolve) => {
    cloud.getItems(['ca_name', 'ca_level', 'ca_user', 'ca_streak', 'ca_last_login', 'ca_quizzes', 'ca_xp'], (err, values) => {
      if (err) {
        console.error('CloudStorage load error:', err)
        // Fallback to local
        if (localName && localLevel) {
          name.value = localName
          level.value = localLevel
          screen.value = 'main'
        } else {
          screen.value = 'splash'
        }
        isLoaded.value = true
        resolve({ name: name.value, level: level.value })
        return
      }

      console.log('[Telegram CloudStorage] Loaded:', values)
      
      if (values.ca_name && values.ca_level) {
        name.value = values.ca_name
        level.value = values.ca_level
        streak.value = parseInt(values.ca_streak || localStreak || '1')
        quizzesDone.value = parseInt(values.ca_quizzes || localQuizzes || '0')
        xp.value = parseInt(values.ca_xp || localXp || '0')
        lastLogin.value = values.ca_last_login || ''
        screen.value = 'main'
        calculateStreak()
      } else if (values.ca_user) {
        try {
          const parsed = JSON.parse(values.ca_user)
          name.value = parsed.name || localName || ''
          level.value = parsed.level || localLevel || ''
          streak.value = parsed.streak || localStreak || 1
          quizzesDone.value = parsed.quizzes || localQuizzes || 0
          xp.value = parsed.xp || localXp || 0
          if (name.value) screen.value = 'main'
          calculateStreak()
        } catch(e) {
          screen.value = localName ? 'main' : 'splash'
        }
      } else {
        if (localName) {
          name.value = localName
          level.value = localLevel
          screen.value = 'main'
          calculateStreak()
        } else {
          screen.value = 'splash'
        }
      }
      
      isLoaded.value = true
      resolve({ name: name.value, level: level.value })
    })
  })
}

export async function clearUserStorage() {
  const cloud = getCloudStorage()
  localStorage.removeItem('ca_name')
  localStorage.removeItem('ca_level')
  localStorage.removeItem('ca_user')
  localStorage.removeItem('ca_streak')
  localStorage.removeItem('ca_last_login')
  localStorage.removeItem('ca_quizzes')
  localStorage.removeItem('ca_xp')
  
  name.value = ''
  level.value = ''
  streak.value = 0
  quizzesDone.value = 0
  xp.value = 0
  lastLogin.value = ''
  screen.value = 'form'

  if (!cloud) return

  return new Promise((resolve) => {
    cloud.removeItems(['ca_name', 'ca_level', 'ca_user', 'ca_streak', 'ca_last_login', 'ca_quizzes', 'ca_xp'], () => {
      resolve()
    })
  })
}

export function useUserStore() {
  const userName = computed(() => name.value)
  const userLevel = computed(() => level.value)
  const isOnboarded = computed(() => !!name.value && !!level.value)
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  
  // Rank calculation based on XP: every 300 XP = +1 rank up (lower number = better)
  const currentRank = computed(() => {
    const baseRank = 50
    const rankFromXp = Math.max(1, baseRank - Math.floor(xp.value / 300))
    return rankFromXp
  })

  async function setUser(newName, newLevel) {
    name.value = newName
    level.value = newLevel
    // If first time, set streak to 1
    if (streak.value === 0) {
      streak.value = 1
      lastLogin.value = getTodayString()
    }
    await saveUserToTelegramStorage(newName, newLevel)
    screen.value = 'main'
  }

  async function updateUser(newName, newLevel) {
    name.value = newName
    level.value = newLevel
    await saveUserToTelegramStorage(newName, newLevel)
  }

  function completeQuiz(xpEarned = 150) {
    quizzesDone.value += 1
    xp.value += xpEarned
    // Recalculate streak on quiz completion
    calculateStreak()
    saveItem('ca_quizzes', String(quizzesDone.value))
    saveItem('ca_xp', String(xp.value))
    // Save all
    saveUserToTelegramStorage(name.value, level.value)
    
    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.notificationOccurred('success')
    }
  }

  function markAllNotificationsRead() {
    notifications.value = notifications.value.map(n => ({ ...n, read: true }))
  }

  function markNotificationRead(id) {
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.read = true
  }

  return { 
    name, level, screen, isLoaded, streak, quizzesDone, xp, lastLogin, notifications, unreadCount, currentRank,
    userName, userLevel, isOnboarded,
    setUser, updateUser, completeQuiz,
    loadUserFromTelegramStorage, saveUserToTelegramStorage, clearUserStorage,
    calculateStreak, markAllNotificationsRead, markNotificationRead
  }
}
