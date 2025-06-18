import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { type ThemeInstance } from 'vuetify'

export const useCustomTheme = defineStore(
  'custom-themes',
  () => {
    const provider = ref<ThemeInstance>()
    const isDark = ref(false)

    function inject(_provider: ThemeInstance) {
      provider.value = _provider
    }

    watch(
      [() => provider.value, () => isDark.value],
      () => {
        if (provider.value) {
          provider.value.global.name = isDark.value ? 'dark' : 'light'
        }
      },
      {
        immediate: true,
      },
    )

    const enableGlassmorphism = ref(true)
    const enableBackgroundImage = ref(true)
    const bgi = ref()

    return {
      inject,
      isDark,
      enableGlassmorphism,
      enableBackgroundImage,
      bgi,
    }
  },
  {
    persist: true,
  },
)
