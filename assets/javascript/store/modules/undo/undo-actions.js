import {
  UNDO,
  REDO
} from '../../action-types.js'
import {
  START_UNDO,
  FINISH_UNDO,
  START_REDO,
  FINISH_REDO
} from '../../mutation-types.js'

export default {
  [UNDO] ({ commit, getters }) {
    if (!getters.canUndo) {
      return
    }

    commit(START_UNDO)
    const { steps } = getters.undoStep
    steps.forEach(({ mutation, undoPayload }) => commit(mutation, undoPayload, { root: true }))
    commit(FINISH_UNDO)
  },
  [REDO] ({ commit, getters }) {
    if (!getters.canRedo) {
      return
    }

    commit(START_REDO)
    const { steps } = getters.redoStep
    steps.forEach(({ mutation, redoPayload }) => commit(mutation, redoPayload, { root: true }))
    commit(FINISH_REDO)
  }
}
