import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const darkMode = ref(localStorage.getItem('tracera_dark') === 'true')

  function initDarkMode() {
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value
    localStorage.setItem('tracera_dark', darkMode.value)
    document.documentElement.classList.toggle('dark', darkMode.value)
  }

  return { darkMode, initDarkMode, toggleDarkMode }
})
