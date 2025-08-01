import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibraryView from '@/views/LibraryView.vue'
import ConfigView from '@/views/ConfigView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/lib',
      name: 'library',
      component: LibraryView,
    },
    {
      path: '/cfg',
      name: 'config',
      component: ConfigView,
    },
  ],
})

export default router
