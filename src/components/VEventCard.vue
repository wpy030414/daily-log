<script setup lang="ts">
import { onActivated, ref, watch } from 'vue'
import VCardX from './VCardX.vue'
import type { EventItem } from '@/types/eventItem'
import { markdownToHtml } from '@/utils'
import mermaid from 'mermaid'

const props = defineProps<{
  e: EventItem
}>()

const textMapper = ref(
  new Map([
    ['worried', 'alert-circle-outline'],
    ['non-worried', 'timetable'],
    ['confused', 'emoticon-confused-outline'],
    ['ok', 'check'],
  ]),
)

const markedBody = ref('')

watch(props.e, (nv) => (markedBody.value = markdownToHtml(nv.body)), {
  immediate: true,
})

async function renderMermaid() {
  await new Promise((res) => setTimeout(res))
  mermaid.run()
  await new Promise((res) => setTimeout(res, 200))
  for (const m of document.querySelectorAll('pre.mermaid')) {
    const svg = m.querySelector('svg')!
    const { width: mW, height: mH } = m.getBoundingClientRect()
    svg.setAttribute('viewBox', `0 0 ${mW} ${mH}`)
    const { width: gW, height: gH } = m.querySelector('svg > g')!.getBoundingClientRect()
    svg.setAttribute('viewBox', `0 0 ${gW + 15} ${gH + 10}`)
  }
}

onActivated(renderMermaid)
watch(markedBody, renderMermaid)
</script>

<template>
  <v-card-x class="item">
    <span :class="['s', e.state, 'mr-4']">
      <v-icon :icon="'mdi-' + textMapper.get(e.state)" size="small"></v-icon>
    </span>
    <p v-html="markedBody || '请输入文本'"></p>
  </v-card-x>
</template>

<style scoped>
.item {
  display: grid;
  grid-template-columns: calc(28px + 2rem) 1fr;

  & .s {
    display: inline-block;
    padding: 0.1rem 0.4rem;
    border-radius: 0.3rem;
    height: 1.8rem;
    color: var(--color-t-main-reverse);
    text-align: center;
  }

  &:hover,
  &.hl {
    & .s {
      background: var(--color-t-main-reverse);
      color: var(--theme);
    }

    & p {
      color: var(--color-t-main-reverse);
    }
  }

  & .worried,
  &:hover:has(.worried),
  &.hl:has(.worried) {
    --theme: var(--color-red);
    background: var(--theme);
  }

  & .non-worried,
  &:hover:has(.non-worried),
  &.hl:has(.non-worried) {
    --theme: var(--color-blue);
    background: var(--theme);
  }

  & .confused,
  &:hover:has(.confused),
  &.hl:has(.confused) {
    --theme: var(--color-orange);
    background: var(--theme);
  }

  & .ok,
  &:hover:has(.ok),
  &.hl:has(.ok) {
    --theme: var(--color-green);
    background: var(--theme);
  }

  & p {
    color: var(--color-t-main);
    line-height: 1.8rem;
  }
}
</style>
