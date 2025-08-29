import type { Log } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLog = defineStore(
  'log',
  () => {
    const value = ref<Log>({
      projects: [],
      events: [],
    })

    return { value }
  },
  {
    persist: true,
  },
)
