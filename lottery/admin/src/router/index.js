import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/'
import login from '@/views/login'
import lotteryIndex from '@/views/lottery/'
import admin from '@/views/admin/'
import lottery from '@/views/admin/children/lottery'
import user from '@/views/admin/children/user'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    name: 'index',
    redirect: 'admin'
  }, {
    path: '/startLottery',
    name: 'startLottery',
    component: lotteryIndex
  }, {
    path: '/login',
    name: 'login',
    component: login
  }, {
    path: '/admin',
    name: 'admin',
    component: admin,
    redirect: {
      name: 'lotteryAdmin'
    },
    children: [{
      path: 'lottery',
      name: 'lotteryAdmin',
      meta: {
        requireLogin: true
      },
      component: lottery
    }, {
      path: 'user',
      name: 'user',
      meta: {
        requireLogin: true
      },
      component: user
    }]
  }]
})

// 路由拦截
router.beforeEach((to, from, next) => {
  if (to.meta.requireLogin) {
    // 判断是否需要登录权限
    if (store.state.user || sessionStorage.getItem('user')) {
      next()
    } else {
      // 没登录则跳转到登录界面
      next({
        path: '/login'
      })
    }
  } else {
    next()
  }
})

export default router
