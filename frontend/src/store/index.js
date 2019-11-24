import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

import member from './modules/member'

Vue.use(Vuex)

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
    state: {
      count: 4
    },
    getters: {
      count : state => {
        return state.count
      } 
    },
    mutations: {
      intCount : state => { state.count++}
    },
    actions : {
      actionTest : context => {debugger}
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
