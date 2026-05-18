import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue')
  },
  {
    path: '/applications',
    name: 'applications',
    component: () => import('@/views/ApplicationsView.vue')
  },
  {
    path: '/applications/add',
    name: 'add-application',
    component: () => import('@/views/AddApplicationView.vue')
  },
  {
    path: '/applications/:id/edit',
    name: 'edit-application',
    component: () => import('@/views/EditApplicationView.vue')
  },
  {
    path: '/applications/:id',
    name: 'application-detail',
    component: () => import('@/views/ApplicationDetailView.vue')
  },
  {
    path: '/insights',
    name: 'insights',
    component: () => import('@/views/InsightsView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (!auth.initialized) {
    await auth.initialize()
  }

  if (!to.meta.public && !auth.user) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.user) {
    return { name: 'dashboard' }
  }
})

export default router
