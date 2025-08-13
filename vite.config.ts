import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    build: {
      target: 'es2022'
    },
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
          theme_color: env.VITE_THEME_HEXCOLOR,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})
