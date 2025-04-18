import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页' },
    },
    {
      path: '/training',
      name: 'training',
      component: () => import('../views/TrainingView.vue'),
      meta: { title: '训练' },
    },
    {
      path: '/community',
      name: 'community',
      component: () => import('../views/CommunityView.vue'),
      meta: { title: '社区' },
    },
    {
      path: '/mine',
      name: 'mine',
      component: () => import('../views/MineView.vue'),
      meta: { title: '我的' },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { title: '注册' },
    },
    {
      path: '/plan-custom',
      name: 'planCustom',
      component: () => import('../views/PlanCustomView.vue'),
      meta: { title: '定制方案' },
    },
    {
      path: '/training-detail/:id',
      name: 'trainingDetail',
      component: () => import('../views/TrainingDetailView.vue'),
      meta: { title: '训练详情' },
    },
    {
      path: '/exercise-detail/:id',
      name: 'exerciseDetail',
      component: () => import('../views/ExerciseDetailView.vue'),
      meta: { title: '动作详情' },
    },
    {
      path: '/plan-result',
      name: 'planResult',
      component: () => import('../views/PlanResultView.vue'),
      meta: { title: '方案结果' },
    },
    {
      path: '/data-statistics',
      name: 'dataStatistics',
      component: () => import('../views/DataStatisticsView.vue'),
      meta: { title: '数据统计' },
    },
    {
      path: '/post-detail/:id',
      name: 'postDetail',
      component: () => import('../views/PostDetailView.vue'),
      meta: { title: '帖子详情' },
    },
    {
      path: '/i18n-demo',
      name: 'i18nDemo',
      component: () => import('../views/I18nDemoView.vue'),
      meta: { title: '国际化演示' },
    },
  ],
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 运动康复指导` : '运动康复指导'
  next()
})

export default router
