export default {
  canUndo: ({ stack, nextUndoIdx }) => stack.length > 0 && nextUndoIdx > 0,
  canRedo: ({ stack, nextUndoIdx }) => stack.length > 0 && nextUndoIdx < (stack.length - 1),
  undoStep: ({ stack, nextUndoIdx }, getters) => getters.canUndo ? stack[nextUndoIdx] : null,
  redoStep: ({ stack, nextUndoIdx }, getters) => getters.canRedo ? stack[nextUndoIdx + 1] : null,
  undoStepTitle: (_, getters) => getters.canUndo ? (getters.undoStep.title || null) : ''
}
