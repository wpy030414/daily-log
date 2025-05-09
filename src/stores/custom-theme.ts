import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useCustomTheme = defineStore(
  'custom-themes',
  () => {
    const defaultValue = '烈焰红'
    const value = ref(defaultValue)

    const options = new Map([
      ['罗兰紫', 'pink'],
      ['烈焰红', 'red'],
      ['麦秆黄', 'yellow'],
      ['青葱绿', 'green'],
      ['远空蓝', 'blue'],
    ])

    watch(
      value,
      () => {
        if (!Array.from(options.keys()).includes(value.value)) {
          value.value = defaultValue
        }
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
