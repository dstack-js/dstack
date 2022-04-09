import { defineConfig } from 'vite'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: ['es2020'],
    rollupOptions: {
      plugins: [
        nodePolyfills({include: ['crypto']}),
      ],
    },
  },
})
