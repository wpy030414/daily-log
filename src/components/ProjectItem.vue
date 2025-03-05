<script setup lang="ts">
import { ref } from "vue";
import Item from "./Item.vue";

const props = defineProps<{
  state?: "failed";
  org: string;
  project: string;
  progress: number;
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
    })(props.progress) * 100
  }%`,
);
</script>

<template>
  <Item
    :class="['item', state]"
    :style="`--progress: ${percent};`"
    :percent="percent"
  >
    <h2>{{ org }}</h2>
    <p>{{ project }}</p>
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
      background: rgb(133.4, 206.2, 97.4);
    }
  }

  &::after {
    content: attr(percent);
  }

  &:hover,
  &.hl {
    background: #24569f;
    color: #fff;
  }

  &.failed {
    background: rgb(247, 137.4, 137.4);
    color: #fff;

    &::after {
      color: #fff;
      opacity: 0.3;
    }

    & .progress {
      background: #ffffff44;

      &::after {
        background: rgba(255, 0, 0, 0.5);
      }
    }
  }
}
</style>
