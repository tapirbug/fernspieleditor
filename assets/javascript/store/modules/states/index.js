import actions from './states-actions.js'
import getters from './states-getters.js'
import mutations from './states-mutations.js'

/**
 * Initialize the state `vuex` module with the given initial data.
 *
 * @param {object} states Initial map of states
 * @returns {object} `vuex` module for states
 */
export default function createStateModule (states) {
  return {
    state: states,
    actions,
    getters,
    mutations
  }
}
