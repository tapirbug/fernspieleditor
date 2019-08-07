const anyId = 'any'
const any = {
  name: 'Any',
  description: 'Transitions from any are used when the current state has no transition defined for an event'
}

/**
 * Getters for the `states` module.
 */
export default {
  states: states => {
    return {
      ...states,
      any
    }
  },
  stateIds: states => Object.keys(states),
  findState: states => id =>
    (id === anyId)
      ? any
      : states[id],
  isAny: _ => id =>
    id === anyId
}
