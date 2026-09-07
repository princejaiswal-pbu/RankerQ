import { ref, computed } from 'vue'

const name = ref(localStorage.getItem('ca_name') || '')
const level = ref(localStorage.getItem('ca_level') || '')
const screen = ref(name.value ? 'main' : 'splash')

export function useUserStore() {
  const userName = computed(() => name.value)
  const userLevel = computed(() => level.value)
  const isOnboarded = computed(() => !!name.value && !!level.value)

  function setUser(newName, newLevel) {
    name.value = newName
    level.value = newLevel
    localStorage.setItem('ca_name', newName)
    localStorage.setItem('ca_level', newLevel)
    screen.value = 'main'
  }

  return { name, level, screen, userName, userLevel, isOnboarded, setUser }
}
