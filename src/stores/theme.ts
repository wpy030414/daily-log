import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useCustomTheme = defineStore(
  'theme',
  () => {
    const value = ref('青葱绿')

    const options = new Map([
      ['西洋紫', 'pink'],
      ['火山红', 'red'],
      ['青葱绿', 'green'],
      ['远空蓝', 'blue'],
    ])

    watch(
      value,
      () => {
        document.documentElement.setAttribute('theme', '' + options.get(value.value))
      },
      { immediate: true },
    )

    const now = computed(() => {
      console.debug(value.value)

      return (
        type:
          | 'bg-main'
          | 'bg-sub'
          | 't-main'
          | 'bg-main-reverse'
          | 'bg-sub-reverse'
          | 't-main-reverse',
      ) => window.getComputedStyle(document.documentElement).getPropertyValue(`--color-${type}`)
    })

    return { value, options: Array.from(options.keys()), now }
  },
  {
    persist: true,
  },
)
