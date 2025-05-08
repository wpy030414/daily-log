import type { ProjectItem } from '@/types/projectItem'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProject = defineStore(
  'projects',
  () => {
    const value = ref<ProjectItem[]>([])

    return { value }
  },
  {
    persist: true,
  },
)
