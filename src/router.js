import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/Index.vue')
    },
    {
      path: '/black',
      name: 'black',
      component: () => import('@/Black.vue')
    },
    {
      path: '/case/:id',
      name: 'case',
      component: () => import('@/Case.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/About/index.vue')
    },
    {
      path: '/vision',
      name: 'vision',
      component: () => import('@/Vision.vue')
    },
    {
      path: '/inspire',
      name: 'inspire',
      component: () => import('@/Inspire.vue')
    }
  ]
})
