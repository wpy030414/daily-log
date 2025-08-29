<script setup lang="ts">
import VMacPanel from '@/components/VMacPanel.vue'
import { useCustomTheme } from '@/stores/custom-theme'
import { useLog } from '@/stores/log'
import { copyAsText, shotElement } from '@/utils'
import { ref } from 'vue'

const showPanel = ref(true)
</script>

<template>
  <div
    id="preview"
    :enable-background="useCustomTheme().enableBackgroundImage"
    :style="[
      useCustomTheme().enableBackgroundImage && useCustomTheme().bgi
        ? `background-image: url(${useCustomTheme().bgi})`
        : '',
    ]"
  >
    <p class="border"></p>

    <v-mac-panel
      v-if="showPanel"
      :actions="[
        () => copyAsText(useLog().value),
        () => shotElement('#preview', 'copy'),
        () => shotElement('#preview', 'download'),
      ]"
      :log="useLog().value"
    ></v-mac-panel>

    <p class="border"></p>
  </div>
</template>

<style scoped>
#preview {
  background: white;

  &[enable-background='true'] {
    background: url('@/assets/panel-background.jpg') no-repeat center center;
    background-size: cover;
  }

  & > .border {
    opacity: 0;
  }
}
</style>
