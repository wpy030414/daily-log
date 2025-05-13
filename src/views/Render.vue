<script setup lang="ts">
import VEventCard from '@/components/VEventCard.vue'
import VProjectCard from '@/components/VProjectCard.vue'
import { useCustomTheme } from '@/stores/custom-theme'
import { useEvent } from '@/stores/events'
import { useFooter } from '@/stores/footer'
import { useProject } from '@/stores/projects'
import { shotElement } from '@/utils'
</script>

<template>
  <div id="preview" class="px-10 py-10 mb-4">
    <h1>项目</h1>

    <article v-if="useProject().value.length">
      <v-project-card v-for="p of useProject().value" :p="p" :key="JSON.stringify(p)" />
    </article>
    <v-empty-state v-else headline="¯\_(ツ)_/¯"></v-empty-state>

    <h1>事件</h1>

    <article v-if="useEvent().value.length">
      <v-event-card v-for="e of useEvent().value" :e="e" :key="JSON.stringify(e)" />
    </article>
    <v-empty-state v-else headline="¯\_(ツ)_/¯"></v-empty-state>

    <v-img v-if="useFooter().value" :src="useFooter().img || 'footer.png'" class="footer-img" cover>
      <v-chip class="footer-chip" :color="useCustomTheme().now('t-main')" size="small">
        {{ useFooter().line }}
      </v-chip>
    </v-img>

    <v-sheet v-if="useFooter().value" height="9rem" class="bg-transparent"></v-sheet>
  </div>

  <div class="px-10 pb-10">
    <v-btn title="下载" class="mr-4" @click="shotElement('#preview', 'download')">
      <v-icon icon="mdi-download"></v-icon>
    </v-btn>

    <v-btn title="复制" @click="shotElement('#preview', 'copy')">
      <v-icon icon="mdi-content-copy"></v-icon>
    </v-btn>

    <canvas v-show="false" id="screenshot-container"></canvas>
  </div>
</template>

<style scoped>
#preview {
  position: relative;
  padding-bottom: calc(2.5rem + 10rem);
  background: var(--color-bg-main);
  perspective: 100px;
  overflow: hidden;

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

  & .footer-img {
    position: absolute;
    left: -3rem;
    bottom: -20rem;
    width: 30rem;
    height: 30rem;
  }

  & .footer-chip {
    position: absolute;
    right: 0;
    top: 3rem;
  }
}
</style>
