<script setup lang="ts">
import { useCustomTheme } from './stores/custom-theme'
import { useMessage } from './stores/messages'
import type { Store } from 'pinia'
import { useWidthRate } from './stores/width-rate'

useWidthRate().init()

declare global {
  interface Window {
    msg: Store
  }
}
window.msg = useMessage()
</script>

<template>
  <v-responsive class="border rounded">
    <v-app>
      <v-main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="$route.name" />
          </keep-alive>
        </router-view>
      </v-main>

      <v-bottom-navigation
        v-model="$route.path"
        v-on:update:model-value="(v) => $router.push(v)"
        :bg-color="useCustomTheme().now('bg-main')"
        :color="useCustomTheme().now('t-main')"
        mode="shift"
        mandatory="force"
      >
        <v-btn value="/render">
          <v-icon icon="mdi-television"></v-icon>

          <span>渲染</span>
        </v-btn>

        <v-btn value="/options">
          <v-icon icon="mdi-cog"></v-icon>

          <span>配置</span>
        </v-btn>

        <v-btn value="/about">
          <v-icon icon="mdi-information-outline"></v-icon>

          <span>关于</span>
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  </v-responsive>

  <v-snackbar-queue :timeout="useMessage().timeout" v-model="useMessage().value"></v-snackbar-queue>
</template>

<style scoped></style>
