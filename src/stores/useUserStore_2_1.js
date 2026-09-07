import { ref, computed } from 'vue'

const name = ref('')
const level = ref('')
const screen = ref('splash')
const isLoaded = ref(false)

// Helper: get Telegram CloudStorage or fallback
function getCloudStorage() {
  return window.Telegram?.WebApp?.CloudStorage || null
}

// Save to Telegram CloudStorage (persists across devices)
export async function saveUserToTelegramStorage(userName, userLevel) {
  const cloud = getCloudStorage()
  const data = {
    name: userName,
    level: userLevel,
    timestamp: Date.now()
  }
  
  // For local dev outside Telegram
  if (!cloud) {
    localStorage.setItem('ca_name', userName)
    localStorage.setItem('ca_level', userLevel)
    localStorage.setItem('ca_user', JSON.stringify(data))
    console.log('[LocalStorage] Saved:', data)
    return true
  }

  // Telegram CloudStorage - official way
  return new Promise((resolve) => {
    cloud.setItem('ca_name', userName, (err) => {
      if (err) console.error('CloudStorage save name error:', err)
    })
    cloud.setItem('ca_level', userLevel, (err) => {
      if (err) console.error('CloudStorage save level error:', err)
    })
    cloud.setItem('ca_user', JSON.stringify(data), (err) => {
      if (err) {
        console.error('CloudStorage save user error:', err)
        resolve(false)
      } else {
        console.log('[Telegram CloudStorage] Saved:', data)
        resolve(true)
      }
    })
  })
}

// Load from Telegram CloudStorage
export async function loadUserFromTelegramStorage() {
  const cloud = getCloudStorage()

  if (!cloud) {
    // Local dev fallback
    const localName = localStorage.getItem('ca_name')
    const localLevel = localStorage.getItem('ca_level')
    if (localName && localLevel) {
      name.value = localName
      level.value = localLevel
      screen.value = 'main'
      console.log('[LocalStorage] Loaded:', localName, localLevel)
    } else {
      screen.value = 'splash'
    }
    isLoaded.value = true
    return { name: name.value, level: level.value }
  }

  // Telegram CloudStorage - getItems
  return new Promise((resolve) => {
    cloud.getItems(['ca_name', 'ca_level', 'ca_user'], (err, values) => {
      if (err) {
        console.error('CloudStorage load error:', err)
        screen.value = 'splash'
        isLoaded.value = true
        resolve({ name: '', level: '' })
        return
      }

      console.log('[Telegram CloudStorage] Loaded:', values)
      
      if (values.ca_name && values.ca_level) {
        name.value = values.ca_name
        level.value = values.ca_level
        screen.value = 'main' // Skip onboarding if data exists
      } else if (values.ca_user) {
        try {
          const parsed = JSON.parse(values.ca_user)
          name.value = parsed.name
          level.value = parsed.level
          screen.value = 'main'
        } catch(e) {
          screen.value = 'splash'
        }
      } else {
        screen.value = 'splash'
      }
      
      isLoaded.value = true
      resolve({ name: name.value, level: level.value })
    })
  })
}

// Clear storage (for logout)
export async function clearUserStorage() {
  const cloud = getCloudStorage()
  
  if (!cloud) {
    localStorage.removeItem('ca_name')
    localStorage.removeItem('ca_level')
    localStorage.removeItem('ca_user')
    name.value = ''
    level.value = ''
    screen.value = 'form'
    return
  }

  return new Promise((resolve) => {
    cloud.removeItems(['ca_name', 'ca_level', 'ca_user'], (err) => {
      if (err) console.error('Clear error:', err)
      name.value = ''
      level.value = ''
      screen.value = 'form'
      resolve()
    })
  })
}

export function useUserStore() {
  const userName = computed(() => name.value)
  const userLevel = computed(() => level.value)
  const isOnboarded = computed(() => !!name.value && !!level.value)

  async function setUser(newName, newLevel) {
    await saveUserToTelegramStorage(newName, newLevel)
    name.value = newName
    level.value = newLevel
    screen.value = 'main'
  }

  return { 
    name, 
    level, 
    screen, 
    isLoaded,
    userName, 
    userLevel, 
    isOnboarded, 
    setUser,
    loadUserFromTelegramStorage,
    saveUserToTelegramStorage,
    clearUserStorage
  }
}
