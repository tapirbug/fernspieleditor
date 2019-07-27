import states from './states/index.js'
import transitions from './transitions/index.js'

/**
 * Initialize the `vuex` modules to be used in the store.
 *
 * Modules:
 * * `store.states` (State machine states and their inherent properties).
 *
 * @param {object} phonebook Initial root state, to initialize the submodules with initial data
 * @returns {object} `vuex` module for states
 */
export default function createModules (phonebook) {
  return {
    states: states(phonebook.states),
    transitions: transitions(phonebook.transitions)
  }
}
