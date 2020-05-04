import {
  START_UNDO,
  FINISH_UNDO,
  START_REDO,
  FINISH_REDO,
  DO
} from '../../mutation-types.js'
import { Transaction } from './undo-transaction.js'

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
  [DO] (undo, transaction: Transaction) {
    if (undo.undoing) {
      return
    }
  
    // first delete all redo steps, if any
    undo.stack.length = undo.nextUndoIdx + 1

    // then add the new transaction to the end
    undo.stack.push(transaction)
  
    // next step to undo is the last one, which we just added
    undo.nextUndoIdx = undo.stack.length - 1
  }
  /*[MOVE_STATE] (undo, redoPayload) {
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
  },
  [ADD_TRANSITION] (undo, payload) {
    push(
      undo,
      'Add transition',
      {
        redoMutation: ADD_TRANSITION,
        undoMutation: REMOVE_TRANSITION,
        payload
      }
    )
  },
  [REMOVE_TRANSITION] (undo, payload) {
    push(
      undo,
      'Remove transition',
      {
        mutation: REMOVE_TRANSITION,
        undoMutation: ADD_TRANSITION,
        payload
      }
    )
  },*/
}

