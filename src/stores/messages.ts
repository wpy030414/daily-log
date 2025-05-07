import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessage = defineStore('msg', () => {
  const value = ref<any[]>([])

  function push(text: string, color: string) {
    value.value.push({
      text,
      color,
      location: 'top center',
    })
  }

  function success(text: string) {
    push(text, 'success')
  }

  function info(text: string) {
    push(text, 'info')
  }

  function warning(text: string) {
    push(text, 'warning')
  }

  function error(text: string) {
    push(text, 'error')
  }

  return { value, success, info, warning, error }
})
