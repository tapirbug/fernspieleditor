import { actions } from './undo-actions'
import { getters } from './undo-getters'
import mutations from './undo-mutations'
import { initialState } from './undo-state'

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
    state: initialState()
  }
}
