import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/render',
      alias: '/',
      name: '渲染',
      component: () => import('@/views/Render.vue'),
    },
    {
      path: '/options',
      name: '配置',
      component: () => import('@/views/Options.vue'),
    },
    {
      path: '/about',
      name: '关于',
      component: () => import('@/views/About.vue'),
    },
  ],
})

router.beforeEach((to) => {
  document.title = `${to.name?.toString() || '不存在的页面'} | 工作日报`
})

export default router
