import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CharacterView from '../views/CharacterView.vue'
import GalleryView from '@/views/GalleryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/characters',
      redirect: '/characters/list'
    },
    {
      path: '/characters/:mode',
      name: 'characters',
      component: CharacterView,
      props: true
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryView
    },
  ]
})

export default router 