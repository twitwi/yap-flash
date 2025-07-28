import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: true,
      },
      pwaAssets: {
        disabled: false,
        config: true,
      },
      manifest: {
        name: 'yap-Flash',
        short_name: 'yap-flash',
        description: 'yap-Flash is a flash card application which is yjs-backed, collaborative, offline-first.',
        theme_color: '#b85900ff',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
