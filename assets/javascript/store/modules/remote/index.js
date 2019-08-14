import actions from './remote-actions.js'
import getters from './remote-getters.js'
import mutations from './remote-mutations.js'

/**
 * Initialize the `vuex` module for deploying phonebooks
 * and tracking the running phonebook.
 *
 * @returns {object} `vuex` module for YAML import
 */
export default function createRemoteModule () {
  return {
    state: {
      activeConnection: '',
      connections: {},
      activeStates: {}
    },
    actions,
    getters,
    mutations
  }
}
