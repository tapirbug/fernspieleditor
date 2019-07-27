import getters from './transitions-getters.js'
import mutations from './transitions-mutations.js'

/**
 * Initialize the transitions `vuex` module with the given initial data.
 *
 * @param {object} transitions Initial transitions
 * @returns {object} `vuex` module for transitions
 */
export default function createTransitionsModule (transitions) {
  return {
    state: transitions,
    getters,
    mutations
  }
}
