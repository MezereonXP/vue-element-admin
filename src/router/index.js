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
    component: () => import('@/views/login/index'),
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
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true, roles: ['admin'] }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/intro',
    meta: { title: '学校概况', icon: 'education', affix: true },
    children: [
      {
        path: 'intro',
        component: () => import('@/views/intro/index'),
        name: 'Intro',
        meta: { title: '学校概况', icon: 'education', affix: true }
      },
      {
        path: 'intro/detail/:id(\\d+)',
        component: () => import('@/views/intro/detail'),
        name: 'IntroDetail',
        hidden: true,
        meta: { title: '详情', affix: true, activeMenu: '/intro/' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/law',
    meta: { title: '法律法规文件制度', icon: 'documentation', affix: true },
    children: [
      {
        path: 'law',
        component: () => import('@/views/law/index'),
        name: 'Law',
        meta: { title: '法律法规文件制度', icon: 'documentation', affix: true }
      },
      {
        path: 'law/detail/:id(\\d+)',
        component: () => import('@/views/law/detail'),
        name: 'LawDetail',
        hidden: true,
        meta: { title: '详情', affix: true, activeMenu: '/law/' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/org',
    meta: { title: '组织架构', icon: 'tree', affix: true },
    children: [
      {
        path: 'org',
        component: () => import('@/views/org/index'),
        name: 'Org',
        meta: { title: '组织架构', icon: 'tree', affix: true }
      },
      {
        path: 'org/detail/:id(\\d+)',
        component: () => import('@/views/org/detail'),
        name: 'OrgDetail',
        hidden: true,
        meta: { title: '详情', affix: true, activeMenu: '/org/' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/approval',
    meta: { title: '实习审批报备管理', icon: 'excel', affix: true },
    children: [
      {
        path: 'approval',
        component: () => import('@/views/approval/index'),
        name: 'Approval',
        meta: { title: '实习审批报备管理', icon: 'excel', affix: true }
      },
      {
        path: 'approval/detail/:id(\\d+)',
        component: () => import('@/views/approval/detail'),
        name: 'ApprovalDetail',
        hidden: true,
        meta: { title: '详情', affix: true, activeMenu: '/approval/' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/report',
    meta: { title: '企业考察报告', icon: 'chart', affix: true },
    children: [
      {
        path: 'report',
        component: () => import('@/views/report/index'),
        name: 'Report',
        meta: { title: '企业考察报告', icon: 'chart', affix: true }
      },
      {
        path: 'report/detail/:id(\\d+)',
        component: () => import('@/views/report/detail'),
        name: 'ReportDetail',
        hidden: true,
        meta: { title: '详情', affix: true, activeMenu: '/report/' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/train',
    meta: { title: '实习培训', icon: 'education', affix: true },
    children: [
      {
        path: 'train',
        component: () => import('@/views/train/index'),
        name: 'Train',
        meta: { title: '实习培训', icon: 'education', affix: true }
      },
      {
        path: 'train/detail/:id(\\d+)',
        component: () => import('@/views/train/detail'),
        name: 'TrainDetail',
        hidden: true,
        meta: { title: '详情', affix: true, activeMenu: '/train/' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/attendance',
    children: [
      {
        path: 'attendance',
        component: () => import('@/views/attendance/index'),
        name: 'Attendance',
        meta: { title: '考勤打卡', icon: 'user', roles: ['user'] }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/position',
    children: [
      {
        path: 'position',
        component: () => import('@/views/position/index'),
        name: 'Position',
        meta: { title: '岗位列表', icon: 'list', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/evaluation',
    children: [
      {
        path: 'evaluation',
        component: () => import('@/views/evaluation/index'),
        name: 'Evaluation',
        meta: { title: '实习评价', icon: 'user', roles: ['user'] }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人信息', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '合同管理',
      icon: 'form'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: '上传新的项目', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: '编辑项目', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: '项目列表', icon: 'list' }
      }
    ]
  },

  {
    path: '/student',
    component: Layout,
    redirect: '/student/list',
    name: 'Student',
    meta: {
      title: '实习过程管理',
      icon: 'user',
      roles: ['admin']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/student/list'),
        name: 'StudentList',
        meta: { title: '学生信息管理', icon: 'list' }
      },
      {
        path: 'company',
        component: () => import('@/views/student/company'),
        name: 'StudentCompany',
        meta: { title: '实习企业介绍', icon: 'icon' }
      },
      {
        path: 'position',
        component: () => import('@/views/student/position'),
        name: 'StudentPosition',
        meta: { title: '实习岗位情况', icon: 'skill' }
      },
      {
        path: 'internship_record',
        component: () => import('@/views/student/internship_record'),
        name: 'StudentInternshipRecord',
        meta: { title: '实习工资档案', icon: 'table', roles: ['admin'] }
      },
      {
        path: 'attendance',
        component: () => import('@/views/student/attendance'),
        name: 'StudentAttendance',
        meta: { title: '考勤情况', icon: 'table' }
      },
      {
        path: 'evaluation',
        component: () => import('@/views/student/evaluation'),
        name: 'StudentEvaluation',
        meta: { title: '实习评价', icon: 'star' }
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
