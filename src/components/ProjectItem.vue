<script setup lang="ts">
import { ref } from "vue";
import Item from "./Item.vue";
import type { ProjectItem } from "@/types/projectItem";

const { p } = defineProps<{
  p: ProjectItem;
}>();

const percent = ref(
  `${
    ((p) => {
      if (p < 0) {
        return 0;
      } else if (p > 1) {
        return 1;
      } else {
        return p;
      }
    })(p.progress) * 100
  }%`,
);
</script>

<template>
  <Item
    :class="['item', p.exception, percent.includes('100%') ? 'done' : '']"
    :style="`--progress: ${percent};`"
    :percent="percent"
  >
    <h2>{{ p.org }}</h2>
    <p>{{ p.project }}</p>
    <div class="progress"></div>
  </Item>
</template>

<style scoped>
.item {
  & .progress {
    position: relative;
    width: calc(100% - 3 * 2.5rem);
    height: 0.3rem;
    margin-top: 0.5rem;
    border-radius: 0.15rem;
    background: #00000022;
    overflow: hidden;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: var(--progress);
      height: 100%;
      background: var(--color-blue);
    }
  }

  &::after {
    content: attr(percent);
  }

  &:hover,
  &.hl {
    background: var(--color-bg-main-reverse);
    color: var(--color-t-main-reverse);
  }

  &.failed {
    background: var(--color-red);
    color: var(--color-t-main-reverse);

    &::after {
      color: var(--color-t-main-reverse);
      opacity: 0.3;
    }

    & .progress {
      background: #ffffff44;

      &::after {
        background: rgba(255, 0, 0, 0.5);
      }
    }
  }

  &.stucked {
    background: var(--color-orange);
    color: var(--color-t-main-reverse);

    &::after {
      color: var(--color-t-main-reverse);
      opacity: 0.3;
    }

    & .progress {
      background: #ffffff44;

      &::after {
        background: rgba(255, 127, 0, 0.75);
      }
    }
  }

  &.done .progress::after {
    background: var(--color-green);
  }
}
</style>
