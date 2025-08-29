import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    basicSsl({
      name: 'Penyo',
      domains: ['log.localhost', 'log.internal'],
      certDir: 'dist/cert',
    }),
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
    port: 2414,
  },
})
