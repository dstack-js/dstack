/* eslint-disable no-global-assign */
import './polyfills'
// import App from './App.vue'
import * as lib from '@dstack-js/lib'
// import { createApp } from 'vue'

for (const [key, value] of Object.entries(lib)) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window[key] = value
}

// createApp(App).mount('#app')
