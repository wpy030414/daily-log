<script setup lang="ts">
import VEventCard from '@/components/VEventCard.vue'
import VProjectCard from '@/components/VProjectCard.vue'
import { useEvent } from '@/stores/events'
import { useProject } from '@/stores/projects'
import { shotElement } from '@/utils'
</script>

<template>
  <div id="preview" class="px-10 py-10 mb-4">
    <h1>项目</h1>

    <article v-if="useProject().value.length">
      <v-project-card v-for="p in useProject().value" :p="p" />
    </article>
    <v-empty-state v-else headline="¯\_(ツ)_/¯"></v-empty-state>

    <h1>事件</h1>

    <article v-if="useEvent().value.length">
      <v-event-card v-for="e in useEvent().value" :e="e" />
    </article>
    <v-empty-state v-else headline="¯\_(ツ)_/¯"></v-empty-state>
  </div>
  <div class="px-10 pb-10">
    <v-btn title="下载" class="mr-4" @click="shotElement('#preview', 'download')"
      ><v-icon icon="mdi-download"></v-icon
    ></v-btn>

    <v-btn title="复制" @click="shotElement('#preview', 'copy')"
      ><v-icon icon="mdi-content-copy"></v-icon
    ></v-btn>

    <canvas v-show="false" id="screenshot-container"></canvas>
  </div>
</template>

<style scoped>
#preview {
  background: var(--color-bg-main);
  perspective: 100px;

  & h1 {
    color: var(--color-bg-main-reverse);
  }

  & h4 {
    color: var(--color-bg-sub-reverse);
  }

  & > * {
    margin-bottom: 1rem;
    transform-style: preserve-3d;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
