import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import basicSsl from '@vitejs/plugin-basic-ssl'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  plugins: [
    vue(),
    basicSsl({
      name: 'Penyo',
      domains: ['oss.ahkdxx.cn', 'nas.localhost'],
      certDir: 'dist/cert',
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  preview: {
    host: true,
    allowedHosts: true,
    port: 414,
  }
})
