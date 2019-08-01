import Vue from 'vue'
import Vuex from 'vuex'
import defaultVueState from './fixtures/startup-phonebook.js'
import createLogger from 'vuex/dist/logger'
import modules from './modules/index.js'
import actions from './actions.js'
import mutations from './mutations.js'
import getters from './getters.js'

Vue.use(Vuex)

export default createStore()

function createStore () {
  const initialState = defaultVueState()

  const initialWithoutModuleState = { ...initialState }
  // delete the properties managed by sub-modules
  delete initialWithoutModuleState.states
  delete initialWithoutModuleState.transitions
  delete initialWithoutModuleState.sounds
  delete initialWithoutModuleState.vendor

  return new Vuex.Store({
    // root state
    state: initialWithoutModuleState,
    // `states` and other store modules
    modules: modules(initialState),
    plugins: [createLogger()],
    // root actions, mutations, getters
    actions,
    mutations,
    getters
  })
}
