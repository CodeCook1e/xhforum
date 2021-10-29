/*
 * @Author: qiuqi
 * @Date: 2021-08-20 12:26:59
 * @LastEditTime: 2021-10-29 15:43:55
 * @LastEditors: Please set LastEditors
 * @Description: 路由配置
 * @FilePath: \xh_forum\src\router\index.js
 */
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 获取原型对象上的 push 函数
const originalPush = VueRouter.prototype.push
// 修改原型对象中的 push 方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  // 默认前往登录界面
  {
    path: '/',
    redirect: '/login'
  },
  // 登录页面
  {
    path: '/login',
    component: () => import("../pages/Login/Login.vue")
  },
  // 注册页面
  {
    path: '/register',
    component: () => import("../pages/Register/Register.vue")
  },
  // 首页
  {
    path: '/home',
    component: () => import("../pages/Home/Home.vue")
  },
  // 论坛页面
  {
    path: '/forum',
    component: () => import("../pages/Forum/Forum.vue")
  },
  // 我的资料页面
  {
    path: '/myprofile',
    component: () => import("../pages/MyProfile/MyProfile.vue")
  },
  // 他人资料页面
  {
    path: '/profile',
    component: () => import("../pages/Profile/Profile.vue")
  },
  // 写文章界面
  {
    path: '/writearticle',
    component: () => import("../pages/WriteArticle/WriteArticle.vue")
  },
  // 管理平台页面
  {
    path: '/admin',
    component: () => import("../pages/AdminLogin/AdminLogin.vue")

  },
  {
    path: '/adminhome',
    redirect: '/adminhome/user',
    component: () => import("../pages/AdminHome/AdminHome.vue"),
    children: [{
      path: '/adminhome/user',
      component: () => import("../components/User/User.vue"),
    }, {
      path: '/adminhome/article',
      component: () => import("../components/Article/Article.vue"),
    }, {
      path: '/adminhome/Tag',
      component: () => import("../components/Tag/Tag.vue"),
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  const token = window.localStorage.getItem('Authorization')
  if (to.path === '/login') {
    if (token) return next('/home')
  }
  next()
})

export default router