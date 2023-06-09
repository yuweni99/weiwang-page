import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/application',
    component: Layout,
    redirect: '/application/list',
    name: 'application',
    meta: { title: '应用', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'classify',
        name: 'classify',
        component: () => import('@/views/application/classify'),
        meta: { title: '应用分类', icon: 'el-icon-sunny' }
      },
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/application/index'),
        meta: { title: '应用列表', icon: 'el-icon-folder-opened' }
      },
      {
        path: 'deptApplication',
        name: 'deptApplication',
        component: () => import('@/views/application/deptApplication'),
        meta: { title: '单位应用', icon: 'table' }
      }

    ]
  },
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/idPhotoAuth',
    name: 'application',
    meta: { title: '应用', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'idPhotoAuth',
        name: 'idPhotoAuth',
        component: () => import('@/views/auth/idPhotoAuth'),
        meta: { title: '证件照审核', icon: 'el-icon-sunny' }
      }

    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'user',
    meta: { title: '用户服务', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/user/index'),
        meta: { title: '用户列表', icon: 'el-icon-sunny' }
      }
    ]
  },
  {
    path: '/schoolInfo',
    component: Layout,
    redirect: '/schoolInfo/index',
    name: 'user',
    meta: { title: '学校列表', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/schoolInfo/index'),
        meta: { title: '学校列表', icon: 'el-icon-sunny' }
      }
    ]
  }, {
    path: '/alumniCard',
    component: Layout,
    name: 'alumniCard',
    meta: { title: '消息通知', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'messageNotification',
        name: 'index',
        component: () => import('@/views/messageNotification/index'),
        meta: { title: '消息通知', icon: 'el-icon-sunny' }
      }
    ]
  },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
