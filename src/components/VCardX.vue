<script setup lang="ts">
import { ref } from 'vue'

const hl = ref('')

function handleHighlighted() {
  hl.value = hl.value ? '' : 'hl'
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

  &:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    transform: translateZ(1px);
  }
}
</style>
