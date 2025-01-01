import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Overview from '../views/Overview.vue'
import GalleryView from '@/views/GalleryView.vue'
import VaultView from '@/views/VaultView.vue'
import LocationView from '@/views/LocationView.vue'
import EventView from '@/views/EventView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryView
    },
    {
      path: '/location',
      name: 'location',
      component: LocationView
    },
    {
      path: '/vault',
      name: 'vault',
      component: VaultView
    },
    {
      path: '/event',
      name: 'event',
      component: EventView
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/TestView.vue')
    },
  ]
})

export default router 