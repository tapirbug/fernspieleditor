import { Transaction } from './undo-transaction'

export interface UndoState {
  stack: Transaction[]
  nextUndoIdx: number
  undoing: boolean
  firstContribution: boolean
}

/**
 * Initial state of the `undo` module.
 */
export function initialState (): UndoState {
  return {
    stack: [],
    nextUndoIdx: 0,
    undoing: false,
    firstContribution: false
  }
}
