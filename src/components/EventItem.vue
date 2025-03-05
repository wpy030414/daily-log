<script setup lang="ts">
import { ref } from "vue";
import Item from "./Item.vue";

defineProps<{
  state: "worried" | "non-worried" | "confused" | "ok";
}>();

const textMapper = ref(
  new Map([
    ["worried", "急"],
    ["non-worried", "缓"],
    ["confused", "疑"],
    ["ok", "✓"],
  ]),
);
</script>

<template>
  <Item class="item">
    <span :class="['s', state]">{{ textMapper.get(state) }}</span>
    <p><slot></slot></p>
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
    color: #fff;
    text-align: center;
  }

  &:hover,
  &.hl {
    & .s {
      background: #fff;
      color: var(--theme);
    }

    & p {
      color: #fff;
    }
  }

  & .worried,
  &:hover:has(.worried),
  &.hl:has(.worried) {
    --theme: rgb(247, 137.4, 137.4);
    background: var(--theme);
  }

  & .non-worried,
  &:hover:has(.non-worried),
  &.hl:has(.non-worried) {
    --theme: rgb(102.2, 177.4, 255);
    background: var(--theme);
  }

  & .confused,
  &:hover:has(.confused),
  &.hl:has(.confused) {
    --theme: rgb(235, 180.6, 99);
    background: var(--theme);
  }

  & .ok,
  &:hover:has(.ok),
  &.hl:has(.ok) {
    --theme: rgb(133.4, 206.2, 97.4);
    background: var(--theme);
  }

  & p {
    color: #333;
    line-height: 1.4rem;
  }
}
</style>
