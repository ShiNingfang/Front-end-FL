import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
/**
  子菜单的显示条件：仅当路由的子项目（children）数量大于或等于1时，子菜单才会显示。这是控制是否展开子菜单的条件。
  hidden：如果设置为 true，该项将不会在侧边栏中显示。默认值是 false。
  alwaysShow：如果设置为 true，根菜单将始终显示。如果不设置 alwaysShow 且路由项有多个子路由，它将变为嵌套模式；否则，根菜单不会显示。
  redirect: noRedirect：如果设置了 noRedirect，在面包屑导航中将不会进行重定向。
  name：路由的名称，由 <keep-alive> 使用（必须设置）。
  meta：元数据对象，包含多个属性：
      roles：控制页面的角色（可以设置多个角色）。
      title：在侧边栏和面包屑中显示的名称（建议设置）。
      icon：在侧边栏显示的图标。
      noCache：如果设置为 true，页面将不会被缓存（默认为 false）。
      affix：如果设置为 true，标签将固定在 tags-view 中。
      breadcrumb：如果设置为 false，项将在面包屑中隐藏（默认为 true）。
      activeMenu：如果设置了路径，侧边栏将高亮显示你设置的路径。
  constantRoutes：一组基本页面，不需要权限要求，所有角色都可以访问。
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/a_login/Login'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  //
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/a_home/index'),
        name: 'Home',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/
  {
    path: '/attack',
    component: Layout,
    redirect: '/attack/item',
    name: 'Attack',
    meta: {
      title: '攻击模拟',
      icon: 'clipboard'
    },
    children: [
      {
        hidden: true,
        path: 'item',
        component: () => import('@/views/a_data/Attack'),
        name: 'Attack',
        meta: { title: '攻击模拟', icon: 'edit' }
      }
    ]
  },
  {
    path: '/projectManage',
    component: Layout,
    name: 'ProjectManage',
    meta: {
      title: '项目管理',
      icon: 'clipboard'
    },
    children: [
      {
        path: 'mine',
        component: () => import('@/views/a_project/ProjectMine'),
        name: 'ProjectMine',
        meta: { title: '我方发起', icon: 'edit' }
      },
      {
        hidden: true,
        path: 'mine/:projectName',
        component: () => import('@/views/a_project/ProjectMineTask'),
        name: 'ProjectMineTask',
        meta: { title: '默认项目', icon: 'edit' },
        beforeEnter: (to, from, next) => {
          to.meta.title = to.params.projectName + '项目' || '默认项目'
          next()
        }
      },
      {
        hidden: true,
        path: 'mine/mine_task/:taskName',
        component: () => import('@/views/a_project/TaskDragger/SplitDrag'),
        name: 'ProjectMineTask',
        meta: { title: '默认任务面板', icon: 'edit' },
        beforeEnter: (to, from, next) => {
          to.meta.title = to.params.taskName + '任务面板' || '默认任务面板'
          next()
        }
      },
      {
        path: 'other',
        component: () => import('@/views/a_project/ProjectOther'),
        name: 'ProjrctOther',
        meta: { title: '我方参与', icon: 'edit' }
      }
      // {
      //   path: 'task',
      //   component: () => import('@/views/a_project/TaskDragger/SplitDrag'),
      //   name: 'TaskBoard',
      //   meta: { title: '任务面板', icon: 'edit' }
      // }
    ]
  },
  {
    path: '/data',
    component: Layout,
    name: 'Data',
    meta: {
      title: '数据资产',
      icon: 'clipboard'
    },
    children: [
      {
        path: 'mine',
        component: () => import('@/views/a_data/DataMine'),
        name: 'DataMine',
        meta: { title: '自有数据', icon: 'edit' }
      },
      {
        path: 'other',
        component: () => import('@/views/a_data/DataOther'),
        name: 'DataOther',
        meta: { title: '外部数据', icon: 'list' }
      },
      {
        path: 'right',
        component: () => import('@/views/a_data/DataRight'),
        name: 'DataRight',
        meta: { title: '授权审批', icon: 'list' }
      }
    ]
  },

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
