import actions from './undo-actions.js'
import getters from './undo-getters.js'
import mutations from './undo-mutations.js'
import state from './undo-state.js'

/**
 * Initialize the module that manages the undo/redo stack.
 *
 * @param {object} transitions Initial transitions
 * @returns {object} `vuex` module for transitions
 */
export default function createUndoModule () {
  return {
    actions,
    getters,
    mutations,
    state
  }
}
