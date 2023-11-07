// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/home.vue'),
  },

  //PRODUCTOS MARIA
  {
    path: '/Marihuana/',
    component: () => import('@/components/Marihuana.vue'),
  },

  //PRODUCTOS ACCESORIOS
  {
    path: '/Accesorios/',
    component: () => import('@/components/Accesorios.vue'),
  },

  //PRODUCTOS HACHIS
  {
    path: '/Hachis/',
    component: () => import('@/components/Hachis.vue'),
  },

  // COMANDES
  {
    path: '/recepcioComandes/',
    name: "recepcioComandes",
    component: () => import('@/components/recepcioComandes.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

