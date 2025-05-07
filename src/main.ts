import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { pl, zhHans } from 'vuetify/locale'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'zhHans',
    fallback: 'sv',
    messages: { zhHans, pl },
  },
})

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
