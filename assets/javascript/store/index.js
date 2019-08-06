import Vue from 'vue'
import Vuex from 'vuex'
import defaultVueState from './fixtures/startup-phonebook.js'
import createLogger from 'vuex/dist/logger'
import modules from './modules/index.js'
import mutations from './mutations.js'

Vue.use(Vuex)

export default createStore()

function createStore () {
  const state = defaultVueState()
  return new Vuex.Store({
    // `states` and other store modules
    modules: modules(state),
    plugins: [createLogger()],
    // root mutations
    mutations,
  })
}
