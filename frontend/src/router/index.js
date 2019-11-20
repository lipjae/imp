import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import axios from 'axios'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach(async (to, from, next) => {
    console.log('Welcome! (beforeEach)')

    var isLogin = await axios.post('http://localhost:3000/auth/is_sess')
      .then((res) => res.data)
    console.log(isLogin)
    if (isLogin === false && to.path !== '/api/login') {
      next('/api/login')
    } else {
      next()
    }
  })

  return Router
}
