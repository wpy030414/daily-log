<script setup lang="ts">
import { ref } from 'vue'
import VCardX from './VCardX.vue'
import type { ProjectItem } from '@/types/projectItem'

const { p } = defineProps<{
  p: ProjectItem
}>()

const percent = ref(
  `${
    ((p) => {
      if (p < 0) {
        return 0
      } else if (p > 1) {
        return 1
      } else {
        return p
      }
    })(p.progress) * 100
  }%`,
)
</script>

<template>
  <v-card-x
    :class="['item', p.exception, percent.includes('100%') ? 'done' : '', 'd-flex']"
    :style="`--progress: ${percent};`"
  >
    <div class="item-main" style="flex: 4" :percent="percent">
      <h2>{{ p.org || '请输入文本' }}</h2>
      <p>{{ p.project || '请输入文本' }}</p>
      <div class="progress"></div>
    </div>

    <v-divider :vertical="true" class="mx-4"></v-divider>

    <div class="d-flex flex-column justify-center" style="flex: 1.1">
      <p class="text-center">
        {{
          percent.includes('100%')
            ? '已完结'
            : '还剩 ' + (p.remaining != undefined ? p.remaining : '?') + ' 天'
        }}
      </p>
    </div>
  </v-card-x>
</template>

<style scoped>
.item {
  & .progress {
    position: relative;
    width: calc(100% - 3 * 2.5rem);
    height: 0.3rem;
    margin: 0.5rem 0 0.3rem;
    border-radius: 0.15rem;
    background: #00000022;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: var(--progress);
      height: 100%;
      background: var(--color-blue);
    }
  }

  & .item-main {
    position: relative;

    &::after {
      content: attr(percent);
      position: absolute;
      right: -0.2rem;
      bottom: -1.65rem;
      color: var(--color-t-main);
      font-family: 'JetBrains Mono';
      font-size: 3rem;
      opacity: 0.05;
    }
  }

  &:hover,
  &.hl {
    background: var(--color-bg-main-reverse);
    color: var(--color-t-main-reverse);

    & .item-main::after {
      color: var(--color-t-main-reverse);
      opacity: 0.3;
    }
  }

  &.failed {
    background: var(--color-red);
    color: var(--color-t-main-reverse);

    & .item-main::after {
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

    & .item-main::after {
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

  & p {
    margin: -0.1rem 0;
  }
}
</style>
