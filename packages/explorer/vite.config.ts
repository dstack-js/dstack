import { defineConfig } from "vite"
import nodePolyfills from "rollup-plugin-polyfill-node"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
