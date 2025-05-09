import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFooter = defineStore(
  'footer',
  () => {
    const value = ref(false)
    const line = ref('老板，记得要请我好好喝几杯！')

    return { value, line }
  },
  {
    persist: true,
  },
)
