export default {
  canSave: (_state, getters) => {
    return getters.saveBlockers.length === 0
  },
  saveBlockers: (_state, _getters, { initial }) => {
    const blockers = []

    if (!initial) {
      blockers.push('Some state must be marked as the initial state')
    }

    return blockers
  },
}