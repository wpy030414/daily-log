import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { pl, zhHans } from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import App from './App.vue'
import router from './router'
import { draggable } from './utils'

const app = createApp(App)

app.directive('draggable', draggable)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.use(router)

const vuetify = createVuetify({
  components,
  directives,
  locale: {
    locale: 'zhHans',
    fallback: 'sv',
    messages: { zhHans, pl },
  },
  icons: {
    aliases,
    sets: {
      mdi,
    },
  },
})
app.use(vuetify)

app.mount('#app')
