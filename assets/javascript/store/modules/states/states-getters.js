const anyId = 'any'
const any = {
  name: 'Any',
  description: 'Transitions from any are used when the current state has no transition defined for an event.'
}

/**
 * Getters for the `states` module.
 */
export default {
  /**
   * All the states, even the removed ones.
   */
  allStates: (states) => { return { ...states, any } },
  states: (_state, getters, _rootState, rootGetters) => {
    const activeStates = getters.stateIds
      // hide deleted states
      .filter(id => !rootGetters.isRemoved(id))
      .reduce(
        (acc, nextId) => {
          acc[nextId] = getters.findState(nextId)
          return acc
        },
        Object.create(null)
      )
    activeStates.any = any
    return activeStates
  },
  stateIds: states => Object.keys(states),
  findState: states => id =>
    (id === anyId)
      ? any
      : states[id],
  isAny: _ => id =>
    id === anyId
}
