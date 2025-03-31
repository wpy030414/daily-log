<script setup lang="ts">
import { ref } from 'vue'
import Item from './Item.vue'
import type { EventItem } from '@/types/eventItem'

defineProps<{
  e: EventItem
}>()

const textMapper = ref(
  new Map([
    ['worried', '急'],
    ['non-worried', '缓'],
    ['confused', '疑'],
    ['ok', '✓'],
  ]),
)
</script>

<template>
  <Item class="item">
    <span :class="['s', e.state]">{{ textMapper.get(e.state) }}</span>
    <p>{{ e.body }}</p>
  </Item>
</template>

<style scoped>
.item {
  display: grid;
  grid-template-columns: calc(28px + 0.5rem) 1fr;

  & .s {
    display: inline-block;
    padding: 0.1rem 0.4rem;
    border-radius: 0.3rem;
    width: 1rem;
    height: 1.2rem;
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
    line-height: 1.4rem;
  }
}
</style>
