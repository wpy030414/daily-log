<script setup lang="ts">
import { ref } from 'vue'
import VCardX from './VCardX.vue'
import type { EventItem } from '@/types/eventItem'
import { marked } from 'marked'

defineProps<{
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
</script>

<template>
  <v-card-x class="item">
    <span :class="['s', e.state, 'mr-4']">
      <v-icon :icon="'mdi-' + textMapper.get(e.state)" size="small"></v-icon>
    </span>
    <p v-html="marked.parse(e.body) || '请输入文本'"></p>
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
