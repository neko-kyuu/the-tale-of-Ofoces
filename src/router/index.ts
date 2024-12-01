import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CharacterView from '../views/CharacterView.vue'
import GalleryView from '@/views/GalleryView.vue'
import NoteView from '@/views/NoteView.vue'
import LocationView from '@/views/LocationView.vue'

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
      name: 'characters',
      component: CharacterView
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
      path: '/location/:id',
      name: 'MapDetail',
      component: () => import('@/components/LocationDetail.vue')
    },
    {
      path: '/note',
      name: 'note',
      component: NoteView
    },
  ]
})

export default router 