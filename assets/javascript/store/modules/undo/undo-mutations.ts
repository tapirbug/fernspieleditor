import {
  START_UNDO,
  FINISH_UNDO,
  START_REDO,
  FINISH_REDO,
  DO
} from '../../mutation-types'
import { Transaction } from './undo-transaction'

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
}

