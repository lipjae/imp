import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

import member from './modules/member'
import VueCookie from 'vue-cookie'

Vue.use(Vuex)
Vue.use(VueCookie)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

 

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
      member
    },
    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
