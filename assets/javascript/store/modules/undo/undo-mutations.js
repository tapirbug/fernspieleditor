import {
  START_UNDO,
  FINISH_UNDO,
  START_REDO,
  FINISH_REDO,
  MOVE_STATE,
  UPDATE_STATE,
  SET_PHONEBOOK_TITLE,
  MAKE_INITIAL_STATE,
  REMOVE_STATE
} from '../../mutation-types.js'

export default {
  [START_UNDO] (undo) {
    undo.undoing = true
  },
  [FINISH_UNDO] (undo) {
    undo.undoing = false
    undo.nextUndoIdx = undo.nextUndoIdx - 1
  },
  [START_REDO] (undo) {
    undo.undoing = true
  },
  [FINISH_REDO] (undo) {
    undo.undoing = false
    undo.nextUndoIdx = undo.nextUndoIdx + 1
  },
  [MOVE_STATE] (undo, redoPayload) {
    const { from, to, ...rest } = redoPayload
    const undoPayload = {
      ...rest,
      to: from,
      from: to
    }
    push(
      undo,
      'Move state',
      {
        mutation: MOVE_STATE,
        undoPayload,
        redoPayload
      }
    )
  },
  [SET_PHONEBOOK_TITLE] (undo, redoPayload) {
    const { oldTitle, newTitle, ...rest } = redoPayload
    const undoPayload = {
      ...rest,
      newTitle: oldTitle,
      oldTitle: newTitle
    }
    push(
      undo,
      'Rename phonebook',
      {
        mutation: SET_PHONEBOOK_TITLE,
        undoPayload,
        redoPayload
      }
    )
  },
  [UPDATE_STATE] (undo, redoPayload) {
    const undoPayload = {
      ...redoPayload,
      changeBack: redoPayload.change,
      change: redoPayload.changeBack
    }
    push(
      undo,
      'Update state property',
      {
        mutation: UPDATE_STATE,
        undoPayload,
        redoPayload
      }
    )
  },
  [MAKE_INITIAL_STATE] (undo, redoPayload) {
    const undoPayload = {
      ...redoPayload,
      changeBack: redoPayload.change,
      change: redoPayload.changeBack
    }
    push(
      undo,
      'Set initial state',
      {
        mutation: MAKE_INITIAL_STATE,
        undoPayload,
        redoPayload
      }
    )
  },
  [REMOVE_STATE] (undo, payload) {
    push(
      undo,
      'Delete state',
      {
        mutation: REMOVE_STATE, // removing a removed state revives it
        undoPayload: payload,
        redoPayload: payload
      }
    )
  }
}

function push (undo, title, step) {
  if (undo.undoing) {
    return
  }

  const steps = typeof step.length === 'undefined' ? [ step ] : step

  // already undid, now doing something else, cannot redo anymore,
  // delete these redo steps
  undo.stack.length = undo.nextUndoIdx + 1
  undo.stack.push({
    title,
    steps
  })

  // next step to undo is the last one
  undo.nextUndoIdx = undo.stack.length - 1
}
