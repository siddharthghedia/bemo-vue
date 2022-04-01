import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: localStorage.getItem('bemo-user') && localStorage.getItem('bemo-user') != null ? JSON.parse(localStorage.getItem('bemo-user')) : null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    logout(state) {
      state.user = null
    }
  },
  actions: {
    setUser(context, data) {
      context.commit('setUser', data)
    },
    logout(context) {
      localStorage.clear()
      context.commit('logout')
    }
  },
  getters: {
    authUser: (state) => state.user
  },
  modules: {
  }
})
