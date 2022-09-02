import "vuetify/styles"
import "./polyfills"
import App from "./App.vue"
import { createApp } from "vue"
import { createVuetify } from "vuetify"

const vuetify = createVuetify({
  theme: { defaultTheme: "dark" }
})

createApp(App)
  .use(vuetify)
  .mount("#app")
