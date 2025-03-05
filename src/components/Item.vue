<script setup lang="ts"></script>

<template>
  <div class="item">
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
  background: rgba(102, 176, 255, 0.168);
  color: #333;

  &,
  & * {
    transition: all 0.35s;
    will-change: background-color, color;
  }

  &:hover,
  &.hl {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);

    &::after {
      color: #fff;
      opacity: 0.3;
    }
  }

  &::after {
    position: absolute;
    right: 0.8rem;
    bottom: -1.2rem;
    color: #000;
    font-family: "JetBrains Mono";
    font-size: 3rem;
    opacity: 0.05;
  }
}
</style>
