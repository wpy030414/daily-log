import type { EventItem } from '@/types/eventItem'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEvent = defineStore(
  'events',
  () => {
    const value = ref<EventItem[]>([])

    return { value }
  },
  {
    persist: true,
  },
)
