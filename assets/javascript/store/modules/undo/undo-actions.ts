import {
  UNDO,
  REDO
} from '../../action-types'
import {
  START_UNDO,
  FINISH_UNDO,
  START_REDO,
  FINISH_REDO
} from '../../mutation-types'
import { ActionContext } from 'vuex'
import { UndoState } from './undo-state'
import { UndoGetters } from './undo-getters'

export interface UndoActions {
  undo()
  redo()
}

export const actions = {
  [UNDO]: undo,
  [REDO]: redo
}

export const undoActionMapping = {
  undo: UNDO,
  redo: REDO
}

interface UndoContext extends ActionContext<UndoState, object> {
  getters: UndoGetters
}

function undo (ctx: UndoContext) {
  const { commit, getters } = ctx

  if (!getters.canUndo) {
    return
  }

  commit(START_UNDO)
  const steps = [...getters.undoStep.steps].reverse()
  steps.forEach(({ undoMutation, undoPayload }) => commit(undoMutation, undoPayload, { root: true }))
  commit(FINISH_UNDO)
}

function redo (ctx: UndoContext) {
  const { commit, getters } = ctx

  if (!getters.canRedo) {
    return
  }

  commit(START_REDO)
  const { steps } = getters.redoStep
  steps.forEach(({ redoMutation, redoPayload }) => commit(redoMutation, redoPayload, { root: true }))
  commit(FINISH_REDO)
}
