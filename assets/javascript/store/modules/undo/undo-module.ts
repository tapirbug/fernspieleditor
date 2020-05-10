import { actions } from './undo-actions'
import { getters } from './undo-getters'
import mutations from './undo-mutations'
import { initialState, UndoState } from './undo-state'
import { Module } from 'vuex'

/**
 * Initialize the module that manages the undo/redo stack.
 *
 * @param {object} transitions Initial transitions
 * @returns {object} `vuex` module for transitions
 */
export default function createUndoModule (): Module<UndoState, any> {
  return {
    actions,
    getters,
    mutations,
    state: initialState()
  }
}
