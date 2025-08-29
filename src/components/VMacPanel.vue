<script setup lang="ts">
import { useCustomTheme } from '@/stores/custom-theme'
import type { Log } from '@/types'
import { mdiChevronTripleRight } from '@mdi/js'
import { marked } from 'marked'
import { computed } from 'vue'

defineProps<{
  actions: ((() => void) | undefined)[]
  log: Log
}>()
</script>

<template>
  <v-card
    class="shell mx-12 my-12"
    elevation="24"
    :enable-glassmorphism="useCustomTheme().enableGlassmorphism"
  >
    <v-list-item class="px-6" height="72">
      <template v-slot:prepend>
        <v-btn icon flat color="#FD5F56" size="16" class="mr-2" @click="actions[0]"></v-btn>
        <v-btn icon flat color="#FFBC2F" size="16" class="mr-2" @click="actions[1]"></v-btn>
        <v-btn icon flat color="#28C840" size="16" class="mr-6" @click="actions[2]"></v-btn>
      </template>

      <template v-slot:title>
        <h4>工作日报</h4>
      </template>
    </v-list-item>

    <v-list-item class="px-6 pb-6">
      <v-card class="section px-2 mb-4" variant="outlined" rounded="lg">
        <template v-for="(i, index) of log.projects">
          <v-card class="my-1" variant="flat">
            <template v-slot:title>
              <v-badge
                dot
                :color="
                  new Map([
                    ['default', 'transparent'],
                    ['failed', 'red'],
                    ['stucked', 'orange'],
                  ]).get(i.exception || 'default')
                "
                offset-x="-12"
              >
                <h5>{{ i.project }}</h5>
              </v-badge>
            </template>

            <template v-slot:subtitle>
              <p>{{ i.org }}</p>
            </template>

            <template v-slot:append>
              <v-icon
                class="mr-1"
                :color="i.makeProgress ? '#FD5F56' : 'transparent'"
                :icon="mdiChevronTripleRight"
              ></v-icon>

              <p class="text-grey">{{ i.progress.toFixed(0) }}%</p>
            </template>
          </v-card>

          <v-divider v-if="index + 1 < log.projects.length"></v-divider>
        </template>

        <v-empty-state v-if="log.projects.length === 0" text="暂时没有项目"></v-empty-state>
      </v-card>

      <v-card class="section px-2" variant="outlined" rounded="lg">
        <template v-for="(i, index) of log.events">
          <v-card class="my-2" variant="flat">
            <template v-slot:title>
              <div
                v-html="computed(() => marked(i.body)).value"
                style="font-size: 14px; opacity: 0.8; white-space: normal"
              ></div>
            </template>

            <template v-slot:append>
              <v-chip>
                {{
                  [
                    { label: '推进', value: 'on' },
                    { label: '阻塞', value: 'blocked' },
                    { label: '完成', value: 'ok' },
                  ].find((s) => s.value === i.state)?.label || '？'
                }}
              </v-chip>
            </template>
          </v-card>

          <v-divider v-if="index + 1 < log.events.length"></v-divider>
        </template>

        <v-empty-state v-if="log.events.length === 0" text="暂时没有事件"></v-empty-state>
      </v-card>
    </v-list-item>
  </v-card>
</template>

<style scoped>
.shell {
  border-radius: 12px;

  &[enable-glassmorphism='true'] {
    background: #ffffffaa;
    backdrop-filter: blur(24px);
  }

  & .section {
    border-color: #00000022;
  }

  & .v-card {
    background: transparent;
  }
}

.v-theme--dark .shell {
  &[enable-glassmorphism='true'] {
    background: #000000aa;
  }

  & .section {
    border-color: #ffffff22;
  }
}

h4,
h5 {
  font-weight: normal;
}
</style>
