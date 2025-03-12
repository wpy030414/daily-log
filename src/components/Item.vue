<script setup lang="ts">
import { ref } from "vue";

const hl = ref("");

function handleHighlighted() {
  hl.value = hl.value ? "" : "hl";
}
</script>

<template>
  <div :class="['item', hl]" @click="handleHighlighted">
    <slot></slot>
  </div>
</template>

<style scoped>
.item {
  position: relative;
  overflow: hidden;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: var(--color-bg-sub);
  color: var(--color-t-main);

  &,
  & * {
    transition: all 0.35s;
    will-change: background-color, color;
  }

  &:hover,
  &.hl {
    &::after {
      color: var(--color-t-main-reverse);
      opacity: 0.3;
    }
  }

  &:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }

  &::after {
    position: absolute;
    right: 0.8rem;
    bottom: -1.2rem;
    color: var(--color-t-main);
    font-family: "JetBrains Mono";
    font-size: 3rem;
    opacity: 0.05;
  }
}
</style>
