import { defineConfig } from "vite"
import monacoEditorPlugin from "vite-plugin-monaco-editor"
import nodePolyfills from "rollup-plugin-polyfill-node"
import vue from "@vitejs/plugin-vue"
import vuetify from "vite-plugin-vuetify"

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    monacoEditorPlugin({
      languageWorkers: ["json"]
    })
  ],
  server: {
    proxy: {
      "/socket.io-next": {
        target: "ws://127.0.0.1:9090",
        ws: true
      }
    }
  },
  build: {
    target: ["es2020"],
    rollupOptions: {
      plugins: [
        nodePolyfills({ include: ["crypto"] })
      ]
    }
  }
})
