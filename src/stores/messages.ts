import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessage = defineStore('msgs', () => {
  const timeout = ref(2000)
  const value = ref<any[]>([])

  async function push(text: string, color: string) {
    timeout.value = 0
    await new Promise((res) => setTimeout(res, 10))
    timeout.value = 2000
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

  return { timeout, value, success, info, warning, error }
})
