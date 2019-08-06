import getters from './initial-getters.js'
import mutations from './initial-mutations.js'

/**
 * Initialize the `vuex` module that manages the state ID where the phonebook
 * starts (initial state), with a given startup initial state.
 *
 * The module is expected to be mounted at `store.initial`, but in contrast to
 * a real phonebook, it is an object in the store form, since vuex state must be
 * a real object. When exported to a phonebook, the state must be replaced with
 * its property `initial`.
 *
 * @param {object} initialState ID of the initial state, e.g. from `initial` in a phonebook
 * @returns {object} `vuex` module for editor state
 */
export default function createInitialModule(initialState) {
  // accept vuex style (nested in object) and real phonebook format (flattened)
  const initialStateId = (() => {
    if (typeof initialState === 'string') {
      return initialState
    } else if (typeof initialState === 'object') {
      return initialState.initial || null
    } else {
      return null
    }
  })()

  return {
    state: { initial: initialStateId },
    getters,
    mutations
  }
}
