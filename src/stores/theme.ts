import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTheme = defineStore(
  'theme',
  () => {
    const value = ref('海湾蓝')

    const options = new Map([
      ['西洋紫', 'pink'],
      ['火山红', 'red'],
      ['青葱绿', 'green'],
      ['海湾蓝', 'blue'],
    ])

    watch(
      value,
      () => {
        document.documentElement.setAttribute('theme', '' + options.get(value.value))
      },
      { immediate: true },
    )

    return { value, options: Array.from(options.keys()) }
  },
  {
    persist: true,
  },
)
