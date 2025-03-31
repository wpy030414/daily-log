import type { EventItem } from '@/types/eventItem'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventStore = defineStore(
  'events',
  () => {
    const events = ref<EventItem[]>([])

    return { events }
  },
  {
    persist: true,
  },
)
