export interface SerializeGetters {
  readonly canSave: boolean
  readonly saveBlockers: string[]
}

export const getters = {
  canSave: (_state, getters) => {
    return getters.saveBlockers.length === 0
  },
  saveBlockers: (_state, _getters, _, rootGetters) => {
    const blockers = []

    if (!rootGetters.hasInitial) {
      blockers.push('Some state must be marked as the initial state')
    }

    if (Object.keys(rootGetters.states).length <= 1) {
      blockers.push('Need at least one state besides Any to save')
    }

    return blockers
  }
}
