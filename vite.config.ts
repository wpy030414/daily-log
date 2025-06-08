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
      domains: ['log.localhost', 'log.internal'],
      certDir: 'dist/cert',
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    allowedHosts: true,
    port: 1414,
  },
  preview: {
    host: true,
    allowedHosts: true,
    port: 414,
  },
})
