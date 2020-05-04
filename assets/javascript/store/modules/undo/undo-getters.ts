import { UndoState } from "./undo-state";
import { Transaction } from "./undo-transaction";

export interface UndoGetters {
  readonly canUndo: boolean
  readonly canRedo: boolean
  readonly undoStep: Transaction|null
  readonly redoStep: Transaction|null
  readonly undoStepTitle: string|null
}

export const getters = {
  canUndo,
  canRedo,
  undoStep,
  redoStep,
  undoStepTitle
}

function canUndo ({stack, nextUndoIdx}: UndoState): boolean {
  return stack.length > 0 && nextUndoIdx > 0
}

function canRedo ({ stack, nextUndoIdx }: UndoState): boolean {
  return stack.length > 0 && nextUndoIdx < (stack.length - 1)
}

function undoStep ({ stack, nextUndoIdx }: UndoState, getters: UndoGetters): Transaction|null {
  return getters.canUndo ? stack[nextUndoIdx] : null
}

function redoStep ({ stack, nextUndoIdx }: UndoState, getters: UndoGetters): Transaction|null {
  return getters.canRedo ? stack[nextUndoIdx + 1] : null
}

function undoStepTitle (_, getters: UndoGetters): string|null {
  const undoStep = getters.undoStep
  return undoStep === null ? null : undoStep.title
}
