import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/the-tale-of-Ofoces/'  // 你的仓库名
    : '/',
  plugins: [
    vue(),
    electron({
      entry: 'electron/main.js'
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
