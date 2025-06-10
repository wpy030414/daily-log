<script setup lang="ts">
import MacPanel from '@/components/MacPanel.vue'
import { useCustomTheme } from '@/stores/custom-theme'
import { useEvent } from '@/stores/events'
import { useProject } from '@/stores/projects'
import { shotElement } from '@/utils'
import { ref } from 'vue'

const showPanel = ref(true)
const draggable = ref(false)

async function switchDraggable() {
  draggable.value = !draggable.value
  showPanel.value = false
  await new Promise((resolve) => setTimeout(resolve))
  showPanel.value = true
}
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

    <mac-panel
      v-if="showPanel"
      v-draggable="draggable"
      :actions="[
        switchDraggable,
        () => shotElement('#preview', 'copy'),
        () => shotElement('#preview', 'download'),
      ]"
      :projects="useProject().value"
      :events="useEvent().value"
    ></mac-panel>

    <p class="border"></p>
  </div>
</template>

<style scoped>
#preview {
  background: white;

  &[enable-background='true'] {
    background: url('panel-background.jpg') no-repeat center center;
    background-size: cover;
  }

  & > .border {
    opacity: 0;
  }
}
</style>
