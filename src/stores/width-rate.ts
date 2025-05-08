import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'

export const useWidthRate = defineStore('width-rate', () => {
  function init() {
    onMounted(() => {
      window.addEventListener(
        'resize',
        () => (value.value = window.innerWidth / window.screen.width),
      )
    })
  }

  const value = ref(window.innerWidth / window.screen.width)

  return { init, value }
})
